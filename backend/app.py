from flask import Flask, jsonify, request
from flask_cors import CORS
from models.database import db
from routes.suggestions import suggestions_bp
import os
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.DEBUG)  # Changed to DEBUG level
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Configure OpenRouter settings
    app.config['OPENROUTER_API_KEY'] = os.getenv('OPENROUTER_API_KEY')
    app.config['SITE_URL'] = os.getenv('SITE_URL', 'http://localhost:3000')
    app.config['SITE_NAME'] = os.getenv('SITE_NAME', 'Plagiarism Checker')

    # Initialize extensions
    db.init_app(app)

    # Debug middleware to log all requests
    @app.before_request
    def log_request_info():
        logger.debug('Headers: %s', dict(request.headers))
        logger.debug('Body: %s', request.get_data())
        logger.debug('URL: %s', request.url)
        logger.debug('Method: %s', request.method)

    # Register blueprints
    app.register_blueprint(suggestions_bp)
    
    # Debug: Print all registered routes
    logger.debug('Registered Routes:')
    for rule in app.url_map.iter_rules():
        logger.debug(f"{rule.endpoint}: {rule.methods} - {rule}")

    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        logger.error(f"404 error: {error}")
        logger.error(f"Requested URL: {request.url}")
        logger.error(f"Available routes: {[str(rule) for rule in app.url_map.iter_rules()]}")
        return jsonify({
            'error': 'Not found',
            'requested_url': request.url,
            'available_routes': [str(rule) for rule in app.url_map.iter_rules()]
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"500 error: {error}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    # Create database tables
    with app.app_context():
        try:
            db.create_all()
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Error creating database tables: {e}")
            raise

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 8000))
    logger.info(f"Starting Flask app on port {port}")
    logger.info(f"Debug mode: {app.debug}")
    app.run(debug=True, port=port, host='0.0.0.0') 