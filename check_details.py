import cv2
import numpy as np

for name in ['lean', 'regular', 'tummy']:
    img = cv2.imread(f'inspect_{name}.png')
    # Let's check:
    # 1. Height line on left?
    # 2. Chest size badge (38\")?
    # 3. Waist size badge (34\" or 36\" or 39\"-40\")?
    # 4. Color tone?
    print(f'=== {name} ===')
    print('Mean color:', img.mean(axis=(0,1)))
    # Check if left side (x=50..150) has a vertical black line or badge:
    left_roi = img[:, 30:130]
    black_pixels = np.all(left_roi < 50, axis=2)
    print('Black pixels in left ROI (height line):', np.sum(black_pixels))
