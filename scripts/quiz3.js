const questions = [
    {
        question: "When you're feeling stressed, you tend to:",
        type: "multiple",
        options: [
            { text: "Ignore your feelings and push through", points: 1,  followUp: 1 },
            { text: "Take a moment to acknowledge your stress and find ways to manage it", points: 4,  followUp: 1 },
            { text: "Become overwhelmed and struggle to cope", points: 2,  followUp: 1 },
            { text: "Lash out at others due to your stress", points: 1,  followUp: 1 }
        ]
       
    },
    {
        question: "When someone shares a problem with you, you usually:",
        type: "multiple",
        options: [
            { text: "Listen attentively and show empathy", points: 4,   followUp: 2 },
            { text: "Offer advice without fully understanding their perspective", points: 2,   followUp: 2 },
            { text: "Change the subject to avoid the conversation", points: 1,   followUp: 2 },
            { text: "Judge them for their problem", points: 1,   followUp: 2 }
        ]
      
    },
    {
        question: "In a challenging situation, you typically:",
        type: "multiple",
        options: [
            { text: "Remain calm and assess the situation objectively", points: 4, followUp: 3 },
            { text: "Become anxious and have difficulty thinking clearly", points: 2, followUp: 3 },
            { text: "React impulsively without considering the consequences", points: 1, followUp: 3 },
            { text: "Blame others for the situation", points: 1, followUp: 3 }
        ]
    },
    {
        question: "When you're in an argument with someone, you usually:",
        type: "multiple",
        options: [
            { text: "Listen to their perspective and try to find a compromise", points: 4, followUp: 4 },
            { text: "Focus solely on proving your point", points: 2, followUp: 4 },
            { text: "Become defensive and dismiss their opinions", points: 1, followUp: 4 },
            { text: "Resort to personal attacks or insults", points: 1, followUp: 4 }
        ]
    
    },
    {
        question: "When you receive constructive criticism, you tend to:",
        type: "multiple",
        options: [
            { text: "Reflect on the feedback and see it as an opportunity for growth", points: 4,  followUp: "result" },
            { text: "Feel slightly discouraged but try to learn from it", points: 3,  followUp: "result" },
            { text: "Become defensive and dismiss the criticism", points: 2,  followUp: "result" },
            { text: "Take it as a personal attack and hold a grudge", points: 1,  followUp: "result" }
        ]
       
    }
];


let currentQuestion = 0;
let points = [];

function renderQuestion() {
    const question = questions[currentQuestion];
    const questionHTML = `
        <div class="question">
            <h3>${question.question}</h3>
            <div class="answer-options">
                ${question.type === 'multiple' ? renderMultipleChoiceOptions(question.options) : renderTextInput()}
            </div>
        </div>
        <button type="button" class="submit-btn" onclick="submitAnswer()">Submit</button>
    `;
    quizForm.innerHTML = questionHTML;
}

function renderMultipleChoiceOptions(options) {
    return options.map(option => `
        <label>
            <input type="radio" name="answer" value="${option.points}" data-follow-up="${option.followUp !== null ? option.followUp : ''}">
            ${option.text}
        </label>
    `).join('');
}

function renderTextInput() {
    return `<input type="text" name="answer" placeholder="Enter your answer">`;
}

function submitAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    const textInput = document.querySelector('input[name="answer"][type="text"]');

    if (selectedOption) {
        points.push(parseInt(selectedOption.value));
        const followUp = selectedOption.dataset.followUp;
        handleFollowUp(followUp);
    } else if (textInput && textInput.value.trim() !== '') {
        const followUp = questions[currentQuestion].followUp;
        handleFollowUp(followUp);
    } else {
        alert('Please select an option or enter a valid answer.');
        return;
    }
}

function handleFollowUp(followUp) {
    if (followUp === "result") {
        showResult();
    } else if (followUp === null || followUp === 'null') {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            renderQuestion();
        } else {
            showResult();
        }
    } else {
        currentQuestion = parseInt(followUp);
        renderQuestion();
    }
}

function showResult() {
    const resultContainer = document.getElementById('result');
    const totalPoints = points.reduce((sum, point) => sum + point, 0);
    const maxPoints = questions.length * 4;
    const percentage = Math.round((totalPoints / maxPoints) * 100);

    let resultText = "";
    if (percentage >= 80) {
        resultText = "You have a high level of emotional intelligence. You are very aware of your own emotions and those of others, and you are able to manage your emotions effectively.";
    } else if (percentage >= 60) {
        resultText = "You have a good level of emotional intelligence. You are generally aware of your emotions and those of others, but there is room for improvement in managing your emotions in certain situations.";
    } else if (percentage >= 40) {
        resultText = "Your emotional intelligence is developing. You may sometimes struggle to recognize and understand your own emotions and those of others. Focus on improving your self-awareness and empathy.";
    } else {
        resultText = "Your emotional intelligence needs improvement. You may often find it challenging to recognize, understand, and manage your emotions and those of others. Consider seeking resources or guidance to develop your emotional intelligence skills.";
    }

    resultContainer.innerHTML = `
        <h3>Quiz Result</h3>
        <p>${resultText}</p>
    `;
}

renderQuestion();