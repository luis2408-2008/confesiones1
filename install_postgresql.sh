#!/bin/bash

# Update package lists
apt-get update

# Install PostgreSQL client
apt-get install -y postgresql-client

# Create database tables
python3 -c "from app import app, db; from models import *; app.app_context().push(); db.create_all()"

# Create admin user
python3 init_admin.py

echo "PostgreSQL client installed and database initialized."
