from utils.skills import SKILLS_DB


def extract_skills_from_resume(text):

    detected_skills = []

    # Convert resume text to lowercase
    text = text.lower()

    # Check each skill
    for skill in SKILLS_DB:

        if skill.lower() in text:
            detected_skills.append(skill)

    return detected_skills