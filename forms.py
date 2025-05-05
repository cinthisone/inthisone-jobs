from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, DateField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Length
from datetime import date

class LoginForm(FlaskForm):
    """Form for user login"""
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class JobForm(FlaskForm):
    """Form for adding/editing job applications"""
    title = StringField('Job Title', validators=[DataRequired(), Length(max=255)])
    company = StringField('Company', validators=[DataRequired(), Length(max=255)])
    apply_date = DateField('Application Date', validators=[DataRequired()], default=date.today)
    description = TextAreaField('Job Description', validators=[DataRequired()])
    cover_letter = TextAreaField('Cover Letter')  # New field for cover letter
    submit = SubmitField('Save Job')

class AIJobForm(FlaskForm):
    """Form for AI-assisted job entry"""
    job_posting = TextAreaField('Paste full job posting here', validators=[DataRequired()])
    submit = SubmitField('Add using AI')
