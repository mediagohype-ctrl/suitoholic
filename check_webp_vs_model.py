import cv2
import numpy as np

for name in ['lean', 'regular', 'tummy']:
    webp = cv2.imread(f'public/customizer/coral-stripe-fit-38-{name}.webp')
    model = cv2.imread(f'public/customizer/shirt_model_coral_stripe_{name}.png')
    print(f'=== {name} ===')
    print('webp shape:', webp.shape)
    print('model shape:', model.shape)
