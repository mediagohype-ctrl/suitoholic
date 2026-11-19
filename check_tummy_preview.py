import cv2
import numpy as np

for n in ['lean', 'regular', 'tummy']:
    im = cv2.imread(f'public/customizer/coral-stripe-fit-38-{n}.webp')
    if im is None:
        print(n, 'None')
        continue
    w = np.all(im > 240, axis=2)
    print(n, 'shape:', im.shape, 'white ratio:', float(np.mean(w)))
