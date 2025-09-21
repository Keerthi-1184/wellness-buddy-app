import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=api_key)

def get_ai_response(user_message, sentiment):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
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

Sentiment analysis: {sentiment_context}
User's message: "{user_message}"

Respond as Wellness Buddy with empathy and helpful guidance. If they're struggling, offer specific coping strategies. If they're happy, celebrate with them. Always end with a question to keep the conversation flowing naturally."""

        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"I'm having trouble connecting right now, but I'm still here for you! 💙 Could you try again in a moment? (Error: {str(e)})"