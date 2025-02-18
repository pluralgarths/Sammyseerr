import os
import json
import psycopg2
from datetime import datetime

# Database connection settings from environment variables
DB_HOST = os.getenv("DB_HOST", "db")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# Path to JSON file
environment = os.getenv("ENV", "production").lower()
json_file_path = "/data/sam_opportunities.json" if environment == "test" else "samdataout/sam_opportunities.json"

def parse_date(date_str, default="1970-01-01"):
    """Convert date to YYYY-MM-DD format for PostgreSQL"""
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return datetime.strptime(default, "%Y-%m-%d").date()

def load_json_to_db():
    """Reads JSON data and inserts it into the PostgreSQL database."""

    if not os.path.exists(json_file_path):
        print(f"❌ JSON file not found: {json_file_path}")
        return

    # Connect to PostgreSQL
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    cursor = conn.cursor()

    try:
        # Read JSON data
        with open(json_file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        records = data.get("opportunitiesData", [])  # Adjust key if needed

        if not records:
            print("⚠️ No opportunities found in JSON file.")
            return

        # Insert data into PostgreSQL
        for item in records:
            title = item.get("title", "Unknown Title")
            description = item.get("description", "No Description")
            agency = item.get("fullParentPathName", "Unknown Agency")
            posted_date = parse_date(item.get("postedDate", "1970-01-01"))

            cursor.execute(
                "INSERT INTO opportunities (title, description, full_parent_path_name, posted_date) VALUES (%s, %s, %s, %s)",
                (title, description, agency, posted_date)
            )

        conn.commit()
        print("✅ Data successfully inserted into PostgreSQL.")

    except Exception as e:
        print(f"❌ Error loading data: {e}")

    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    load_json_to_db()
