from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey
)
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from datetime import datetime

from database.db import Base


class ResumeData(Base):

    __tablename__ = "resume_data"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String)

    predicted_role = Column(String)

    skills = Column(Text)

    ats_score = Column(String)

    extracted_text = Column(Text)

    skill_match = Column(String)

    resume_strength = Column(String)

    missing_skills = Column(Text)

    ai_feedback = Column(Text)

    rewritten_resume = Column(Text)
    user_id = Column(
    Integer,
    ForeignKey("users.id")
)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(
        String,
        unique=True
    )

    email = Column(
        String,
        unique=True
    )

    hashed_password = Column(
    String)