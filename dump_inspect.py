import cv2
import numpy as np

for name in ['lean', 'regular', 'tummy']:
    webp = cv2.imread(f'public/customizer/coral-stripe-fit-38-{name}.webp')
    # Save as PNG so we can inspect
    cv2.imwrite(f'inspect_{name}.png', webp)
    print(f'inspect_{name}.png saved')
