from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from models.user import User
import bcrypt

auth_bp = Blueprint('auth', __name__)

# ------------------------- REGISTER -------------------------
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    if not username or not email or not password:
        return jsonify({"error": "All required fields must be filled"}), 400

    if User.find_by_email(email):
        return jsonify({"error": "Email already exists"}), 409

    # ✅ Create new user and hash password
    user = User()
    user.username = username
    user.email = email
    user.first_name = first_name
    user.last_name = last_name

    # Use the static method defined in your model
    user.password_hash = User.hash_password(password).decode('utf-8')
    user.save()

    return jsonify({"success": True, "message": "Registration successful"}), 201


# ------------------------- LOGIN -------------------------
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.find_by_email(email)
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    login_user(user)
    user.update_last_login()
    return jsonify({"success": True, "message": "Login successful"}), 200


# ------------------------- LOGOUT -------------------------
@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"success": True, "message": "Logged out"}), 200


# ------------------------- PROFILE (GET/UPDATE) -------------------------
@auth_bp.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == 'GET':
        return jsonify({"success": True, "user": current_user.to_dict()}), 200

    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    for field in ['username', 'first_name', 'last_name']:
        if field in data:
            setattr(current_user, field, data[field])
    current_user.save()

    return jsonify({"success": True, "message": "Profile updated"}), 200


# ------------------------- CHANGE PASSWORD -------------------------
@auth_bp.route('/change_password', methods=['POST'])
@login_required
def change_password():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not old_password or not new_password:
        return jsonify({"error": "Both old and new passwords are required"}), 400

    if not current_user.check_password(old_password):
        return jsonify({"error": "Old password is incorrect"}), 401

    # ✅ Re-hash and update password
    current_user.password_hash = User.hash_password(new_password).decode('utf-8')
    current_user.save()

    return jsonify({"success": True, "message": "Password changed successfully"}), 200
