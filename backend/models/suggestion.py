from datetime import datetime
from models.database import db

class Suggestion(db.Model):
    __tablename__ = 'suggestions'

    id = db.Column(db.Integer, primary_key=True)
    original_text = db.Column(db.Text, nullable=False)
    paraphrased_text = db.Column(db.Text, nullable=False)
    citation_text = db.Column(db.Text, nullable=False)
    source_url = db.Column(db.String(512), nullable=False)
    source_title = db.Column(db.String(512), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'original_text': self.original_text,
            'paraphrased_text': self.paraphrased_text,
            'citation_text': self.citation_text,
            'source_url': self.source_url,
            'source_title': self.source_title,
            'created_at': self.created_at.isoformat()
        } 