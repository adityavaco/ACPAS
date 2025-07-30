from flask import Flask
from api.interview_scheduler_api.route import interview_bp
from models.models import db,Employee, Candidate

app = Flask(__name__)
app.register_blueprint(interview_bp)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cpas_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db.init_app(app)

# Create tables if they don't exist
with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(debug = True)