import cv2

lean = cv2.imread('public/customizer/coral-stripe-fit-38-lean.webp')
reg = cv2.imread('public/customizer/coral-stripe-fit-38-regular.webp')
tum = cv2.imread('public/customizer/coral-stripe-fit-38-tummy.webp')

print('lean:', lean.shape, 'reg:', reg.shape, 'tum:', tum.shape)
cv2.imwrite('debug_lean_webp.jpg', lean)
cv2.imwrite('debug_reg_webp.jpg', reg)
cv2.imwrite('debug_tum_webp.jpg', tum)
print('Saved debug jpegs')
