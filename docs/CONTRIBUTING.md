# Contributing to ArcLight AI

Thank you for your interest in contributing! 🧠

## How to Contribute

### 1. Fork & Clone
```bash
git clone https://github.com/Devengoyal885/Arclight_Early_Detection_of_Neurological_Disorders.git
cd Arclight_Early_Detection_of_Neurological_Disorders
```

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 3. Make Changes

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. Code Standards

**Frontend (TypeScript):**
- Use functional components with hooks
- Follow the existing CSS design system in `index.css`
- Use Framer Motion for animations
- Always handle loading and error states

**Backend (Python):**
- Follow PEP 8
- Add Pydantic schemas for all request/response types
- Keep model code (`inference.py` model class definitions) unchanged
- Add docstrings to all functions

### 5. Submit PR
- Reference any relevant issues
- Include a clear description of changes
- Add screenshots for UI changes
- Ensure `npm run build` passes

## Reporting Issues

Use the GitHub Issue templates:
- **Bug Report:** For unexpected behavior
- **Feature Request:** For new capabilities

## Areas Needing Help

- [ ] DICOM/NIfTI file format support
- [ ] Real Grad-CAM implementation via API
- [ ] Firebase authentication integration
- [ ] Mobile responsiveness improvements
- [ ] Additional language support (i18n)
- [ ] Unit tests for backend inference
- [ ] E2E tests for frontend

## Code of Conduct

Be respectful, constructive, and collaborative. This is a healthcare AI research project — accuracy and safety matter.
