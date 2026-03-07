# Inthisone Jobs - Project Files Guide

## Core Python Files
- **app.py**: Main Flask application configuration
- **main.py**: Entry point for the application
- **models.py**: Database models (Resume, Job, User)
- **forms.py**: Form definitions (LoginForm, JobForm, ResumeForm, AIJobForm)
- **routes.py**: All application routes and request handlers
- **utils.py**: Utility functions and helpers
- **openai_service.py**: OpenAI integration for AI features

## Templates
- **base.html**: Base template with common layout and navigation
- **dashboard.html**: Main dashboard view with job listings
- **flash_messages.html**: Reusable template for displaying flash messages
- **job_detail.html**: Detailed view of a single job application
- **job_form.html**: Form for adding/editing job applications
- **login.html**: User login page
- **resume_detail.html**: Detailed view of a single resume
- **resume_form.html**: Form for adding/editing resumes
- **resume_list.html**: List of all user resumes
- **setup_password.html**: Initial password setup page

## Static Files
- **css/styles.css**: Main CSS styles for the application
- **js/main.js**: JavaScript for dynamic functionality

## Documentation
- **README.md**: Main project documentation
- **SETUP.md**: Setup and installation guide
- **LICENSE**: MIT license file
- **dependencies.txt**: List of Python package dependencies

## Configuration Files
- **.gitignore**: Specifies files to exclude from Git repository

## When Creating Your GitHub Repository
1. Create a new repository on GitHub
2. Initialize with all of these files
3. Rename `dependencies.txt` to `requirements.txt` on GitHub
4. Ensure `.env` files with sensitive information are not committed