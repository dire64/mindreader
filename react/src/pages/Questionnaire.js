import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import Chatbot from "../components/Chatbot";
import quiz1 from "../assets/quiz1.jpg";
import quiz2 from "../assets/quiz2.jpg";
import quiz3 from "../assets/quiz3.jpg";
import quiz4 from "../assets/quiz4.jpg";
import "../assets/questionare.css";
import Quiz from "../components/Quiz1";

export default function Questionnaire() {
  return (
    <>
      <Header />
      <section className="quiz-selection">
        <div className="quiz-container">
          <Link to="/Quiz1">
            <img src={quiz1} alt="How well do you manage stress?" />

            <h3>How well do you manage stress?</h3>
          </Link>
        </div>

        <div className="quiz-container">
          <Link to="/Quiz2">
            <img src={quiz2} alt="How healthy is your friendship?" />
            <h3>How healthy is your friendship?</h3>
          </Link>
        </div>

        <div className="quiz-container">
          <Link to="/Quiz3">
            <img src={quiz3} alt="Test your emotional intelligence" />
            <h3>Test your emotional intelligence</h3>
          </Link>
        </div>

        <div className="quiz-container">
          <Link to="/Quiz4">
            <img src={quiz4} alt="Do you practice enough self-care?" />
            <h3>Do you practice enough self-care?</h3>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
