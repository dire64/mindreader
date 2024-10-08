import React, { useState } from "react";
import "../assets/quiz.css";
import Header from "./header";
import Footer from "./footer";

const questions = [
  {
    question: "When you're feeling stressed, you tend to:",
    type: "multiple",
    options: [
      { text: "Ignore your feelings and push through", points: 1, followUp: 1 },
      {
        text: "Take a moment to acknowledge your stress and find ways to manage it",
        points: 4,
        followUp: 1,
      },
      {
        text: "Become overwhelmed and struggle to cope",
        points: 2,
        followUp: 1,
      },
      { text: "Lash out at others due to your stress", points: 1, followUp: 1 },
    ],
  },
  {
    question: "When someone shares a problem with you, you usually:",
    type: "multiple",
    options: [
      { text: "Listen attentively and show empathy", points: 4, followUp: 2 },
      {
        text: "Offer advice without fully understanding their perspective",
        points: 2,
        followUp: 2,
      },
      {
        text: "Change the subject to avoid the conversation",
        points: 1,
        followUp: 2,
      },
      { text: "Judge them for their problem", points: 1, followUp: 2 },
    ],
  },
  {
    question: "In a challenging situation, you typically:",
    type: "multiple",
    options: [
      {
        text: "Remain calm and assess the situation objectively",
        points: 4,
        followUp: 3,
      },
      {
        text: "Become anxious and have difficulty thinking clearly",
        points: 2,
        followUp: 3,
      },
      {
        text: "React impulsively without considering the consequences",
        points: 1,
        followUp: 3,
      },
      { text: "Blame others for the situation", points: 1, followUp: 3 },
    ],
  },
  {
    question: "When you're in an argument with someone, you usually:",
    type: "multiple",
    options: [
      {
        text: "Listen to their perspective and try to find a compromise",
        points: 4,
        followUp: 4,
      },
      { text: "Focus solely on proving your point", points: 2, followUp: 4 },
      {
        text: "Become defensive and dismiss their opinions",
        points: 1,
        followUp: 4,
      },
      { text: "Resort to personal attacks or insults", points: 1, followUp: 4 },
    ],
  },
  {
    question: "When you receive constructive criticism, you tend to:",
    type: "multiple",
    options: [
      {
        text: "Reflect on the feedback and see it as an opportunity for growth",
        points: 4,
        followUp: "result",
      },
      {
        text: "Feel slightly discouraged but try to learn from it",
        points: 3,
        followUp: "result",
      },
      {
        text: "Become defensive and dismiss the criticism",
        points: 2,
        followUp: "result",
      },
      {
        text: "Take it as a personal attack and hold a grudge",
        points: 1,
        followUp: "result",
      },
    ],
  },
];

const Quiz3 = () => {
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
      resultText = "You have a challenging relationship with stress.";
    } else if (totalPoints <= 10) {
      resultText = "You manage stress reasonably well but can improve.";
    } else if (totalPoints <= 15) {
      resultText = "You have a good approach to stress management.";
    } else {
      resultText = "You excel at managing stress and supporting others.";
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

export default Quiz3;
