import numpy as np
import torch

def preprocess_mri(filepath):
    volume = np.load(filepath)

    mid = volume.shape[2] // 2
    img = volume[:, :, mid]

    img = (img - np.mean(img)) / (np.std(img) + 1e-5)

    img = np.expand_dims(img, axis=0)
    img = np.expand_dims(img, axis=0)

    return torch.tensor(img, dtype=torch.float32)