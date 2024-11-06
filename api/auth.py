from flask import Flask, Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import check_password_hash
from .models import User, db

# Create a Blueprint named 'auth' for handling authentication routes
auth = Blueprint('auth', __name__)

# Route for user signup
@auth.route('/signup', methods=['POST'])
def signup():
    """
    Handles user registration.
    - Gets the data (username and password) from the request body.
    - Checks if the user already exists.
    - If not, creates a new user and saves it to the database.
    - Returns a response indicating success or failure.
    """
    try:
        # Get JSON data from the request
        data = request.get_json()
        print("Received data:", data)  # Debug print to check received data
        username = data.get('username')
        password = data.get('password')

        # Check if a user with the given username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'message': 'User already exists'}), 400

        # Create a new user instance and add it to the database
        new_user = User(username=username)
        new_user.set_password(password)  # Set hashed password
        db.session.add(new_user)
        db.session.commit()

        # Return a success message
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        # Handle exceptions and log errors
        print(e)  # Log the error for debugging purposes
        return jsonify({'error': 'Internal Server Error'}), 500

# Route for user login
@auth.route('/login', methods=['POST'])
def login():
    """
    Handles user login.
    - Gets the username and password from the request body.
    - Checks if the user exists and if the password is correct.
    - If the credentials are correct, creates an access token and returns it.
    - Returns an error response if credentials are incorrect.
    """
    # Get JSON data from the request
    data = request.get_json()

    # Find the user with the given username
    user = User.query.filter_by(username=data.get('username')).first()

    # Verify if the user exists and the password is correct
    if user and check_password_hash(user.password_hash, data.get('password')):
        # Create an identity dictionary for the user to include in the access token
        user_identity = {'identity': user.id}
        # Create a JWT access token for the user
        access_token = create_access_token(identity=user_identity)
        # Return the access token
        return jsonify(access_token=access_token), 200

    # Return error if username or password is incorrect
    return jsonify({"msg": "Bad username or password"}), 401
