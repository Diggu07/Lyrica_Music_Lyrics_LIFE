#!/usr/bin/env python3
"""
Simple test script to verify the authentication system works correctly.
Run this after setting up the environment and installing dependencies.
"""

import sys
import os
from datetime import datetime

# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_user_model():
    """Test the User model functionality"""
    print("Testing User Model...")
    
    try:
        from models.user import User
        
        # Test password hashing
        password = "TestPassword123!"
        hashed = User.hash_password(password)
        print(f"✓ Password hashing works")
        
        # Test password verification
        user = User()
        user.password_hash = hashed
        assert user.check_password(password), "Password verification failed"
        print(f"✓ Password verification works")
        
        # Test user creation
        user.username = "testuser"
        user.email = "test@example.com"
        user.first_name = "Test"
        user.last_name = "User"
        user.created_at = datetime.utcnow()
        
        print(f"✓ User object creation works")
        print(f"  - Username: {user.username}")
        print(f"  - Email: {user.email}")
        print(f"  - Full Name: {user.first_name} {user.last_name}")
        
        return True
        
    except Exception as e:
        print(f"✗ User model test failed: {e}")
        return False

def test_forms():
    """Test the authentication forms"""
    print("\nTesting Authentication Forms...")
    
    try:
        from forms.auth_forms import LoginForm, RegistrationForm
        
        # Test login form
        login_form = LoginForm()
        print(f"✓ LoginForm creation works")
        
        # Test registration form
        reg_form = RegistrationForm()
        print(f"✓ RegistrationForm creation works")
        
        return True
        
    except Exception as e:
        print(f"✗ Forms test failed: {e}")
        return False

def test_flask_app():
    """Test Flask app creation"""
    print("\nTesting Flask App...")
    
    try:
        from app import create_app
        
        app = create_app()
        print(f"✓ Flask app creation works")
        
        # Test app configuration
        assert app.config['SECRET_KEY'] is not None, "Secret key not set"
        print(f"✓ App configuration works")
        
        return True
        
    except Exception as e:
        print(f"✗ Flask app test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 50)
    print("Lyrica Authentication System Test")
    print("=" * 50)
    
    tests = [
        test_user_model,
        test_forms,
        test_flask_app
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Authentication system is ready.")
        print("\nNext steps:")
        print("1. Set up MongoDB connection")
        print("2. Configure environment variables in .env")
        print("3. Run: python app.py")
        print("4. Visit: http://localhost:5000")
    else:
        print("❌ Some tests failed. Please check the errors above.")
    
    print("=" * 50)

if __name__ == "__main__":
    main()
