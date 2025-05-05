import json
import os
from openai import OpenAI
from datetime import datetime

# The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
# Do not change this unless explicitly requested by the user
MODEL = "gpt-4o"

def get_openai_client():
    """Get OpenAI client instance"""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OpenAI API key not found in environment variables")
    return OpenAI(api_key=api_key)

def parse_job_posting(text):
    """
    Parse job posting text to extract title, company, and description
    Returns a dictionary with the extracted information
    """
    try:
        client = get_openai_client()
        
        prompt = (
            "Extract the job title, company name, and job description from the following job posting. "
            "Then, generate a professional cover letter for this position. "
            "Return JSON in this format: {'title': '...', 'company': '...', 'description': '...', 'cover_letter': '...'}. "
            "Make sure to format both the description and cover letter with proper HTML paragraphs for readability.\n\n"
            f"{text}"
        )
        
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.7
        )
        
        result = json.loads(response.choices[0].message.content)
        
        # Add current date as apply_date
        result["apply_date"] = datetime.now().strftime("%Y-%m-%d")
        
        return result
    except Exception as e:
        return {
            "error": str(e),
            "title": "",
            "company": "",
            "description": "",
            "cover_letter": "",
            "apply_date": datetime.now().strftime("%Y-%m-%d")
        }
