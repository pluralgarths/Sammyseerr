import os
import json
import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Database connection settings from .env
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", 5432)
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# Connect to PostgreSQL
conn = psycopg2.connect(
    host=DB_HOST,
    port=DB_PORT,
    database=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD
)
cursor = conn.cursor()

# Load JSON file
with open("sam_opportunities.json", "r") as file:
    data = json.load(file)

# Insert Opportunities
for opp in data["opportunitiesData"]:
    cursor.execute("""
        INSERT INTO opportunities (
            notice_id, title, solicitation_number, full_parent_path_name,
            posted_date, type, base_type, archive_type, archive_date,
            response_deadline, naics_code, classification_code, active,
            description, organization_type
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (notice_id) DO NOTHING;
    """, (
        opp["noticeId"], opp["title"], opp.get("solicitationNumber"),
        opp["fullParentPathName"], opp["postedDate"], opp["type"], 
        opp["baseType"], opp.get("archiveType"), opp.get("archiveDate"),
        opp.get("responseDeadLine"), opp.get("naicsCode"), opp["classificationCode"],
        True if opp["active"] == "Yes" else False,
        opp["description"], opp["organizationType"]
    ))

# Commit and close connection
conn.commit()
cursor.close()
conn.close()

print("✅ Data successfully loaded into PostgreSQL!")
