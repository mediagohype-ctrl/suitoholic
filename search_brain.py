import os

for root, dirs, files in os.walk('C:/Users/HP/.gemini/antigravity/brain/d6bacf2f-0275-4250-93cc-b13026582193'):
    if 'tasks' in root or 'logs' in root:
        continue
    for f in files:
        if f.endswith('.py'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                if 'coral-stripe-fit-38' in fp.read():
                    print('Found in brain script:', p)
