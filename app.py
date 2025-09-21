# app.py
import os
import time
import sqlite3
import atexit
import smtplib
from datetime import datetime
from email.mime.text import MIMEText

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

# Load environment variables
load_dotenv()

# Create FastAPI app instance
app = FastAPI()

# Mount the static directory to serve CSS, JS, etc.
app.mount("/static", StaticFiles(directory="static"), name="static")

# Define the templates directory
templates = Jinja2Templates(directory="templates")

# Allow frontend (HTML/JS) requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# You can keep the rest of your backend code (database, email, etc.) here.
# For example, the /mood, /chat, etc. endpoints.

# Your database and other helper functions...
CRISIS_KEYWORDS = ['suicide', 'self-harm', 'hopeless', 'kill myself']
EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASS = os.getenv('EMAIL_PASS')
EMAIL_RECIPIENT = os.getenv('EMAIL_RECIPIENT')
HOTLINE_NUMBER = os.getenv('HOTLINE_NUMBER')
DB_PATH = os.getenv('OFFLINE_DB_PATH', 'offline_moods.db')

def init_db(path=DB_PATH):
    conn = sqlite3.connect(path, check_same_thread=False)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS moods (date TEXT, score INTEGER, category TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS messages (role TEXT, content TEXT)''')
    conn.commit()
    return conn

conn = init_db()

def save_offline(data_tuple, table):
    c = conn.cursor()
    if table == "moods":
        c.execute("INSERT INTO moods (date, score, category) VALUES (?, ?, ?)", data_tuple)
    elif table == "messages":
        c.execute("INSERT INTO messages (role, content) VALUES (?, ?)", data_tuple)
    conn.commit()

def load_offline(table):
    c = conn.cursor()
    if table == "moods":
        c.execute("SELECT date, score, category FROM moods")
    elif table == "messages":
        c.execute("SELECT role, content FROM messages")
    return c.fetchall()

def cleanup():
    try:
        conn.close()
    except:
        pass

atexit.register(cleanup)

def send_crisis_email(message, recipient=None):
    to_address = recipient or EMAIL_RECIPIENT or EMAIL_USER
    if not (EMAIL_USER and EMAIL_PASS and to_address):
        return False
    body = f"Crisis detected in message: \"{message}\"."
    if HOTLINE_NUMBER:
        body += f" Please call this hotline: {HOTLINE_NUMBER}."
    msg = MIMEText(body)
    msg['Subject'] = 'Crisis Alert from Wellness Buddy'
    msg['From'] = EMAIL_USER
    msg['To'] = to_address
    try:
        import smtplib
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, [to_address], msg.as_string())
        return True
    except:
        return False

class MoodInput(BaseModel):
    score: int
    category: str

class ChatInput(BaseModel):
    message: str

class EmergencyEmailInput(BaseModel):
    emergencyEmail: str

# API Routes
@app.get("/motivation")
def get_motivation():
    quotes = [
        "The best way to predict the future is to create it. – Peter Drucker",
        "You are enough just as you are. – Meghan Markle",
        "Happiness is not something ready-made. It comes from your own actions. – Dalai Lama",
        "Believe you can and you're halfway there. – Theodore Roosevelt",
        "The only way to do great work is to love what you do. – Steve Jobs"
    ]
    idx = time.localtime().tm_yday % len(quotes)
    return {"quote": quotes[idx]}

@app.post("/mood")
def save_mood(mood: MoodInput):
    entry_date = str(datetime.now().date())
    save_offline((entry_date, mood.score, mood.category), "moods")
    return {"message": "Mood saved!", "date": entry_date, "score": mood.score, "category": mood.category}

@app.get("/moods")
def get_moods():
    rows = load_offline("moods")
    return [{"date": r[0], "score": r[1], "category": r[2]} for r in rows]

# Templates and static files already defined above

# Import services for AI functionality
from services.ai_service import get_ai_response
from services.sentiment_service import analyze_sentiment

@app.post("/plan")
def generate_plan():
    moods = load_offline("moods")
    msgs = load_offline("messages")
    history_summary = "User mood scores: " + ", ".join([f"{m[0]}: {m[1]} ({m[2]})" for m in moods]) if moods else "No mood history."
    history_summary += ". Recent messages: " + ", ".join([m[1] for m in msgs[-10:]]) if msgs else ". No recent messages."

    latest_category = moods[-1][2] if moods else "Neutral"
    avg_score = sum([m[1] for m in moods]) / len(moods) if moods else 0

    prompt = f"Generate a 3-day wellness plan for a teen. {history_summary}. Latest mood: {latest_category}."
    try:
        response = get_ai_response(prompt, {"compound": avg_score})
    except Exception:
        response = "Day 1: Walk, meditation.\nDay 2: Exercise, talk to a friend.\nDay 3: Creative activity, relax."
    return {"plan": response}

@app.post("/chat")
def chat_with_bot(chat: ChatInput):
    user_msg = chat.message
    save_offline(("user", user_msg), "messages")
    try:
        sentiment = analyze_sentiment(user_msg)
    except:
        sentiment = {"compound": 0}
    try:
        ai_response = get_ai_response(user_msg, sentiment)
    except:
        ai_response = "I'm here for you. Could you tell me more?"
    suggestion = 'Try breathing: Inhale 4s, hold 4s, exhale 4s.' if sentiment.get('compound', 0) < 0 else 'Keep up the positivity!'
    response = f"{ai_response} {suggestion}"
    if any(k in user_msg.lower() for k in CRISIS_KEYWORDS):
        # In a real app, you'd get the user's emergency email from the database
        # For now, we'll use the default from environment
        if send_crisis_email(user_msg):
            response += " ⚠️ Crisis detected, email sent with hotline info."
        else:
            response += " ⚠️ Crisis detected, but alert failed. Please seek help immediately."
    save_offline(("assistant", response), "messages")
    return {"response": response}

@app.post("/emergency-email")
def update_emergency_email(emergency_data: EmergencyEmailInput):
    # In a real app, you'd store this in a database
    # For now, we'll just return success
    return {"message": "Emergency email updated successfully", "emergencyEmail": emergency_data.emergencyEmail}

# Serve the login page
@app.get("/")
def serve_login():
    return FileResponse("login-register-form/index.html")

# Serve the main dashboard
@app.get("/dashboard")
def serve_dashboard():
    return FileResponse("templates/dashboard.html")

# Serve the main index.html file (alternative route)
@app.get("/main")
def serve_index():
    return FileResponse("templates/index.html")