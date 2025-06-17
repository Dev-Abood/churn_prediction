-- Database schema for ChurnPredict AI application
-- This schema is designed for Neon.tech PostgreSQL database

-- Users table (will integrate with Clerk authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer data table for storing input data
CREATE TABLE IF NOT EXISTS customer_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Demographics
    gender VARCHAR(10),
    senior_citizen VARCHAR(10),
    partner VARCHAR(10),
    dependents VARCHAR(10),
    
    -- Account information
    tenure INTEGER,
    contract VARCHAR(50),
    paperless_billing VARCHAR(10),
    payment_method VARCHAR(100),
    
    -- Services
    phone_service VARCHAR(10),
    multiple_lines VARCHAR(50),
    internet_service VARCHAR(50),
    online_security VARCHAR(50),
    online_backup VARCHAR(50),
    device_protection VARCHAR(50),
    tech_support VARCHAR(50),
    streaming_tv VARCHAR(50),
    streaming_movies VARCHAR(50),
    
    -- Billing
    monthly_charges DECIMAL(10,2),
    total_charges DECIMAL(10,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prediction sessions table
CREATE TABLE IF NOT EXISTS prediction_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    customer_data_id UUID REFERENCES customer_data(id) ON DELETE CASCADE,
    
    -- Prediction results
    prediction VARCHAR(20) NOT NULL, -- 'Churn' or 'No Churn'
    confidence DECIMAL(5,2) NOT NULL, -- Confidence percentage
    factors TEXT[], -- Array of key factors
    
    -- Model information
    model_version VARCHAR(50),
    api_response_time INTEGER, -- Response time in milliseconds
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_customer_data_user_id ON customer_data(user_id);
CREATE INDEX IF NOT EXISTS idx_prediction_sessions_user_id ON prediction_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_prediction_sessions_created_at ON prediction_sessions(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data insertion (for testing)
-- Note: In production, this will be handled by Clerk authentication
INSERT INTO users (clerk_user_id, email, first_name, last_name) 
VALUES ('test_user_1', 'test@example.com', 'Test', 'User')
ON CONFLICT (clerk_user_id) DO NOTHING;

-- View for session analytics
CREATE OR REPLACE VIEW session_analytics AS
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    COUNT(ps.id) as total_predictions,
    COUNT(CASE WHEN ps.prediction = 'Churn' THEN 1 END) as churn_predictions,
    COUNT(CASE WHEN ps.prediction = 'No Churn' THEN 1 END) as no_churn_predictions,
    AVG(ps.confidence) as avg_confidence,
    MAX(ps.created_at) as last_prediction_date
FROM users u
LEFT JOIN prediction_sessions ps ON u.id = ps.user_id
GROUP BY u.id, u.first_name, u.last_name;

COMMENT ON TABLE users IS 'User accounts integrated with Clerk authentication';
COMMENT ON TABLE customer_data IS 'Customer information used for churn prediction';
COMMENT ON TABLE prediction_sessions IS 'Prediction results and session history';
COMMENT ON VIEW session_analytics IS 'Analytics view for user prediction statistics';
