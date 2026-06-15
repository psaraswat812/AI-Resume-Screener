# from passlib.context import CryptContext
# from jose import jwt
# from datetime import datetime, timedelta


# # Secret key
# SECRET_KEY = "MY_SECRET_KEY"

# # JWT Algorithm
# ALGORITHM = "HS256"

# # Token expiry
# ACCESS_TOKEN_EXPIRE_MINUTES = 60


# # Password hashing
# pwd_context = CryptContext(
#     schemes=["bcrypt"],
#     deprecated="auto"
# )


# # Hash password
# def hash_password(password):

#     return pwd_context.hash(password)


# # Verify password
# def verify_password(plain_password, hashed_password):

#     return pwd_context.verify(
#         plain_password,
#         hashed_password
#     )


# # Create JWT token
# def create_access_token(data: dict):

#     to_encode = data.copy()

#     expire = datetime.utcnow() + timedelta(
#         minutes=ACCESS_TOKEN_EXPIRE_MINUTES
#     )

#     to_encode.update({"exp": expire})

#     encoded_jwt = jwt.encode(
#         to_encode,
#         SECRET_KEY,
#         algorithm=ALGORITHM
#     )

#     return encoded_jwt

# from jose import JWTError


# # Verify JWT token
# def verify_token(token):

#     try:

#         payload = jwt.decode(
#             token,
#             SECRET_KEY,
#             algorithms=[ALGORITHM]
#         )

#         email = payload.get("sub")

#         return email

#     except JWTError:

#         return None
import os
from dotenv import load_dotenv

load_dotenv()
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
SECRET_KEY = os.getenv(
    "SECRET_KEY"
)

ALGORITHM = "HS256"

def create_access_token(data):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(days=1)

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password):

    return pwd_context.hash(password)

def verify_password(
    plain_password,
    hashed_password
):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )

def verify_token(token):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except Exception:

        return None