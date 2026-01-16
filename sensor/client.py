
import requests
import json
import time
import os
import uuid
import platform
import socket

HQ_URL = "http://localhost:3000/api"
QUEUE_FILE = "offline_queue.json"

class SensorClient:
    def __init__(self):
        self.hq_url = HQ_URL
        self.session = requests.Session()
        self.hostname = socket.gethostname()
        self.sensor_id = self._get_or_create_id()
        self.os_info = f"{platform.system()} {platform.release()}"
        self.offline_queue = self._load_queue()
        print(f"[*] Sensor initialized. ID: {self.sensor_id} | Host: {self.hostname}")

    def _get_or_create_id(self):
        """Ensures Sensor ID persistence across restarts (stored in User Home)"""
        home = os.path.expanduser("~")
        sentinel_dir = os.path.join(home, ".sentinel")
        
        if not os.path.exists(sentinel_dir):
            try:
                os.makedirs(sentinel_dir)
            except:
                pass # Fail silently if permissions verify

        id_file = os.path.join(sentinel_dir, "sensor_id.identity")
        
        if os.path.exists(id_file):
            try:
                with open(id_file, "r") as f:
                    return f.read().strip()
            except:
                pass
        
        # Generate new ID if missing
        new_id = str(uuid.uuid4())
        try:
            with open(id_file, "w") as f:
                f.write(new_id)
        except Exception as e:
            print(f"[!] Warning: Could not save identity: {e}")
            
        return new_id

    def _post(self, endpoint, data):
        """Helper for POST requests using session"""
        try:
            res = self.session.post(f"{self.hq_url}/{endpoint}", json=data, timeout=5)
            if res.status_code == 200:
                self.flush_queue()
                return True
        except Exception as e:
            print(f"[!] Connection Error ({endpoint}): {e}")
        return False

    def _save_queue(self, queue):
        with open(QUEUE_FILE, 'w') as f:
            json.dump(queue, f)

    def _load_queue(self):
        if not os.path.exists(QUEUE_FILE):
            return []
        try:
            with open(QUEUE_FILE, 'r') as f:
                return json.load(f)
        except:
            return []

    def send_heartbeat(self):
        """Sends heartbeat to HQ and returns active policies if provided in response"""
        data = {
            "id": self.sensor_id,
            "hostname": self.hostname,
            "status": "ONLINE",
            "version": "1.0.0"
        }
        try:
            # heartbeat now returns { policies: [], commands: [] }
            res_json = self._post_and_response("telemetry/heartbeat", data)
            if res_json:
                if 'commands' in res_json:
                    self.execute_commands(res_json['commands'])
                return res_json.get('policies', []) # Return policies to update caller
        except:
            pass 
        return []

    def execute_commands(self, commands):
        for cmd in commands:
            ctype = cmd.get('type')
            payload = cmd.get('payload')
            print(f"[!] EXECUTING CMD: {ctype} -> {payload}")
            
            if ctype == 'PURGE':
                import pyperclip
                pyperclip.copy("")
                print("    - Clipboard Purged")
            elif ctype == 'MSG':
                from plyer import notification
                notification.notify(title='HQ COMMAND', message=payload, app_name='Sentinel', timeout=5)
            elif ctype == 'OPEN':
                import webbrowser
                webbrowser.open(payload)

    def _post_and_response(self, endpoint, data):
        """Helper for POST requests using session"""
        try:
            res = self.session.post(f"{self.hq_url}/{endpoint}", json=data, timeout=5)
            if res.status_code == 200:
                self.flush_queue()
                return res.json()
            else:
                print(f"[!] Server Returned {res.status_code}: {res.text}")
        except Exception as e:
            print(f"[!] Connection Error ({endpoint}): {e}")
        return None

    def fetch_policies(self):
        """Fetches latest policies from HQ"""
        try:
            response = requests.get(f"{HQ_URL}/policy", timeout=5) # Changed self.hq_url to HQ_URL
            if response.status_code == 200:
                print(f"[*] Synced Policies: {len(response.json())} rules active")
                return response.json()
        except Exception as e:
            print(f"[!] Policy Fetch Error: {e}")
        return []

    def send_alert(self, alert_type, metadata):
        event = {
            "sensorId": self.sensor_id,
            "type": alert_type,
            "timestamp": int(time.time() * 1000),
            "metadata":  {**metadata, "host": self.hostname}
        }
        
        try:
            res = self.session.post(f"{HQ_URL}/telemetry/alert", json=event, timeout=5)
            if res.status_code == 200:
                print(f"[+] Alert Sent: {alert_type}")
                return
        except:
            print(f"[!] Network Error. Queuing Alert: {alert_type}")

        # If failed, queue it
        queue = self._load_queue()
        queue.append(event)
        self._save_queue(queue)

    def flush_queue(self):
        queue = self._load_queue()
        if not queue:
            return

        print(f"[*] Flushing {len(queue)} offline events...")
        failed_queue = []
        for event in queue:
            try:
                self.session.post(f"{HQ_URL}/telemetry/alert", json=event, timeout=5)
            except:
                failed_queue.append(event)
        
        self._save_queue(failed_queue)
        if not failed_queue:
            print("[+] Offline Queue Cleared.")
