// Pomodoro Timer (keep previous code)
let timerDuration = 25 * 60;
let remainingTime = timerDuration;
let interval = null;

const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");

function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

function startTimer() {
    if (interval) return;
    interval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            updateDisplay();
        } else {
            clearInterval(interval);
            interval = null;
            alert("Pomodoro finished! Take a break.");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    clearInterval(interval);
    interval = null;
    remainingTime = timerDuration;
    updateDisplay();
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

updateDisplay();

// --------------------------------------------
// Fetch Resources
const topicInput = document.getElementById("topic-input");
const findResourcesBtn = document.getElementById("find-resources");
const resourcesContainer = document.getElementById("resources-container");

findResourcesBtn.addEventListener("click", () => {
    const topic = topicInput.value.trim();
    if (!topic) return alert("Please enter a topic!");

    fetch(`/resources?topic=${encodeURIComponent(topic)}`)
        .then(res => res.json())
        .then(data => {
            resourcesContainer.innerHTML = ""; // clear previous results
            data.forEach(item => {
                const card = document.createElement("div");
                card.className = "resource-card";
                card.innerHTML = `
    <h3>${item.type}: ${item.title}</h3>
    <a href="${item.url}" target="_blank">
        <img src="${item.thumbnail}" alt="${item.title}" class="resource-thumbnail">
    </a>
`;
                resourcesContainer.appendChild(card);
            });
        })
        .catch(err => console.error(err));
});
