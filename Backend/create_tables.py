from database.db import engine
from database.models import Base


# Create all tables
Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")