from flask import Blueprint, render_template, redirect, url_for, flash, request, session
from flask_login import login_user, logout_user, login_required, current_user
from models.user import User
from forms.auth_forms import (
    LoginForm, RegistrationForm, PasswordResetRequestForm, 
    PasswordResetForm, ChangePasswordForm, UpdateProfileForm
)
from datetime import datetime
import secrets
import string

# Create authentication blueprint:

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """User login route"""
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.find_by_email(form.email.data)
        if user and user.check_password(form.password.data):
            if not user.is_active:
                flash('Your account has been deactivated. Please contact support.', 'error')
                return render_template('auth/login.html', form=form)
            
            login_user(user, remember=form.remember_me.data)
            user.update_last_login()
            
            # Redirect to next page or dashboard:
            next_page = request.args.get('next')
            if next_page:
                return redirect(next_page)
            return redirect(url_for('main.dashboard'))
        else:
            flash('Invalid email or password.', 'error')
    
    return render_template('auth/login.html', form=form)

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    """User registration route"""
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User()     #Create new user
        user.username = form.username.data
        user.email = form.email.data
        user.password_hash = User.hash_password(form.password.data)
        user.first_name = form.first_name.data
        user.last_name = form.last_name.data
        user.date_of_birth = form.date_of_birth.data
        user.gender = form.gender.data
        user.created_at = datetime.utcnow()
        
        user.save()     # Save user to database
        
        flash('Registration successful! You can now log in.', 'success')
        return redirect(url_for('auth.login'))
    
    return render_template('auth/register.html', form=form)

@auth_bp.route('/logout')
@login_required
def logout():
    """User logout route"""
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('main.index'))

@auth_bp.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    """User profile page"""
    form = UpdateProfileForm(original_username=current_user.username)
    
    if form.validate_on_submit():
        current_user.username = form.username.data
        current_user.first_name = form.first_name.data
        current_user.last_name = form.last_name.data
        current_user.date_of_birth = form.date_of_birth.data
        current_user.gender = form.gender.data
        
        current_user.save()
        flash('Your profile has been updated.', 'success')
        return redirect(url_for('auth.profile'))
    
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.first_name.data = current_user.first_name
        form.last_name.data = current_user.last_name
        form.date_of_birth.data = current_user.date_of_birth
        form.gender.data = current_user.gender
    
    return render_template('auth/profile.html', form=form)

@auth_bp.route('/change_password', methods=['GET', 'POST'])
@login_required
def change_password():
    """Change password route"""
    form = ChangePasswordForm()
    
    if form.validate_on_submit():
        if current_user.check_password(form.current_password.data):
            current_user.password_hash = User.hash_password(form.new_password.data)
            current_user.save()
            flash('Your password has been changed.', 'success')
            return redirect(url_for('auth.profile'))
        else:
            flash('Current password is incorrect.', 'error')
    
    return render_template('auth/change_password.html', form=form)

@auth_bp.route('/reset_password_request', methods=['GET', 'POST'])
def reset_password_request():
    """Request password reset route"""
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    
    form = PasswordResetRequestForm()
    if form.validate_on_submit():
        user = User.find_by_email(form.email.data)
        if user:
            reset_token = generate_reset_token()
            session['reset_token'] = reset_token
            session['reset_email'] = user.email
            session['reset_expires'] = datetime.utcnow().timestamp() + 3600  # 1 hour
            
            flash(f'Password reset token: {reset_token} (In production, this would be sent via email)', 'info')
            return redirect(url_for('auth.reset_password'))
        else:
            flash('If an account with that email exists, a password reset link has been sent.', 'info')
    
    return render_template('auth/reset_password_request.html', form=form)

@auth_bp.route('/reset_password', methods=['GET', 'POST'])
def reset_password():
    """Reset password route"""
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    
    reset_token = session.get('reset_token')
    reset_email = session.get('reset_email')
    reset_expires = session.get('reset_expires')
    
    if not reset_token or not reset_email or not reset_expires:
        flash('Invalid or expired reset token.', 'error')
        return redirect(url_for('auth.reset_password_request'))
    
    if datetime.utcnow().timestamp() > reset_expires:
        flash('Reset token has expired.', 'error')
        session.pop('reset_token', None)
        session.pop('reset_email', None)
        session.pop('reset_expires', None)
        return redirect(url_for('auth.reset_password_request'))
    
    form = PasswordResetForm()
    if form.validate_on_submit():
        user = User.find_by_email(reset_email)
        if user:
            user.password_hash = User.hash_password(form.password.data)
            user.save()
            
            session.pop('reset_token', None)
            session.pop('reset_email', None)
            session.pop('reset_expires', None)
            
            flash('Your password has been reset. You can now log in.', 'success')
            return redirect(url_for('auth.login'))
    
    return render_template('auth/reset_password.html', form=form)

@auth_bp.route('/delete_account', methods=['POST'])
@login_required
def delete_account():
    """Delete user account route"""
    current_user.is_active = False
    current_user.save()
    
    logout_user()
    flash('Your account has been deactivated.', 'info')
    return redirect(url_for('main.index'))

def generate_reset_token():
    """Generate a secure reset token"""
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))

@auth_bp.errorhandler(401)
def unauthorized(error):
    """Handle unauthorized access"""
    flash('Please log in to access this page.', 'warning')
    return redirect(url_for('auth.login'))

@auth_bp.errorhandler(403)
def forbidden(error):
    """Handle forbidden access"""
    flash('You do not have permission to access this page.', 'error')
    return redirect(url_for('main.index'))
