# Turnitin Backend API

This is the backend for the Turnitin project. It provides RESTful API endpoints for user authentication.

## Setup

1. Install dependencies:
   ```
   pip install django djangorestframework django-cors-headers
   ```

2. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

3. Create a superuser (admin):
   ```
   python manage.py createsuperuser
   ```

4. Run the server:
   ```
   python manage.py runserver
   ```

## API Endpoints

### Authentication

#### Register a new user
- **URL**: `/api/register/`
- **Method**: `POST`
- **Data**:
  ```json
  {
    "username": "your_username",
    "email": "your@email.com",
    "password": "your_password",
    "password2": "your_password",
    "first_name": "Your",
    "last_name": "Name"
  }
  ```
- **Success Response**: 
  - **Code**: 201 CREATED
  - **Content**: 
    ```json
    {
      "token": "your_auth_token",
      "user_id": 1,
      "username": "your_username",
      "email": "your@email.com"
    }
    ```

#### Login
- **URL**: `/api/login/`
- **Method**: `POST`
- **Data**:
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: 
    ```json
    {
      "token": "your_auth_token",
      "user_id": 1,
      "username": "your_username",
      "email": "your@email.com"
    }
    ```

#### Get current user details
- **URL**: `/api/user/`
- **Method**: `GET`
- **Headers**: `Authorization: Token your_auth_token`
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: 
    ```json
    {
      "id": 1,
      "username": "your_username",
      "email": "your@email.com",
      "first_name": "Your",
      "last_name": "Name",
      "profile": {
        "date_joined": "2023-06-01T12:00:00Z"
      }
    }
    ```

#### Logout
- **URL**: `/api/logout/`
- **Method**: `POST`
- **Headers**: `Authorization: Token your_auth_token`
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: 
    ```json
    {
      "message": "Successfully logged out"
    }
    ```

## Security

The API uses token-based authentication. For each request to a protected endpoint, include the token in the header:

```
Authorization: Token your_auth_token
```

Passwords are securely hashed using Django's built-in password hashing system.

## CORS

CORS is enabled to allow the frontend to access the API from a different domain. In production, you should update the settings to restrict access to only your frontend domain. 