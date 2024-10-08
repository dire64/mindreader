import React, { useState } from "react";
import "../assets/quiz.css";
import Header from "./header";
import Footer from "./footer";

const quizQuestions = [
  {
    question: "How often do you feel overwhelmed by stress?",
    type: "multiple",
    options: [
      { text: "Never", points: 0, followUp: 1 },
      { text: "Rarely", points: 1, followUp: 1 },
      { text: "Sometimes", points: 2, followUp: 1 },
      { text: "Often", points: 3, followUp: 1 },
      { text: "Always", points: 4, followUp: 1 },
    ],
  },
  {
    question: "When stressed, do you have difficulty concentrating?",
    type: "multiple",
    options: [
      { text: "Never", points: 0, followUp: 2 },
      { text: "Rarely", points: 1, followUp: 2 },
      { text: "Sometimes", points: 2, followUp: 2 },
      { text: "Often", points: 3, followUp: 2 },
      { text: "Always", points: 4, followUp: 2 },
    ],
  },
  {
    question: "How do you typically cope with stress?",
    type: "text",
    followUp: 4,
  },
  {
    question: "What activities help you relax and reduce stress?",
    type: "text",
    followUp: 5,
  },
  {
    question:
      "What prevents you from seeking professional help for stress management?",
    type: "text",
    followUp: 9,
  },
  {
    question: "How does stress impact your sleep?",
    type: "multiple",
    options: [
      { text: "It doesn't affect my sleep", points: 0, followUp: 11 },
      { text: "I have occasional sleep disturbances", points: 2, followUp: 10 },
      { text: "I often have trouble sleeping", points: 3, followUp: 10 },
      {
        text: "I have chronic sleep issues due to stress",
        points: 4,
        followUp: 10,
      },
    ],
  },
  {
    question: "Have you tried any relaxation techniques to improve sleep?",
    type: "text",
    followUp: 11,
  },
  {
    question: "How does stress affect your physical health?",
    type: "multiple",
    options: [
      { text: "It doesn't affect my physical health", points: 0, followUp: 13 },
      {
        text: "I experience occasional physical symptoms",
        points: 2,
        followUp: 12,
      },
      { text: "I have frequent physical symptoms", points: 3, followUp: 12 },
      {
        text: "I have chronic physical health issues due to stress",
        points: 4,
        followUp: 12,
      },
    ],
  },
  {
    question: "What physical symptoms do you experience when stressed?",
    type: "text",
    followUp: "result",
  },
];

const Quiz1 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleTextChange = (event) => {
    setTextAnswer(event.target.value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    const question = quizQuestions[currentQuestion];

    // Handle "multiple" type questions
    if (question.type === "multiple") {
      if (selectedOption) {
        const points = parseInt(selectedOption);
        const followUp = quizQuestions[currentQuestion].options.find(
          (opt) => opt.points === points
        ).followUp;

        setTotalPoints((prevPoints) => prevPoints + points);
        handleFollowUp(followUp);
        setSelectedOption(null); 
      } else {
        alert("Please select an option.");
      }
    }

    // Handle "text" type questions
    if (question.type === "text") {
      if (textAnswer.trim() !== "") {
        handleFollowUp(question.followUp);
        setTextAnswer(""); 
      } else {
        alert("Please enter your answer.");
      }
    }
  };

  const handleFollowUp = (followUp) => {
    if (followUp === "result") {
      setQuizCompleted(true);
    } else if (followUp < quizQuestions.length) {
      setCurrentQuestion(parseInt(followUp));
    } else {
      console.error("Invalid followUp value: ", followUp);
    }
  };

  const renderQuestion = () => {
    const question = quizQuestions[currentQuestion];

    if (question.type === "multiple") {
      return question.options.map((option, index) => (
        <label key={index}>
          <input
            type="radio"
            name="answer"
            value={option.points}
            checked={selectedOption === option.points.toString()}
            onChange={handleOptionChange}
          />
          {option.text}
        </label>
      ));
    } else if (question.type === "text") {
      return (
        <input
          type="text"
          value={textAnswer}
          onChange={handleTextChange}
          placeholder="Enter your answer"
        />
      );
    }
  };

  const renderResult = () => {
    let resultText = "";
    if (totalPoints <= 10) {
      resultText = "You have excellent stress management skills.";
    } else if (totalPoints <= 20) {
      resultText =
        "You have good stress management skills, but there is room for improvement.";
    } else if (totalPoints <= 30) {
      resultText =
        "Your stress management skills need improvement. Consider seeking guidance or support.";
    } else {
      resultText =
        "You may be struggling with stress management. It is important to seek professional help and develop coping strategies.";
    }

    return (
      <div>
        <h3>Quiz Result</h3>
        <p>{resultText}</p>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <div className="quiz-container">
        <div className="quiz-box">
          {quizCompleted ? (
            renderResult()
          ) : (
            <div>
              <h3>{quizQuestions[currentQuestion].question}</h3>
              {renderQuestion()}
              <button type="button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Quiz1;
