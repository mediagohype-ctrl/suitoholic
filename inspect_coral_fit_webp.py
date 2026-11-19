import cv2
import numpy as np

for name in ['lean', 'regular', 'tummy']:
    img = cv2.imread(f'public/customizer/coral-stripe-fit-38-{name}.webp')
    print(f'=== {name} ===')
    # Let's check what is in this image
    # Does it have badges?
    # Where does the shirt start/end?
    bg = img[10, 10]
    print('bg:', bg)
    diff = np.linalg.norm(img.astype(float) - bg.astype(float), axis=2)
    ys, xs = np.where(diff > 25)
    print(f'Y: {ys.min()} to {ys.max()}, X: {xs.min()} to {xs.max()}')
