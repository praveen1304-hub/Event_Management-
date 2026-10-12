import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

def get_database_uri():
    raw_url = os.getenv('DATABASE_URL', '').strip()
    sqlite_uri = f"sqlite:///{os.path.join(BASE_DIR, 'campuspulse.db')}"
    
    if not raw_url:
        return sqlite_uri
        
    # Test connection if it is a MySQL URL
    if raw_url.startswith('mysql'):
        try:
            from sqlalchemy import create_engine
            test_engine = create_engine(raw_url, pool_pre_ping=True)
            with test_engine.connect() as conn:
                pass
            return raw_url
        except Exception as e:
            # MySQL connection cannot be established with given credentials, use SQLite
            print(f"[CampusPulse] Notice: MySQL not accessible with current credentials ({e}).")
            print(f"[CampusPulse] Auto-configuring local SQLite database: {sqlite_uri}")
            return sqlite_uri
            
    return raw_url

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'campuspulse-secret-key-2026')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'campuspulse-jwt-secret-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 86400)))
    
    SQLALCHEMY_DATABASE_URI = get_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }
    
    CORS_ORIGINS = [
        origin.strip() 
        for origin in os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(',') 
        if origin.strip()
    ]
