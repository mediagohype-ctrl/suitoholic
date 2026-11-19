import cv2
import numpy as np

img = cv2.imread('inspect_tummy.png')
print('inspect_tummy shape:', img.shape)
# Top-left color:
print('Top-left color:', img[5, 5])
# Center color:
print('Center color:', img[img.shape[0]//2, img.shape[1]//2])
