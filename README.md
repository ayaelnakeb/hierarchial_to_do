# To-Do List Application

## Overview

The **To-Do List Application** is a simple yet visually appealing web app that allows users to create, manage, and organize their to-do lists. The app features user authentication for secure access, list and task management, and an intuitive interface designed with React and Bootstrap. The backend is powered by Flask, providing API endpoints for managing user sessions and data storage.

## Features

- **User Authentication**: Users can sign up, log in, and log out. Authentication is managed with JWT tokens, stored securely in the browser’s local storage.
- **Task Management**: Users can create lists, add tasks, and delete them.
- **Responsive Design**: The app is styled with Bootstrap for a responsive and mobile-friendly experience.
- **Navigation and UI Components**: Includes a dynamic header that displays different options based on the user's login status.
- **RESTful API**: The backend provides RESTful endpoints to manage users, lists, and tasks.

## Tech Stack

- **Frontend**: React, Bootstrap
- **Backend**: Flask, Flask-JWT-Extended for authentication, Flask-SQLAlchemy for database management
- **Database**: SQLite (can be swapped for other databases as needed)

## Getting Started

### Prerequisites

- **Node.js** (for the frontend React application)
- **Python 3** and **pip** (for the backend Flask server)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/todolist-app.git
   cd todolist-app
   ```
2. **Install Backend Dependencies**
   cd api
   python3 -m venv venv
   source venv/bin/activate # On Windows, use `venv\Scripts\activate`
   pip install -r requirements.txt

3. **Install Frontend Dependencies**
   npm install

## API Endpoints

### User Authentication

- **POST** `/auth/signup` - Register a new user
- **POST** `/auth/login` - Authenticate a user and receive a JWT token

### To-Do List Management

- **GET** `/api/lists` - Fetch all lists for a user
- **POST** `/api/lists` - Create a new list
- **DELETE** `/api/lists/:id` - Delete a list

### Task Management

- **GET** `/api/tasks/:listId` - Fetch all tasks for a specific list
- **POST** `/api/tasks` - Create a new task
- **DELETE** `/api/tasks/:id` - Delete a task

## Environment Variables

Place your environment variables in a `.env` file in the `server` directory:

- **`JWT_SECRET_KEY`**: Secret key for JWT authentication.
- **`SQLALCHEMY_DATABASE_URI`**: Database connection URI (e.g., `sqlite:///database.db`).

## Customization and Styling

The app uses Bootstrap for styling, with custom styles defined in `App.css` in the `client/src` folder. You can adjust colors, font sizes, and layouts as needed.

