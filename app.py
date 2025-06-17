from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class ChurnPredictor:
    def __init__(self, model_path='model.pkl'):
        self.model = None
        self.model_path = model_path
        self.feature_columns = [
            'gender', 'SeniorCitizen', 'Partner', 'Dependents', 'tenure',
            'PhoneService', 'MultipleLines', 'InternetService', 'OnlineSecurity',
            'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV',
            'StreamingMovies', 'Contract', 'PaperlessBilling', 'PaymentMethod',
            'MonthlyCharges', 'TotalCharges'
        ]
        self.load_model()

    def load_model(self):
        """Load the pre-trained XGBoost model from pickle file"""
        try:
            if os.path.exists(self.model_path):
                with open(self.model_path, 'rb') as file:
                    self.model = pickle.load(file)
                logger.info(f"Model loaded successfully from {self.model_path}")
                return True
            else:
                logger.error(f"Model file {self.model_path} not found!")
                return False
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            return False

    def preprocess_input(self, customer_data):
        """Preprocess customer data for prediction"""
        try:
            df = pd.DataFrame([customer_data])

            # Map frontend field names to model expected names
            field_mapping = {
                'gender': 'gender',
                'seniorCitizen': 'SeniorCitizen',
                'partner': 'Partner',
                'dependents': 'Dependents',
                'tenure': 'tenure',
                'phoneService': 'PhoneService',
                'multipleLines': 'MultipleLines',
                'internetService': 'InternetService',
                'onlineSecurity': 'OnlineSecurity',
                'onlineBackup': 'OnlineBackup',
                'deviceProtection': 'DeviceProtection',
                'techSupport': 'TechSupport',
                'streamingTV': 'StreamingTV',
                'streamingMovies': 'StreamingMovies',
                'contract': 'Contract',
                'paperlessBilling': 'PaperlessBilling',
                'paymentMethod': 'PaymentMethod',
                'monthlyCharges': 'MonthlyCharges',
                'totalCharges': 'TotalCharges'
            }

            # Rename columns to match model expectations
            processed_data = {}
            for frontend_key, model_key in field_mapping.items():
                if frontend_key in customer_data:
                    processed_data[model_key] = customer_data[frontend_key]

            df = pd.DataFrame([processed_data])

            # Handle categorical variables - convert to numeric as expected by model
            categorical_mappings = {
                'gender': {'Male': 1, 'Female': 0},
                'SeniorCitizen': {'Yes': 1, 'No': 0},
                'Partner': {'Yes': 1, 'No': 0},
                'Dependents': {'Yes': 1, 'No': 0},
                'PhoneService': {'Yes': 1, 'No': 0},
                'MultipleLines': {'Yes': 1, 'No': 0, 'No phone service': 2},
                'InternetService': {'DSL': 0, 'Fiber optic': 1, 'No': 2},
                'OnlineSecurity': {'Yes': 1, 'No': 0, 'No internet service': 2},
                'OnlineBackup': {'Yes': 1, 'No': 0, 'No internet service': 2},
                'DeviceProtection': {'Yes': 1, 'No': 0, 'No internet service': 2},
                'TechSupport': {'Yes': 1, 'No': 0, 'No internet service': 2},
                'StreamingTV': {'Yes': 1, 'No': 0, 'No internet service': 2},
                'StreamingMovies': {'Yes': 1, 'No': 0, 'No internet service': 2},
                'Contract': {'Month-to-month': 0, 'One year': 1, 'Two year': 2},
                'PaperlessBilling': {'Yes': 1, 'No': 0},
                'PaymentMethod': {
                    'Electronic check': 0,
                    'Mailed check': 1,
                    'Bank transfer (automatic)': 2,
                    'Credit card (automatic)': 3
                }
            }

            # Apply categorical mappings
            for col, mapping in categorical_mappings.items():
                if col in df.columns:
                    df[col] = df[col].map(mapping).fillna(0)

            # Ensure numerical columns are properly typed
            numerical_columns = ['tenure', 'MonthlyCharges', 'TotalCharges']
            for col in numerical_columns:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

            # Ensure all required columns are present in correct order
            for col in self.feature_columns:
                if col not in df.columns:
                    df[col] = 0

            # Select and order columns as expected by model
            df = df[self.feature_columns]

            return df

        except Exception as e:
            logger.error(f"Error preprocessing data: {str(e)}")
            raise ValueError(f"Data preprocessing failed: {str(e)}")

    def predict(self, customer_data):
        """Make a churn prediction for a single customer"""
        if self.model is None:
            raise ValueError("Model is not loaded. Please check if model.pkl exists.")

        try:
            # Preprocess the input data
            processed_data = self.preprocess_input(customer_data)

            # Make prediction
            prediction = self.model.predict(processed_data)[0]
            prediction_proba = self.model.predict_proba(processed_data)[0]

            # Get confidence score
            confidence = float(max(prediction_proba) * 100)
            churn_probability = float(prediction_proba[1] * 100) if len(prediction_proba) > 1 else 0

            # Determine key factors (simplified - you can enhance this based on your model)
            key_factors = []
            if customer_data.get('contract') == 'Month-to-month':
                key_factors.append('Contract type')
            if float(customer_data.get('monthlyCharges', 0)) > 70:
                key_factors.append('Monthly charges')
            if int(customer_data.get('tenure', 0)) < 12:
                key_factors.append('Tenure')
            if customer_data.get('internetService') == 'Fiber optic':
                key_factors.append('Internet service type')
            if customer_data.get('paymentMethod') == 'Electronic check':
                key_factors.append('Payment method')

            # Ensure we have at least some factors
            if not key_factors:
                key_factors = ['Contract type', 'Monthly charges', 'Tenure']

            result = {
                'prediction': 'Churn' if prediction == 1 else 'No Churn',
                'confidence': round(confidence, 2),
                'churn_probability': round(churn_probability, 2),
                'factors': key_factors[:4],  # Limit to top 4 factors
                'model_version': '1.0'
            }

            return result

        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            raise ValueError(f"Prediction failed: {str(e)}")

# Initialize the predictor
predictor = ChurnPredictor()

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'ChurnPredict AI API is running',
        'version': '1.0',
        'model_loaded': predictor.model is not None
    })

@app.route('/predict', methods=['POST'])
def predict_churn():
    """Predict churn for a customer"""
    try:
        # Get customer data from request
        data = request.json

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        customer_data = data.get('customerData', {})

        if not customer_data:
            return jsonify({'error': 'No customer data provided'}), 400

        # Make prediction using the loaded XGBoost model
        start_time = datetime.now()
        result = predictor.predict(customer_data)
        end_time = datetime.now()

        # Calculate response time
        response_time = int((end_time - start_time).total_seconds() * 1000)
        result['apiResponseTime'] = response_time

        logger.info(f"Prediction made: {result['prediction']} with {result['confidence']}% confidence")

        return jsonify(result)

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': 'Internal server error occurred'}), 500

@app.route('/model/status', methods=['GET'])
def model_status():
    """Get model status and information"""
    return jsonify({
        'model_loaded': predictor.model is not None,
        'model_path': predictor.model_path,
        'feature_columns': predictor.feature_columns,
        'model_type': 'XGBoost Classifier'
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Detailed health check"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model_status': 'loaded' if predictor.model is not None else 'not_loaded',
        'version': '1.0'
    })

if __name__ == '__main__':
    if predictor.model is None:
        logger.error("Failed to load model. Please ensure model.pkl exists in the current directory.")
    else:
        logger.info("ChurnPredict AI API is ready!")

    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
