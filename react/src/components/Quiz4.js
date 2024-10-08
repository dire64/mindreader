import React, { useState } from "react";
import "../assets/quiz.css";
import Header from "./header";
import Footer from "./footer";

const questions = [
  {
    question: "How often do you take time for yourself each week?",
    type: "multiple",
    options: [
      { text: "Rarely or never", points: 1, followUp: 1 },
      { text: "1-2 times a week", points: 2, followUp: 1 },
      { text: "3-4 times a week", points: 3, followUp: 1 },
      { text: "Almost every day", points: 4, followUp: 1 },
    ],
  },
  {
    question: "When you feel overwhelmed, how do you respond?",
    type: "multiple",
    options: [
      { text: "Ignore my feelings and push through", points: 1, followUp: 2 },
      {
        text: "Take a break and engage in a relaxing activity",
        points: 4,
        followUp: 2,
      },
      { text: "Talk to someone about how I feel", points: 3, followUp: 2 },
      { text: "Become frustrated and irritable", points: 1, followUp: 2 },
    ],
  },
  {
    question: "Do you prioritize physical activity in your routine?",
    type: "multiple",
    options: [
      { text: "Not at all", points: 1, followUp: 3 },
      { text: "Sometimes", points: 2, followUp: 3 },
      { text: "Regularly", points: 3, followUp: 3 },
      { text: "Daily", points: 4, followUp: 3 },
    ],
  },
  {
    question: "How often do you engage in activities that bring you joy?",
    type: "multiple",
    options: [
      { text: "Rarely", points: 1, followUp: 4 },
      { text: "Occasionally", points: 2, followUp: 4 },
      { text: "Often", points: 3, followUp: 4 },
      { text: "All the time", points: 4, followUp: 4 },
    ],
  },
  {
    question: "How do you manage your stress levels?",
    type: "multiple",
    options: [
      {
        text: "I don’t manage my stress effectively",
        points: 1,
        followUp: "result",
      },
      {
        text: "I try some methods but they don’t always work",
        points: 2,
        followUp: "result",
      },
      {
        text: "I have effective strategies I use",
        points: 3,
        followUp: "result",
      },
      {
        text: "I have a solid routine that works well for me",
        points: 4,
        followUp: "result",
      },
    ],
  },
];

const Quiz4 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    const question = questions[currentQuestion];

    if (question.type === "multiple") {
      if (selectedOption) {
        const points = parseInt(selectedOption);
        const followUp = question.options.find(
          (opt) => opt.points === points
        ).followUp;

        setTotalPoints((prevPoints) => prevPoints + points);
        handleFollowUp(followUp);
        setSelectedOption(null); // Reset selected option after submission
      } else {
        alert("Please select an option.");
      }
    }
  };

  const handleFollowUp = (followUp) => {
    if (followUp === "result") {
      setQuizCompleted(true);
    } else if (followUp < questions.length) {
      setCurrentQuestion(parseInt(followUp));
    } else {
      console.error("Invalid followUp value: ", followUp);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];

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
  };

  const renderResult = () => {
    let resultText = "";
    if (totalPoints <= 5) {
      resultText = "You may need to prioritize self-care more in your life.";
    } else if (totalPoints <= 10) {
      resultText =
        "You practice some self-care but there's room for improvement.";
    } else if (totalPoints <= 15) {
      resultText = "You take good care of yourself, keep it up!";
    } else {
      resultText =
        "You excel in self-care practices; you clearly value your well-being.";
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
              <h3>{questions[currentQuestion].question}</h3>
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

export default Quiz4;
