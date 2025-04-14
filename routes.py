from flask import render_template, flash, redirect, url_for, request, abort, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from urllib.parse import urlparse
from datetime import datetime

from app import app, db
from models import User, Confession, Comment, Favorite
from forms import LoginForm, RegistrationForm, ConfessionForm, CommentForm, AdminUserEditForm
from utils import update_user_activity, get_user_stats, flash_errors

@app.before_request
def before_request():
    """Update user's last activity time before each request."""
    update_user_activity()

@app.route('/')
def index():
    """Home page route."""
    return render_template('index.html', title='Confesiones Anónimas')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login route."""
    if current_user.is_authenticated:
        return redirect(url_for('confessions'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Nombre de usuario o contraseña incorrectos', 'danger')
            return redirect(url_for('login'))
        
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or urlparse(next_page).netloc != '':
            next_page = url_for('confessions')
        
        flash('¡Has iniciado sesión correctamente!', 'success')
        return redirect(next_page)
    
    return render_template('login.html', title='Iniciar Sesión', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    """User registration route."""
    if current_user.is_authenticated:
        return redirect(url_for('confessions'))
    
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(
            name=form.name.data,
            username=form.username.data,
            email=form.email.data
        )
        user.set_password(form.password.data)
        
        db.session.add(user)
        db.session.commit()
        
        flash('¡Te has registrado correctamente! Ahora puedes iniciar sesión.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html', title='Registro', form=form)

@app.route('/logout')
def logout():
    """User logout route."""
    logout_user()
    flash('Has cerrado sesión correctamente.', 'info')
    return redirect(url_for('index'))

@app.route('/confessions')
@login_required
def confessions():
    """List all confessions."""
    page = request.args.get('page', 1, type=int)
    per_page = 10
    confessions = Confession.query.order_by(Confession.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    
    # Get user's favorites
    user_favorites = []
    if current_user.is_authenticated:
        user_favorites = [fav.confession_id for fav in current_user.favorites]
    
    return render_template('confessions.html', title='Confesiones', confessions=confessions, 
                          user_favorites=user_favorites, form=ConfessionForm())

@app.route('/confessions/new', methods=['POST'])
@login_required
def new_confession():
    """Create a new confession."""
    form = ConfessionForm()
    if form.validate_on_submit():
        confession = Confession(
            content=form.content.data,
            user_id=current_user.id
        )
        db.session.add(confession)
        db.session.commit()
        
        flash('¡Tu confesión ha sido publicada!', 'success')
        return redirect(url_for('confessions'))
    
    flash_errors(form)
    return redirect(url_for('confessions'))

@app.route('/confessions/<int:id>')
@login_required
def confession_detail(id):
    """Show a specific confession with its comments."""
    confession = Confession.query.get_or_404(id)
    comments = Comment.query.filter_by(confession_id=id, approved=True).order_by(Comment.created_at.asc()).all()
    
    # Check if user has favorited this confession
    is_favorite = False
    if current_user.is_authenticated:
        is_favorite = Favorite.query.filter_by(user_id=current_user.id, confession_id=id).first() is not None
    
    return render_template('confession_detail.html', title='Detalle de Confesión',
                          confession=confession, comments=comments, 
                          form=CommentForm(), is_favorite=is_favorite)

@app.route('/confessions/<int:id>/comment', methods=['POST'])
@login_required
def add_comment(id):
    """Add a comment to a confession."""
    confession = Confession.query.get_or_404(id)
    form = CommentForm()
    
    if form.validate_on_submit():
        comment = Comment(
            content=form.content.data,
            user_id=current_user.id,
            confession_id=id
        )
        db.session.add(comment)
        db.session.commit()
        
        flash('¡Tu comentario ha sido publicado!', 'success')
    else:
        flash_errors(form)
        
    return redirect(url_for('confession_detail', id=id))

@app.route('/confessions/<int:id>/edit', methods=['GET', 'POST'])
@login_required
def edit_confession(id):
    """Edit a confession."""
    confession = Confession.query.get_or_404(id)
    
    # Check ownership
    if confession.user_id != current_user.id and not current_user.is_admin:
        abort(403)
    
    form = ConfessionForm()
    
    if request.method == 'GET':
        form.content.data = confession.content
        return render_template('confession_detail.html', title='Editar Confesión',
                              confession=confession, form=form, editing=True)
    
    if form.validate_on_submit():
        confession.content = form.content.data
        confession.updated_at = datetime.utcnow()
        db.session.commit()
        
        flash('Confesión actualizada correctamente', 'success')
        return redirect(url_for('confession_detail', id=id))
    
    flash_errors(form)
    return redirect(url_for('confession_detail', id=id))

@app.route('/confessions/<int:id>/delete', methods=['POST'])
@login_required
def delete_confession(id):
    """Delete a confession."""
    confession = Confession.query.get_or_404(id)
    
    # Check ownership
    if confession.user_id != current_user.id and not current_user.is_admin:
        abort(403)
    
    db.session.delete(confession)
    db.session.commit()
    
    flash('Confesión eliminada correctamente', 'success')
    return redirect(url_for('confessions'))

@app.route('/comments/<int:id>/edit', methods=['GET', 'POST'])
@login_required
def edit_comment(id):
    """Edit a comment."""
    comment = Comment.query.get_or_404(id)
    
    # Check ownership
    if comment.user_id != current_user.id and not current_user.is_admin:
        abort(403)
    
    form = CommentForm()
    
    if request.method == 'GET':
        form.content.data = comment.content
        return render_template('confession_detail.html', title='Editar Comentario',
                              confession=comment.confession, editing_comment=comment, form=form)
    
    if form.validate_on_submit():
        comment.content = form.content.data
        comment.updated_at = datetime.utcnow()
        db.session.commit()
        
        flash('Comentario actualizado correctamente', 'success')
        return redirect(url_for('confession_detail', id=comment.confession_id))
    
    flash_errors(form)
    return redirect(url_for('confession_detail', id=comment.confession_id))

@app.route('/comments/<int:id>/delete', methods=['POST'])
@login_required
def delete_comment(id):
    """Delete a comment."""
    comment = Comment.query.get_or_404(id)
    
    # Check ownership
    if comment.user_id != current_user.id and not current_user.is_admin:
        abort(403)
    
    confession_id = comment.confession_id
    db.session.delete(comment)
    db.session.commit()
    
    flash('Comentario eliminado correctamente', 'success')
    return redirect(url_for('confession_detail', id=confession_id))

@app.route('/confessions/<int:id>/favorite', methods=['POST'])
@login_required
def toggle_favorite(id):
    """Toggle favorite status for a confession."""
    confession = Confession.query.get_or_404(id)
    
    favorite = Favorite.query.filter_by(user_id=current_user.id, confession_id=id).first()
    
    if favorite:
        # Remove favorite
        db.session.delete(favorite)
        db.session.commit()
        message = 'Eliminado de favoritos'
        status = False
    else:
        # Add favorite
        favorite = Favorite(user_id=current_user.id, confession_id=id)
        db.session.add(favorite)
        db.session.commit()
        message = 'Añadido a favoritos'
        status = True
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({
            'status': 'success',
            'is_favorite': status,
            'message': message,
            'count': confession.get_favorite_count()
        })
    
    flash(message, 'success')
    return redirect(url_for('confession_detail', id=id))

@app.route('/admin')
@login_required
def admin_index():
    """Admin dashboard index."""
    if not current_user.is_admin:
        abort(403)
    
    total_users = User.query.count()
    total_confessions = Confession.query.count()
    total_comments = Comment.query.count()
    
    # Get recent users
    recent_users = User.query.order_by(User.registered_on.desc()).limit(5).all()
    
    # Get recent confessions
    recent_confessions = Confession.query.order_by(Confession.created_at.desc()).limit(5).all()
    
    return render_template('admin/index.html', title='Panel de Administración',
                          total_users=total_users, total_confessions=total_confessions,
                          total_comments=total_comments, recent_users=recent_users,
                          recent_confessions=recent_confessions)

@app.route('/admin/users')
@login_required
def admin_users():
    """Admin user management."""
    if not current_user.is_admin:
        abort(403)
    
    page = request.args.get('page', 1, type=int)
    per_page = 20
    users = User.query.order_by(User.registered_on.desc()).paginate(page=page, per_page=per_page, error_out=False)
    
    return render_template('admin/users.html', title='Gestión de Usuarios', users=users)

@app.route('/admin/users/<int:id>/edit', methods=['GET', 'POST'])
@login_required
def admin_edit_user(id):
    """Edit a user as admin."""
    if not current_user.is_admin:
        abort(403)
    
    user = User.query.get_or_404(id)
    form = AdminUserEditForm()
    
    if request.method == 'GET':
        form.name.data = user.name
        form.email.data = user.email
        form.is_admin.data = user.is_admin
    
    if form.validate_on_submit():
        user.name = form.name.data
        user.email = form.email.data
        user.is_admin = form.is_admin.data
        db.session.commit()
        
        flash(f'Usuario {user.username} actualizado correctamente', 'success')
        return redirect(url_for('admin_users'))
    
    user_stats = get_user_stats(id)
    return render_template('admin/users.html', title='Editar Usuario', 
                          editing_user=user, form=form, user_stats=user_stats)

@app.route('/admin/users/<int:id>/delete', methods=['POST'])
@login_required
def admin_delete_user(id):
    """Delete a user as admin."""
    if not current_user.is_admin:
        abort(403)
    
    user = User.query.get_or_404(id)
    
    # Don't allow deleting yourself
    if user.id == current_user.id:
        flash('No puedes eliminar tu propio usuario', 'danger')
        return redirect(url_for('admin_users'))
    
    db.session.delete(user)
    db.session.commit()
    
    flash(f'Usuario {user.username} eliminado correctamente', 'success')
    return redirect(url_for('admin_users'))

@app.route('/admin/confessions')
@login_required
def admin_confessions():
    """Admin confession management."""
    if not current_user.is_admin:
        abort(403)
    
    page = request.args.get('page', 1, type=int)
    per_page = 20
    confessions = Confession.query.order_by(Confession.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    
    return render_template('admin/confessions.html', title='Gestión de Confesiones', confessions=confessions)

@app.route('/admin/comments')
@login_required
def admin_comments():
    """Admin comment management."""
    if not current_user.is_admin:
        abort(403)
    
    page = request.args.get('page', 1, type=int)
    per_page = 20
    comments = Comment.query.order_by(Comment.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    
    return render_template('admin/comments.html', title='Gestión de Comentarios', comments=comments)

@app.route('/admin/comments/<int:id>/approve', methods=['POST'])
@login_required
def admin_approve_comment(id):
    """Approve a comment as admin."""
    if not current_user.is_admin:
        abort(403)
    
    comment = Comment.query.get_or_404(id)
    comment.approved = True
    db.session.commit()
    
    flash('Comentario aprobado correctamente', 'success')
    return redirect(url_for('admin_comments'))

@app.route('/admin/comments/<int:id>/disapprove', methods=['POST'])
@login_required
def admin_disapprove_comment(id):
    """Disapprove a comment as admin."""
    if not current_user.is_admin:
        abort(403)
    
    comment = Comment.query.get_or_404(id)
    comment.approved = False
    db.session.commit()
    
    flash('Comentario desaprobado correctamente', 'success')
    return redirect(url_for('admin_comments'))

@app.route('/profile')
@login_required
def profile():
    """User profile page."""
    user_stats = get_user_stats(current_user.id)
    
    # Get user's confessions
    confessions = Confession.query.filter_by(user_id=current_user.id).order_by(Confession.created_at.desc()).all()
    
    # Get user's favorite confessions
    favorites = db.session.query(Confession).join(Favorite).filter(Favorite.user_id == current_user.id).all()
    
    return render_template('profile.html', title='Mi Perfil', 
                          user_stats=user_stats, confessions=confessions, favorites=favorites)

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(403)
def forbidden_error(error):
    return render_template('403.html'), 403

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('500.html'), 500
