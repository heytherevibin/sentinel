const { app, clipboard } = require('electron');
const os = require('os');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class SensorManager {
  constructor(hqServerUrl) {
    this.hqServerUrl = hqServerUrl;
    this.sensorId = null; // Will be initialized in start()
    this.hostname = os.hostname();
    this.version = app.getVersion() || '1.0.0';
    this.heartbeatInterval = null;
    this.clipboardInterval = null;
    this.connectionStatus = 'OFFLINE';
    this.lastHeartbeat = null;
    this.heartbeatCount = 0;
    this.successCount = 0;
    this.policies = [];
    this.policyVersion = null; // Policy Versioning
    this.lastLatency = null;
    this.systemHealth = 0;
    this.isRunning = false;
    this.lastClipboardContent = '';
  }

  // ... (existing methods) ...

  async start() {
    await this.getOrCreateSensorIdSync();
    await this.loadConfigSync();

    console.log('[SENSOR] Starting discovery...');
    const foundUrl = await this.discoverHqServer();

    if (foundUrl) {
      this.hqServerUrl = foundUrl;
      console.log(`[SENSOR] Connected to HQ at ${foundUrl}`);
      this.saveConfig(); // Persist successful connection
    } else {
      console.warn('[SENSOR] Could not auto-discover HQ. Using default:', this.hqServerUrl);
    }

    this.isRunning = true;
    this.sendHeartbeat();
    this.fetchGlobalStats();
    this.fetchRecentAlerts();
    this.startClipboardMonitor();

    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
      this.fetchGlobalStats();
      this.fetchRecentAlerts();
    }, 5000);
  }

  startClipboardMonitor() {
    console.log('[SENSOR] Starting Clipboard Monitor...');
    if (this.clipboardInterval) clearInterval(this.clipboardInterval);

    this.clipboardInterval = setInterval(() => {
      this.checkClipboard();
    }, 1000); // Check every second
  }

  checkClipboard() {
    if (!this.isRunning || this.policies.length === 0) return;

    try {
      const text = clipboard.readText();

      // Optimization: Skip if content hasn't changed or is empty
      if (!text || text === this.lastClipboardContent) return;

      this.lastClipboardContent = text;

      // Check against policies
      for (const policy of this.policies) {
        try {
          const regex = new RegExp(policy.pattern, 'i'); // Case insensitive default? Or strictly allow flags?
          if (regex.test(text)) {
            console.log(`[DLP] Match found: ${policy.name}`);

            if (policy.action === 'BLOCK') {
              console.log('[DLP] Blocking content...');
              clipboard.writeText(''); // Clear clipboard
              this.lastClipboardContent = ''; // Reset tracker so they can't just paste again immediately (?) 
              // Actually, if we clear it, readText() next time will be empty. 
              // If we set lastClipboard to empty, duplicate empty check handles it.

              this.sendAlert('CLIPBOARD_BLOCK', {
                policyId: policy.id,
                policyName: policy.name,
                contentSnippet: text.substring(0, 20) + '...', // Log snippet? Risk of logging the secret.
                host: this.hostname
              });
            } else {
              // LOG_ONLY
              console.log('[DLP] Logging content...');
              this.sendAlert('CLIPBOARD_LOG', {
                policyId: policy.id,
                policyName: policy.name,
                host: this.hostname
              });
            }
            break; // Stop after first match
          }
        } catch (err) {
          console.error(`[DLP] Invalid regex for policy ${policy.name}:`, err.message);
        }
      }
    } catch (error) {
      console.error('[SENSOR] Clipboard check failed:', error.message);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.clipboardInterval) {
      clearInterval(this.clipboardInterval);
      this.clipboardInterval = null;
    }
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async getOrCreateSensorIdSync() {
    try {
      const userDataPath = app.getPath('userData');
      const sensorIdFile = path.join(userDataPath, 'sensor-id.json');

      try {
        const data = await fs.readFile(sensorIdFile, 'utf8');
        const json = JSON.parse(data);
        this.sensorId = json.sensorId;
        return this.sensorId;
      } catch {
        // File doesn't exist, create new ID
        const sensorId = this.generateUUID();
        await fs.writeFile(sensorIdFile, JSON.stringify({ sensorId }), 'utf8');
        this.sensorId = sensorId;
        return this.sensorId;
      }
    } catch (error) {
      // Fallback to generating a new UUID
      this.sensorId = this.generateUUID();
      return this.sensorId;
    }
  }



  async loadConfigSync() {
    try {
      const userDataPath = app.getPath('userData');
      const configFile = path.join(userDataPath, 'config.json');
      const data = await fs.readFile(configFile, 'utf8');
      const config = JSON.parse(data);
      if (config.hqServerUrl) {
        this.hqServerUrl = config.hqServerUrl;
        console.log('[SENSOR] Loaded saved HQ URL:', this.hqServerUrl);
      }
      if (config.policyVersion) {
        this.policyVersion = config.policyVersion;
      }
    } catch (e) {
      // Ignore missing config
    }
  }

  async saveConfig() {
    try {
      const userDataPath = app.getPath('userData');
      const configFile = path.join(userDataPath, 'config.json');
      await fs.writeFile(configFile, JSON.stringify({
        hqServerUrl: this.hqServerUrl,
        policyVersion: this.policyVersion
      }), 'utf8');
    } catch (e) {
      console.error('[SENSOR] Failed to save config:', e.message);
    }
  }

  async discoverHqServer() {
    const candidates = new Set();

    // 1. Current/Saved URL
    if (this.hqServerUrl) candidates.add(this.hqServerUrl);

    // 2. Common Local Dev URLs
    candidates.add('http://localhost:3000');
    candidates.add('http://127.0.0.1:3000');

    // 3. Docker/VM Host
    candidates.add('http://host.docker.internal:3000');

    // 4. Gateway / Subnet Heuristics
    const gateway = this.detectGatewayIp();
    if (gateway) {
      candidates.add(`http://${gateway}:3000`);
    }

    // Try all candidates
    console.log('[SENSOR] Probing candidates:', Array.from(candidates));

    for (const url of candidates) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000); // 1s timeout

        const response = await fetch(`${url}/api/stats`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          return url;
        }
      } catch (e) {
        // Continue to next candidate
      }
    }
    return null;
  }

  detectGatewayIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        // Skip internal and non-IPv4
        if (iface.family === 'IPv4' && !iface.internal) {
          // Heuristic: Assume gateway is x.x.x.1 of the interface's subnet
          const parts = iface.address.split('.');
          parts[3] = '1';
          return parts.join('.');
        }
      }
    }
    return null;
  }



  async sendHeartbeat() {
    if (!this.isRunning) return;

    const startTime = Date.now();

    try {
      const response = await fetch(`${this.hqServerUrl}/api/telemetry/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.sensorId,
          hostname: this.hostname,
          version: this.version,
          policyVersion: this.policyVersion // Send current version
        }),
      });

      const latency = Date.now() - startTime;
      this.lastLatency = latency / 1000; // Convert to seconds

      if (response.ok) {
        const data = await response.json();
        this.connectionStatus = 'ONLINE';
        this.lastHeartbeat = new Date();
        this.heartbeatCount++;
        this.successCount++;

        // Delta Sync Logic
        if (data.policies) {
          console.log(`[SENSOR] Policy Update: ${this.policyVersion || 'None'} -> ${data.policyVersion}`);
          this.policies = data.policies;
          this.policyVersion = data.policyVersion;
          this.saveConfig(); // Persist new version
        }

        // Calculate system health (0-100) based on success rate and latency
        const successRate = this.heartbeatCount > 0
          ? this.successCount / this.heartbeatCount
          : 0;
        const latencyScore = Math.max(0, 1.0 - (this.lastLatency / 5.0)); // 5s = 0, 0s = 1
        this.systemHealth = (successRate * 0.7 + latencyScore * 0.3) * 100;

        console.log(`[SENSOR] Heartbeat sent successfully. Latency: ${latency}ms`);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      this.connectionStatus = 'OFFLINE';
      this.heartbeatCount++;
      this.lastHeartbeat = new Date();

      // Update system health based on success rate only
      const successRate = this.heartbeatCount > 0
        ? this.successCount / this.heartbeatCount
        : 0;
      this.systemHealth = successRate * 100;

      console.error(`[SENSOR] Heartbeat failed:`, error.message);
    }
  }

  async fetchGlobalStats() {
    if (!this.isRunning) return;
    try {
      const response = await fetch(`${this.hqServerUrl}/api/stats`);
      if (response.ok) {
        const data = await response.json();
        this.globalStats = data.stats;
      }
    } catch (error) {
      console.error('[SENSOR] Failed to fetch global stats:', error.message);
    }
  }

  async fetchRecentAlerts() {
    if (!this.isRunning) return;
    try {
      const response = await fetch(`${this.hqServerUrl}/api/telemetry/alert`);
      if (response.ok) {
        const data = await response.json();
        // Take latest 10
        this.recentAlerts = Array.isArray(data) ? data.slice(0, 10) : [];
      }
    } catch (error) {
      console.error('[SENSOR] Failed to fetch recent alerts:', error.message);
    }
  }

  async sendAlert(type, metadata) {
    if (!this.isRunning) return;

    try {
      const event = {
        id: this.generateUUID(),
        sensorId: this.sensorId,
        type,
        timestamp: Date.now(),
        metadata,
      };

      await fetch(`${this.hqServerUrl}/api/telemetry/alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      console.log(`[SENSOR] Alert sent: ${type}`);
      // Refresh alerts after sending one
      this.fetchRecentAlerts();
    } catch (error) {
      console.error(`[SENSOR] Failed to send alert:`, error.message);
    }
  }

  getStatus() {
    return {
      sensorId: this.sensorId,
      hostname: this.hostname,
      version: this.version,
      connectionStatus: this.connectionStatus,
      lastHeartbeat: this.lastHeartbeat ? this.lastHeartbeat.toISOString() : null,
      heartbeatCount: this.heartbeatCount,
      successCount: this.successCount,
      lastLatency: this.lastLatency,
      systemHealth: this.systemHealth,
      policies: this.policies,
      globalStats: this.globalStats,
      recentAlerts: this.recentAlerts
    };
  }

  getSensorId() {
    return this.sensorId;
  }

  getHqServerUrl() {
    return this.hqServerUrl;
  }

  updateHqServerUrl(url) {
    this.hqServerUrl = url;
    // Restart heartbeat loop with new URL
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}


module.exports = SensorManager;
