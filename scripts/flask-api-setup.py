"""
Flask API setup script for churn prediction model integration.
This script demonstrates how to set up the Flask backend that will integrate with the Next.js frontend.
"""

# Install required packages
import subprocess
import sys

def install_packages():
    packages = [
        'flask',
        'flask-cors',
        'pandas',
        'numpy',
        'scikit-learn',
        'joblib',
        'python-dotenv'
    ]
    
    for package in packages:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
    
    print("All required packages installed successfully!")

# Flask API structure
flask_api_code = '''
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js integration

# Load your trained model (you'll need to train and save this)
# model = joblib.load('churn_model.pkl')
# scaler = joblib.load('scaler.pkl')

@app.route('/api/predict', methods=['POST'])
def predict_churn():
    try:
        # Get customer data from request
        customer_data = request.json
        
        # Convert to DataFrame for model prediction
        df = pd.DataFrame([customer_data])
        
        # Preprocess the data (encode categorical variables, scale numerical)
        # This is where you'd apply the same preprocessing as your training data
        
        # For demonstration, we'll return a mock prediction
        # In production, replace this with:
        # prediction = model.predict(processed_data)[0]
        # confidence = model.predict_proba(processed_data)[0].max()
        
        mock_prediction = np.random.choice(['Churn', 'No Churn'], p=[0.3, 0.7])
        mock_confidence = np.random.uniform(0.7, 0.95)
        
        # Key factors that influenced the prediction
        factors = [
            'Contract type',
            'Monthly charges',
            'Tenure',
            'Internet service type',
            'Payment method'
        ]
        
        response = {
            'prediction': mock_prediction,
            'confidence': round(mock_confidence * 100, 2),
            'factors': factors,
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5328))
    app.run(host='127.0.0.1', port=port, debug=True)
'''

# Save Flask API code to file
with open('api/index.py', 'w') as f:
    f.write(flask_api_code)

print("Flask API setup complete!")
print("Next steps:")
print("1. Train your churn prediction model")
print("2. Save the model using joblib.dump(model, 'churn_model.pkl')")
print("3. Update the Flask API to load and use your actual model")
print("4. Run the Flask API with: python api/index.py")

# Install packages
install_packages()
