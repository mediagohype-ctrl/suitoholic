import cv2

lean = cv2.imread('public/customizer/coral-stripe-fit-38-lean.webp')
reg = cv2.imread('public/customizer/coral-stripe-fit-38-regular.webp')
tum = cv2.imread('public/customizer/coral-stripe-fit-38-tummy.webp')

print('lean shape:', lean.shape)
print('reg shape:', reg.shape)
print('tum shape:', tum.shape)

# Let's check colors in the center of the shirt:
print('lean center:', lean[lean.shape[0]//2, lean.shape[1]//2])
print('reg center:', reg[reg.shape[0]//2, reg.shape[1]//2])
print('tum center:', tum[tum.shape[0]//2, tum.shape[1]//2])

# Let's check the corners of each:
print('lean corners:', lean[0, 0], lean[0, -1], lean[-1, 0], lean[-1, -1])
print('reg corners:', reg[0, 0], reg[0, -1], reg[-1, 0], reg[-1, -1])
print('tum corners:', tum[0, 0], tum[0, -1], tum[-1, 0], tum[-1, -1])
