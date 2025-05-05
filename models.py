from datetime import datetime
from app import db

class Job(db.Model):
    """Model for job applications"""
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255), nullable=False)
    apply_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert instance to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'apply_date': self.apply_date.strftime('%Y-%m-%d'),
            'description': self.description,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }

class User(db.Model):
    """Model for user authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, default="admin")
    password_hash = db.Column(db.String(256), nullable=False)
