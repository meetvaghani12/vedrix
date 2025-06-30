#!/bin/bash

# Make the script executable
chmod +x start.sh

# Set the default port
PORT="${PORT:-8000}"

# Start Gunicorn
exec gunicorn turnitin_backend.wsgi:application --bind 0.0.0.0:$PORT 