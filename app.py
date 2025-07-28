import os
from flask import Flask, render_template, request, redirect, url_for, session, flash
# from cuid2 import cuid2 as cuid2
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__) # Change this to a strong, random key
app.secret_key = os.getenv('SECRET_KEY')
# print("SECRET_KEY:", app.secret_key)  # Debugging line to check if the secret key is loaded correctly

@app.route('/')
def index():
    """Renders the login page."""
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    """Handles login form submission."""
    print(dict(request.form))  # Debugging line to check form data
    username = request.form['username']
    password = request.form['password']
    print("Login attempt with username:", username)

    # Simple hardcoded credentials for demonstration
    if username == 'cpas' and password == 'vacobinary':
        session['logged_in'] = True
        print("Session after login:", dict(session))  # Debugging line to check login status
        flash('Login successful!', 'success')
        return redirect(url_for('dashboard'))
    else:
        flash('Invalid username or password. Please try again.', 'danger')
        return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    """Renders the dashboard page if the user is logged in."""
    if 'logged_in' in session and session['logged_in']:
        return render_template('dashboard.html') # Note: your file is named dashboard.html
    else:
        flash('Please log in to access the dashboard.', 'warning')
        return redirect(url_for('index'))

@app.route('/logout')
def logout():
    """Logs out the user."""
    session.pop('logged_in', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True) # debug=True for development, set to False in production