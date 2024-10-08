import React, { useState } from "react";
import "../assets/wiki.css";
import Header from "../components/header";
import Footer from "../components/footer";
import stress from "../assets/stress.jpg";
import Meditation from "../assets/Meditation.jpg";
import Anxiety from "../assets/Anxiety.jpg";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Wiki = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault(); 
    if (searchTerm.trim()) {
      const wikiSearchUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(
        searchTerm
      )}`;
      window.open(wikiSearchUrl, "_blank"); 
    }
  };

  return (
    <main>
      <Header />
      <section className="wiki-intro">
        <h1>Welcome to the MindReader Wiki</h1>
        <p>
          Explore articles on mental health topics, definitions, strategies, or
          find resources to help you learn and grow.
        </p>
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search Wikipedia"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </section>

      <section className="wiki-categories">
        <h2>Wiki Categories</h2>
        <div className="categories-list">
          <article className="category">
            <i className="fas fa-brain fa-3x"></i>
            <h3>Understanding Mental Health</h3>
            <p>
              Mental health affects us all. Learn how it impacts the human body
              and how to take care of it.
            </p>
            <a
              href="https://cmha.ca/brochure/fast-facts-about-mental-illness/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Category <i className="fas fa-arrow-right"></i>
            </a>
          </article>
          <article className="category">
            <i className="fas fa-heartbeat fa-3x"></i>
            <h3>Self-Care Strategies</h3>
            <p>
              Discover effective self-care techniques to improve your mental
              well-being and manage stress.
            </p>
            <a
              href="https://www.snhu.edu/about-us/newsroom/health/what-is-self-care"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Category <i className="fas fa-arrow-right"></i>
            </a>
          </article>
          <article className="category">
            <i className="fas fa-hands-helping fa-3x"></i>
            <h3>Support & Resources</h3>
            <p>
              Find support groups, helplines, and resources for addressing
              mental health challenges.
            </p>
            <a
              href="https://ontario.cmha.ca/provincial-mental-health-supports/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Category <i className="fas fa-arrow-right"></i>
            </a>
          </article>
        </div>
      </section>

      <section className="featured-articles">
        <h2>Featured Articles</h2>
        <div className="articles-grid">
          <article className="article-preview">
            <img
              src={stress}
              alt="Stress Management"
              width="100%"
              height="auto"
            />
            <div className="article-content">
              <h3>Managing Stress</h3>
              <p>
                Learn effective techniques to manage day-to-day stress and
                improve your wellbeing.
              </p>
              <a href="https://www.verywellmind.com/tips-to-reduce-stress-3145195">
                Read More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </article>
          <article className="article-preview">
            <img
              src={Anxiety}
              alt="Understanding Anxiety"
              width="100%"
              height="auto"
            />
            <div className="article-content">
              <h3>Understanding Anxiety</h3>
              <p>
                Gain insights into the symptoms, causes, and treatments for
                anxiety disorders.
              </p>
              <a href="https://www.verywellmind.com/anxiety-disorder-2510539">
                Read More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </article>
          <article className="article-preview">
            <img
              src={Meditation}
              alt="Mindfulness Meditation"
              width="100%"
              height="auto"
            />
            <div className="article-content">
              <h3>Mindfulness Meditation</h3>
              <p>
                Discover the benefits of mindfulness and learn how to
                incorporate it into your daily life.
              </p>
              <a href="https://www.verywellmind.com/mindfulness-the-health-and-stress-relief-benefits-3145189">
                Read More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </article>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Wiki;
