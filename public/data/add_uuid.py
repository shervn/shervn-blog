import sys
import json
import random
import string


def random_id(length=8):
    chars = string.ascii_lowercase + string.digits
    return ''.join(random.choices(chars, k=length))

if len(sys.argv) < 2:
    print("Usage: python add_uuid.py <input.json>")
    sys.exit(1)

path = sys.argv[1]

with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

for item in data:
    if "uuid" not in item:
        item["uuid"] = random_id()

with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
