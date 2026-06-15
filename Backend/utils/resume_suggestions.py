from utils.skills import SKILLS_DB


def generate_resume_suggestions(
    detected_skills,
    job_description,
    ats_score
):

    suggestions = []

    missing_skills = []

    # Convert JD to lowercase
    jd_lower = job_description.lower()

    # Detect missing skills
    for skill in SKILLS_DB:

        if skill.lower() in jd_lower and skill not in detected_skills:
            missing_skills.append(skill)

    # ATS-based suggestions
    if ats_score < 50:
        suggestions.append(
            "Your ATS score is low. Add more relevant keywords from the job description."
        )

    if ats_score < 70:
        suggestions.append(
            "Try adding more technical skills and project-related experience."
        )

    # Missing skills suggestions
    if missing_skills:

        suggestions.append(
            "Consider adding these missing skills if you have experience with them."
        )

    # Resume quality suggestions
    suggestions.append(
        "Use measurable achievements in your project descriptions."
    )

    suggestions.append(
        "Add action verbs like Developed, Built, Implemented, Optimized."
    )

    suggestions.append(
        "Keep resume formatting ATS-friendly."
    )

    return {
        "missing_skills": missing_skills,
        "suggestions": suggestions
    }