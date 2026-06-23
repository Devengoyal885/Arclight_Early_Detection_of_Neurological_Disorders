# Deployment Guide

## Frontend — Vercel

### Step 1: Build Settings on Vercel
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Step 2: Environment Variables
Add to Vercel dashboard → Project Settings → Environment Variables:
```
VITE_API_URL=https://your-backend.onrender.com
```

### Step 3: Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# From frontend directory
cd frontend
vercel --prod
```

---

## Backend — Render

### Step 1: Create New Web Service on Render
- **Runtime:** Python 3
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 2: Upload Model Files
The `.pth` model files must be accessible. Options:
1. Include them in the repo (already committed — 47MB total)
2. Use Render Persistent Disk to store model files separately

### Step 3: Environment Variables on Render
No additional env vars required for basic deployment.

### Step 4: Health Check URL
Set to `/health` in Render dashboard.

---

## Backend — Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

railway login
railway init
railway up
```

Set `Start Command`:
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Docker (Optional)

### Backend Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY ../best_model.pth .
COPY ../model_multi.pth .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t arclight-backend -f backend/Dockerfile .
docker run -p 8000:8000 arclight-backend
```

---

## CORS Configuration

For production, update `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-app.vercel.app"],  # Replace *
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```
