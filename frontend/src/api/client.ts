import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

export interface PredictionResult {
  prediction: string;
  confidence: number;
  risk_level: string;
  recommendation: string;
  probabilities: Record<string, number>;
  remark: string;
  mode: string;
}

export interface ImageResult extends PredictionResult {
  filename: string;
}

export interface MultiPredictionResult {
  results: ImageResult[];
  overall_assessment: string;
  abnormal_count: number;
  total_count: number;
}

export const predictSingle = async (
  file: File,
  mode = "multiclass"
): Promise<PredictionResult> => {
  const form = new FormData();
  form.append("file", file);
  form.append("mode", mode);
  const { data } = await apiClient.post<PredictionResult>("/predict", form);
  return data;
};

export const predictMultiple = async (
  files: File[],
  mode = "multiclass"
): Promise<MultiPredictionResult> => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  form.append("mode", mode);
  const { data } = await apiClient.post<MultiPredictionResult>(
    "/predict-multiple",
    form
  );
  return data;
};

export const checkHealth = async () => {
  const { data } = await apiClient.get("/health");
  return data;
};
