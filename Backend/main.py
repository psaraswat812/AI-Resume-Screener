# from models import ResumeData
# from database.db import SessionLocal
from sqlalchemy import or_
from utils.auth import (
    hash_password,
    verify_password,
    create_access_token
)
from sqlalchemy import func
from utils.job_recommender import recommend_jobs
from utils.chatbot import ask_resume_chatbot
# from pydantic import BaseModel
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from fastapi.responses import FileResponse
from utils.ai_resume_rewriter import rewrite_resume
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends
from fastapi import Header
from utils.auth import verify_token
from database.models import User
# from utils.auth import (
#     hash_password,
#     verify_password,
#     create_access_token
# )
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from database.db import SessionLocal
from database.models import ResumeData
from utils.resume_suggestions import generate_resume_suggestions
from utils.ats_score import calculate_ats_score
from utils.predict_role import predict_job_role
from utils.skill_extractor import extract_skills_from_resume
from fastapi import FastAPI, UploadFile, File, Form
import shutil
import os

# Import parser functions
from utils.resume_parser import (
    extract_text_from_pdf,
    extract_text_from_docx
)

app = FastAPI()
security = HTTPBearer()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# class SignupRequest(BaseModel):

#     username: str
#     email: str
#     password: str


# class LoginRequest(BaseModel):

#     email: str
#     password: str


# Home Route
@app.get("/")
def home():
    return {
        "message": "AI Resume Screener Backend Running"
    }
class SignupRequest(BaseModel):

    username: str

    email: str

    password: str


class LoginRequest(BaseModel):

    email: str

    password: str

@app.post("/signup")
def signup(data: SignupRequest):
    db = SessionLocal()

    existing_user = db.query(User).filter(
    or_(
        User.email == data.email,
        User.username == data.username
    )
).first()

    if existing_user:

        return {
            "error": "User already exists"
        }

    user = User(

        username=data.username,

        email=data.email,

        hashed_password=hash_password(data.password)
    )

    db.add(user)

    db.commit()

    db.close()

    return {
        "message": "Signup successful"
    }

@app.post("/login")
def login(data: LoginRequest):

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:

        return {
            "error": "Invalid credentials"
        }

    if not verify_password(
        data.password,
        user.hashed_password
    ):

        return {
            "error": "Invalid credentials"
        }

    token = create_access_token({
        "user_id": user.id
    })

    return {
        "access_token": token,
        "username": user.username
    }
def get_current_user(
    credentials: HTTPAuthorizationCredentials
):

    token = credentials.credentials

    payload = verify_token(token)

    if not payload:

        return None

    user_id = payload.get(
        "user_id"
    )

    db = SessionLocal()

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    db.close()

    return user

@app.get("/resume-history/")
async def resume_history(
    authorization: str = Header(None)
):

    if not authorization:

        return {
            "error": "No token found"
        }

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = verify_token(token)

    if not payload:

        return {
            "error": "Invalid token"
        }

    user_id = payload["user_id"]

    db = SessionLocal()

    resumes = db.query(
        ResumeData
    ).filter(
        ResumeData.user_id == user_id
    ).all()

    db.close()

    return resumes

@app.get("/recruiter-dashboard/")
def recruiter_dashboard():

    db = SessionLocal()

    resumes = db.query(
        ResumeData
    ).all()

    total_resumes = len(resumes)

    if total_resumes == 0:

        db.close()

        return {
            "total_resumes": 0
        }

    # Average ATS

    ats_scores = []

    for resume in resumes:

        try:

            ats_scores.append(
                float(
                    resume.ats_score.replace("%", "")
                )
            )

        except:

            pass

    average_ats = round(
        sum(ats_scores) / len(ats_scores),
        2
    )

    # Role Counts

    role_counts = {}

    for resume in resumes:

        role = resume.predicted_role

        role_counts[role] = (
            role_counts.get(role, 0) + 1
        )

    # Skill Counts

    skill_counts = {}

    for resume in resumes:

        skills = resume.skills.split(",")

        for skill in skills:

            skill = skill.strip()

            skill_counts[skill] = (
                skill_counts.get(skill, 0) + 1
            )

    top_roles = sorted(
        role_counts.items(),
        key=lambda x: x[1],
        reverse=True
    )[:5]

    top_skills = sorted(
        skill_counts.items(),
        key=lambda x: x[1],
        reverse=True
    )[:10]

    best_candidates = sorted(
        resumes,
        key=lambda x: float(
            x.ats_score.replace("%", "")
        ),
        reverse=True
    )[:5]

    result = []

    for candidate in best_candidates:

        result.append({

            "filename":
            candidate.filename,

            "role":
            candidate.predicted_role,

            "ats":
            candidate.ats_score
        })

    db.close()

    return {

        "total_resumes":
        total_resumes,

        "average_ats":
        average_ats,

        "top_roles":
        top_roles,

        "top_skills":
        top_skills,

        "best_candidates":
        result
    }

@app.get("/my-resumes")
def get_my_resumes(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    # Verify token
    token = credentials.credentials

    email = verify_token(token)

    if not email:

        return {
            "error": "Invalid token"
        }

    db = SessionLocal()

    # Find current user
    current_user = db.query(User).filter(
        User.email == email
    ).first()

    # Get user resumes
    resumes = db.query(ResumeData).filter(
        ResumeData.user_id == current_user.id
    ).all()

    results = []

    for resume in resumes:

        results.append({

            "filename": resume.filename,

            "predicted_role": resume.predicted_role,

            "ats_score": resume.ats_score,

            "skills": resume.skills

        })

    db.close()

    return {
        "resume_history": results
    }
# Upload Resume Route
# Verify JWT token
# email = verify_token(authorization)

# if not email:
#     return {
#         "error": "Invalid token"
#     }

# # Create DB session
# db = SessionLocal()

# # Find logged-in user
# current_user = db.query(User).filter(
#     User.email == email
# ).first()

@app.post("/upload-resume/") 
async def upload_resume( 
    file: UploadFile = File(...), 
    job_description: str = Form(...),
    credentials: HTTPAuthorizationCredentials = Depends(security) 
    ):

    current_user = get_current_user(
    credentials
)

    if not current_user:

        return {
        "error": "Unauthorized"
    }
    allowed_extensions = [".pdf", ".docx"]

    file_extension = os.path.splitext(file.filename)[1]

    # Validate file type
    if file_extension not in allowed_extensions:
        return {
            "error": "Only PDF and DOCX files are allowed"
        }

    # Save file
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text based on file type
    extracted_text = ""
    

    if file_extension == ".pdf":
        extracted_text = extract_text_from_pdf(file_path)

    elif file_extension == ".docx":
        extracted_text = extract_text_from_docx(file_path)

    # Generate AI suggestions
    ai_feedback = rewrite_resume(extracted_text)

    # Extract skills
    detected_skills = extract_skills_from_resume(extracted_text)
    recommended_jobs = recommend_jobs(
    detected_skills
)
    matched_keywords = detected_skills
    # Predict job role
    predicted_role = predict_job_role(extracted_text)
    # Calculate ATS score
    ats_score = calculate_ats_score(
    extracted_text,
    job_description
)
    # Generate AI suggestions
    suggestion_data = generate_resume_suggestions(
    detected_skills,
    job_description,
    ats_score
)
    matched_skills = len(detected_skills)
    missing_count = len(suggestion_data["missing_skills"])

    skill_match = round(
    (matched_skills / (matched_skills + missing_count)) * 100,
    2
)
    resume_score = (ats_score + skill_match) / 2

    if resume_score < 40:
        resume_strength = "Weak"

    elif resume_score < 70:
        resume_strength = "Average"

    elif resume_score < 85:
        resume_strength = "Strong"

    else:
        resume_strength = "Excellent"


    try:

        db = SessionLocal()

        resume_entry = ResumeData(
            filename=file.filename,
            user_id=current_user.id,
            predicted_role=predicted_role,
            skills=", ".join(detected_skills),
            ats_score=f"{ats_score}%",
            skill_match=str(skill_match),
            resume_strength=resume_strength,
            missing_skills=", ".join(
                suggestion_data["missing_skills"]
            ),
            extracted_text=extracted_text,
            ai_feedback=ai_feedback["feedback"],
            rewritten_resume=ai_feedback["rewritten_resume"]
        )

        db.add(resume_entry)

        db.commit()

        print("DATA SAVED SUCCESSFULLY")

    except Exception as e:

        print("DATABASE ERROR:")
        print(e)

    finally:

        db.close()

    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
        "predicted_role": predicted_role,
        "skills": detected_skills,
        "matched_keywords": matched_keywords,
        "ATS_score": f"{ats_score}%",
        "skill_match": skill_match,
        "resume_strength": resume_strength,
        "missing_skills": suggestion_data["missing_skills"],
        "suggestions": suggestion_data["suggestions"],
        "extracted_text": extracted_text,
        "ai_feedback": ai_feedback["feedback"],
        "rewritten_resume": ai_feedback["rewritten_resume"],
        "recommended_jobs": recommended_jobs
    }

@app.get("/resume-history/")
async def resume_history(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    current_user = get_current_user(
        credentials
    )

    if not current_user:

        return {
            "error": "Unauthorized"
        }

    db = SessionLocal()

    resumes = db.query(
        ResumeData
    ).filter(
        ResumeData.user_id == current_user.id
    ).all()

    db.close()

    return resumes

@app.get("/user-dashboard/")
async def user_dashboard(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    current_user = get_current_user(
        credentials
    )

    if not current_user:

        return {
            "error": "Unauthorized"
        }

    db = SessionLocal()

    resumes = db.query(
        ResumeData
    ).filter(
        ResumeData.user_id == current_user.id
    ).all()

    total_resumes = len(resumes)

    if total_resumes == 0:

        db.close()

        return {
            "total_resumes": 0,
            "average_ats": 0,
            "best_ats": 0
        }

    ats_scores = []

    for resume in resumes:

        try:

            ats_scores.append(
                float(
                    resume.ats_score.replace(
                        "%",
                        ""
                    )
                )
            )

        except:

            pass

    average_ats = round(
        sum(ats_scores) / len(ats_scores),
        2
    )

    best_ats = max(ats_scores)

    db.close()

    return {

        "total_resumes": total_resumes,

        "average_ats": average_ats,

        "best_ats": best_ats,

        "username": current_user.username
    }

@app.get("/compare-resumes/{resume1_id}/{resume2_id}")
def compare_resumes(
    resume1_id: int,
    resume2_id: int
):

    db = SessionLocal()

    resume1 = db.query(
        ResumeData
    ).filter(
        ResumeData.id == resume1_id
    ).first()

    resume2 = db.query(
        ResumeData
    ).filter(
        ResumeData.id == resume2_id
    ).first()

    if not resume1 or not resume2:

        return {
            "error": "Resume not found"
        }

    skills1 = set(
        resume1.skills.split(", ")
    )

    skills2 = set(
        resume2.skills.split(", ")
    )

    added_skills = list(
        skills2 - skills1
    )

    removed_skills = list(
        skills1 - skills2
    )

    ats1 = float(
        resume1.ats_score.replace("%", "")
    )

    ats2 = float(
        resume2.ats_score.replace("%", "")
    )

    ats_change = round(
        ats2 - ats1,
        2
    )

    db.close()

    return {

        "resume1": resume1.filename,

        "resume2": resume2.filename,

        "ats_before": ats1,

        "ats_after": ats2,

        "ats_change": ats_change,

        "added_skills": added_skills,

        "removed_skills": removed_skills,

        "old_role": resume1.predicted_role,

        "new_role": resume2.predicted_role
    }

@app.post("/download-improved-resume/")
async def download_improved_resume(data: dict):

    rewritten_resume = data.get(
        "rewritten_resume",
        ""
    )

    file_path = "improved_resume.txt"

    with open(file_path, "w", encoding="utf-8") as file:
        file.write(rewritten_resume)

    return FileResponse(
        file_path,
        media_type="text/plain",
        filename="improved_resume.txt"
    )
@app.post("/download-ats-report/")
async def download_ats_report(data: dict):

    pdf_file = "ATS_Report.pdf"

    doc = SimpleDocTemplate(pdf_file)

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph(
            "AI Resume Analysis Report",
            styles["Title"]
        )
    )

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            f"Predicted Role: {data.get('predicted_role')}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"ATS Score: {data.get('ATS_score')}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Skill Match: {data.get('skill_match')}%",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Resume Strength: {data.get('resume_strength')}",
            styles["Normal"]
        )
    )

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            "Missing Skills",
            styles["Heading2"]
        )
    )

    content.append(
        Paragraph(
            ", ".join(data.get("missing_skills", [])),
            styles["Normal"]
        )
    )

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            "AI Feedback",
            styles["Heading2"]
        )
    )

    content.append(
        Paragraph(
            data.get("ai_feedback", ""),
            styles["Normal"]
        )
    )

    doc.build(content)

    return FileResponse(
        pdf_file,
        media_type="application/pdf",
        filename="ATS_Report.pdf"
    )
class ChatRequest(BaseModel):
    question: str
    ATS_score: str
    predicted_role: str
    skills: list
    missing_skills: list
    ai_feedback: str


@app.post("/chatbot/")
def chatbot(
    data: ChatRequest
):

    answer = ask_resume_chatbot(
        data.question,
        data.dict()
    )

    return {
        "answer": answer
    }


# Create DB session
    db = SessionLocal()

# Create database object
#     resume_entry = ResumeData(
#     user_id=current_user.id,
#     # filename=file.filename,
#     # predicted_role=predicted_role,
#     # skills=", ".join(detected_skills),
#     # ats_score=f"{ats_score}%",
#     # extracted_text=extracted_text
# )

# # Add to database
#     db.add(resume_entry)

# # Commit changes
#     db.commit()

# # Close DB
#     db.close()

