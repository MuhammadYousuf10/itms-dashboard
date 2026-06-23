from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import EmailStr
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema, Token
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
import smtplib
from email.message import EmailMessage

router = APIRouter()

@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        role=user_in.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/forgot-password")
def forgot_password(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # We still return 200 so we don't leak which emails exist
        return {"message": "If an account with that email exists, a recovery link has been sent."}
    
    # Generate a dummy token (in production, use a secure short-lived token)
    reset_token = f"reset_{user.id}_{create_access_token(data={'sub': user.id})[-10:]}"
    
    import os
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"
    
    # Check if SMTP is configured
    if settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD:
        try:
            msg = EmailMessage()
            msg.set_content(f"Please click the following link to reset your password:\n\n{reset_link}")
            msg['Subject'] = "Password Recovery - ITMS Dashboard"
            msg['From'] = settings.SMTP_USER
            msg['To'] = email

            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
            print(f"✅ Real email sent successfully to {email}")
        except Exception as e:
            print(f"❌ Failed to send real email: {e}")
            print("Falling back to simulator...")
            _simulate_email(email, reset_link)
    else:
        _simulate_email(email, reset_link)
    
    return {"message": "If an account with that email exists, a recovery link has been sent."}

def _simulate_email(email: str, reset_link: str):
    print(f"\n" + "="*50)
    print(f"📧 EMAIL SERVICE SIMULATOR")
    print(f"To: {email}")
    print(f"Subject: Password Recovery - ITMS Dashboard")
    print(f"Body: Please click the following link to reset your password:")
    print(f"{reset_link}")
    print("="*50 + "\n")
