import cv2

lean = cv2.imread('public/customizer/coral-stripe-fit-38-lean.webp')
reg = cv2.imread('public/customizer/coral-stripe-fit-38-regular.webp')
tum = cv2.imread('public/customizer/coral-stripe-fit-38-tummy.webp')

cv2.imwrite('thumb_lean.jpg', cv2.resize(lean, (300, 450)))
cv2.imwrite('thumb_reg.jpg', cv2.resize(reg, (300, 450)))
cv2.imwrite('thumb_tum.jpg', cv2.resize(tum, (300, 450)))
print('Saved thumbs')
