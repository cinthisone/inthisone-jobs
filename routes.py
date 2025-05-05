from flask import render_template, request, redirect, url_for, session, flash, jsonify
from datetime import datetime, date
import json
from werkzeug.security import generate_password_hash
from sqlalchemy import text

from app import app, db
from models import Job, User, Resume
from forms import LoginForm, JobForm, AIJobForm, ResumeForm
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
    
    # Populate the resume dropdown
    resumes = Resume.query.order_by(Resume.title).all()
    form.resume_id.choices = [(0, 'None')] + [(r.id, r.title) for r in resumes]
    
    if request.method == 'POST':
        # Debug logging
        print("POST request received to add_job")
        print(f"Form data: {request.form}")
        
        # Get the form data directly from request.form 
        title = request.form.get('title')
        company = request.form.get('company')
        apply_date_str = request.form.get('apply_date')
        description = request.form.get('description')
        cover_letter = request.form.get('cover_letter')
        resume_id_str = request.form.get('resume_id')
        
        # Convert resume_id to int if provided
        resume_id = None
        if resume_id_str and resume_id_str != '0':
            try:
                resume_id = int(resume_id_str)
            except ValueError:
                pass
        
        # Validate form fields manually
        errors = []
        if not title:
            errors.append('Job Title is required')
        if not company:
            errors.append('Company is required')
        if not description:
            errors.append('Job Description is required')
            
        if errors:
            for error in errors:
                flash(error, 'danger')
            # Populate form with submitted data
            form.title.data = title
            form.company.data = company
            form.description.data = description
            form.cover_letter.data = cover_letter
            if resume_id:
                form.resume_id.data = resume_id
            if apply_date_str:
                try:
                    form.apply_date.data = datetime.strptime(apply_date_str, '%Y-%m-%d').date()
                except ValueError:
                    form.apply_date.data = date.today()
            return render_template('job_form.html', form=form, title="Add New Job Application")
        
        # Form is valid
        print("Form data is valid, creating job")
        try:
            # Parse the apply_date or use today's date
            try:
                apply_date = datetime.strptime(apply_date_str, '%Y-%m-%d').date() if apply_date_str else date.today()
            except ValueError:
                apply_date = date.today()
            
            # Extra validation to prevent empty values
            if not title or title.strip() == '':
                flash('Job title cannot be empty', 'danger')
                return render_template('job_form.html', form=form, title="Add New Job Application")
                
            if not company or company.strip() == '':
                flash('Company name cannot be empty', 'danger')
                return render_template('job_form.html', form=form, title="Add New Job Application")
                
            # Create and save the job
            job = Job(
                title=title,
                company=company,
                apply_date=apply_date,
                description=description,
                cover_letter=cover_letter,
                resume_id=resume_id
            )
            db.session.add(job)
            db.session.commit()
            print("Job saved successfully")
            flash('Job application added successfully!', 'success')
            return redirect(url_for('dashboard'))
        except Exception as e:
            print(f"Error saving job: {str(e)}")
            db.session.rollback()
            flash(f'Error saving job: {str(e)}', 'danger')
    
    return render_template('job_form.html', form=form, title="Add New Job Application")

@app.route('/jobs/edit/<int:job_id>', methods=['GET', 'POST'])
@login_required
def edit_job(job_id):
    job = Job.query.get_or_404(job_id)
    form = JobForm(obj=job)
    
    # Populate the resume dropdown
    resumes = Resume.query.order_by(Resume.title).all()
    form.resume_id.choices = [(0, 'None')] + [(r.id, r.title) for r in resumes]
    
    if request.method == 'POST':
        # Set default date if not provided
        if not form.apply_date.data:
            form.apply_date.data = date.today()
        
        # Get resume_id from form
        resume_id_str = request.form.get('resume_id')
        resume_id = None
        if resume_id_str and resume_id_str != '0':
            try:
                resume_id = int(resume_id_str)
            except ValueError:
                pass
            
        # Validate form
        if form.validate():
            # Extra validation to prevent empty values
            if not form.title.data or form.title.data.strip() == '':
                flash('Job title cannot be empty', 'danger')
                return render_template('job_form.html', form=form, title="Edit Job Application")
                
            if not form.company.data or form.company.data.strip() == '':
                flash('Company name cannot be empty', 'danger')
                return render_template('job_form.html', form=form, title="Edit Job Application")
                
            job.title = form.title.data
            job.company = form.company.data
            job.apply_date = form.apply_date.data
            job.description = form.description.data
            job.cover_letter = form.cover_letter.data
            job.resume_id = resume_id
            db.session.commit()
            flash('Job application updated successfully!', 'success')
            return redirect(url_for('dashboard'))
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    flash(f"Error in {getattr(form, field).label.text}: {error}", 'danger')
    
    return render_template('job_form.html', form=form, title="Edit Job Application")

@app.route('/jobs/delete/<int:job_id>', methods=['POST'])
@login_required
def delete_job(job_id):
    try:
        # Get the job and log its information
        job = Job.query.get_or_404(job_id)
        print(f"Deleting job: ID={job.id}, Title={job.title or 'Empty'}, Company={job.company or 'Empty'}")
        
        # Delete the job
        db.session.delete(job)
        db.session.commit()
        
        print(f"Job {job_id} deleted successfully")
        flash('Job application deleted successfully!', 'success')
    except Exception as e:
        print(f"Error deleting job {job_id}: {str(e)}")
        
        # If normal deletion failed, try direct SQL deletion as a fallback
        try:
            print(f"Attempting direct SQL deletion for job {job_id}")
            db.session.execute(text(f"DELETE FROM jobs WHERE id = {job_id}"))
            db.session.commit()
            print(f"Job {job_id} force deleted via SQL")
            flash('Job application deleted successfully (forced deletion)!', 'success')
            return redirect(url_for('dashboard'))
        except Exception as sql_error:
            print(f"SQL deletion also failed: {str(sql_error)}")
            db.session.rollback()
            flash(f'Error deleting job: {str(e)}', 'danger')
    
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
    
    # Populate resume dropdowns for both forms
    resumes = Resume.query.order_by(Resume.title).all()
    form.resume_id.choices = [(0, 'None')] + [(r.id, r.title) for r in resumes]
    job_form.resume_id.choices = [(0, 'None')] + [(r.id, r.title) for r in resumes]
    
    if request.method == 'GET':
        # Just render the template on GET requests
        return render_template('job_form.html', form=job_form, ai_form=form, title="AI-Assisted Job Entry")
    
    # For POST requests, don't do anything - we'll only use AJAX for this
    return render_template('job_form.html', form=job_form, ai_form=form, title="AI-Assisted Job Entry")

@app.route('/api/parse-job', methods=['POST'])
@login_required
def api_parse_job():
    try:
        data = request.json
        job_posting = data.get('text', '')
        resume_id = data.get('resume_id')
        
        if not job_posting:
            return jsonify({'error': 'No job posting provided'}), 400
        
        # If resume_id is provided, get the resume content
        resume_content = None
        if resume_id:
            try:
                resume = Resume.query.get(resume_id)
                if resume:
                    resume_content = resume.content
            except Exception as resume_error:
                print(f"Error retrieving resume: {str(resume_error)}")
        
        # Parse job posting with resume content if available
        result = parse_job_posting(job_posting, resume_content)
        
        # Add resume_id to result if it was provided
        if resume_id:
            result['resume_id'] = resume_id
            
        return jsonify(result)
    except Exception as e:
        print(f"Error in API parse job: {str(e)}")
        return jsonify({'error': str(e)}), 500

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

@app.route('/jobs/force-delete/<int:job_id>', methods=['GET'])
@login_required
def force_delete_job(job_id):
    """Special route to force delete problematic job records"""
    try:
        # First try direct SQL deletion
        db.session.execute(text(f"DELETE FROM jobs WHERE id = {job_id}"))
        db.session.commit()
        flash(f'Successfully force-deleted job ID {job_id}!', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Error force-deleting job: {str(e)}', 'danger')
    
    return redirect(url_for('dashboard'))

# Resume management routes
@app.route('/resumes')
@login_required
def resumes():
    """List all resumes"""
    resumes = Resume.query.order_by(Resume.created_at.desc()).all()
    return render_template('resume_list.html', resumes=resumes, title="My Resumes")

@app.route('/resumes/add', methods=['GET', 'POST'])
@login_required
def add_resume():
    """Add a new resume"""
    form = ResumeForm()
    
    if request.method == 'POST':
        # Get form data
        title = request.form.get('title')
        job_title = request.form.get('job_title')
        content = request.form.get('content')
        
        # Validate form fields
        errors = []
        if not title:
            errors.append('Resume Title is required')
        if not job_title:
            errors.append('Target Job Title is required')
        if not content:
            errors.append('Resume Content is required')
            
        if errors:
            for error in errors:
                flash(error, 'danger')
            # Populate form with submitted data
            form.title.data = title
            form.job_title.data = job_title
            form.content.data = content
            return render_template('resume_form.html', form=form, title="Add New Resume")
        
        # Form is valid, create resume
        try:
            resume = Resume(
                title=title,
                job_title=job_title,
                content=content
            )
            db.session.add(resume)
            db.session.commit()
            flash('Resume added successfully!', 'success')
            return redirect(url_for('resumes'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error saving resume: {str(e)}', 'danger')
    
    return render_template('resume_form.html', form=form, title="Add New Resume")

@app.route('/resumes/edit/<int:resume_id>', methods=['GET', 'POST'])
@login_required
def edit_resume(resume_id):
    """Edit an existing resume"""
    resume = Resume.query.get_or_404(resume_id)
    form = ResumeForm(obj=resume)
    
    if request.method == 'POST':
        # Validate form
        if form.validate():
            # Extra validation to prevent empty values
            if not form.title.data or form.title.data.strip() == '':
                flash('Resume title cannot be empty', 'danger')
                return render_template('resume_form.html', form=form, title="Edit Resume")
                
            if not form.job_title.data or form.job_title.data.strip() == '':
                flash('Target job title cannot be empty', 'danger')
                return render_template('resume_form.html', form=form, title="Edit Resume")
                
            resume.title = form.title.data
            resume.job_title = form.job_title.data
            resume.content = form.content.data
            db.session.commit()
            flash('Resume updated successfully!', 'success')
            return redirect(url_for('resumes'))
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    flash(f"Error in {getattr(form, field).label.text}: {error}", 'danger')
    
    return render_template('resume_form.html', form=form, title="Edit Resume")

@app.route('/resumes/view/<int:resume_id>')
@login_required
def view_resume(resume_id):
    """View a single resume"""
    resume = Resume.query.get_or_404(resume_id)
    return render_template('resume_detail.html', resume=resume)

@app.route('/resumes/delete/<int:resume_id>', methods=['POST'])
@login_required
def delete_resume(resume_id):
    """Delete a resume"""
    try:
        resume = Resume.query.get_or_404(resume_id)
        
        # Check if the resume is used by any jobs
        jobs_using_resume = Job.query.filter_by(resume_id=resume_id).count()
        if jobs_using_resume > 0:
            flash(f'Cannot delete this resume as it is used by {jobs_using_resume} job applications. Please update those jobs first.', 'warning')
            return redirect(url_for('resumes'))
        
        # Delete the resume
        db.session.delete(resume)
        db.session.commit()
        flash('Resume deleted successfully!', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Error deleting resume: {str(e)}', 'danger')
    
    return redirect(url_for('resumes'))
