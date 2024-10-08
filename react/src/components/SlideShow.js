import React, { useState, useEffect } from 'react';
import Therapy from '../assets/Therapy.jpg';
import Question from '../assets/Question.jpg';
import Forum from '../assets/forum.jpg';
import '../assets/SlideShow.css'

const Slideshow = () => {
  const [slideIndex, setSlideIndex] = useState(1); // State to track current slide

  const slides = [
    { img: Therapy, alt: 'Therapy Session', text: 'Therapy Helps' },
    { img: Question, alt: 'Questionnaire', text: 'Discover Your Path' },
    { img: Forum, alt: 'Support Forum', text: 'Join the Community' }
  ];

  // Show the slides based on the index
  const showSlides = (n) => {
    if (n > slides.length) setSlideIndex(1);
    else if (n < 1) setSlideIndex(slides.length);
    else setSlideIndex(n);
  };

  // Function to handle next/previous navigation
  const plusSlides = (n) => {
    showSlides(slideIndex + n);
  };

  // Function to go to a specific slide
  const currentSlide = (n) => {
    showSlides(n);
  };

  useEffect(() => {
    // Auto slide every 5 seconds
    const interval = setInterval(() => {
      plusSlides(1);
    }, 5000);
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [slideIndex]); // Dependency on slideIndex

  return (
    <div className="slideshow-container">
      {slides.map((slide, index) => (
        <div
          key={index}
          className="mySlides fade"
          style={{ display: index + 1 === slideIndex ? 'block' : 'none' }}
        >
          <img src={slide.img} alt={slide.alt} />
          <div className="text">{slide.text}</div>
        </div>
      ))}

      <a className="prev" onClick={() => plusSlides(-1)}>
        &#10094;
      </a>
      <a className="next" onClick={() => plusSlides(1)}>
        &#10095;
      </a>

      <div className="progress-bar"></div>

      <br />
      <div className="dot-container">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index + 1 === slideIndex ? 'active' : ''}`}
            onClick={() => currentSlide(index + 1)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
