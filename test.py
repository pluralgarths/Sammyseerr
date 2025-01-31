import os
from dotenv import load_dotenv

load_dotenv()

sam_key = os.getenv("sam_key")
print(f"API Key: {sam_key}") 