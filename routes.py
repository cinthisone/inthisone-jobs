from flask import render_template, request, redirect, url_for, session, flash, jsonify
from datetime import datetime
import json
from werkzeug.security import generate_password_hash

from app import app, db
from models import Job, User
from forms import LoginForm, JobForm, AIJobForm
from utils import validate_user, format_date, search_jobs, initialize_admin
from openai_service import parse_job_posting

# Initialize admin user on app start
# Flask 2.0+ uses app.before_request instead of before_first_request
def setup():
    initialize_admin()

@app.before_request
def before_request():
    # Only run setup once
    if not getattr(app, '_setup_done', False):
        setup()
        app._setup_done = True

# Authentication check decorator
def login_required(view_func):
    def wrapped_view(*args, **kwargs):
        if not session.get('authenticated'):
            return redirect(url_for('login'))
        return view_func(*args, **kwargs)
    wrapped_view.__name__ = view_func.__name__
    return wrapped_view

# Route handlers
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        if validate_user(form.password.data):
            session['authenticated'] = True
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid password!', 'danger')
    
    return render_template('login.html', form=form)

@app.route('/logout')
def logout():
    session.pop('authenticated', None)
    flash('You have been logged out!', 'info')
    return redirect(url_for('login'))

@app.route('/')
def index():
    if session.get('authenticated'):
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    # Get jobs for initial load
    jobs = Job.query.order_by(Job.created_at.desc()).all()
    return render_template('dashboard.html', jobs=jobs)

@app.route('/jobs/search')
@login_required
def job_search():
    query = request.args.get('q', '')
    jobs = search_jobs(query)
    return jsonify([job.to_dict() for job in jobs])

@app.route('/jobs/add', methods=['GET', 'POST'])
@login_required
def add_job():
    form = JobForm()
    
    if form.validate_on_submit():
        job = Job(
            title=form.title.data,
            company=form.company.data,
            apply_date=form.apply_date.data,
            description=form.description.data
        )
        db.session.add(job)
        db.session.commit()
        flash('Job application added successfully!', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('job_form.html', form=form, title="Add New Job Application")

@app.route('/jobs/edit/<int:job_id>', methods=['GET', 'POST'])
@login_required
def edit_job(job_id):
    job = Job.query.get_or_404(job_id)
    form = JobForm(obj=job)
    
    if form.validate_on_submit():
        job.title = form.title.data
        job.company = form.company.data
        job.apply_date = form.apply_date.data
        job.description = form.description.data
        db.session.commit()
        flash('Job application updated successfully!', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('job_form.html', form=form, title="Edit Job Application")

@app.route('/jobs/delete/<int:job_id>', methods=['POST'])
@login_required
def delete_job(job_id):
    job = Job.query.get_or_404(job_id)
    db.session.delete(job)
    db.session.commit()
    flash('Job application deleted successfully!', 'success')
    return redirect(url_for('dashboard'))

@app.route('/jobs/view/<int:job_id>')
@login_required
def view_job(job_id):
    job = Job.query.get_or_404(job_id)
    return render_template('job_detail.html', job=job)

@app.route('/jobs/ai-assist', methods=['GET', 'POST'])
@login_required
def ai_assist():
    form = AIJobForm()
    job_form = JobForm()
    
    if request.method == 'POST':
        job_posting = request.form.get('job_posting')
        if job_posting:
            result = parse_job_posting(job_posting)
            if 'error' in result and result['error']:
                flash(f"Error parsing job posting: {result['error']}", 'danger')
                return render_template('job_form.html', form=job_form, ai_form=form, title="AI-Assisted Job Entry")
            
            job_form.title.data = result.get('title', '')
            job_form.company.data = result.get('company', '')
            job_form.apply_date.data = format_date(result.get('apply_date', datetime.now().strftime('%Y-%m-%d')))
            job_form.description.data = result.get('description', '')
            
            flash('Job posting parsed successfully! Review and submit the form.', 'success')
            return render_template('job_form.html', form=job_form, ai_form=form, title="AI-Assisted Job Entry", 
                                prefilled=True)
    
    return render_template('job_form.html', form=job_form, ai_form=form, title="AI-Assisted Job Entry")

@app.route('/api/parse-job', methods=['POST'])
@login_required
def api_parse_job():
    data = request.json
    job_posting = data.get('text', '')
    if not job_posting:
        return jsonify({'error': 'No job posting provided'}), 400
    
    result = parse_job_posting(job_posting)
    return jsonify(result)

@app.route('/setup-password', methods=['GET', 'POST'])
def setup_password():
    # Only allow this if no user exists or user is authenticated
    if User.query.count() > 0 and not session.get('authenticated'):
        flash('Unauthorized access', 'danger')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if not password or len(password) < 8:
            flash('Password must be at least 8 characters long', 'danger')
        elif password != confirm_password:
            flash('Passwords do not match', 'danger')
        else:
            # If admin exists, update password, otherwise create new admin
            admin = User.query.filter_by(username='admin').first()
            if admin:
                admin.password_hash = generate_password_hash(password)
            else:
                admin = User(username='admin', password_hash=generate_password_hash(password))
                db.session.add(admin)
            
            db.session.commit()
            flash('Password set successfully!', 'success')
            return redirect(url_for('login'))
    
    return render_template('setup_password.html')

@app.route('/reset-password/<token>', methods=['GET'])
def reset_password(token):
    # This is a special route for demonstration purposes
    # In a real application, you would use a secure token system
    if token == 'special-reset-token':
        # Set a specific password
        admin = User.query.filter_by(username='admin').first()
        if admin:
            admin.password_hash = generate_password_hash('Erockeast123!@#')
            db.session.commit()
            flash('Password has been reset to your requested password. You can now log in.', 'success')
        else:
            # Create admin if it doesn't exist
            admin = User(username='admin', password_hash=generate_password_hash('Erockeast123!@#'))
            db.session.add(admin)
            db.session.commit()
            flash('Admin user created with your requested password. You can now log in.', 'success')
        
        return redirect(url_for('login'))
    else:
        flash('Invalid reset token', 'danger')
        return redirect(url_for('login'))
