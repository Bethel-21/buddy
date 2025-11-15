

from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Buddy is here to help you!"


if __name__ == "__main__":
    app.run(debug=True)