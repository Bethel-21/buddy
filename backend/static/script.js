// Pomodoro Timer
let timerDuration = 25 * 60;
let remainingTime = timerDuration;
let interval = null;

const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");

function updateDisplay() {
    const minutes = Math.floor(remainingTime/60);
    const seconds = remainingTime%60;
    timerDisplay.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

function finishPomodoro() {
    alert("Pomodoro finished! Take a break.");
    const topic = document.getElementById("topic-input").value.trim() || "Unknown";
    fetch("/pomodoro", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ topic, duration: 25 })
    }).then(res => res.json()).then(data=>console.log(data));
}

function startTimer() {
    if (interval) return;
    interval = setInterval(()=>{
        if(remainingTime>0){ remainingTime--; updateDisplay(); }
        else { clearInterval(interval); interval=null; finishPomodoro(); }
    },1000);
}

function pauseTimer(){ clearInterval(interval); interval=null; }
function resetTimer(){ clearInterval(interval); interval=null; remainingTime=timerDuration; updateDisplay(); }

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
updateDisplay();

// Fetch Resources
const topicInput = document.getElementById("topic-input");
const findResourcesBtn = document.getElementById("find-resources");
const resourcesContainer = document.getElementById("resources-container");

findResourcesBtn.addEventListener("click", ()=>{
    const topic = topicInput.value.trim();
    if(!topic) return alert("Enter topic!");
    fetch(`/resources?topic=${encodeURIComponent(topic)}`)
    .then(res=>res.json())
    .then(data=>{
        resourcesContainer.innerHTML="";
        data.forEach(item=>{
            const card=document.createElement("div");
            card.className="resource-card";
            card.innerHTML=`<h3>${item.type}: ${item.title}</h3>
            <a href="${item.url}" target="_blank"><img src="${item.thumbnail}" alt="${item.title}"></a>`;
            resourcesContainer.appendChild(card);
        });
    }).catch(err=>console.error(err));
});

// Quiz
const takeQuizBtn = document.getElementById("take-quiz");
const quizContainer = document.getElementById("quiz-container");
const quizTopicInput = document.getElementById("quiz-topic-input");
const quizNumInput = document.getElementById("quiz-num-input");

takeQuizBtn.addEventListener("click", ()=>{
    const topic = quizTopicInput.value.trim();
    const num = quizNumInput.value || 3;
    if(!topic) return alert("Enter quiz topic!");
    fetch(`/quiz?topic=${encodeURIComponent(topic)}&num=${num}`)
    .then(res=>res.json())
    .then(questions=>{
        quizContainer.innerHTML="";
        questions.forEach((q,index)=>{
            const qDiv=document.createElement("div");
            qDiv.className="quiz-question";
            qDiv.innerHTML=`<p>${index+1}. ${q.question}</p>
            ${q.options.map((opt,i)=>`<label><input type="radio" name="q${index}" value="${i}">${opt}</label>`).join("")}<hr>`;
            quizContainer.appendChild(qDiv);
        });
        const submitBtn=document.createElement("button");
        submitBtn.textContent="Submit Quiz";
        submitBtn.addEventListener("click",()=>submitQuiz(questions));
        quizContainer.appendChild(submitBtn);
    }).catch(err=>console.error(err));
});

function submitQuiz(questions){
    let score=0;
    questions.forEach((q,index)=>{
        const selected=document.querySelector(`input[name="q${index}"]:checked`);
        if(selected && parseInt(selected.value)===q.answer){ score++; }
    });
    const topic = quizTopicInput.value.trim() || "Unknown";
    fetch("/quiz_score",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ topic, score, total: questions.length })
    }).then(res=>res.json()).then(data=>console.log(data));
    alert(`You scored ${score} / ${questions.length}`);
}
