import cv2
import numpy as np

for name in ['lean', 'reg', 'tum']:
    img = cv2.imread(f'thumb_{name}.jpg')
    print(f'=== {name} ===')
    # Let's inspect top 20 rows, middle 20 rows, bottom 20 rows:
    print('Top row mean color:', img[:5, :].mean(axis=(0,1)))
    print('Bottom row mean color:', img[-5:, :].mean(axis=(0,1)))
    print('Left edge mean color:', img[:, :5].mean(axis=(0,1)))
    print('Right edge mean color:', img[:, -5:].mean(axis=(0,1)))
