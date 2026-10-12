import random
import string
import json

CATEGORY_PREFIXES = {
    'Workshop': 'WS',
    'Paper Presentation': 'PPT',
    'Coding Event': 'CODE',
    'Project Presentation': 'PRJ',
    'Seminar': 'SEM',
    'Technical Event': 'TECH',
    'Cultural Event': 'CULT',
    'Sports': 'SPT',
    'Competition': 'COMP',
    'Other': 'GEN'
}

def generate_registration_code(category: str = 'Workshop', roll_number: str = '') -> str:
    """
    Generates a standardized unique event registration code.
    Format: CP-<PREFIX>-<RANDOM><ROLL_SUFFIX>
    Example: CP-CODE-8F92 or CP-WS-7K39
    """
    prefix = CATEGORY_PREFIXES.get(category, 'EVT')
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    
    # Extract clean alphanumeric suffix from roll number
    clean_roll = ''.join(ch for ch in roll_number if ch.isalnum()).upper()
    roll_suffix = clean_roll[-2:] if len(clean_roll) >= 2 else ''.join(random.choices(string.digits, k=2))
    
    return f"CP-{prefix}-{random_part}{roll_suffix}"

def extract_code_from_raw(raw_code_or_json: str) -> str:
    """
    Safely extracts registration code or ID whether scanned as a JSON QR string,
    raw string, or formatted pass code.
    """
    if not raw_code_or_json:
        return ""
    
    text = raw_code_or_json.strip()
    
    # Check if JSON payload from scanner
    if text.startswith('{') and text.endswith('}'):
        try:
            parsed = json.loads(text)
            return (parsed.get('code') or parsed.get('regId') or parsed.get('roll') or text).strip()
        except Exception:
            pass
            
    return text
