

from flask import Flask, render_template, jsonify, request
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
if not YOUTUBE_API_KEY:
    raise ValueError("YouTube API key not found. Set it in .env file.")

@app.route("/")
def home():
    return render_template("index.html")




@app.route("/resources")
def resources():
    topic = request.args.get("topic", "").strip()
    if not topic:
        return jsonify([])

    # YouTube Data API URL
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": topic,
        "type": "video",
        "maxResults": 5,
        "key": YOUTUBE_API_KEY
    }

    try:
        response = requests.get(url, params=params).json()

        # Build resources list from YouTube results
        resources_to_return = []
        for item in response.get("items", []):
            resources_to_return.append({
                "type": "YouTube",
                "title": item["snippet"]["title"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"]  
            })

    except Exception as e:
        print("Error fetching YouTube data:", e)
        # fallback to static sample if YouTube fails
        resources_to_return = [
            {"type": "Website", "title": "Learning Resources Hub", "url": "https://example.com"}
        ]

    return jsonify(resources_to_return)



if __name__ == "__main__":
    app.run(debug=True)