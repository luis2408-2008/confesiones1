import random
from datetime import datetime
from flask import flash
from flask_login import current_user
from models import User
from app import db

def get_random_avatar_id():
    """Generate a random avatar ID between 1 and 8."""
    return random.randint(1, 8)

def format_date(date):
    """Format a datetime object into a Spanish date string."""
    months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]
    
    day = date.day
    month = months[date.month - 1]
    year = date.year
    
    return f"{day} de {month} de {year}"

def update_user_activity():
    """Update the last_active field for the current user."""
    if current_user.is_authenticated:
        current_user.last_active = datetime.utcnow()
        db.session.commit()

def get_user_stats(user_id):
    """Get statistics for a specific user."""
    user = User.query.get(user_id)
    if not user:
        return None
    
    return {
        'confession_count': user.get_confession_count(),
        'comment_count': user.get_comment_count(),
        'favorites_count': user.get_favorites_count(),
        'days_registered': (datetime.utcnow() - user.registered_on).days
    }

def flash_errors(form):
    """Flash all errors from a form."""
    for field, errors in form.errors.items():
        for error in errors:
            flash(f"{getattr(form, field).label.text}: {error}", "danger")
