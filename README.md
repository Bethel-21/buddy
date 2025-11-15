Buddy

Overview
Buddy is a prototype platform for self-learners that combines a Pomodoro timer, curated learning resources, and quizzes to help users study efficiently and track their progress.

## Features
- Pomodoro Timer: Tracks study sessions and encourages focus
- Resource Finder: Fetches YouTube videos
- Quizzes:** Users can take topic-based quizzes and record their scores

## Inspiration
Self-learners often struggle with staying consistent, finding relevant materials, and testing their knowledge. Study Buddy combines these into a single platform.

## Technologies
- Frontend: HTML, CSS, JavaScript
- Backend: Python, Flask
- APIs: YouTube Data API v3
- Environment Variables: dotenv

## Setup
1. Clone the repository:
2. 
git clone <repo-url>
cd study-buddy/backend

Install dependencies:
pip install -r requirements.txt

Create .env file and add your YouTube API key:
YOUTUBE_API_KEY=your_api_key_here

Run the app:
python app.py

Usage

Open http://127.0.0.1:5000 in your browser

Track your study time using the Pomodoro timer

Enter a topic to find video resources

Take a quiz and see your score 

