import os
from werkzeug.security import generate_password_hash
from app import app, db
from models import User

def update_admin_password():
    """Update admin user password."""
    with app.app_context():
        # Find admin user
        admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
        admin = User.query.filter_by(username=admin_username).first()
        
        if admin:
            print(f"Updating password for admin user '{admin_username}'...")
            admin.password_hash = generate_password_hash(os.environ.get('ADMIN_PASSWORD', 'admin1234'))
            db.session.commit()
            print(f"Password for admin user '{admin_username}' updated successfully.")
        else:
            print(f"Admin user '{admin_username}' not found.")

if __name__ == '__main__':
    update_admin_password()