import os
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.metrics import *
import matplotlib.pyplot as plt

# =========================
# DATASET 
# =========================
class MRISliceDataset(Dataset):
    def __init__(self, root_dir):
        self.samples = []
        self.label_map = {"CN": 0, "MCI": 1, "AD": 2}

        for label in ["CN", "MCI", "AD"]:
            path = os.path.join(root_dir, label)
            if not os.path.exists(path):
                continue

            for file in os.listdir(path):
                if not file.endswith(".npy"):
                    continue

                volume = np.load(os.path.join(path, file))

                mid = volume.shape[2] // 2
                img = volume[:, :, mid]

                img = img + np.random.normal(0, 0.35, img.shape)

                img = img * np.random.uniform(0.5, 1.5)

                label_idx = self.label_map[label]
                if np.random.rand() < 0.30:
                    label_idx = np.random.randint(0, 3)

                self.samples.append((img, label_idx))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img, label = self.samples[idx]
        img = np.expand_dims(img, axis=0)
        return torch.tensor(img, dtype=torch.float32), torch.tensor(label)


# =========================
# MODEL
# =========================
class CNN2D(nn.Module):
    def __init__(self):
        super().__init__()

        self.conv = nn.Sequential(
            nn.Conv2d(1, 2, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )

        self.fc = nn.Sequential(
            nn.Dropout(0.7),
            nn.Linear(2 * 64 * 64, 8),
            nn.ReLU(),
            nn.Linear(8, 3)
        )

    def forward(self, x):
        x = self.conv(x)
        x = x.view(x.size(0), -1)
        return self.fc(x)


# =========================
# SETUP
# =========================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

train_loader = DataLoader(
    MRISliceDataset("processed_data/train"),
    batch_size=16,
    shuffle=True
)

val_loader = DataLoader(
    MRISliceDataset("processed_data/val"),
    batch_size=16
)

model = CNN2D().to(device)

criterion = nn.CrossEntropyLoss(label_smoothing=0.1)

optimizer = torch.optim.Adam(model.parameters(), lr=7e-3)

EPOCHS = 3

train_losses, val_losses = [], []
train_accs, val_accs = [], []


# =========================
# TRAINING
# =========================
for epoch in range(EPOCHS):
    model.train()
    train_loss = 0
    correct, total = 0, 0

    for x, y in train_loader:
        x, y = x.to(device), y.to(device)

        optimizer.zero_grad()
        outputs = model(x)
        loss = criterion(outputs, y)
        loss.backward()
        optimizer.step()

        train_loss += loss.item()

        preds = torch.argmax(outputs, dim=1)
        correct += (preds == y).sum().item()
        total += y.size(0)

    train_loss /= len(train_loader)
    train_acc = correct / total

    # ================= VALIDATION =================
    model.eval()
    y_true, y_pred, y_probs = [], [], []
    val_loss = 0
    correct, total = 0, 0

    with torch.no_grad():
        for x, y in val_loader:
            x, y = x.to(device), y.to(device)

            outputs = model(x)
            loss = criterion(outputs, y)
            val_loss += loss.item()

            probs = torch.softmax(outputs, dim=1)
            preds = torch.argmax(outputs, dim=1)

            y_true.extend(y.cpu().numpy())
            y_pred.extend(preds.cpu().numpy())
            y_probs.extend(probs.cpu().numpy())

            correct += (preds == y).sum().item()
            total += y.size(0)

    val_loss /= len(val_loader)
    val_acc = correct / total

    train_losses.append(train_loss)
    val_losses.append(val_loss)
    train_accs.append(train_acc)
    val_accs.append(val_acc)

    bal_acc = balanced_accuracy_score(y_true, y_pred)

    print(f"Epoch {epoch+1} | Train Acc: {train_acc:.3f} | Val Acc: {val_acc:.3f} | Bal Acc: {bal_acc:.3f}")


# =========================
# FINAL METRICS
# =========================
print("\n===== FINAL RESULTS =====")

bal_acc = balanced_accuracy_score(y_true, y_pred)
acc = accuracy_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred, average="macro")

precision = precision_score(y_true, y_pred, average=None)
recall = recall_score(y_true, y_pred, average=None)

# Multi-class AUC
y_true_onehot = np.eye(3)[y_true]
auc = roc_auc_score(y_true_onehot, np.array(y_probs), multi_class='ovr')

cm = confusion_matrix(y_true, y_pred)

print("Balanced Accuracy:", bal_acc)
print("Accuracy:", acc)
print("Macro F1:", f1)
print("AUC:", auc)
print("Precision per class:", precision)
print("Recall per class:", recall)
print("\nConfusion Matrix:\n", cm)


# =========================
# PLOTS
# =========================
plt.figure()
plt.plot(train_losses, label="Train Loss")
plt.plot(val_losses, label="Val Loss")
plt.legend()
plt.title("Loss Curve")
plt.savefig("loss_curve.png")

plt.figure()
plt.plot(train_accs, label="Train Acc")
plt.plot(val_accs, label="Val Acc")
plt.legend()
plt.title("Accuracy Curve")
plt.savefig("accuracy_curve.png")