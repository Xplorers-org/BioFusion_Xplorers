import joblib
import os
import numpy as np
import pandas as pd

# Path to model components
BASE_PATH = os.path.dirname(__file__)
SCALER_PATH = os.path.join(BASE_PATH, 'scaler.pkl')
MODEL_PATH = os.path.join(BASE_PATH, 'ensemble_model.pkl')  
FEATURE_NAMES_PATH = os.path.join(BASE_PATH, 'feature_names.pkl')

def predict_parkinson(features: dict) -> float:
    """
    Predict Parkinson's motor UPDRS score from patient features.
    
    Parameters:
    -----------
    features : dict
        Dictionary containing patient features with keys:
        'age', 'sex', 'test_time', 'Jitter(%)', 'Jitter(Abs)', 'Jitter:RAP',
        'Jitter:PPQ5', 'Jitter:DDP', 'Shimmer', 'Shimmer(dB)', 'Shimmer:APQ3',
        'Shimmer:APQ5', 'Shimmer:APQ11', 'Shimmer:DDA', 'NHR', 'HNR', 
        'RPDE', 'DFA', 'PPE'
    
    Returns:
    --------
    float : Predicted motor UPDRS score
    """
    try:
        # Load required model components
        scaler = joblib.load(SCALER_PATH)
        model = joblib.load(MODEL_PATH)
        feature_names = joblib.load(FEATURE_NAMES_PATH)
        
        print(f"Expected features: {feature_names}")
        print(f"Received features: {list(features.keys())}")
        
        # Validate that all required features are present
        missing_features = [name for name in feature_names if name not in features]
        if missing_features:
            raise ValueError(f"Missing required features: {missing_features}")
        
        # Check for any NaN or infinite values
        for name in feature_names:
            value = features[name]
            if pd.isna(value) or np.isinf(value):
                print(f"Warning: Feature '{name}' has invalid value: {value}")
                features[name] = 0.0  # Replace with default value
        
        # Convert dict to ordered array based on feature_names order and create DataFrame with feature names
        input_values = [features[name] for name in feature_names]
        input_df = pd.DataFrame([input_values], columns=feature_names)
        
        print(f"Input DataFrame shape: {input_df.shape}")
        print(f"Input DataFrame:\n{input_df}")
        
        # Scale features using the same scaler from training
        scaled_features = scaler.transform(input_df)
        
        # Make prediction and return UPDRS value
        updrs_prediction = model.predict(scaled_features)[0]
        
        return float(updrs_prediction)
        
    except FileNotFoundError as e:
        raise FileNotFoundError(f"Model file not found: {e}")
    except Exception as e:
        raise Exception(f"Prediction error: {e}")

def get_required_features():
    """
    Get list of required feature names for the model.
    
    Returns:
    --------
    list : List of required feature names
    """
    try:
        feature_names = joblib.load(FEATURE_NAMES_PATH)
        return feature_names.tolist()
    except FileNotFoundError:
        # Fallback list if feature_names.pkl is not available
        return [
            'age', 'sex', 'test_time', 'Jitter(%)', 'Jitter(Abs)', 'Jitter:RAP',
            'Jitter:PPQ5', 'Jitter:DDP', 'Shimmer', 'Shimmer(dB)', 'Shimmer:APQ3',
            'Shimmer:APQ5', 'Shimmer:APQ11', 'Shimmer:DDA', 'NHR', 'HNR', 
            'RPDE', 'DFA', 'PPE'
        ]

# Example usage and testing
if __name__ == "__main__":
    # Example patient data
    example_patient = {
        'age': 72, 'sex': 0, 'test_time': 5.6431,
        'Jitter(%)': 0.00662, 'Jitter(Abs)': 3.38e-005,
        'Jitter:RAP': 0.00401, 'Jitter:PPQ5': 0.00317, 'Jitter:DDP': 0.01204,
        'Shimmer': 0.02565, 'Shimmer(dB)': 0.23, 'Shimmer:APQ3': 0.01438,
        'Shimmer:APQ5': 0.01309, 'Shimmer:APQ11': 0.01662, 'Shimmer:DDA': 0.04314,
        'NHR': 0.01429, 'HNR': 21.64, 'RPDE': 0.41888, 'DFA': 0.54842, 'PPE': 0.16006
    }
    
    try:
        # Test the function
        updrs_score = predict_parkinson(example_patient)
        print(f"Predicted Motor UPDRS: {updrs_score:.2f}")
        
        # Show required features
        print(f"\nRequired features: {get_required_features()}")
        
    except Exception as e:
        print(f"Error: {e}")