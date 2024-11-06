from flask import Flask
from flask_migrate import Migrate
from .models import db
from flask_cors import CORS
from flask_jwt_extended import JWTManager

jwt = JWTManager()

def create_app(debug=True):
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['JWT_SECRET_KEY'] = 'super-secret'

    db.init_app(app)
    jwt.init_app(app)
    migrate = Migrate(app, db)

    # Import blueprints
    from .auth import auth as auth_blueprint
    from .tasks import tasks as tasks_blueprint

    # Apply CORS to the app for routes under /auth/*
    # In your create_app function
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})



    # Register blueprints
    app.register_blueprint(auth_blueprint, url_prefix='/auth')
    app.register_blueprint(tasks_blueprint)

    return app

app = create_app()
if __name__ == '__main__':
    app.run(debug=True)
