import React, { useState } from "react";
import "../assets/quiz.css";
import Header from "./header";
import Footer from "./footer";

const quiz2Questions = [
  {
    question:
      "Do you feel comfortable sharing your thoughts and feelings with your friend?",
    type: "multiple",
    options: [
      { text: "Always", points: 4, followUp: 1 },
      { text: "Often", points: 3, followUp: 1 },
      { text: "Sometimes", points: 2, followUp: 1 },
      { text: "Rarely", points: 1, followUp: 1 },
      { text: "Never", points: 0, followUp: 1 },
    ],
  },
  {
    question:
      "Does your friend actively listen to you and show genuine interest in your life?",
    type: "multiple",
    options: [
      { text: "Always", points: 4, followUp: 2 },
      { text: "Often", points: 3, followUp: 2 },
      { text: "Sometimes", points: 2, followUp: 2 },
      { text: "Rarely", points: 1, followUp: 2 },
      { text: "Never", points: 0, followUp: 2 },
    ],
  },
  {
    question:
      "Do you and your friend support each other during difficult times?",
    type: "multiple",
    options: [
      { text: "Always", points: 4, followUp: 3 },
      { text: "Often", points: 3, followUp: 3 },
      { text: "Sometimes", points: 2, followUp: 3 },
      { text: "Rarely", points: 1, followUp: 3 },
      { text: "Never", points: 0, followUp: 3 },
    ],
  },
  {
    question:
      "Can you trust your friend to keep your secrets and maintain your privacy?",
    type: "multiple",
    options: [
      { text: "Always", points: 4, followUp: 4 },
      { text: "Often", points: 3, followUp: 4 },
      { text: "Sometimes", points: 2, followUp: 4 },
      { text: "Rarely", points: 1, followUp: 4 },
      { text: "Never", points: 0, followUp: 4 },
    ],
  },
  {
    question:
      "Do you and your friend respect each other's boundaries and opinions, even when you disagree?",
    type: "multiple",
    options: [
      { text: "Always", points: 4, followUp: 5 },
      { text: "Often", points: 3, followUp: 5 },
      { text: "Sometimes", points: 2, followUp: 5 },
      { text: "Rarely", points: 1, followUp: 5 },
      { text: "Never", points: 0, followUp: 5 },
    ],
  },
  {
    question:
      "Do you and your friend make an effort to spend quality time together?",
    type: "multiple",
    options: [
      { text: "Always", points: 4, followUp: 6 },
      { text: "Often", points: 3, followUp: 6 },
      { text: "Sometimes", points: 2, followUp: 6 },
      { text: "Rarely", points: 1, followUp: 6 },
      { text: "Never", points: 0, followUp: 6 },
    ],
  },
  {
    question: "Do you feel appreciated and valued by your friend?",
    type: "multiple",
    options: [
      { text: "Always", points: 4, followUp: 7 },
      { text: "Often", points: 3, followUp: 7 },
      { text: "Sometimes", points: 2, followUp: 7 },
      { text: "Rarely", points: 1, followUp: 7 },
      { text: "Never", points: 0, followUp: 7 },
    ],
  },
  {
    question:
      "Are you and your friend able to resolve conflicts in a healthy and respectful manner?",
    type: "multiple",
    options: [
      { text: "Always", points: 4, followUp: "result" },
      { text: "Often", points: 3, followUp: "result" },
      { text: "Sometimes", points: 2, followUp: "result" },
      { text: "Rarely", points: 1, followUp: "result" },
      { text: "Never", points: 0, followUp: "result" },
    ],
  },
];

const Quiz2 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    const question = quiz2Questions[currentQuestion];

    if (question.type === "multiple") {
      if (selectedOption) {
        const points = parseInt(selectedOption);
        const followUp = quiz2Questions[currentQuestion].options.find(
          (opt) => opt.points === points
        ).followUp;

        setTotalPoints((prevPoints) => prevPoints + points);
        handleFollowUp(followUp);
        setSelectedOption(null);
      } else {
        alert("Please select an option.");
      }
    }
  };

  const handleFollowUp = (followUp) => {
    if (followUp === "result") {
      setQuizCompleted(true);
    } else if (followUp < quiz2Questions.length) {
      setCurrentQuestion(parseInt(followUp));
    } else {
      console.error("Invalid followUp value: ", followUp);
    }
  };

  const renderQuestion = () => {
    const question = quiz2Questions[currentQuestion];

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
    if (totalPoints >= 28) {
      resultText = "You have a strong and healthy friendship.";
    } else if (totalPoints >= 20) {
      resultText = "You have a good friendship, but there is room for growth.";
    } else if (totalPoints >= 10) {
      resultText =
        "Your friendship may need work. Consider discussing ways to strengthen your bond.";
    } else {
      resultText =
        "Your friendship could use improvement. Open communication and understanding can help.";
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
              <h3>{quiz2Questions[currentQuestion].question}</h3>
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

export default Quiz2;
