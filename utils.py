import os
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from models import User
from app import db

def initialize_admin():
    """Initialize admin user with default password if not exists"""
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        # Default password hardcoded for demo purposes - in production, use environment variable
        default_password = os.environ.get('ADMIN_PASSWORD', 'inthisonejobs2024')
        admin = User(
            username='admin',
            password_hash=generate_password_hash(default_password)
        )
        db.session.add(admin)
        db.session.commit()

def validate_user(password):
    """Validate user password"""
    admin = User.query.filter_by(username='admin').first()
    if admin and check_password_hash(admin.password_hash, password):
        return True
    return False

def format_date(date_str):
    """Convert date string to date object"""
    try:
        if isinstance(date_str, str):
            return datetime.strptime(date_str, '%Y-%m-%d').date()
        return date_str
    except ValueError:
        return datetime.now().date()

def search_jobs(query):
    """Search jobs by query"""
    from models import Job
    
    if not query or query.strip() == '':
        return Job.query.order_by(Job.created_at.desc()).all()
        
    search_term = f"%{query}%"
    jobs = Job.query.filter(
        (Job.title.ilike(search_term)) |
        (Job.company.ilike(search_term)) |
        (Job.description.ilike(search_term))
    ).order_by(Job.created_at.desc()).all()
    
    return jobs
