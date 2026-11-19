import cv2
import numpy as np

src = cv2.imread(r"C:\Users\HP\.gemini\antigravity\brain\d6bacf2f-0275-4250-93cc-b13026582193\.user_uploaded\media_1795071241463_79f05e35.jpg")
H_src, W_src, _ = src.shape

bg_color = np.array([210, 217, 244], dtype=float)
diff = np.linalg.norm(src.astype(float) - bg_color, axis=2)

# Sample a horizontal line across the shirt placket (e.g. Y=400, X=400..500)
for x in range(400, 480, 5):
    print(f"Y=400, X={x}: BGR={src[400, x]}, diff={diff[400, x]:.1f}")
