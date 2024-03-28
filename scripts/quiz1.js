// Quiz data and logic
const quizData = [
    {
        text: 'Are you often overwhelmed by stress?',
        type: 'multiple-choice',
        options: ['Rarely', 'Sometimes', 'Often', 'Constantly'],
        nextQuestion: {
            'Rarely': 2,
            'Sometimes': 3,
            'Often': 4,
            'Constantly': 5
        }
    },
    {
        text: 'Understood. Would you like to share any tips or techniques that work for you?',
        type: 'text',
        nextQuestion: 16
    },
    {
        text: 'Do you practice any stress management techniques like meditation, yoga, or deep breathing exercises?',
        type: 'multiple-choice',
        options: ['Yes', 'No'],
        nextQuestion: {
            'Yes': 6,
            'No': 7
        }
    },
    {
        text: 'What are your typical stress triggers?',
        type: 'text',
        nextQuestion: 8
    },
    {
        text: 'Have you tried stress-relieving activities, such as exercise, mindfulness practices, or hobbies?',
        type: 'multiple-choice',
        options: ['Yes', 'No'],
        nextQuestion: {
            'Yes': 9,
            'No': 10
        }
    },
    {
        text: 'It is understandable to feel overwhelmed by stress frequently. Would you be interested in learning some effective anti-stress techniques?',
        type: 'multiple-choice',
        options: ['Yes', 'No'],
        nextQuestion: {
            'Yes': 11,
            'No': 12
        }
    },
    {
        text: 'Can you share what techniques have been most helpful for you in managing stress? Its alright if you dont have any.',
        type: 'text',
        nextQuestion: 16
    },
    {
        text: ' Would you be interested in learning some effective stress management strategies?',
        type: 'multiple-choice',
        options: ['Yes', 'No'],
        nextQuestion: {
            'Yes': 11,
            'No': 12
        }
    },
    {
        text: 'Identifying your stress triggers is the first step towards managing stress effectively. Based on your response, it seems like [insert stress triggers] are significant sources of stress for you. Would you like some suggestions on how to better manage stress related to these areas?',
        type: 'multiple-choice',
        options: ['Yes', 'No'],
        nextQuestion: {
            'Yes': 13,
            'No': 14
        }
    },
    {
        text: 'Thats great! Can you share what activities or hobbies have been most helpful for you in managing stress?',
        type: 'text',
        nextQuestion: 16
    },
    {
        text: 'Its important to find healthy ways to manage stress before it becomes overwhelming. Do you have some ways of dealing with stress',
        type: 'multiple-choice',
        options: ['Yes', 'No'],
        nextQuestion: {
            'Yes': 15,
            'No': 16
        }
    },
    {
        text: 'It might be hard to learn new techniques, but managing stress is crucial for overall well-being. Would you be open to learning more about how to get started?',
        type: 'multiple-choice',
        options: ['Yes', 'No'],
        nextQuestion: {
            'Yes': 15,
            'No': 16
        }
    },
    {
        text: ' Let us know if you would like any additional resources or support in managing stress',
        type: 'text',
        nextQuestion: 16
    },
    {
        text: 'Thank you for sharing your voice! Your feedback will help us provide better resources and support for stress management. Please leave your email address if you would like to receive more help.',
        type: 'email'
    },
    {
        text: 'Thank you for completing the quiz. We appreciate your participation.',
        type: 'feedback'
    }
];

let currentQuestionIndex = 0;

// Here's the function to render a question
function renderQuestion(question) {
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('question');

    const questionText = document.createElement('h3');
    questionText.textContent = question.text;

    const answerOptions = document.createElement('div');
    answerOptions.classList.add('answer-options');

    if (question.type === 'multiple-choice') {
        question.options.forEach(option => {
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = `question-${currentQuestionIndex}`;
            radioInput.value = option;

            const label = document.createElement('label');
            label.textContent = option;
            label.prepend(radioInput);

            answerOptions.appendChild(label);
        });
    } else if (question.type === 'text') {
        const textInput = document.createElement('input');
        textInput.type = 'text';
        answerOptions.appendChild(textInput);
    }

    questionContainer.appendChild(questionText);
    questionContainer.appendChild(answerOptions);

    return questionContainer;
}

// Function to render the whole quiz
function renderQuiz() {
    const quizForm = document.getElementById('quizForm');
    quizForm.innerHTML = ''; // Clear previous questions

    const questionElement = renderQuestion(quizData[currentQuestionIndex]);
    quizForm.appendChild(questionElement);

    if (quizData[currentQuestionIndex].type !== 'email') {
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Next';
        submitBtn.classList.add('submit-btn');
        submitBtn.addEventListener('click', handleSubmit);
        quizForm.appendChild(submitBtn);
    }
}

// Function to handle quiz submission
function handleSubmit(e) {
    e.preventDefault();

    const currentQuestion = quizData[currentQuestionIndex];
    const userResponse = getUserResponse(currentQuestion);

    if (!userResponse && (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'text')) {
        alert('Please answer the current question before moving to the next one.');
        return;
    }

    if (currentQuestion.type === 'email') {
        const resultContainer = document.getElementById('result');
        resultContainer.innerHTML = '';

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.placeholder = 'Enter your email';

        const emailLabel = document.createElement('label');
        emailLabel.textContent = currentQuestion.text;
        emailLabel.appendChild(emailInput);

        resultContainer.appendChild(emailLabel);
    } else {
        const nextQuestionIndex = getNextQuestionIndex(currentQuestion, userResponse);
        currentQuestionIndex = nextQuestionIndex;
        renderQuiz();
    }
}

// Function to get the user's response for the current question
function getUserResponse(question) {
    if (question.type === 'multiple-choice') {
        const radioInputs = document.querySelectorAll(`input[name="question-${currentQuestionIndex}"]:checked`);
        return radioInputs[0]?.value;
    } else if (question.type === 'text') {
        const textInput = document.querySelector(`input[type="text"]`);
        return textInput.value;
    }
}

// Function to get the next question index based on the user's response
function getNextQuestionIndex(question, userResponse) {
    if (question.nextQuestion) {
        if (typeof question.nextQuestion === 'object') {
            return question.nextQuestion[userResponse] || 16;
        } else {
            return question.nextQuestion;
        }
    }
    return 16;
}

//To render the initial quiz
renderQuiz();

function toggleChat() {
    var chatBox = document.getElementById('chat-box');
    var displayStatus = chatBox.style.display;
    
    if(displayStatus === 'none') {
      chatBox.style.display = 'block';
    } else {
      chatBox.style.display = 'none';
    }
  }