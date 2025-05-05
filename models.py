from datetime import datetime
from app import db

class Resume(db.Model):
    """Model for resumes"""
    __tablename__ = 'resumes'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    job_title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with jobs (one resume can be used for many job applications)
    jobs = db.relationship('Job', backref='resume', lazy=True)
    
    def to_dict(self):
        """Convert instance to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'job_title': self.job_title,
            'content': self.content,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }

class Job(db.Model):
    """Model for job applications"""
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255), nullable=False)
    apply_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text, nullable=False)
    cover_letter = db.Column(db.Text, nullable=True)
    pay_range = db.Column(db.String(100), nullable=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert instance to dictionary"""
        result = {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'apply_date': self.apply_date.strftime('%Y-%m-%d'),
            'description': self.description,
            'cover_letter': self.cover_letter,
            'pay_range': self.pay_range,
            'resume_id': self.resume_id,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Include resume information if available
        if self.resume:
            result['resume'] = {
                'id': self.resume.id,
                'title': self.resume.title,
                'job_title': self.resume.job_title
            }
        
        return result

class User(db.Model):
    """Model for user authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, default="admin")
    password_hash = db.Column(db.String(256), nullable=False)
