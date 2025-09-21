# 🌸 Wellness Buddy App

A comprehensive wellness tracking and support application designed for teens and young adults. Features mood tracking, AI-powered chat support, personalized wellness plans, and crisis detection.

## ✨ Features

- **🔐 User Authentication**: Secure login/register system with dark mode support
- **📊 Mood Tracking**: Track daily moods with scores and categories
- **🤖 AI Chat Support**: Chat with an empathetic AI wellness buddy
- **📅 Personalized Wellness Plans**: AI-generated 3-day wellness plans based on mood history
- **🌞 Daily Motivation**: Inspirational quotes to start your day
- **⚠️ Crisis Detection**: Automatic detection of crisis keywords with email alerts
- **💾 Offline Storage**: SQLite database for local data storage
- **📱 Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone or download this repository**
   ```bash
   cd wellness-buddy-app
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   - Copy the `.env` file and add your API keys:
   ```bash
   # Edit .env file with your actual values
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_RECIPIENT=emergency_contact@gmail.com
   HOTLINE_NUMBER=988
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Run the application**
   ```bash
   python run_app.py
   ```
   
   Or manually:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000 --reload
   ```

6. **Open your browser**
   - Go to: `http://localhost:8000`
   - Register a new account or login
   - Start using the wellness features!

## 🔧 Configuration

### Required API Keys

1. **Google Gemini API Key** (for AI chat and wellness plans)
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file as `GEMINI_API_KEY`

2. **Email Configuration** (for crisis alerts)
   - Use Gmail with App Password
   - Enable 2-factor authentication
   - Generate an App Password
   - Add credentials to `.env` file

### Optional Features

- **Crisis Detection**: Automatically detects concerning messages
- **Email Alerts**: Sends emergency notifications
- **Hotline Integration**: Includes crisis hotline numbers

## 📁 Project Structure

```
wellness-buddy-app/
├── app.py                 # Main FastAPI application
├── run_app.py            # Startup script
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables (create this)
├── offline_moods.db      # SQLite database (auto-created)
├── templates/
│   ├── index.html        # Main dashboard
│   └── dashboard.html    # User dashboard
├── static/
│   ├── script.js         # Frontend JavaScript
│   └── styles.css        # Styling
├── services/
│   ├── ai_service.py     # AI integration
│   └── sentiment_service.py # Sentiment analysis
├── login-register-form/
│   ├── index.html        # Login/Register page
│   ├── script.js         # Auth JavaScript
│   └── style.css         # Auth styling
└── utils/
    └── encryption.py     # Security utilities
```

## 🛠️ Development

### Running in Development Mode

```bash
# Start with auto-reload
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### API Endpoints

- `GET /` - Login page
- `GET /dashboard` - Main dashboard
- `GET /motivation` - Daily motivation quote
- `POST /mood` - Save mood entry
- `GET /moods` - Get mood history
- `POST /plan` - Generate wellness plan
- `POST /chat` - Chat with AI buddy

## 🔒 Security Features

- Password hashing and encryption
- Crisis keyword detection
- Email alerts for concerning messages
- Local data storage (SQLite)
- CORS protection

## 🆘 Crisis Support

The app includes automatic crisis detection for keywords like:
- "suicide", "self-harm", "hopeless", "kill myself"

When detected, the app will:
- Send an email alert to configured contacts
- Display crisis hotline information
- Provide immediate support resources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check that all dependencies are installed
2. Verify your `.env` file is properly configured
3. Ensure you have a stable internet connection for AI features
4. Check the console for error messages

## 🌟 Features in Detail

### Mood Tracking
- Rate your mood from 1-5
- Select mood categories (Happy, Sad, Anxious, Calm, Stressed)
- View mood history over time
- Data stored locally for privacy

### AI Chat Support
- Empathetic AI responses based on sentiment analysis
- Crisis detection and intervention
- Breathing exercises and coping strategies
- Conversation history saved locally

### Wellness Planning
- AI-generated 3-day wellness plans
- Based on your mood history and current state
- Personalized recommendations
- Activities for physical and mental wellness

### Daily Motivation
- Inspirational quotes that change daily
- Positive affirmations
- Encouraging messages

---

**Remember**: This app is designed to support your wellness journey, but it's not a replacement for professional mental health care. If you're experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.