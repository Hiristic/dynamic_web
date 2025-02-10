import os
from dotenv import load_dotenv

# Ladda miljövariabler från .env-filen
load_dotenv()

class Config:
    # API-nycklar
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    
    # Server-inställningar
    PORT = int(os.getenv('PORT', 3000))
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # Andra inställningar kan läggas till här
    API_VERSION = 'v1' 