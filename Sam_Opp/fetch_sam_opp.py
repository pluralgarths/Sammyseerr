import os
import requests
import json
from datetime import datetime, timedelta

def get_sam_opportunities(posted_from: str, posted_to: str, limit: int = 10):
    """
    Fetch contract award information from SAM.gov API, switching between testing and production environments.
    """
    environment = os.getenv("ENV", "production").lower()
    sam_key = os.getenv("SAM_KEY_TEST") if environment == "test" else os.getenv("SAM_KEY_PROD")
    
    if not sam_key:
        raise ValueError(f"API key is not set for {environment} environment.")
    
    print(f"Using API Key: {sam_key[:5]}... (masked) in {environment} environment")
    
    base_url = "https://api-alpha.sam.gov/opportunities/v2/search" if environment == "test" else "https://api.sam.gov/prod/opportunities/v2/search"
    
    url = (
        f"{base_url}?limit={limit}&api_key={sam_key}&postedFrom={posted_from}&postedTo={posted_to}"
    )
    
    # Ensure appropriate output directory exists
    output_dir = "SamDataOutTest" if environment == "test" else "SamDataOut"
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "sam_opportunities.json")
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        # Save data to a JSON file for future analysis
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None

if __name__ == "__main__":
    # Set date range for the last 30 days with correct MM/dd/yyyy format
    posted_to = datetime.today().strftime("%m/%d/%Y")
    posted_from = (datetime.today() - timedelta(days=30)).strftime("%m/%d/%Y")
    
    opportunities = get_sam_opportunities(posted_from, posted_to, limit=10)
    
    if opportunities:
        print(json.dumps(opportunities, indent=4))
