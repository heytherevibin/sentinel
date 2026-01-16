import time
import sys
from client import SensorClient
from clipboard_watcher import ClipboardWatcher

def main():
    print("[*] Sentinel Sensor v1.0.0 Initializing...")
    
    client = SensorClient()
    clipboard = ClipboardWatcher(client)
    
    # Initial Policy Sync
    # fetch_policies is defined in client.py
    policies = client.fetch_policies()
    clipboard.update_policies(policies)

    print("[*] Monitoring Active...")
    
    try:
        while True:
            # Heartbeat returns latest policies and executes commands
            new_policies = client.send_heartbeat()
            if new_policies:
                clipboard.update_policies(new_policies)
                
            clipboard.check()
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n[!] Shutting down...")
        sys.exit(0)

if __name__ == "__main__":
    main()
