# Parkinson's Disease Predictor App

This application analyzes voice recordings to predict the likelihood of Parkinson's disease using the Unified Parkinson's Disease Rating Scale (UPDRS). It combines modern web technologies with advanced machine learning models to provide healthcare professionals and patients with a non-invasive screening tool.

**Key Features:**

- Voice recording and analysis
- AI-powered UPDRS score prediction
- Comprehensive dashboard with results visualization

## 🚀 Quick Start

### Step 1: Clone the Repository

```bash
git clone https://github.com/Xplorers-org/Parkinsons-Disease-Predictor-app.git
cd Parkinsons-Disease-Predictor-app
```

### Step 2: Download ML Models

Download the machine learning models from Google Drive and place them in the backend/app/ml directory:

📁 **Download Link**: [ML Models](https://drive.google.com/drive/folders/1T36drPayYQtJHlV5S3svuDKn_GtLfKHa?usp=share_link)

**Directory Structure After Download:**

```
backend/
   app/
   ├── main.py               
   ├── ml/                  # 👈 ML models go here
   │   ├──model_predictor.py
   |   └── ensemble_model.pkl   
   |   └── feature_names.pkl
   |   └── scaler.pkl
   ├── schema/
   │   └── ...
```

**Instructions:**

1. Download all model files from the Google Drive link
2. Place the downloaded `.pkl` files in the `backend/app/ml/` directory

### Step 3: Start the Application

```bash
docker compose up --build
```

**That's it!** 🎉

### Step 4: Access the Application

- **Frontend (Main App)**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Step 5: Stop the Application

```bash
docker compose down
```

##  How to Use

1. **Open the app** at http://localhost:3000
2. **Navigate to Voice Recording** section
3. **Enter patient information** (name, age, gender)
4. **Record or upload** a voice sample
5. **View the UPDRS analysis** and risk assessment


# Docker Images


### 🖥️ Frontend

- **Docker Hub:** https://hub.docker.com/r/mavi21/parkinsons_frontend_image  

- **Pull Command:**

```bash
docker pull mavi21/parkinsons_frontend_image:v1.0
```

#### Run the container:

```bash
docker run -d -p 3000:3000 mavi21/parkinsons_frontend_image:v1.0
```
---

### ⚙️ Backend

- **Docker Hub:** https://hub.docker.com/r/mavi21/parkinsons-disease-predictor-app-backend

- **Pull Command:**

```bash
docker pull mavi21/parkinsons-disease-predictor-app-backend
```

#### Run the container:

```bash
docker run -d -p 8000:8000 mavi21/parkinsons-disease-predictor-app-backend
```
---
## 🔧 Troubleshooting

### Docker Issues

```bash
# If build fails, clear Docker cache
docker system prune -f
docker compose up --build
```

### Port Issues

```bash
# Check if ports are in use
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

### Missing Models Error

- Ensure you've downloaded all model files from the Google Drive link
- Verify files are placed in `backend/app/ml/` directory
- Check that the files have `.pkl` extension

## 📁 Project Structure

```
Parkinsons-Disease-Predictor-app/
├── README.md
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── .dockerignore
│
├── backend/                    # FastAPI Backend
│   ├── requirements.txt
│   └── app/
│       ├── main.py            # API entry point
│       ├── ml/
│       │   ├── *.pkl        # 👈 ML models go here
│       │   └── model_predictor.py
│       ├── routers/           # API endpoints
│       ├── services/          # Business logic
│       └── utils/             # Utilities
│
└── frontend/                  # Next.js Frontend
    ├── package.json
    ├── src/
    │   ├── app/              # Pages and layouts
    │   ├── domain/           # Business logic
    │   └── presentation/     # UI components
    └── ...
```

## 🏥 For Healthcare Professionals

This tool is designed for:

- **Early screening** of Parkinson's disease
- **Monitoring patient progress** over time
- **Non-invasive assessment** using voice analysis
- **Research and clinical studies**

**Important**: This application is for research and screening purposes only. It should not replace professional medical diagnosis. Always consult healthcare professionals for medical decisions.


---

## Team: **Xplorers** 
