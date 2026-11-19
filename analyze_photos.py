import cv2
import numpy as np

def analyze_photo(name, path):
    img = cv2.imread(path)
    # Check dimensions
    H, W, _ = img.shape
    # Find shirt by finding where color differs from background
    # Background at (50, 50)
    bg = img[50, 50]
    diff = np.linalg.norm(img.astype(float) - bg.astype(float), axis=2)
    mask = diff > 30
    ys, xs = np.where(mask)
    print(f'=== {name} ===')
    print(f'Shape: {img.shape}, bg at (50,50): {bg}')
    print(f'Mask Y: {ys.min()} to {ys.max()}, X: {xs.min()} to {xs.max()}')
    # Check if there is a badge or line
    # Look at row ys.min()
    print(f'Top row of shirt: {ys.min()}')
    print(f'Bottom row of shirt: {ys.max()}')

analyze_photo('lean', 'debug_lean_webp.jpg')
analyze_photo('reg', 'debug_reg_webp.jpg')
analyze_photo('tum', 'debug_tum_webp.jpg')
