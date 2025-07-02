from flask import Blueprint, jsonify, request, current_app
from models.suggestion import Suggestion
from models.database import db
from services.llm_service import LLMService
from datetime import datetime

suggestions_bp = Blueprint('suggestions', __name__)

@suggestions_bp.route('/api/suggestions/generate', methods=['POST'])
def generate_suggestions():
    try:
        data = request.get_json()
        text = data.get('text')
        matched_sources = data.get('matched_sources', [])
        
        if not text or not matched_sources:
            return jsonify({'error': 'Missing required fields'}), 400
            
        llm_service = LLMService(
            api_key=current_app.config['OPENROUTER_API_KEY'],
            site_url=current_app.config['SITE_URL'],
            site_name=current_app.config['SITE_NAME']
        )
        
        suggestions = llm_service.generate_suggestions(text, matched_sources)
        
        return jsonify({
            'suggestions': [suggestion.to_dict() for suggestion in suggestions]
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error generating suggestions: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@suggestions_bp.route('/api/suggestions/<int:document_id>', methods=['GET'])
def get_suggestions(document_id):
    try:
        suggestions = Suggestion.query.filter_by(document_id=document_id).all()
        return jsonify({
            'suggestions': [suggestion.to_dict() for suggestion in suggestions]
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching suggestions: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500 