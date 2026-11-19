import cv2
import numpy as np

# Load tummy source image
src = cv2.imread(r"C:\Users\HP\.gemini\antigravity\brain\d6bacf2f-0275-4250-93cc-b13026582193\.user_uploaded\media_1795071241463_79f05e35.jpg")
H_src, W_src, _ = src.shape
print(f"Source image: {W_src}x{H_src}")

# Background color in uploaded image: [210, 217, 244] in BGR
# Let's inspect the background variation in src
# Check corners and borders of src:
print("Corners:", src[5, 5], src[5, -5], src[-5, 5], src[-5, -5])

# In src, what are the background pixels?
# The background is a smooth, light pinkish studio backdrop:
# B ~ 205-215, G ~ 212-222, R ~ 240-250
# The shirt has coral stripes (R ~ 170-220, G ~ 70-120, B ~ 50-100)
# and white stripes (R ~ 245-255, G ~ 245-255, B ~ 240-255)
# In white stripes, B and G are >= 235!
# Whereas in background, B ~ 210, G ~ 217! (notice B and G are noticeably lower than white stripes)

# Let's test color distance to background:
bg_color = np.array([210, 217, 244], dtype=float)
diff = np.linalg.norm(src.astype(float) - bg_color, axis=2)

print("diff in background at (10,10):", diff[10, 10])
print("diff at center of shirt:", diff[H_src//2, W_src//2])
print("diff distribution in image:")
for thresh in [5, 10, 15, 20, 25, 30]:
    print(f"  diff <= {thresh}: {np.sum(diff <= thresh)} pixels")
