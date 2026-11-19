import os

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json', '.py', '.md')):
            p = os.path.join(root, file)
            try:
                with open(p, 'r', encoding='utf-8', errors='ignore') as f:
                    if 'coral-stripe-fit-38' in f.read():
                        print('Found in file:', p)
            except:
                pass
