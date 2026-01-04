# Disease Prediction API

This API is designed to predict diseases based on various inputs, including voice data and patient information. It uses machine learning models to analyze the data and provide predictions.

## Features

- **Voice Analysis**: Extracts features from audio files/ records and predicts diseases like Parkinson's.
- **Patient Information Integration**: Combines patient details (e.g., age, gender) with extracted features for predictions.
- **FastAPI Framework**: Built using FastAPI for high performance and easy scalability.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd disease_predict_api
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the API

1. Start the server:

   ```bash
   python -m uvicorn app.main:app --reload
   ```

2. Access the API documentation at:
   - Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Endpoints

### `/analyze/voice`

- **Method**: `POST`
- **Description**: Analyzes voice data and predicts diseases.
- **Inputs**:
  - `name` (string): Patient's name.
  - `age` (integer): Patient's age.
  - `gender` (string): Patient's gender (`male` or `female`).
  - `audio_file` (file): Audio file for analysis.
- **Response**:
  ```json
  {
    "prediction": "Disease prediction result",
    "patient": "Patient's name"
  }
  ```

## Project Structure

```
app/
├── main.py                # Entry point for the FastAPI app
├── ml/
│   ├──model_predictor.py # Machine learning model for predictions
|   └── ensemble_model.pkl
|   └── feature_names.pkl
|   └── scaler.pkl
├── schema/
│   └── patient_inputs.py  # Data schema for patient inputs
├── routers/
│   └── analyze_router.py  # API routes
├── services/
│   └── voice_analyze_service.py # Voice analysis logic
├── utils/
    ├── file_handler.py    # File handling utilities
    └── voice_data_extraction.py # Voice feature extraction
```

## Requirements

- Python 3.8+
- FastAPI
- Uvicorn
- Parselmouth
- SciPy

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
