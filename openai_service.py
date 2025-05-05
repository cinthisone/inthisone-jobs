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

def parse_job_posting(text, resume_content=None):
    """
    Parse job posting text to extract title, company, and description
    If resume_content is provided, use it to tailor the cover letter
    Returns a dictionary with the extracted information
    """
    try:
        client = get_openai_client()
        
        # Base prompt
        prompt_base = (
            "Extract the job title, company name, pay range (if available), and job description from the following job posting. "
            "Then, generate a professional cover letter for this position using this information: "
            "Name: Chan Inthisone, Phone: 781-664-4975, Email: cinthisone@gmail.com. "
        )
        
        # Add resume content if available
        if resume_content:
            prompt_resume = (
                f"Use the following resume information to tailor the cover letter to highlight relevant skills and experience:\n\n"
                f"{resume_content}\n\n"
            )
        else:
            prompt_resume = ""
            
        # Complete the prompt
        prompt = (
            f"{prompt_base}"
            f"{prompt_resume}"
            "The cover letter should be concise, no more than 3 paragraphs total. "
            "Include contact information at the top of the cover letter. "
            "Return JSON in this format: {'title': '...', 'company': '...', 'pay_range': '...', 'job_url': '...', 'description': '...', 'cover_letter': '...'}. "
            "Make sure to format both the description and cover letter with proper HTML paragraphs for readability. "
            "If no pay range is mentioned in the job posting, include an empty string for the pay_range field.\n\n"
            "IMPORTANT: The title and company fields MUST be non-empty strings. If you can't extract them "
            "with high confidence, use 'Unknown Job Title' and 'Unknown Company' as fallbacks, "
            "but never return empty strings for these fields.\n\n"
            f"JOB POSTING:\n{text}"
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
        
        # Make sure title and company are never empty
        if not result.get('title') or result['title'].strip() == '':
            result['title'] = 'Unknown Job Title'
            
        if not result.get('company') or result['company'].strip() == '':
            result['company'] = 'Unknown Company'
        
        return result
    except Exception as e:
        return {
            "error": str(e),
            "title": "Unknown Job Title",
            "company": "Unknown Company",
            "description": "Error extracting job details. Please try again.",
            "cover_letter": "",
            "pay_range": "",
            "job_url": "",
            "apply_date": datetime.now().strftime("%Y-%m-%d")
        }
