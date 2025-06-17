# ChurnPredict AI - Customer Churn Prediction Application

A comprehensive web application for predicting customer churn using machine learning, built with Next.js and designed for integration with Clerk authentication and Neon database.

## Features

- **User Authentication**: Ready for Clerk integration with sign-in/sign-up pages
- **Churn Prediction**: ML-powered customer churn prediction with confidence scores
- **Session Management**: Store and track prediction history
- **Analytics Dashboard**: View prediction statistics and trends
- **Flask API Integration**: Backend API for ML model serving
- **Database Ready**: PostgreSQL schema for Neon.tech integration

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Flask API (Python)
- **Database**: PostgreSQL (Neon.tech ready)
- **Authentication**: Clerk (integration ready)
- **Icons**: Lucide React

## Project Structure

\`\`\`
churn-prediction-app/
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/page.tsx
│   ├── predict/page.tsx
│   ├── sessions/page.tsx
│   ├── api/predict/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/ui/
│   └── [shadcn components]
├── scripts/
│   ├── flask-api-setup.py
│   └── database-schema.sql
├── lib/
│   └── utils.ts
└── [config files]
\`\`\`

## Getting Started

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Set Up Flask API

Run the Flask API setup script:

\`\`\`bash
python scripts/flask-api-setup.py
\`\`\`

This will:
- Install required Python packages
- Create the Flask API structure
- Set up the prediction endpoint

### 3. Database Setup

Execute the database schema:

\`\`\`sql
-- Run the contents of scripts/database-schema.sql in your Neon database
\`\`\`

### 4. Environment Variables

Create a `.env.local` file:

\`\`\`env
# Database (Neon)
DATABASE_URL=your_neon_database_url

# Clerk Authentication (when ready)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Flask API
FLASK_API_URL=http://127.0.0.1:5328
\`\`\`

### 5. Run the Application

Start the Next.js development server:

\`\`\`bash
npm run dev
\`\`\`

Start the Flask API (in a separate terminal):

\`\`\`bash
python api/index.py
\`\`\`

## Customer Data Parameters

The application handles 19 input parameters for churn prediction:

### Demographics
- Gender (Male/Female)
- Senior Citizen (Yes/No)
- Partner (Yes/No)
- Dependents (Yes/No)

### Account Information
- Tenure (months)
- Contract (Month-to-month, One year, Two year)
- Paperless Billing (Yes/No)
- Payment Method (Electronic check, Mailed check, Bank transfer, Credit card)

### Services
- Phone Service (Yes/No)
- Multiple Lines (Yes/No/No phone service)
- Internet Service (DSL/Fiber optic/No)
- Online Security (Yes/No/No internet service)
- Online Backup (Yes/No/No internet service)
- Device Protection (Yes/No/No internet service)
- Tech Support (Yes/No/No internet service)
- Streaming TV (Yes/No/No internet service)
- Streaming Movies (Yes/No/No internet service)

### Billing
- Monthly Charges ($)
- Total Charges ($)

## Integration Roadmap

### Clerk Authentication
1. Install Clerk packages
2. Configure Clerk providers
3. Replace mock authentication with Clerk
4. Update user management

### Neon Database
1. Set up Neon project
2. Configure database connection
3. Implement data persistence
4. Add real-time session storage

### ML Model Integration
1. Train your churn prediction model
2. Save model artifacts (pickle/joblib)
3. Update Flask API with real model
4. Implement feature preprocessing

## API Endpoints

### Next.js API Routes
- `POST /api/predict` - Proxy to Flask API for predictions

### Flask API Endpoints
- `POST /api/predict` - Generate churn prediction
- `GET /api/health` - Health check

## Database Schema

The application includes a complete PostgreSQL schema with:
- Users table (Clerk integration ready)
- Customer data storage
- Prediction sessions tracking
- Analytics views

## Deployment

### Vercel Deployment
1. Push to GitHub
2. Connect to Vercel
3. Configure environment variables
4. Deploy

### Flask API Deployment
- Can be deployed as Vercel serverless functions
- Or as a separate service (Railway, Heroku, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
