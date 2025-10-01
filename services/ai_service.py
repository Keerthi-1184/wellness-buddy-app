import google.generativeai as genai
from dotenv import load_dotenv
import os
import re

load_dotenv()
# Support multiple env var names for convenience
api_key = (
    os.getenv('GEMINI_API_KEY')
    or os.getenv('GOOGLE_API_KEY')
    or os.getenv('API_KEY')
)
genai.configure(api_key=api_key)
_ENV_MODEL = (os.getenv('GEMINI_MODEL') or os.getenv('GOOGLE_MODEL') or '').strip()

# Resolve a working Gemini model name at import time to avoid 404s from outdated names
_PREFERRED_MODELS = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash-lite",
]

_RESOLVED_MODEL_NAME = None

def _resolve_working_model_name():
    global _RESOLVED_MODEL_NAME
    if _RESOLVED_MODEL_NAME:
        return _RESOLVED_MODEL_NAME
    # Env override takes precedence if provided
    if _ENV_MODEL:
        _RESOLVED_MODEL_NAME = _ENV_MODEL
        return _RESOLVED_MODEL_NAME
    try:
        available = list(genai.list_models())
        # Only consider models that support text generation
        def supports_text(m):
            methods = getattr(m, "supported_generation_methods", None) or []
            # For older SDKs this may be a list of strings like ["generateContent", ...]
            return any("generateContent" in str(x) for x in methods)

        available_names = {m.name.split("/")[-1]: m for m in available if supports_text(m)}
        # Prefer flash family to avoid pro/exp quotas
        flash_like = [n for n in available_names.keys() if "flash" in n]
        for name in _PREFERRED_MODELS:
            if name in available_names:
                _RESOLVED_MODEL_NAME = name
                return _RESOLVED_MODEL_NAME
        if flash_like:
            _RESOLVED_MODEL_NAME = flash_like[0]
            return _RESOLVED_MODEL_NAME
        # As a last resort, avoid picking pro/exp if possible
        non_pro = [n for n in available_names.keys() if ("pro" not in n and "exp" not in n)]
        if non_pro:
            _RESOLVED_MODEL_NAME = non_pro[0]
            return _RESOLVED_MODEL_NAME
    except Exception:
        # If listing models fails (e.g., missing API key or network), try common default
        pass
    _RESOLVED_MODEL_NAME = _PREFERRED_MODELS[0]
    return _RESOLVED_MODEL_NAME

def get_ai_response(user_message, sentiment):
    try:
        model_name = _resolve_working_model_name()
        model = genai.GenerativeModel(model_name)
        
        # Enhanced prompt with more context and personality
        sentiment_score = sentiment.get('compound', 0)
        sentiment_context = ""
        
        if sentiment_score < -0.5:
            sentiment_context = "The user seems to be feeling very negative or distressed. Be extra gentle, empathetic, and offer specific support resources."
        elif sentiment_score < 0:
            sentiment_context = "The user appears to be having a difficult time. Show understanding and offer helpful suggestions."
        elif sentiment_score < 0.5:
            sentiment_context = "The user seems to be in a neutral mood. Be encouraging and ask engaging questions."
        else:
            sentiment_context = "The user appears to be in a positive mood. Celebrate with them and help maintain their positive energy."
        
        prompt = f"""You are Wellness Buddy, an empathetic AI companion for teens. Your personality:
- Warm, caring, and non-judgmental
- Use casual, friendly language appropriate for teens
- Be encouraging and supportive
- Ask thoughtful follow-up questions
- Offer practical, actionable advice
- Use emojis occasionally but not excessively
- Keep responses conversational and not too long (2-3 sentences max)

Style guide:
- Do not start with generic greetings like "Hey there!", "Hi", or "Hello".
- Respond directly to the user's content. If a greeting is natural, vary it and avoid repetition across turns.
- Avoid repeating the same opener across messages.

Sentiment analysis: {sentiment_context}
User's message: "{user_message}"

Respond as Wellness Buddy with empathy and helpful guidance. If they're struggling, offer specific coping strategies. If they're happy, celebrate with them. Always end with a question to keep the conversation flowing naturally."""

        # For SDK 0.7.x generate_content accepts a string; for some versions a list also works
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Post-process to remove repetitive generic greetings at the start
        text = re.sub(r"^(?:\s*(?:hey|hi|hello|hey there|hi there)[,!\s-]*)+", "", text, flags=re.IGNORECASE)
        # Ensure we didn't end up with an empty string
        return text.strip() or "I'm here for you. What feels hardest right now?"
    except Exception as e:
        message = str(e)
        if "429" in message or "Quota" in message or "quota" in message:
            # Provide a clear, gentle message when quota is exceeded
            return (
                "I’m out of AI credits at the moment, but I’m still here for you. "
                "We’ll keep chatting without AI for now. If you’d like to re-enable AI, "
                "please add billing to your Gemini API key or set a model with available quota in .env "
                "using GEMINI_MODEL (e.g., gemini-1.5-flash-8b)."
            )
        return f"I'm having trouble connecting right now, but I'm still here for you! 💙 Could you try again in a moment? (Error: {message})"