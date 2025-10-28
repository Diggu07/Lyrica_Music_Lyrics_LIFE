from flask import Blueprint, jsonify, request, session
from flask_login import login_user, logout_user, login_required, current_user
from models.user import User
from forms.auth_forms import (
    LoginForm, RegistrationForm, PasswordResetRequestForm, 
    PasswordResetForm, ChangePasswordForm, UpdateProfileForm
)
from datetime import datetime
import secrets
import string

# Creating authentication blueprint
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration route"""
    if current_user.is_authenticated:
        return jsonify({"error": "User already logged in"}), 400
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON data required"}), 400
        
        form = RegistrationForm(data=data)
        
        if form.validate():
            user = User()
            user.username = form.username.data
            user.email = form.email.data
            user.password_hash = User.hash_password(form.password.data)
            user.first_name = form.first_name.data
            user.last_name = form.last_name.data
            user.date_of_birth = form.date_of_birth.data
            user.gender = form.gender.data
            user.created_at = datetime.utcnow()
            
            user.save()
            
            return jsonify({
                "message": "Registration successful! You can now log in.",
                "success": True,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }
            }), 201
        else:
            return jsonify({
                "error": "Validation failed",
                "details": form.errors
            }), 400
            
    except Exception as e:
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login route"""
    if current_user.is_authenticated:
        return jsonify({"error": "User already logged in"}), 400
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON data required"}), 400
        
        form = LoginForm(data=data)
        
        if form.validate():
            user = User.find_by_email(form.email.data)
            if user and user.check_password(form.password.data):
                if not user.is_active:
                    return jsonify({"error": "Account deactivated"}), 403
                
                login_user(user, remember=form.remember_me.data)
                user.update_last_login()
                
                return jsonify({
                    "message": "Login successful",
                    "success": True,
                    "user": user.to_dict()
                }), 200
            else:
                return jsonify({"error": "Invalid email or password"}), 401
        else:
            return jsonify({
                "error": "Validation failed",
                "details": form.errors
            }), 400
            
    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    """User logout route"""
    logout_user()
    return jsonify({"message": "Logout successful"}), 200

@auth_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    """Get user profile"""
    return jsonify({
        "user": current_user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['POST'])
@login_required
def update_profile():
    """Update user profile"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON data required"}), 400
        
        if 'first_name' in data:
            current_user.first_name = data['first_name']
        if 'last_name' in data:
            current_user.last_name = data['last_name']
        if 'username' in data:
            current_user.username = data['username']
        if 'date_of_birth' in data:
            current_user.date_of_birth = data['date_of_birth']
        if 'gender' in data:
            current_user.gender = data['gender']
        
        current_user.save()
        
        return jsonify({
            "message": "Profile updated successfully",
            "user": current_user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Profile update failed: {str(e)}"}), 500

@auth_bp.route('/change_password', methods=['POST'])
@login_required
def change_password():
    """Change password route"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON data required"}), 400
        
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        new_password2 = data.get('new_password2')
        
        if not all([current_password, new_password, new_password2]):
            return jsonify({"error": "All password fields required"}), 400
        
        if new_password != new_password2:
            return jsonify({"error": "New passwords do not match"}), 400
        
        if not current_user.check_password(current_password):
            return jsonify({"error": "Current password is incorrect"}), 400
        
        current_user.password_hash = User.hash_password(new_password)
        current_user.save()
        
        return jsonify({"message": "Password changed successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": f"Password change failed: {str(e)}"}), 500

def generate_reset_token():
    """Generate a secure reset token"""
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))


@auth_bp.errorhandler(401)
def unauthorized(error):
    """Handle unauthorized access"""
    return jsonify({"error": "Authentication required"}), 401

@auth_bp.errorhandler(403)
def forbidden(error):
    """Handle forbidden access"""
    return jsonify({"error": "Access forbidden"}), 403