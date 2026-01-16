
import time
import pyperclip
import re
from plyer import notification

SENSITIVE_PATTERNS = [
    (r"AKIA[0-9A-Z]{16}", "AWS_ACCESS_KEY"),
    (r"eyJ[a-zA-Z0-9_\-\.]+", "JWT_TOKEN"),
    (r"\b(password|passwd|pwd)\s*=\s*[^\s]+", "HARDCODED_PASSWORD"),
    (r"CONFIDENTIAL", "INTERNAL_KEYWORD")
]

class ClipboardWatcher:
    def __init__(self, client):
        self.client = client
        self.last_content = ""
        self.policies = []

    def update_policies(self, policies):
        self.policies = policies

    def check(self):
        try:
            content = pyperclip.paste()
            if not content or content == self.last_content:
                return

            self.last_content = content
            
            # Check Dynamic Policies
            for rule in self.policies:
                pattern = rule.get('pattern')
                label = rule.get('name')
                action = rule.get('action', 'BLOCK')
                
                if re.search(pattern, content, re.IGNORECASE):
                    print(f"[!] MATCH: {label}")
                    
                    if action == 'BLOCK':
                        pyperclip.copy("[SENTINEL::BLOCKED]")
                        
                        notification.notify(
                            title='Security Incident',
                            message=f'Restricted Data Blocked: {label}',
                            app_name='Sentinel',
                            timeout=3
                        )
                    
                    self.client.send_alert("CLIPBOARD_BLOCK", {
                        "contentOverride": label,
                        "riskScore": 100 if action == 'BLOCK' else 10
                    })
                    break # Stop after first match

        except Exception as e:
            print(f"Clipboard Error: {e}")
