from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, DateField, TextAreaField, SubmitField, SelectField
from wtforms.validators import DataRequired, Length
from datetime import date

class LoginForm(FlaskForm):
    """Form for user login"""
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class ResumeForm(FlaskForm):
    """Form for adding/editing resumes"""
    title = StringField('Resume Title', validators=[DataRequired(), Length(max=255)], 
                        description="A name to identify this resume (e.g., 'Software Engineer Resume')")
    job_title = StringField('Target Job Title', validators=[DataRequired(), Length(max=255)],
                           description="The job title you're targeting with this resume (e.g., 'Senior Software Engineer')")
    content = TextAreaField('Resume Content', validators=[DataRequired()],
                           description="Your complete resume content including skills, experience, etc.")
    submit = SubmitField('Save Resume')


class JobForm(FlaskForm):
    """Form for adding/editing job applications"""
    title = StringField('Job Title', validators=[DataRequired(), Length(max=255)])
    company = StringField('Company', validators=[DataRequired(), Length(max=255)])
    apply_date = DateField('Application Date', validators=[DataRequired()], default=date.today)
    description = TextAreaField('Job Description', validators=[DataRequired()])
    cover_letter = TextAreaField('Cover Letter')
    pay_range = StringField('Pay Range', validators=[Length(max=100)], 
                           description="Optional salary or pay range information (e.g., '$75,000-$90,000/year')")
    job_url = StringField('Job URL', validators=[Length(max=500)],
                         description="Optional link to the job posting online")
    resume_id = SelectField('Select Resume', coerce=int, validators=[])
    submit = SubmitField('Save Job')

class AIJobForm(FlaskForm):
    """Form for AI-assisted job entry"""
    job_posting = TextAreaField('Paste full job posting here', validators=[DataRequired()])
    resume_id = SelectField('Select Resume for Cover Letter Generation', coerce=int, 
                          description="Selecting a resume will help the AI tailor the cover letter to your skills and experience")
    submit = SubmitField('Add using AI')
