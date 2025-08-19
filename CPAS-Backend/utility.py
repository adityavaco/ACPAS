# from google.oauth2 import service_account
# from googleapiclient.discovery import build
# import datetime
# import uuid

from flask import jsonify, session, request
import csv , os
from functools import wraps
from models.models import Employee
from google.oauth2 import service_account
from googleapiclient.discovery import build

SERVICE_ACCOUNT_FILE = os.getenv('SERVICE_ACCOUNT_FILE')
SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
SHEET_NAME = os.getenv('SHEET_NAME')





def read_csv_data(file_path):
    data = []
    try:
        with open(file_path, mode='r', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)  # Reads as list of dictionaries
            for row in reader:
                data.append(row)
        return data
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return []
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return []
    

def generic_json_response(success = True, status_code = 200, message ='', data=[], error=[]):
    response_body = {'success':  success, 'status_code' : status_code, 'message' : message, 'data' : data, 'error' : error }
    return jsonify(response_body), status_code

def simple_login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "id_user" not in session:
            return generic_json_response(
                success=False,
                status_code=401,
                message="Unauthorized user"
            )
    return decorated_function



def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "id_user" not in session:
            return generic_json_response(
                success=False,
                status_code=401,
                message="Unauthorized user"
            )
  
        user = Employee.query.get(session["id_user"])
        if not user:
            return generic_json_response(
                success=False,
                status_code=401,
                message="User not found"
            )

        # allow GET for everyone logged in
        if request.method == "GET":
            return f(*args, **kwargs)

        # allow POST only if HR
        if (request.method == "POST" or request.method == "PATCH" or request.method == "DELETE" ) and user.is_hr:
            return f(*args, **kwargs)

        return generic_json_response(
            success=False,
            status_code=403,  # forbidden
            message="Access denied. Only HR can perform this action."
        )

    return decorated_function


def update_sheet_with_row(headers, new_row):
    # Auth setup
    scopes = ['https://www.googleapis.com/auth/spreadsheets']
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=scopes)
    service = build('sheets', 'v4', credentials=credentials)

    # Get existing headers
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=f"{SHEET_NAME}!1:1"
    ).execute()
    existing_values = result.get('values', [])
    current_headers = existing_values[0] if existing_values else []

    # Set headers if missing
    if not current_headers:
        print("Headers missing, setting headers...")
        service.spreadsheets().values().update(
            spreadsheetId=SPREADSHEET_ID,
            range=f"{SHEET_NAME}!1:1",
            valueInputOption='RAW',
            body={'values': [headers]}
        ).execute()
    else:
        print(f"Headers found: {current_headers}")

    # Append the new row
    service.spreadsheets().values().append(
        spreadsheetId=SPREADSHEET_ID,
        range=SHEET_NAME,
        valueInputOption='RAW',
        insertDataOption='INSERT_ROWS',
        body={'values': [new_row]}
    ).execute()

