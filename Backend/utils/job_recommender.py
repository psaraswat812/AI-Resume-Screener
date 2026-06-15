import pandas as pd


jobs = pd.read_csv(
    "datasets/job_dataset.csv"
)


def recommend_jobs(
    detected_skills
):

    recommendations = []

    user_skills = set(
        [skill.lower() for skill in detected_skills]
    )

    for _, row in jobs.iterrows():

        job_skills = set(
            skill.strip().lower()
            for skill in row["skills"].split(",")
        )

        matched = len(
            user_skills.intersection(job_skills)
        )

        score = round(
            (matched / len(job_skills)) * 100,
            2
        )

        recommendations.append(
            {
                "job_role": row["job_role"],
                "match_score": score
            }
        )

    recommendations.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return recommendations[:5]