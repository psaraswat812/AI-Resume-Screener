
from dotenv import load_dotenv
import os
import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
load_dotenv()
DATABASE_URL = os.getenv(
    "DATABASE_URL"
)


# Create database engine
engine = create_engine(DATABASE_URL)


# Create session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Base class
Base = declarative_base()