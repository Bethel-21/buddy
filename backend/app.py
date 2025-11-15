

from flask import Flask, render_template, jsonify, request
import requests
import os
from dotenv import load_dotenv
from database import get_connection

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
if not YOUTUBE_API_KEY:
    raise ValueError("YouTube API key not found. Set it in .env file.")



# Mock quizzes for demo
MOCK_QUIZZES = {
    "cats": [
        {
            "question": "What is the average lifespan of a domestic cat?",
            "options": ["5-8 years", "10-15 years", "15-20 years", "20-25 years"],
            "answer": 1
        },
        {
            "question": "Which breed is known for having no tail?",
            "options": ["Siamese", "Manx", "Persian", "Maine Coon"],
            "answer": 1
        },
        {
            "question": "Cats sleep for about how many hours per day?",
            "options": ["8 hours", "12 hours", "16 hours", "20 hours"],
            "answer": 2
        }
    ],
    "default": [
        {
            "question": "Sample question?",
            "options": ["A", "B", "C", "D"],
            "answer": 0
        }
    ]
}

@app.route("/quiz")
def quiz():
    topic_input = request.args.get("topic", "").lower()
    num_questions = request.args.get("num", 5, type=int)

    # For demo: return mock quiz if topic matches, else default
    quiz_questions = MOCK_QUIZZES.get(topic_input, MOCK_QUIZZES["default"])

    # Limit to requested number of questions
    return jsonify(quiz_questions[:num_questions])




@app.route("/pomodoro", methods=["POST"])
def save_pomodoro():
    data = request.json
    topic = data.get("topic", "Unknown")
    duration = data.get("duration", 25)

    conn = get_connection()
    c = conn.cursor()
    c.execute("INSERT INTO pomodoro (topic, duration) VALUES (?, ?)", (topic, duration))
    conn.commit()
    conn.close()

    return jsonify({"status": "success"})



@app.route("/quiz_score", methods=["POST"])
def save_quiz_score():
    data = request.json
    topic = data.get("topic", "Unknown")
    score = data.get("score", 0)
    total = data.get("total", 0)

    conn = get_connection()
    c = conn.cursor()
    c.execute("INSERT INTO quiz_score (topic, score, total) VALUES (?, ?, ?)", (topic, score, total))
    conn.commit()
    conn.close()

    return jsonify({"status": "success"})






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