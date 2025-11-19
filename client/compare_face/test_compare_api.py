import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# curl --location -g 'http://localhost:8000/api/v1/recognition/subjects' \
# --header 'x-api-key: 2914a5ba-e243-402d-a535-37f361ed1bf2'
url = "http://localhost:8000/api/v1/verification/verify?limit=0&det_prob_threshold=0.8&face_plugins=landmarks%2C%20gender%2C%20age%2C%20calculator%2C%20mask%2C%20pose&status=true"

headers = {
    "Content-Type": "application/json",
    "x-api-key": os.getenv("VITE_VERIFICATION_API_KEY")
}

# # Source - https://stackoverflow.com/a
# # Posted by Jim Brissom, modified by community. See post 'Timeline' for change history
# # Retrieved 2025-11-18, License - CC BY-SA 3.0

import base64

with open("selfie_pic.jpg", "rb") as image_file:
    encoded_string_1 = base64.b64encode(image_file.read())

with open("selfie_pic_2.jpg", "rb") as image_filez:
    encoded_string_2 = base64.b64encode(image_filez.read())

payload = {
    "source_image": encoded_string_1.decode("utf-8"),    # Replace with actual base64 string
    "target_image": encoded_string_2.decode("utf-8")     # Replace with actual base64 string
}

response = requests.post(url, json=payload, headers=headers)

print(response.status_code)
print(response.json()["result"][0]["face_matches"][0]['similarity'])
# print(response.json())
