from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Email, Length, EqualTo, ValidationError
from models import User

class LoginForm(FlaskForm):
    username = StringField('Nombre de Usuario', validators=[DataRequired(message="Este campo es obligatorio")])
    password = PasswordField('Contraseña', validators=[DataRequired(message="Este campo es obligatorio")])
    remember_me = BooleanField('Recordarme')
    submit = SubmitField('Iniciar Sesión')

class RegistrationForm(FlaskForm):
    name = StringField('Nombre Completo', validators=[DataRequired(message="Este campo es obligatorio"), 
                                                     Length(min=2, max=100, message="El nombre debe tener entre 2 y 100 caracteres")])
    username = StringField('Nombre de Usuario', validators=[DataRequired(message="Este campo es obligatorio"), 
                                                           Length(min=3, max=64, message="El nombre de usuario debe tener entre 3 y 64 caracteres")])
    email = StringField('Correo Electrónico', validators=[DataRequired(message="Este campo es obligatorio"), 
                                                         Email(message="Dirección de correo electrónico no válida")])
    password = PasswordField('Contraseña', validators=[DataRequired(message="Este campo es obligatorio"), 
                                                      Length(min=8, message="La contraseña debe tener al menos 8 caracteres")])
    password2 = PasswordField('Repetir Contraseña', validators=[DataRequired(message="Este campo es obligatorio"), 
                                                               EqualTo('password', message='Las contraseñas deben coincidir')])
    submit = SubmitField('Registrarse')
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError('Este nombre de usuario ya está en uso. Por favor use otro.')
    
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError('Esta dirección de correo ya está registrada. Por favor use otra.')

class ConfessionForm(FlaskForm):
    content = TextAreaField('Tu Confesión Anónima', validators=[DataRequired(message="Este campo es obligatorio"), 
                                                               Length(min=10, max=1000, message="La confesión debe tener entre 10 y 1000 caracteres")])
    submit = SubmitField('Publicar Confesión')

class CommentForm(FlaskForm):
    content = TextAreaField('Tu Comentario Anónimo', validators=[DataRequired(message="Este campo es obligatorio"), 
                                                                Length(min=2, max=500, message="El comentario debe tener entre 2 y 500 caracteres")])
    submit = SubmitField('Comentar')

class AdminUserEditForm(FlaskForm):
    name = StringField('Nombre Completo', validators=[DataRequired(message="Este campo es obligatorio")])
    email = StringField('Correo Electrónico', validators=[DataRequired(message="Este campo es obligatorio"), Email()])
    is_admin = BooleanField('Administrador')
    submit = SubmitField('Guardar Cambios')
