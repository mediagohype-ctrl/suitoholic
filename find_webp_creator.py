import glob

for p in glob.glob('C:/Users/HP/.gemini/antigravity/brain/d6bacf2f-0275-4250-93cc-b13026582193/scratch/*.py'):
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()
        if 'coral-stripe-fit-38' in c:
            print('Found in:', p)
