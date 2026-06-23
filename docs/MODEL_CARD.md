# Model Card — ArcLight AI

## Model Purpose

ArcLight AI uses two PyTorch models for neurological disorder screening from Brain MRI slices:

1. **ResNetMRI** — Binary classification (CN vs AD)
2. **CNN2D** — Multiclass classification (CN, MCI, AD)

Both models are intended for **research and screening assistance only** — not for clinical diagnosis.

---

## Model Details

### ResNetMRI (Binary)

| Property | Value |
|----------|-------|
| Architecture | ResNet-18 (modified) |
| Task | Binary classification |
| Classes | CN (0), AD (1) |
| Input | Grayscale 2D MRI slice — 1 × H × W |
| Weights | `best_model.pth` (45MB) |
| Parameters | ~11.2M |
| Training | 15 epochs, Adam optimizer, lr=1e-4 |
| Loss | CrossEntropy (class weights [1.0, 1.5]) |
| Early Stopping | Patience=3 |

### CNN2D (Multiclass)

| Property | Value |
|----------|-------|
| Architecture | Custom 2-layer CNN |
| Task | Multiclass classification |
| Classes | CN (0), MCI (1), AD (2) |
| Input | Grayscale 2D MRI slice — 1 × 128 × 128 |
| Weights | `model_multi.pth` (2MB) |
| Parameters | ~2.1M |
| Training | 3 epochs, Adam optimizer, lr=7e-3 |
| Loss | CrossEntropy with label smoothing (0.1) |

---

## Dataset

- **Source:** ADNI-like preprocessed MRI data (`.npy` volumetric format)
- **Classes:** CN (Cognitively Normal), MCI (Mild Cognitive Impairment), AD (Alzheimer's Disease)
- **Preprocessing:** Mid-slice extraction from 3D volumes, z-score normalization, horizontal flip augmentation
- **Data Split:** Train / Val splits (exact sizes not disclosed)

---

## Training Methodology

### Binary Model
- Two ResNet18 models trained with different seeds (42, 99)
- Test-time augmentation: horizontal flip ensemble
- Subject-level aggregation: mean probability across slices
- Optimal threshold tuning via balanced accuracy

### Multiclass Model
- Label noise injection during training (30% random label reassignment) — used as a regularization technique
- Gaussian noise + brightness augmentation

---

## Evaluation Metrics

| Model | Metric | Value |
|-------|--------|-------|
| ResNetMRI | Balanced Accuracy | ~0.82 |
| ResNetMRI | AUC | ~0.89 |
| ResNetMRI | Macro F1 | ~0.81 |
| CNN2D | Balanced Accuracy | ~0.72 |
| CNN2D | AUC | ~0.78 |
| CNN2D | Macro F1 | ~0.70 |

> **Note:** These metrics are approximate based on training logs and validation splits.

---

## Limitations

1. **Input format mismatch:** Models were trained on `.npy` volumetric MRI data. The production API uses a PIL-based adapter to convert PNG/JPG inputs to grayscale tensors. This may affect prediction quality.
2. **Dataset size:** Trained on a relatively small dataset — may not generalize across scanner manufacturers or acquisition protocols.
3. **Label noise:** The multiclass model was trained with deliberate label noise injection (30%) as a regularization technique, which limits absolute accuracy.
4. **No DICOM support:** Real clinical MRI data is in DICOM/NIfTI format, which is not currently supported.
5. **2D slice only:** Models analyze a single 2D slice (mid-axial), not full 3D volume, which discards valuable spatial context.

---

## Ethical Considerations

- **Not a diagnostic tool:** Results must never replace clinical evaluation
- **Bias risk:** Dataset demographics may not represent global populations
- **False negatives:** Missing AD diagnosis could cause harm — always recommend clinical follow-up
- **False positives:** Incorrect AD prediction may cause unnecessary anxiety
- **Data privacy:** No MRI data is stored on the server (stateless inference)

---

## Bias Analysis

- Training dataset may over-represent specific age ranges, ethnicities, or scanner types
- MCI is the most difficult class and has highest misclassification rate
- Model performance on data from different MRI scanners is untested

---

## Clinical Disclaimer

> This model is intended for **research and screening purposes only**.
> It is NOT certified for clinical use, FDA approval has not been sought,
> and it MUST NOT be used as a substitute for professional neurological diagnosis.
> Clinical decisions should always be made by qualified healthcare professionals.

---

## Version

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025 | Initial hackathon release |
| 1.1.0 | 2025 | FastAPI integration + image adapter |
