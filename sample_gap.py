import cv2
import numpy as np

src = cv2.imread(r"C:\Users\HP\.gemini\antigravity\brain\d6bacf2f-0275-4250-93cc-b13026582193\.user_uploaded\media_1795071241463_79f05e35.jpg")

# Sample across left arm gap at Y=500, X=150 to 250
bg_color = np.array([210, 217, 244], dtype=float)
diff = np.linalg.norm(src.astype(float) - bg_color, axis=2)

print("Row 500 across left gap:")
for x in range(160, 250, 5):
    print(f"X={x}: BGR={src[500, x]}, diff={diff[500, x]:.1f}")
