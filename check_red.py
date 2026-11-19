import cv2
import numpy as np

for name in ['lean', 'regular', 'tummy']:
    webp = cv2.imread(f'public/customizer/coral-stripe-fit-38-{name}.webp')
    print(f'=== {name} ===')
    print('shape:', webp.shape)
    # Check bounding box of the actual shirt inside this webp:
    # background is pink or black
    # find where the shirt is
    # coral color has high red (~180-250)
    red_channel = webp[:, :, 2]
    ys, xs = np.where(red_channel > 120)
    print(f'Red pixels Y: {ys.min()} to {ys.max()}, X: {xs.min()} to {xs.max()}')
