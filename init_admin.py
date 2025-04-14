import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash
from app import app, db
from models import User

load_dotenv()

def create_admin_user():
    """Create admin user if it doesn't exist."""
    with app.app_context():
        # Check if admin exists
        admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
        admin = User.query.filter_by(username=admin_username).first()
        
        if not admin:
            print("Creating admin user...")
            admin = User(
                name="Administrador",
                username=admin_username,
                email=os.environ.get('ADMIN_EMAIL', 'admin@confessiones.com'),
                password_hash=generate_password_hash(os.environ.get('ADMIN_PASSWORD', 'admin1234')),
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()
            print(f"Admin user '{admin_username}' created successfully.")
        else:
            print(f"Admin user '{admin_username}' already exists.")

if __name__ == '__main__':
    create_admin_user()
