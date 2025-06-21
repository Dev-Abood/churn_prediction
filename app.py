# flask imports, request to receive form data, jsonify to return results in json form
from flask import Flask, request, jsonify 
from flask_cors import CORS # CORS for enabling Next.js application communication
# python libraries needed
import pandas as pd
import numpy as np
import pickle
import os
import logging
from datetime import datetime

# configure logging system to send information and display errors
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js application

class ChurnPredictor:
    def __init__(self, model_path='model.pkl', scaler_path='scaler.pkl'):
        # Initialize predictor variables
        self.model = None 
        self.scaler = None
        self.encoder = None
        self.model_path = model_path # defining the paths
        self.scaler_path = scaler_path

        self.feature_columns = [ # listing all features 
            'gender', 'SeniorCitizen', 'Partner', 'Dependents', 'tenure',
            'PhoneService', 'MultipleLines', 'InternetService', 'OnlineSecurity',
            'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV',
            'StreamingMovies', 'Contract', 'PaperlessBilling', 'PaymentMethod',
            'MonthlyCharges', 'TotalCharges'
        ]
        
        self.load_model() # function to the load the model pkl file
        self.load_scaler() # function to load the StandardScaler() pkl file

    def load_scaler(self):
        # error checking for scaler path
        try:
            if os.path.exists(self.scaler_path):
                with open(self.scaler_path, 'rb') as file:
                    self.scaler = pickle.load(file)
                logger.info(f"Scaler loaded successfully from {self.scaler_path}")
                return True
            else:
                logger.warning(f"Scaler file not found at {self.scaler_path}, will skip scaling")
                self.scaler = None
                return False
        except Exception as e:
            logger.error(f"Error loading scaler: {str(e)}")
            self.scaler = None
            return False

    def load_model(self):
        """Load the pre-trained XGBoost model from pickle file"""
        try:
            # error checking the pickle file path, name is "model.pkl"
            if os.path.exists(self.model_path):
                with open(self.model_path, 'rb') as file:
                    self.model = pickle.load(file) # load the model
                # log success message
                logger.info(f"model is loaded succesfully from path: {self.model_path}")
                return True
            else:
                # in case of error (model path does not exist):
                logger.error(f"model file path for {self.model_path} is not found, please make sure it exists")
                return False
        except Exception as e:
            # in case of server / client computer error
            logger.error(f"Error loading model: {str(e)}") # log the error
            return False

    def preprocess_input(self, customer_data):
        """Function for preprocessing the data"""
        try:
            churn_df = pd.DataFrame([customer_data])
            mapping = { # map frontend field names to model expected names
                # reference to the dataset
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

            
            processed_data = {} # Rename columns to match model expectations
            for frontend_key, model_key in mapping.items():
                if frontend_key in customer_data:
                    processed_data[model_key] = customer_data[frontend_key]

            churn_df = pd.DataFrame([processed_data]) # place mapped feature columns in a dataframe object

            # Ensure numerical columns are properly typed
            numerical_columns = ['tenure', 'MonthlyCharges', 'TotalCharges']
            for col in numerical_columns:
                if col in churn_df.columns:
                    churn_df[col] = pd.to_numeric(churn_df[col], errors='coerce').fillna(0)
                    
            
            # convert categorical columns to numeric as expected by model
            categorical_mappings = {
                #! manually editing them is better practice
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
                if col in churn_df.columns:
                    churn_df[col] = churn_df[col].map(mapping).fillna(0)
            
            # Ensure all required columns are present in correct order
            for col in self.feature_columns:
                if col not in churn_df.columns:
                    churn_df[col] = 0

            # Select and order columns as expected by model
            churn_df = churn_df[self.feature_columns]
            
            # apply scaling using the pre-trained scaler 
            if self.scaler is not None:
                try:
                    # check if scaler was trained on all features or just numerical ones
                    if hasattr(self.scaler, 'feature_names_in_') and len(self.scaler.feature_names_in_) == len(self.feature_columns):
                        # Scaler was trained on all features the same
                        churn_df_scaled = pd.DataFrame(
                            self.scaler.transform(churn_df),
                            columns=churn_df.columns
                        )
                        churn_df = churn_df_scaled
                        logger.info("Applied scaling to all features")
                    else:
                        # Scaler was trained on numerical features only
                        churn_df_copy = churn_df.copy()
                        churn_df_copy[numerical_columns] = self.scaler.transform(churn_df_copy[numerical_columns])
                        churn_df = churn_df_copy
                        logger.info("Applied scaling to numerical features only")
                except Exception as e:
                    logger.warning(f"Could not apply pre-trained scaler: {str(e)}. Skipping scaling.")
            else:
                logger.info("No pre-trained scaler available, skipping scaling")

            return churn_df

        except Exception as e:
            logger.error(f"Error preprocessing data: {str(e)}")
            raise ValueError(f"Data preprocessing failed: {str(e)}")
    
    def sendFI(self):
        """Function to send feature importance results"""
        
        importance_churn_df = pd.DataFrame({
                "Features": self.feature_columns,
                "Importance": self.model.feature_importances_ 
            }).sort_values(
                by="Importance",
                ascending=False # Sort descendingly by importance so we get the most important features as the top most
            )
        return importance_churn_df
    
    def predict(self, customer_data): # Function to create churn prediction
        """Make a churn prediction for a single customer"""
        
        if self.model is None: # error check model loading
            raise ValueError("Model is not loaded, maybe model.pkl does not exist in your dir")

        try:
            # Preprocess the input data
            processed_data = self.preprocess_input(customer_data)

            # Make prediction
            prediction = self.model.predict(processed_data)[0]
            prediction_proba = self.model.predict_proba(processed_data)[0]

            # Get confidence score
            confidence = float( # Make sure confidence score is a float, and convert to fixed probability
                max(prediction_proba) * 100
            )
            
            churn_probability = float( # Serialize into churn or no churn
                prediction_proba[1] * 100
            ) if len(prediction_proba) > 1 else 0
            
            
            # Get the top 5 most influential features to the model's prediction
            importance = self.sendFI()
            FS = importance["Features"].to_list()[:5] # Limiting to top 5 factors
            
            print("feature importance top 5: ", FS)
            print("prediction: ", prediction)
            print("prediction probability: ", prediction_proba)
            print("confidence score: ", confidence)
            print("churn_probability", churn_probability)
            
            result = { # result request to be sent back to frontend
                'prediction': 'Churn' if prediction == 1 else 'No Churn',
                'confidence': round(confidence, 2),
                'churn_probability': round(churn_probability, 2),
                'factors': FS,  
                'model_version': '1.0',
            }

            return result # return back result json object

        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            raise ValueError(f"Prediction failed: {str(e)}")



# Initialize the predictor
predictor = ChurnPredictor()

# the predict function
@app.route('/predict', methods=['POST'])
def predict_churn():
    """Predict churn for a customer"""
    try:
        # Get customer data from request
        data = request.json

        if not data: # check if data does not exist (null)
            # jsonify a not found error
            return jsonify({'error': 'no prediction data provided'}), 400

        # split customer data
        customer_data = data.get('customerData', {})

        if not customer_data:
            # jsonify a not found error if customer data does not exist
            return jsonify({'error': 'no customer data provided'}), 400

        # generate prediction using the loaded XGBoost model
        start_time = datetime.now() # start time
        result = predictor.predict(customer_data) # make prediction
        end_time = datetime.now() # end time upon finishing the prediction

        # response time calculation (for testing purposes)
        response_time = int( # receive time - send start time
            (end_time - start_time).total_seconds() * 1000
        )
        
        # save in results
        result['apiResponseTime'] = response_time

        # log prediction info
        logger.info(f"Prediction made: {result['prediction']} with {result['confidence']}% confidence")

        return jsonify(result)

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': 'Internal server error occurred'}), 500

# health check endpoints
@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'ChurnPredict AI API is running',
        'version': '1.0',
        'model_loaded': predictor.model is not None
    })

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
        # time in ISO formatting
        'timestamp': datetime.now().isoformat(),
        'model_status': 'loaded' if predictor.model is not None else 'not_loaded',
        'version': '1.0'
    })

if __name__ == '__main__':
    if predictor.model is None: # error check model loading
        logger.error("loading model failed, please ensure model.pkl exists in the current dir.")
    else:
        logger.info("ChurnPredict AI API is ready")

    # Run the Flask app
    app.run(host='0.0.0.0', port=5000)
#* Port 5000 for API