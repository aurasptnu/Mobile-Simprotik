from pathlib import Path
import re

path = Path('src/data/tasks.ts')
lines = path.read_text(encoding='utf-8').splitlines()
new_lines = []
expect_location = False
current_indent = ''
for line in lines:
    # remove priority lines entirely
    if re.match(r"^\s*priority:\s*'[^']+',?\s*$", line):
        continue

    # handle progress and status on the same line
    m = re.match(r"^(\s*progress:\s*\d+,\s*)(status:\s*'([^']+)'\s*,?\s*)$", line)
    if m:
        indent = re.match(r'^(\s*)', line).group(1)
        new_lines.append(m.group(1).rstrip())
        new_lines.append(f"{indent}location: 'UPA TIK Office',")
        new_lines.append(f"{indent}{m.group(2)}")
        expect_location = False
        continue

    if expect_location:
        if re.match(r"^\s*location:\s*'[^']+',?\s*$", line):
            indent = current_indent
            new_lines.append(f"{indent}location: 'UPA TIK Office',")
            expect_location = False
            continue
        if re.match(r"^\s*status:\s*'[^']+',?\s*$", line) or re.match(r"^\s*type:\s*'[^']+',?\s*$", line) or re.match(r"^\s*isStarted:\s*(true|false),?\s*$", line) or re.match(r"^\s*}\s*,?\s*$", line):
            new_lines.append(f"{current_indent}location: 'UPA TIK Office',")
            expect_location = False

    progress_match = re.match(r"^(\s*progress:\s*\d+,\s*)$", line)
    if progress_match:
        current_indent = re.match(r'^(\s*)', line).group(1)
        new_lines.append(line)
        expect_location = True
        continue

    new_lines.append(line)

text = '\n'.join(new_lines) + ('\n' if lines and lines[-1].endswith('\n') else '')
path.write_text(text, encoding='utf-8')
print(f'updated {path}')
