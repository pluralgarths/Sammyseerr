import subprocess
import os
from dotenv import load_dotenv

load_dotenv()

def main():
    """
    Run the fetch_sam_opp.py script from the Sam_Opp directory.
    """
    script_path = os.path.join(os.getcwd(), "Sam_Opp", "fetch_sam_opp.py")

    try:
        subprocess.run(["python", script_path], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error executing script: {e}")

if __name__ == "__main__":
    main()
