#!/usr/bin/env python3
"""
Wellness Buddy App Startup Script
Run this script to start the FastAPI application
"""

import uvicorn
import os
import sys

def main():
    # Check if .env file exists (warn but do not exit, since platforms provide env vars)
    if not os.path.exists('.env'):
        print("⚠️  Warning: .env file not found!")
        print("Using environment variables from the hosting platform if available.")
        print("If running locally, create a .env file or set env vars.")
    
    # Check if required directories exist
    required_dirs = ['templates', 'static', 'services', 'login-register-form']
    for dir_name in required_dirs:
        if not os.path.exists(dir_name):
            print(f"❌ Error: Required directory '{dir_name}' not found!")
            return
    
    print("🌸 Starting Wellness Buddy App...")
    print("📱 Open your browser and go to: http://localhost:8000")
    print("🔑 Make sure to set up your .env file with API keys")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        port = int(os.getenv("PORT", "8000"))
        uvicorn.run(
            "app:app",
            host="0.0.0.0",
            port=port,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Wellness Buddy App stopped. Take care!")
    except Exception as e:
        print(f"❌ Error starting the app: {e}")
        print("💡 Make sure all dependencies are installed: pip install -r requirements.txt")

if __name__ == "__main__":
    main()
