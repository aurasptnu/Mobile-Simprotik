from pathlib import Path
import re
p = Path('src/data/tasks.ts')
s = p.read_text(encoding='utf-8')
# Replace patterns like assignedTo: 'email', with assignedTo: ['email'],
new = re.sub(r"assignedTo:\s*'([^']+)'\s*,","assignedTo: ['\\1'],", s)
# Handle cases with double quotes just in case
new = re.sub(r'assignedTo:\s*"([^"]+)"\s*,', r"assignedTo: ['\1'],", new)
if new != s:
    p.write_text(new, encoding='utf-8')
    print('converted assignedTo to arrays')
else:
    print('no change')
