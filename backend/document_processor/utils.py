import os
import PyPDF2
import docx
from io import BytesIO

def extract_text_from_pdf(file_path):
    """
    Extract text from a PDF file.
    
    Args:
        file_path: Path to the PDF file
        
    Returns:
        str: Extracted text from the PDF
    """
    text = ""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text()
                # Add a newline between pages for better readability
                if page_num < len(pdf_reader.pages) - 1:
                    text += "\n\n"
    except Exception as e:
        text = f"Error extracting text from PDF: {str(e)}"
    
    return text

def extract_text_from_docx(file_path):
    """
    Extract text from a DOCX file.
    
    Args:
        file_path: Path to the DOCX file
        
    Returns:
        str: Extracted text from the DOCX
    """
    text = ""
    try:
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            if para.text:
                text += para.text + "\n"
    except Exception as e:
        text = f"Error extracting text from DOCX: {str(e)}"
    
    return text

def extract_text_from_doc(file_path):
    """
    Extract text from a DOC file.
    Note: This is a fallback method as direct DOC extraction is more complex.
    For production use, consider using a more robust solution like textract or an external service.
    
    Args:
        file_path: Path to the DOC file
        
    Returns:
        str: Message indicating limitation of DOC extraction
    """
    return "Direct extraction from DOC files is not supported. Please convert to DOCX format for better results."

def extract_text(file_path, file_type):
    """
    Extract text from a document based on its file type.
    
    Args:
        file_path: Path to the document file
        file_type: Type of the document (pdf, docx, doc)
        
    Returns:
        str: Extracted text from the document
    """
    if file_type == 'pdf':
        return extract_text_from_pdf(file_path)
    elif file_type == 'docx':
        return extract_text_from_docx(file_path)
    elif file_type == 'doc':
        return extract_text_from_doc(file_path)
    else:
        return "Unsupported file type. Please upload a PDF or DOCX file." 