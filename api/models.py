from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize SQLAlchemy instance to handle database operations
db = SQLAlchemy()

# Define User model to store user information
class User(db.Model):
    # Primary key ID for each user
    id = db.Column(db.Integer, primary_key=True)
    # Username for the user, must be unique and not nullable
    username = db.Column(db.String(80), unique=True, nullable=False)
    # Password hash for securely storing the user's password
    password_hash = db.Column(db.String(100), nullable=False)
    # Relationship to ListItem model; each user can have multiple list items
    list_items = db.relationship('ListItem', backref='user', lazy='dynamic')
    # Relationship to List model; each user can have multiple lists
    lists = db.relationship('List', backref='user', lazy='dynamic')

    # Method to set the password hash using werkzeug's generate_password_hash
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Method to check the password by comparing it with the stored password hash
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Define List model to represent a collection of items for each user
class List(db.Model):
    # Primary key ID for each list
    id = db.Column(db.Integer, primary_key=True)
    # Name of the list, cannot be null
    name = db.Column(db.String(100), nullable=False)
    # Relationship to ListItem model; a list contains multiple list items
    items = db.relationship('ListItem', backref='list', lazy=True, cascade="all, delete-orphan")
    # Foreign key to associate each list with a specific user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Method to serialize list information into a dictionary format for JSON responses
    def serialize(self):
        """Serialize the list."""
        return {
            'id': self.id,
            'name': self.name,
        }

# Define ListItem model to represent individual items within a list, including support for hierarchical structure
class ListItem(db.Model):
    # Primary key ID for each list item
    id = db.Column(db.Integer, primary_key=True)
    # Title of the list item, cannot be null
    title = db.Column(db.String(100), nullable=False)
    # Foreign key to the parent item, allowing for nested items; nullable to support top-level items
    parent_id = db.Column(db.Integer, db.ForeignKey('list_item.id'), nullable=True)
    # Foreign key to associate each list item with a specific user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # Foreign key to associate each list item with a specific list
    list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    # Relationship to itself to allow hierarchical nesting of list items (sub-items)
    sub_items = db.relationship('ListItem', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')

    # Method to serialize the list item and its hierarchy, including any nested sub-items
    def serialize_hierarchy(self):
        """Serialize the list item, including any nested sub-items."""
        return {
            'id': self.id,
            'title': self.title,
            'list_id': self.list_id,
            # Recursively serialize sub-items for hierarchical structure
            'sub_items': [sub_item.serialize_hierarchy() for sub_item in self.sub_items]
        }
