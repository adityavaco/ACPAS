from flask import Blueprint, request
from utility import read_csv_data, generic_json_response
from models.models import Employee, Candidate,db
from datetime import datetime

interview_bp = Blueprint('api', __name__, url_prefix="/interviews")



@interview_bp.route('/fetch-data-from-sheet',methods=['POST'])
def fetch_data_from_sheet():
    try:
        candidate_data = read_csv_data("files/data.csv")
        candidate_instance = [Candidate(**data) for data in candidate_data]
        db.session.add_all(candidate_instance)
        db.session.commit()    
        return generic_json_response(success=True, 
                                 status_code=200,
                                 message = "Data inserted successfully!")
    
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
            "interview_date": candidate.interview_date,
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
        candidate.interview_date = interview_datetime
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



    




