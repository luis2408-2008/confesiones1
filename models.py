from datetime import datetime
from app import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import random

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    registered_on = db.Column(db.DateTime, default=datetime.utcnow)
    last_active = db.Column(db.DateTime, default=datetime.utcnow)
    is_admin = db.Column(db.Boolean, default=False)
    
    # Relationships
    confessions = db.relationship('Confession', backref='author', lazy='dynamic')
    comments = db.relationship('Comment', backref='author', lazy='dynamic')
    favorites = db.relationship('Favorite', backref='user', lazy='dynamic')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def update_activity(self):
        self.last_active = datetime.utcnow()
        db.session.commit()
    
    def get_confession_count(self):
        return self.confessions.count()
    
    def get_comment_count(self):
        return self.comments.count()
    
    def get_favorites_count(self):
        return self.favorites.count()

class Confession(db.Model):
    __tablename__ = 'confessions'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    avatar_id = db.Column(db.Integer, default=lambda: random.randint(1, 8))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationships
    comments = db.relationship('Comment', backref='confession', lazy='dynamic', cascade='all, delete-orphan')
    favorites = db.relationship('Favorite', backref='confession', lazy='dynamic', cascade='all, delete-orphan')
    
    def get_comment_count(self):
        return self.comments.count()
    
    def get_favorite_count(self):
        return self.favorites.count()
    
    def is_favorited_by(self, user):
        return Favorite.query.filter_by(confession_id=self.id, user_id=user.id).first() is not None

class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    avatar_id = db.Column(db.Integer, default=lambda: random.randint(1, 8))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    confession_id = db.Column(db.Integer, db.ForeignKey('confessions.id'), nullable=False)
    approved = db.Column(db.Boolean, default=True)  # For moderation

class Favorite(db.Model):
    __tablename__ = 'favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    confession_id = db.Column(db.Integer, db.ForeignKey('confessions.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Composite unique constraint
    __table_args__ = (db.UniqueConstraint('user_id', 'confession_id', name='unique_user_confession'),)
