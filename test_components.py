import cv2
import numpy as np

src = cv2.imread(r"C:\Users\HP\.gemini\antigravity\brain\d6bacf2f-0275-4250-93cc-b13026582193\.user_uploaded\media_1795071241463_79f05e35.jpg")
H_src, W_src, _ = src.shape

bg_color = np.array([210, 217, 244], dtype=float)
diff = np.linalg.norm(src.astype(float) - bg_color, axis=2)

# Check all pixels where diff < 20:
mask_low_diff = diff < 20

# Let's check connected components of mask_low_diff
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(mask_low_diff.astype(np.uint8))
print("Total components with diff < 20:", num_labels)
for i in range(1, num_labels):
    area = stats[i, cv2.CC_STAT_AREA]
    if area > 100:
        c_x, c_y = centroids[i]
        print(f"Component {i}: area={area}, centroid=({c_x:.1f}, {c_y:.1f})")
