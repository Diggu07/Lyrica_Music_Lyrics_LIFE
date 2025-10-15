# Lyrica - Music Streaming Platform

A modern, scalable music streaming platform built with Flask, MongoDB, and server-side rendering. Inspired by Spotify, Lyrica provides a comprehensive music streaming experience with user authentication, playlist management, and dynamic content integration.

## Features

->User Authentication
- Secure user registration and login
- Password hashing with bcrypt
- Password reset functionality
- User profile management
- Session management with Flask-Login

->Music Management
- User playlists creation and management
- Liked songs tracking
- Listening history
- User preferences and settings

->Modern UI/UX
- Responsive Bootstrap 5 design
- Dark theme optimized for music streaming
- Interactive forms with validation
- Flash messages for user feedback
- Mobile-friendly interface

### 🏗️ Architecture
- Modular Flask application structure
- MongoDB for flexible data storage
- Server-side rendering with Jinja2 templates
- Blueprint-based route organization
- Environment-based configuration

## Installation

### Prerequisites
- Python 3.8+
- MongoDB (local or cloud instance)
- Virtual environment (recommended)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Lyrica_Music_Lyrics_LIFE
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   - Set a secure `SECRET_KEY`
   - Configure `MONGO_URI` and `DB_NAME`
   - Add email settings for password reset (optional)

5. **Start MongoDB**
   Make sure MongoDB is running on your system or update the `MONGO_URI` in `.env` to point to your MongoDB instance.

6. **Run the application**
   ```bash
   python app.py
   ```

7. **Access the application**
   Open your browser and go to `http://localhost:5000`

## Project Structure

```
Lyrica_Music_Lyrics_LIFE/
├── app.py                 # Main application file
├── auth.py                # Authentication blueprint
├── models/                # Data models
│   ├── __init__.py
│   └── user.py           # User model with MongoDB integration
├── forms/                 # WTForms
│   ├── __init__.py
│   └── auth_forms.py     # Authentication forms
├── templates/             # Jinja2 templates
│   ├── base.html         # Base template
│   ├── index.html        # Home page
│   ├── dashboard.html    # User dashboard
│   ├── playlists.html    # Playlists page
│   ├── auth/             # Authentication templates
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── profile.html
│   │   ├── change_password.html
│   │   ├── reset_password_request.html
│   │   └── reset_password.html
│   └── errors/           # Error pages
│       ├── 404.html
│       └── 500.html
├── static/               # Static files
│   ├── css/
│   │   └── style.css    # Custom styles
│   └── js/
│       └── main.js      # JavaScript functionality
├── venv/                # Virtual environment
├── .env.example         # Environment variables template
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Key Components

### User Model (`models/user.py`)
- MongoDB integration with PyMongo
- Password hashing and verification
- User profile management
- Playlist and listening history tracking
- Preferences management

### Authentication System (`auth.py`)
- Login and registration routes
- Password reset functionality
- Profile management
- Session handling
- Security features

### Forms (`forms/auth_forms.py`)
- WTForms integration
- Form validation
- Password strength checking
- User-friendly error messages

### Templates
- Responsive Bootstrap 5 design
- Dark theme optimized for music streaming
- Consistent navigation and layout
- Flash message integration

## Configuration

### Environment Variables
- `SECRET_KEY`: Flask secret key for session security
- `MONGO_URI`: MongoDB connection string
- `DB_NAME`: Database name
- `MAIL_*`: Email configuration for password reset

### MongoDB Collections
- `users`: User accounts and profiles
- `playlists`: User playlists (future implementation)
- `songs`: Music library (future implementation)

## Security Features

- Password hashing with bcrypt
- CSRF protection with Flask-WTF
- Session management with Flask-Login
- Input validation and sanitization
- Secure password requirements
- Account deactivation instead of deletion

## Future Enhancements

- Music file upload and streaming
- Advanced playlist features
- Social features (sharing, following)
- Music recommendations
- Podcast and audiobook support
- Mobile app development
- Payment integration for premium features
- Advanced search and filtering
- Music discovery algorithms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue on the GitHub repository.

---

**Note**: This is a development version. For production deployment, ensure proper security measures, environment configuration, and database setup.