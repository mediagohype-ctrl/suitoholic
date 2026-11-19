import os, datetime
mtime = os.path.getmtime('src/components/MannequinShirtViewer.tsx')
print('MannequinShirtViewer.tsx last modified:', datetime.datetime.fromtimestamp(mtime))
