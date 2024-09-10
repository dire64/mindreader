const questions = [
    {
        question: "Do you feel comfortable sharing your thoughts and feelings with your friend?",
        type: "multiple",
        options: [
            { text: "Always", points: 4, followUp: 1 },
            { text: "Often", points: 3, followUp: 1 },
            { text: "Sometimes", points: 2, followUp: 1 },
            { text: "Rarely", points: 1, followUp: 1 },
            { text: "Never", points: 0, followUp: 1 }
        ]
    },
    {
        question: "Does your friend actively listen to you and show genuine interest in your life?",
        type: "multiple",
        options: [
            { text: "Always", points: 4, followUp: 2 },
            { text: "Often", points: 3, followUp: 2 },
            { text: "Sometimes", points: 2, followUp: 2 },
            { text: "Rarely", points: 1, followUp: 2 },
            { text: "Never", points: 0, followUp: 2 }
        ]
    },
    {
        question: "Do you and your friend support each other during difficult times?",
        type: "multiple",
        options: [
            { text: "Always", points: 4, followUp: 3 },
            { text: "Often", points: 3, followUp: 3 },
            { text: "Sometimes", points: 2, followUp: 3 },
            { text: "Rarely", points: 1, followUp: 3 },
            { text: "Never", points: 0, followUp: 3 }
        ]
    },
    {
        question: "Can you trust your friend to keep your secrets and maintain your privacy?",
        type: "multiple",
        options: [
            { text: "Always", points: 4, followUp: 4 },
            { text: "Often", points: 3, followUp: 4 },
            { text: "Sometimes", points: 2, followUp: 4 },
            { text: "Rarely", points: 1, followUp: 4 },
            { text: "Never", points: 0, followUp: 4 }
        ]
    },
    {
        question: "Do you and your friend respect each other's boundaries and opinions, even when you disagree?",
        type: "multiple",
        options: [
            { text: "Always", points: 4, followUp: 5 },
            { text: "Often", points: 3, followUp: 5 },
            { text: "Sometimes", points: 2, followUp: 5 },
            { text: "Rarely", points: 1, followUp: 5 },
            { text: "Never", points: 0, followUp: 5 }
        ]
    },
    {
        question: "Do you and your friend make an effort to spend quality time together?",
        type: "multiple",
        options: [
            { text: "Always", points: 4, followUp: 6 },
            { text: "Often", points: 3, followUp: 6 },
            { text: "Sometimes", points: 2, followUp: 6 },
            { text: "Rarely", points: 1, followUp: 6 },
            { text: "Never", points: 0, followUp: 6 }
        ]
    },
    {
        question: "Do you feel appreciated and valued by your friend?",
        type: "multiple",
        options: [
            { text: "Always", points: 4, followUp: 7 },
            { text: "Often", points: 3, followUp: 7 },
            { text: "Sometimes", points: 2, followUp: 7 },
            { text: "Rarely", points: 1, followUp: 7 },
            { text: "Never", points: 0, followUp: 7 }
        ]
    },
    {
        question: "Are you and your friend able to resolve conflicts in a healthy and respectful manner?",
        type: "multiple",
        options: [
            { text: "Always", points: 4, followUp: "result" },
            { text: "Often", points: 3, followUp: "result" },
            { text: "Sometimes", points: 2, followUp: "result" },
            { text: "Rarely", points: 1, followUp: "result" },
            { text: "Never", points: 0, followUp: "result" }
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
        resultText = "Your friendship is very healthy! You and your friend have a strong, supportive, and trustworthy relationship.";
    } else if (percentage >= 60) {
        resultText = "Your friendship is generally healthy, but there may be some areas that could be improved to strengthen your bond.";
    } else if (percentage >= 40) {
        resultText = "Your friendship has some challenges. It's important to work on communication, trust, and support to enhance your relationship.";
    } else {
        resultText = "Your friendship seems to be struggling. It may be beneficial to have an open and honest conversation with your friend to address any issues and find ways to improve your connection.";
    }

    resultContainer.innerHTML = `
        <h3>Quiz Result</h3>
        <p>${resultText}</p>
    `;
}

// To render the initial quiz
renderQuestion();