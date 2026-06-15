import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Gemini API Key
genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def ask_resume_chatbot(
    question,
    resume_data
):

    prompt = f"""
    Resume Information:

    ATS Score:
    {resume_data.get('ATS_score')}

    Predicted Role:
    {resume_data.get('predicted_role')}

    Skills:
    {resume_data.get('skills')}

    Missing Skills:
    {resume_data.get('missing_skills')}

    AI Feedback:
    {resume_data.get('ai_feedback')}

    User Question:
    {question}

    Answer professionally.
    """

    response = model.generate_content(
        prompt
    )

    return response.text