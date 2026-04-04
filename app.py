from flask import Flask, render_template, request
import torch
import torch.nn as nn
import torchvision.models as models
import numpy as np
import os
from utils import preprocess_mri

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# =========================
# RESNET MODEL (BINARY)
# =========================
class ResNetMRI(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.model = models.resnet18(weights=None)

        self.model.conv1 = nn.Conv2d(1, 64, 7, 2, 3, bias=False)

        self.model.fc = nn.Sequential(
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        return self.model(x)

# =========================
# CNN2D MODEL (MULTICLASS)
# =========================
class CNN2D(nn.Module):
    def __init__(self):
        super().__init__()

        self.conv = nn.Sequential(
            nn.Conv2d(1, 8, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(8, 16, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )

        self.fc = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(16 * 32 * 32, 32),
            nn.ReLU(),
            nn.Linear(32, 3)
        )

    def forward(self, x):
        x = self.conv(x)
        x = x.view(x.size(0), -1)
        return self.fc(x)

# =========================
# LOAD MODELS
# =========================
binary_model = ResNetMRI(2).to(device)
binary_model.load_state_dict(torch.load("best_model.pth", map_location=device))
binary_model.eval()

multi_model = CNN2D().to(device)
multi_model.load_state_dict(torch.load("model_multi.pth", map_location=device))
multi_model.eval()

# =========================
# ROUTE
# =========================
@app.route("/", methods=["GET", "POST"])
def index():
    result = None

    if request.method == "POST":
        file = request.files["file"]
        mode = request.form["mode"]

        # Save uploaded file
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        # Preprocess MRI
        img = preprocess_mri(filepath).to(device)

        with torch.no_grad():
            if mode == "binary":
                probs = torch.softmax(binary_model(img), dim=1).cpu().numpy()[0]
                classes = ["CN", "AD"]
            else:
                probs = torch.softmax(multi_model(img), dim=1).cpu().numpy()[0]
                classes = ["CN", "MCI", "AD"]

        pred = np.argmax(probs)

        # ✅ Confidence
        confidence = float(np.max(probs))

        # ✅ Clinical interpretation
        if confidence > 0.85:
            remark = "High confidence prediction. Clinical findings are strongly indicative."
        elif confidence > 0.65:
            remark = "Moderate confidence. Further clinical evaluation recommended."
        else:
            remark = "Low confidence. Strongly recommend additional diagnostic tests."

        # ✅ Color coding
        if classes[pred] == "AD":
            color = "red"
        elif classes[pred] == "MCI":
            color = "orange"
        else:
            color = "green"

        result = {
            "prediction": classes[pred],
            "confidence": confidence,
            "probs": probs,
            "remark": remark,
            "color": color
        }

    return render_template("index.html", result=result)

# =========================
# RUN APP
# =========================
if __name__ == "__main__":
    app.run(debug=True)