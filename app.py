import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
# create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "inthisone_jobs_secret_key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)  # needed for url_for to generate with https

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///jobs.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# OpenAI configuration
app.config["OPENAI_API_KEY"] = os.environ.get("OPENAI_API_KEY", "")

# initialize the app with the extensions
db.init_app(app)
csrf = CSRFProtect(app)

# Exempt API endpoints from CSRF protection
@app.route('/api/parse-job', methods=['POST'])
def csrf_exempt_api_parse_job():
    pass  # Actual implementation is in routes.py
    
csrf.exempt(csrf_exempt_api_parse_job)

with app.app_context():
    # Import models to ensure they're registered with SQLAlchemy
    import models  # noqa: F401
    db.create_all()

# Import routes after app and db are initialized
import routes  # noqa: E402
