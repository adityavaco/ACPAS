from . import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class Employee(db.Model):
    __tablename__ = 'employee'

    id_user = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100), nullable=False)
    reporting_manager_id = db.Column(db.Integer, db.ForeignKey('employee.id_user'), default=0)
    last_working_day = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    security_key = db.Column(db.String(200), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)

    is_admin = db.Column(db.Boolean, default=False)
    is_manager = db.Column(db.Boolean, default=False)
    is_hr = db.Column(db.Boolean, default=False)
    is_panel_member = db.Column(db.Boolean, default=False)

    email = db.Column(db.String(100), unique=True, nullable=False)
    employee_id = db.Column(db.String(100), nullable=False)
    client_name = db.Column(db.String(100), nullable=False)

    is_notice_period = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)

    created_on = db.Column(db.DateTime, default=datetime.utcnow)
    updated_on = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Self-referencing relationship for reporting manager
    manager = db.relationship('Employee', remote_side=[id_user])

    # Reverse relationships for candidates
    hr_candidates = db.relationship('Candidate', foreign_keys='Candidate.hr_id', backref='hr', lazy='dynamic')
    manager_candidates = db.relationship('Candidate', foreign_keys='Candidate.manager_id', backref='manager', lazy='dynamic')

    def __repr__(self):
        return f"<Employee {self.full_name} ({self.email})>"

    def set_password(self, raw_password):
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password, raw_password)


class Candidate(db.Model):
    __tablename__ = 'candidate'

    candidate_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    candid = db.Column(db.String(50), unique=True, nullable=False)
    candidate_name = db.Column(db.String(100), nullable=False)

    hr_id = db.Column(db.Integer, db.ForeignKey('employee.id_user'), nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey('employee.id_user'), default=0)

    total_experience = db.Column(db.Float, nullable=False)
    resume_link = db.Column(db.String(255), nullable=False)
    job_id = db.Column(db.String(100), nullable=False)
    job_role = db.Column(db.String(100), nullable=False)
    interview_link = db.Column(db.String(255))

    # L1 Round
    L1_panel = db.Column(db.String(100))
    L1_date = db.Column(db.DateTime, default=datetime.utcnow)
    L1_feedback = db.Column(db.Text)
    L1_status = db.Column(db.String(20))

    # L2 Round
    L2_panel = db.Column(db.String(100))
    L2_date = db.Column(db.Date)
    L2_feedback = db.Column(db.Text)
    L2_status = db.Column(db.String(20))

    # Final Outcome
    final_feedback = db.Column(db.Text)
    final_comments = db.Column(db.Text)

    # Statuses
    candidate_status = db.Column(db.String(50), default='pending')
    offer_letter_status = db.Column(db.Boolean, default=False)
    bgv_status = db.Column(db.Boolean, default=False)
    loi_status = db.Column(db.Boolean, default=False)
    additional_stages = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)

    createdon = db.Column(db.DateTime, default=datetime.utcnow)
    updatedon = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Candidate {self.candidate_name} for {self.job_role}>"
