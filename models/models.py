from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Employee(db.Model):
    __tablename__ = 'employee'

    id_user = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_name = db.Column(db.String, nullable=False)
    reporting_manager_id = db.Column(db.Integer, nullable=False, default=0)
    last_working_day = db.Column(db.DateTime, nullable=True)
    password = db.Column(db.String, nullable=False)
    security_key = db.Column(db.String, nullable=False)
    full_name = db.Column(db.String, nullable=False)
    is_admin = db.Column(db.Integer, nullable=False, default=0)
    is_manager = db.Column(db.Integer, nullable=False, default=0)
    is_hr = db.Column(db.Integer, nullable=False, default=0)
    is_panel_member = db.Column(db.Integer, nullable=False, default=0)
    email = db.Column(db.String, nullable=False, unique=True)
    employee_id = db.Column(db.String, nullable=False, unique = True)
    client_name = db.Column(db.String, nullable=False)
    is_notice_period = db.Column(db.Integer, nullable=False, default=0)
    is_active = db.Column(db.Integer, nullable=False, default=1)
    created_on = db.Column(db.DateTime, default=datetime.utcnow)
    updated_on = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships (optional, but useful)
    managed_candidates = db.relationship('Candidate', foreign_keys='Candidate.manager_id', backref='manager', lazy=True)
    hr_candidates = db.relationship('Candidate', foreign_keys='Candidate.hr_id', backref='hr', lazy=True)



class Candidate(db.Model):
    __tablename__ = 'candidates'

    candidate_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    candidate_name = db.Column(db.String, nullable=False)
    hr_id = db.Column(db.Integer, db.ForeignKey('employee.id_user'))
    total_experience = db.Column(db.Float)
    resume_link = db.Column(db.String)
    job_id = db.Column(db.String, nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey('employee.id_user'))
    interview_date = db.Column(db.DateTime)
    job_role = db.Column(db.String)
    interview_link = db.Column(db.String)
    L1_panel = db.Column(db.String)
    L1_date = db.Column(db.Date)
    L1_feedback = db.Column(db.String)
    L1_status = db.Column(db.String)
    L2_panel = db.Column(db.String)
    L2_date = db.Column(db.Date)
    L2_feedback = db.Column(db.String)
    L2_status = db.Column(db.String)
    final_feedback = db.Column(db.String)
    final_comments = db.Column(db.String)
    candidate_status = db.Column(db.String, default='pending')
    offer_letter_status = db.Column(db.Integer, default=0)
    bgv_status = db.Column(db.Integer, default=0)
    loi_status = db.Column(db.Integer, default=0)
    additional_stages = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Integer, default=1)
    created_on = db.Column(db.DateTime, default=datetime.utcnow)
    updated_on = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)



