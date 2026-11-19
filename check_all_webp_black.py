import cv2
import numpy as np

for name in ['lean', 'regular', 'tummy']:
    img = cv2.imread(f'public/customizer/coral-stripe-fit-38-{name}.webp')
    black = np.all(img < 10, axis=2)
    print(name, 'black count:', np.sum(black), 'shape:', img.shape)
