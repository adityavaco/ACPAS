from flask import jsonify
import csv


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
