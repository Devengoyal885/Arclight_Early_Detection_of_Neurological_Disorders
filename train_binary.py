import os
import numpy as np
import torch
import torch.nn as nn
import torchvision.models as models
from torch.utils.data import Dataset, DataLoader
from sklearn.metrics import *
import matplotlib.pyplot as plt

# =========================
# DATASET
# =========================
class MRISliceDataset(Dataset):
    def __init__(self, root_dir):
        self.samples = []
        self.label_map = {"CN": 0, "AD": 1}

        for label in ["CN", "AD"]:
            path = os.path.join(root_dir, label)
            if not os.path.exists(path): continue

            for file in os.listdir(path):
                if not file.endswith(".npy"):
                    continue

                volume = np.load(os.path.join(path, file))
                sid = file

                mid = volume.shape[2] // 2
                slices = volume[:, :, max(0, mid-30):mid+30]

                for i in range(slices.shape[2]):
                    img = slices[:, :, i]
                    img = (img - np.mean(img)) / (np.std(img) + 1e-5)
                    self.samples.append((img, self.label_map[label], sid))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img, label, sid = self.samples[idx]

        if np.random.rand() > 0.5:
            img = np.flip(img, axis=1).copy()

        img = np.expand_dims(img, axis=0)

        return torch.tensor(img, dtype=torch.float32), torch.tensor(label), sid


# =========================
# MODEL
# =========================
class ResNetMRI(nn.Module):
    def __init__(self):
        super().__init__()
        self.model = models.resnet18(weights=None)

        self.model.conv1 = nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)

        self.model.fc = nn.Sequential(
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, 2)
        )

    def forward(self, x):
        return self.model(x)


# =========================
# TRAIN FUNCTION
# =========================
def train_model(seed):
    torch.manual_seed(seed)

    model = ResNetMRI().to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)

    weights = torch.tensor([1.0, 1.5]).to(device)
    criterion = nn.CrossEntropyLoss(weight=weights)

    best_loss = float('inf')
    patience = 3
    counter = 0

    train_losses = []
    val_losses = []
    train_accs = []
    val_accs = []

    for epoch in range(15):
        model.train()
        train_loss = 0

        for x, y, _ in train_loader:
            x, y = x.to(device), y.to(device)

            optimizer.zero_grad()
            outputs = model(x)
            loss = criterion(outputs, y)
            loss.backward()
            optimizer.step()

            train_loss += loss.item()

        train_loss /= len(train_loader)

        # TRAIN ACC
        model.eval()
        train_correct, train_total = 0, 0

        with torch.no_grad():
            for x, y, _ in train_loader:
                x, y = x.to(device), y.to(device)
                preds = torch.argmax(model(x), dim=1)
                train_correct += (preds == y).sum().item()
                train_total += y.size(0)

        train_acc = train_correct / train_total

        # VALIDATION
        val_loss = 0
        val_correct, val_total = 0, 0

        with torch.no_grad():
            for x, y, _ in val_loader:
                x, y = x.to(device), y.to(device)

                outputs = model(x)
                loss = criterion(outputs, y)
                val_loss += loss.item()

                preds = torch.argmax(outputs, dim=1)
                val_correct += (preds == y).sum().item()
                val_total += y.size(0)

        val_loss /= len(val_loader)
        val_acc = val_correct / val_total

        # STORE
        train_losses.append(train_loss)
        val_losses.append(val_loss)
        train_accs.append(train_acc)
        val_accs.append(val_acc)

        print(f"Epoch {epoch+1} | Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f} | Train Acc: {train_acc:.4f} | Val Acc: {val_acc:.4f}")

        if val_loss < best_loss:
            best_loss = val_loss
            counter = 0
            best_model = model.state_dict()
        else:
            counter += 1

        if counter >= patience:
            break

    model.load_state_dict(best_model)
    return model, train_losses, val_losses, train_accs, val_accs


# =========================
# SETUP
# =========================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

train_loader = DataLoader(MRISliceDataset("processed_data/train"), batch_size=32, shuffle=True)
val_loader = DataLoader(MRISliceDataset("processed_data/val"), batch_size=32)


# =========================
# TRAIN
# =========================
print("\nTraining Model 1...")
model1, train_l, val_l, train_a, val_a = train_model(42)

print("\nTraining Model 2...")
model2, _, _, _, _ = train_model(99)


# =========================
# INFERENCE
# =========================
subject_probs = {}
subject_labels = {}

with torch.no_grad():
    for x, y, sid in val_loader:
        x = x.to(device)

        x_flip = torch.flip(x, dims=[3])

        p1 = torch.softmax(model1(x), dim=1)[:, 1]
        p1f = torch.softmax(model1(x_flip), dim=1)[:, 1]

        p2 = torch.softmax(model2(x), dim=1)[:, 1]
        p2f = torch.softmax(model2(x_flip), dim=1)[:, 1]

        probs = ((p1 + p1f + p2 + p2f) / 4).cpu().numpy()

        for i in range(len(sid)):
            s = sid[i]
            if s not in subject_probs:
                subject_probs[s] = []
                subject_labels[s] = y[i].item()
            subject_probs[s].append(probs[i])


# =========================
# AGGREGATION
# =========================
final_probs = np.array([np.mean(subject_probs[s]) for s in subject_probs])
final_labels = np.array([subject_labels[s] for s in subject_probs])


# =========================
# THRESHOLD
# =========================
best_bal = 0
best_t = 0.5

for t in np.arange(0.2, 0.7, 0.005):
    preds = (final_probs >= t).astype(int)
    bal = balanced_accuracy_score(final_labels, preds)

    if bal > best_bal:
        best_bal = bal
        best_t = t


# =========================
# FINAL RESULTS
# =========================
final_preds = (final_probs >= best_t).astype(int)

print("\n===== FINAL RESULTS =====")
print("Best Threshold:", best_t)
print("Balanced Accuracy:", balanced_accuracy_score(final_labels, final_preds))
print("Accuracy:", accuracy_score(final_labels, final_preds))
print("AUC:", roc_auc_score(final_labels, final_probs))
print("F1:", f1_score(final_labels, final_preds))
print("Confusion Matrix:\n", confusion_matrix(final_labels, final_preds))
precision = precision_score(final_labels, final_preds, average=None)
recall = recall_score(final_labels, final_preds, average=None)

print("Precision per class:", precision)
print("Recall per class:", recall)

# =========================
# PLOTS
# =========================
plt.figure()
plt.plot(train_l, label="Train Loss")
plt.plot(val_l, label="Val Loss")
plt.legend()
plt.title("Loss Curve")
plt.savefig("loss_curve.png")

plt.figure()
plt.plot(train_a, label="Train Accuracy")
plt.plot(val_a, label="Val Accuracy")
plt.legend()
plt.title("Accuracy Curve")
plt.savefig("accuracy_curve.png")

print("\nSaved: loss_curve.png & accuracy_curve.png")