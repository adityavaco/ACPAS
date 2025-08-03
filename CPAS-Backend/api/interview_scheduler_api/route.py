from flask import Blueprint, request
from utility import read_csv_data, generic_json_response
from models.models import Employee, Candidate, db
from datetime import datetime
import secrets
import string
from flask import jsonify

interview_bp = Blueprint('api', __name__, url_prefix="/interviews")



@interview_bp.route('/fetch-data-from-sheet',methods=['POST'])
def fetch_data_from_sheet():
    try:
        candidate_data = read_csv_data("files/data.csv")
        new_candidates = []
        for data in candidate_data:
            # Check for existing candidate by job_id and candidate_name
            exists = Candidate.query.filter_by(job_id=data.get("job_id"), candidate_name=data.get("candidate_name")).first()
            if not exists:
                new_candidates.append(Candidate(**data))
        if new_candidates:
            db.session.add_all(new_candidates)
            db.session.commit()
            msg = f"Inserted {len(new_candidates)} new candidates."
        else:
            msg = "No new candidates to insert."
        return generic_json_response(success=True, 
                                 status_code=200,
                                 message = msg)
    
    except Exception as err:
        return generic_json_response(
                                     success=False,
                                     status_code = 500,
                                     message="Internal server error",
                                     error= str(err) 
                                     )



@interview_bp.route('/get-candidates', methods = ['GET'])
def get_candidates():
    try:
        candidates = Candidate.query.order_by(Candidate.updated_on.desc()).all()
        result = []

        
        for candidate in candidates:
            result.append({
            "job_id" : candidate.job_id,
            "candidate_id": candidate.candidate_id,
            "candidate_name": candidate.candidate_name,
            "l1_interview_date": candidate.L1_date,
            "l2_interview_date": candidate.L2_date,
            "hr_interview_date": candidate.hr_date,
            "manager_assigned": candidate.manager.full_name if candidate.manager else None
                 })
            
        return generic_json_response(
            success = True,
            status_code = 200,
            message="Candidate data fetched successfully.",
            data = result
        )


    except Exception as err:
        return generic_json_response(
                                     success=False,
                                     status_code = 500,
                                     message="Internal server error",
                                     error= str(err) 
                                     )



@interview_bp.route('/interview-schedule', methods = ['PATCH'])
def interview_schedule():
    try:
        candidate_id = request.args.get('candidate_id')
        interview_datetime_str = request.args.get('interview_datetime')
        round_type = request.args.get('round_type', None)

        # Check required parameters
        if not all([candidate_id, interview_datetime_str]):
            return generic_json_response(
            success = False,
            status_code = 400,
            message="Missing required parameters."
                                         )
        try:
        # Parse combined datetime string
            interview_datetime = datetime.strptime(interview_datetime_str, "%Y-%m-%d %H:%M")

     
        except ValueError:
            return generic_json_response(
            success = False,
            status_code = 400,
            message="Invalid datetime format. Use YYYY-MM-DD HH:MM")
        
         # Look up candidate
        candidate = Candidate.query.get(candidate_id)
        
        if not candidate:
            return generic_json_response(
                    success = False,
                    status_code = 404,
                    message="Candidate not found")
        
        # Update and commit
        if round_type.upper() == "L1":
            candidate.L1_date = interview_datetime


        elif round_type.upper() == "L2":
            candidate.L2_date = interview_datetime

        elif round_type.upper() == "HR":
            candidate.hr_date = interview_datetime

        else:
            return generic_json_response(
                success = False,
                status_code = 400,
                message = "All interviews already scheduled."
            )
        
        db.session.commit()
        return generic_json_response(
                    success = True,
                    status_code = 200,
                    message= "Interview date updated successfully.")

    

    except Exception as err:
        return generic_json_response(
                                     success=False,
                                     status_code = 500,
                                     message="Internal server error",
                                     error= str(err) 
                                     )
    

@interview_bp.route("/managers", methods=["GET", "POST"])
def managers_config():
    '''
        API collection to get manager list and assign manager to candidate
    '''    
    try:
        if request.method == "GET":
            # Get all employees with role 'manager'
            try:
                managers = Employee.query.filter_by(is_manager=True).all()
                response_body = [
                    {"id": manager.id_user, "name": manager.full_name}
                    for manager in managers
                ]

                return generic_json_response(
                    success=True,
                    status_code = 200,
                    message = "Manager list fetched successfully.",
                    data = response_body
                )

            except Exception as err:
                return generic_json_response(
                                             success=False,
                                             status_code = 500,
                                             message="Internal server error",
                                             error= str(err) 
                                             )
            
        if request.method == "POST":
            try:
                data = request.get_json()
                candidate_id = data.get("candidate_id", None)
                manager_id = data.get("manager_id", None)
                
                # Validate inputs
                if not candidate_id or not manager_id:
                    return generic_json_response(success = False,
                                                 status_code = 400,
                                                 message = "Required parameters not provided.",
                                                 )
                
                candidate = Candidate.query.get(candidate_id)
                manager = Employee.query.get(manager_id)

                if not candidate:
                    return generic_json_response(
                        success = False,
                        status_code = 404,
                        message = "Candidate not found."
                    )
                
                if not manager:
                    return generic_json_response(
                        success = False,
                        status_code = 404,
                        message = "Manager not found."
                    )
                
                # assign manager
                candidate.manager_id = manager_id
                db.session.commit()

                return generic_json_response(
                    success = True,
                    status_code = 200,
                     message = "Manager assigned successfully."
                )

            except Exception as err:
                return generic_json_response(
                                             success=False,
                                             status_code = 500,
                                             message="Internal server error",
                                             error= str(err) 
                                             )
    except Exception as err:
        return generic_json_response(
                                     success=False,
                                     status_code = 500,
                                     message="Internal server error",
                                     error= str(err) 
                                     )



@interview_bp.route("/candidate-reject" , methods = ["DELETE"] )
def candidate_reject():
    try:
        candidate_id = request.args.get('candidate_id', None)
        if not candidate_id:
            return generic_json_response(
                                     success=False,
                                     status_code = 400,
                                     message="Required parameters not provided.")

        candidate = Candidate.query.get(candidate_id)
        if not candidate:
            return generic_json_response(
                                     success=False,
                                     status_code = 404,
                                     message="Candidate not found.")
        
        # Deleting user after rejection
        db.session.delete(candidate)
        db.session.commit()
        return generic_json_response(
                                     success=True,
                                     status_code = 200,
                                     message="Candidate deleted successfully.")

    except Exception as err:
            return generic_json_response(
                                     success=False,
                                     status_code = 500,
                                     message="Internal server error",
                                     error= str(err) 
                                     )
    
    
JITSI_DOMAIN = "meet.jit.si"

def generate_unique_room_name(length=16):
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))

@interview_bp.route('/generate-meeting-link', methods=['POST'])
def generate_meeting_link():
    data = request.get_json()
    candidate_id = data.get("candidate_id")
    if not candidate_id:
        return jsonify({"success": False, "message": "candidate_id required"}), 400

    room_name = generate_unique_room_name()
    jitsi_url = f"https://{JITSI_DOMAIN}/{room_name}"

    candidate = Candidate.query.get(candidate_id)
    if not candidate:
        return jsonify({"success": False, "message": "Candidate not found"}), 404

    candidate.interview_link = jitsi_url
    db.session.commit()

    return jsonify({
        "success": True,
        "meeting_url": jitsi_url,
        "candidate_name": candidate.candidate_name
    })



