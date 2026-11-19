import cv2
import numpy as np

img = cv2.imread('public/customizer/coral-stripe-fit-38-tummy.webp')
# Check if there is text "38" or "Height" or badges in this image
print('Image shape:', img.shape)
cv2.imwrite('public/customizer/test_tummy_fit_webp.png', img)
print('Saved test_tummy_fit_webp.png')
