import cv2
import numpy as np

src = cv2.imread(r"C:\Users\HP\.gemini\antigravity\brain\d6bacf2f-0275-4250-93cc-b13026582193\.user_uploaded\media_1795071241463_79f05e35.jpg")
H_src, W_src, _ = src.shape

# Let's test color-based background mask:
# Background in uploaded image has very specific properties:
# High red (~240-250), high green (~210-225), high blue (~205-220).
# The saturation in HSV:
hsv = cv2.cvtColor(src, cv2.COLOR_BGR2HSV)
# Hue, Saturation, Value
# In background:
# Saturation is very low (~30-50 out of 255)
# In coral stripes: Saturation is very high (~120-200)
# In white stripes: Value is 250-255, but in background Value is ~240-248 and Blue is noticeably lower!

# Let's check HSV of background vs white stripes:
print("Background HSV at (10, 10):", hsv[10, 10])
print("Background HSV at (5, W-5):", hsv[5, W_src-5])
print("White stripe HSV at (400, 415):", hsv[400, 415])
print("Coral stripe HSV at (400, 425):", hsv[400, 425])
