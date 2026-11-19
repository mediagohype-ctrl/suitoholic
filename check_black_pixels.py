import cv2
import numpy as np

img = cv2.imread('public/customizer/coral-stripe-fit-38-tummy.webp')
print('Shape:', img.shape)
# Count how many pure black pixels [0, 0, 0] or near black pixels are in the image!
black_pixels = np.all(img < 10, axis=2)
print('Black pixels count:', np.sum(black_pixels))
# Where are black pixels?
ys, xs = np.where(black_pixels)
if len(ys) > 0:
    print(f'Black Y range: [{ys.min()}, {ys.max()}], X range: [{xs.min()}, {xs.max()}]')
    
# What about the borders?
print('Row 0:', img[0, :10])
print('Row -1:', img[-1, :10])
print('Col 0:', img[:10, 0])
print('Col -1:', img[:10, -1])
