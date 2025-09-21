from cryptography.fernet import Fernet
from dotenv import load_dotenv
import os

load_dotenv()
key = os.getenv('ENCRYPTION_KEY').encode()  # Load from .env
cipher = Fernet(key)

def encrypt(text):
    return cipher.encrypt(text.encode()).decode()

def decrypt(ciphertext):
    return cipher.decrypt(ciphertext.encode()).decode()