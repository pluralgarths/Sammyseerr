import subprocess
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

def main():
    """
    Run the fetch_sam_opp.py script from the Sam_Opp directory with date arguments.
    """
    script_path = os.path.join(os.getcwd(), "Sam_Opp", "fetch_sam_opp.py")
    
    # Get the last 30 days range
    posted_to = datetime.today().strftime("%m/%d/%Y")
    posted_from = (datetime.today() - timedelta(days=30)).strftime("%m/%d/%Y")

    try:
        subprocess.run(["python3", script_path, posted_from, posted_to], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error executing script: {e}")

if __name__ == "__main__":
    main()
