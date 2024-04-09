const quizForm = document.getElementById('quizForm');
const resultContainer = document.getElementById('result');

const questions = [
    {
        question: "How often do you feel overwhelmed by stress?",
        type: "multiple",
        options: [
            { text: "Never", points: 0, followUp: 1 },
            { text: "Rarely", points: 1, followUp: 1 },
            { text: "Sometimes", points: 2, followUp: 1 },
            { text: "Often", points: 3, followUp: 1 },
            { text: "Always", points: 4, followUp: 1 }
        ]
    },
    {
        question: "When stressed, do you have difficulty concentrating?",
        type: "multiple",
        options: [
            { text: "Never", points: 0, followUp: 2 },
            { text: "Rarely", points: 1, followUp: 2 },
            { text: "Sometimes", points: 2, followUp: 2 },
            { text: "Often", points: 3, followUp: 2 },
            { text: "Always", points: 4, followUp: 2 }
        ]
    },
    {
        question: "Do you feel irritable or easily frustrated when stressed?",
        type: "multiple",
        options: [
            { text: "Never", points: 0, followUp: 3 },
            { text: "Rarely", points: 1, followUp: 3 },
            { text: "Sometimes", points: 2, followUp: 3 },
            { text: "Often", points: 3, followUp: 3 },
            { text: "Always", points: 4, followUp: 3 }
        ]
    },
    {
        question: "How do you typically cope with stress?",
        type: "text",
        followUp: 4
    },
    {
        question: "What activities help you relax and reduce stress?",
        type: "text",
        followUp: 5
    },
    {
        question: "Do you have a support system to help you manage stress?",
        type: "multiple",
        options: [
            { text: "Yes, a strong support system", points: 0, followUp: 6 },
            { text: "Yes, but I could use more support", points: 2, followUp: 6 },
            { text: "No, I don't have a support system", points: 4, followUp: 6 }
        ]
    },
    {
        question: "How often do you make time for self-care and stress-reducing activities?",
        type: "multiple",
        options: [
            { text: "Regularly", points: 0, followUp: 7 },
            { text: "Occasionally", points: 2, followUp: 7 },
            { text: "Rarely", points: 3, followUp: 7 },
            { text: "Never", points: 4, followUp: 7 }
        ]
    },
    {
        question: "Are you open to seeking professional help to manage stress if needed?",
        type: "multiple",
        options: [
            { text: "Yes", points: 0, followUp: 9 },
            { text: "Maybe", points: 2, followUp: 9 },
            { text: "No", points: 4, followUp: 8 }
        ]
    },
    {
        question: "What prevents you from seeking professional help for stress management?",
        type: "text",
        followUp: 9
    },
    {
        question: "How does stress impact your sleep?",
        type: "multiple",
        options: [
            { text: "It doesn't affect my sleep", points: 0, followUp: 11 },
            { text: "I have occasional sleep disturbances", points: 2, followUp: 10 },
            { text: "I often have trouble sleeping", points: 3, followUp: 10 },
            { text: "I have chronic sleep issues due to stress", points: 4, followUp: 10 }
        ]
    },
    {
        question: "Have you tried any relaxation techniques to improve sleep?",
        type: "text",
        followUp: 11
    },
    {
        question: "How does stress affect your physical health?",
        type: "multiple",
        options: [
            { text: "It doesn't affect my physical health", points: 0, followUp: 13 },
            { text: "I experience occasional physical symptoms", points: 2, followUp: 12 },
            { text: "I have frequent physical symptoms", points: 3, followUp: 12 },
            { text: "I have chronic physical health issues due to stress", points: 4, followUp: 12 }
        ]
    },
    {
        question: "What physical symptoms do you experience when stressed?",
        type: "text",
        followUp: 13
    },
    {
        question: "How do you typically handle stressful situations at work/school?",
        type: "text",
        followUp: 14
    },
    {
        question: "Do you have any stress management techniques that work well for you?",
        type: "text",
        followUp: 15
    },
    {
        question: "How often do you take breaks during stressful periods?",
        type: "multiple",
        options: [
            { text: "Regularly", points: 0, followUp: "result" },
            { text: "Occasionally", points: 2, followUp: "result" },
            { text: "Rarely", points: 3, followUp: "result" },
            { text: "Never", points: 4, followUp: "result" }
        ]
    }
];

let currentQuestion = 0;
let totalPoints = 0;

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
        totalPoints += parseInt(selectedOption.value);
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
    let resultText = '';
    if (totalPoints <= 10) {
        resultText = 'You have excellent stress management skills.';
    } else if (totalPoints <= 20) {
        resultText = 'You have good stress management skills, but there is room for improvement.';
    } else if (totalPoints <= 30) {
        resultText = 'Your stress management skills need improvement. Consider seeking guidance or support.';
    } else {
        resultText = 'You may be struggling with stress management. It is important to seek professional help and develop coping strategies.';
    }

    resultContainer.innerHTML = `
    <h3>Quiz Result</h3>
    <p>${resultText}</p>
`;

}
//To render the initial quiz
renderQuestion();

function toggleChat() {
    var chatBox = document.getElementById('chat-box');
    var displayStatus = chatBox.style.display;
    
    if(displayStatus === 'none') {
      chatBox.style.display = 'block';
    } else {
      chatBox.style.display = 'none';
    }
  }

  function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
  
    if (message !== '') {
      const chatBoxContent = document.getElementById('chat-box-content');
      const userMessage = document.createElement('div');
      userMessage.classList.add('user-message');
      userMessage.textContent = message;
      chatBoxContent.appendChild(userMessage);
      chatBoxContent.scrollTop = chatBoxContent.scrollHeight; // Scroll to the bottom
  
      userInput.value = '';
  
      fetch('http://127.0.0.1:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    })  
      .then(response => response.json())
      .then(data => {
        const botMessage = document.createElement('div');
        botMessage.classList.add('bot-message');
        botMessage.textContent = data.advice;
        chatBoxContent.appendChild(botMessage);
        chatBoxContent.scrollTop = chatBoxContent.scrollHeight; // Scroll to the bottom
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }
  