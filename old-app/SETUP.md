# Setup Guide for Inthisone Jobs

This guide will help you set up the Inthisone Jobs application on your local machine or server.

## Prerequisites

- Python 3.10 or higher
- PostgreSQL database
- OpenAI API key

## Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/inthisone-jobs.git
   cd inthisone-jobs
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/inthisone_jobs
   OPENAI_API_KEY=your_openai_api_key
   SESSION_SECRET=a_random_secure_string_for_sessions
   ```

## Database Setup

1. Create a PostgreSQL database:
   ```bash
   createdb inthisone_jobs
   ```

2. The application will automatically create the necessary tables on first run.

## Running the Application

1. Start the application:
   ```bash
   gunicorn --bind 0.0.0.0:5000 main:app
   ```

2. Access the application in your browser:
   ```
   http://localhost:5000
   ```

3. Login with default credentials:
   - Username: admin
   - Password: inthisonejobs2024

4. Change the default password after first login.

## Environment Configuration Options

- `DATABASE_URL`: Connection string for your PostgreSQL database
- `OPENAI_API_KEY`: Your OpenAI API key for AI-powered features
- `SESSION_SECRET`: Secret key for session security

## Development Notes

- The application uses Flask's debug mode by default
- Updates to templates are automatically reloaded
- Database models are defined in `models.py`
- Routes are defined in `routes.py`