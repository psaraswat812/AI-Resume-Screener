import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def rewrite_resume(resume_text):

    prompt = f"""
You are an expert ATS Resume Writer.

Analyze the following resume.

Return your response in EXACTLY this format:

===FEEDBACK===

1. Resume Weaknesses
2. ATS Improvements
3. Missing Skills
4. Better Project Descriptions
5. Better Professional Summary

===REWRITTEN_RESUME===

Rewrite the entire resume professionally.

Improve:
- ATS optimization
- grammar
- formatting
- project descriptions
- professional summary
- technical skills section

Resume:

{resume_text}
"""

    try:

        response = model.generate_content(
            prompt
        )

        content = response.text

    except Exception as e:

        return {
            "feedback": f"Gemini Error: {str(e)}",
            "rewritten_resume": ""
        }

    feedback = ""
    rewritten_resume = ""

    if "===REWRITTEN_RESUME===" in content:

        parts = content.split(
            "===REWRITTEN_RESUME==="
        )

        feedback = parts[0].replace(
            "===FEEDBACK===",
            ""
        ).strip()

        rewritten_resume = parts[1].strip()

    else:

        feedback = content.strip()

        rewritten_resume = (
            "Could not parse rewritten resume format cleanly."
        )

    return {
        "feedback": feedback,
        "rewritten_resume": rewritten_resume
    }