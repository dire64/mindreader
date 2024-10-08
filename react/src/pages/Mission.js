import React from "react";
import "../assets/mission.css"; // Link to your CSS file
import Header from "../components/header";
import Footer from "../components/footer";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Mission = () => {
  return (
    <>
      <Header />
      <div className="mission-page">
        {/* Introduction Section */}
        <section className="intro-section">
          <div className="content">
            <h1>Our Mission</h1>
            <p>
              Mental health is just as important as physical health, but
              unfortunately, it doesn't always receive the same attention. Our
              mission is to raise awareness, provide resources, and help
              individuals prioritize their mental well-being. We believe that
              every person deserves to feel supported, heard, and understood,
              regardless of the challenges they face.
            </p>
          </div>
        </section>

        {/* Vision and Goals Section */}
        <section className="vision-section">
          <div className="content">
            <h2>Our Vision</h2>
            <p>
              We envision a world where mental health care is accessible to all,
              and where discussing mental health issues is normalized and free
              from stigma. Our goal is to foster a culture of openness, empathy,
              and support that empowers individuals to speak up and seek help
              when needed.
            </p>

            <div className="goals">
              <h3>Our Goals</h3>
              <p>
                Promote the importance of mental health and emotional
                well-being.
              </p>
              <p>
                Create safe spaces for discussions about mental health
                challenges.
              </p>
              <p>
                Support individuals on their journey to mental wellness by
                offering resources and guidance.
              </p>
              <p>
                Advocate for mental health awareness in schools, workplaces, and
                communities.
              </p>
            </div>
          </div>
        </section>

        {/* Key Focus Areas */}
        <section className="focus-areas-section">
          <div className="content">
            <h2>Key Focus Areas</h2>
            <p>
              Our approach to mental health awareness is comprehensive,
              addressing multiple dimensions to support individuals on their
              mental health journey:
            </p>
            <div className="focus-areas">
              <h3>1. Education and Awareness</h3>
              <p>
                We provide educational content that helps people better
                understand mental health, including common mental health
                conditions, coping strategies, and ways to support loved ones.
                Our aim is to spread accurate, accessible information and dispel
                myths that contribute to stigma.
              </p>

              <h3>2. Emotional Support</h3>
              <p>
                Everyone needs a support system. We connect individuals with
                resources, peer support groups, and helplines that can offer
                emotional assistance during tough times. We believe that
                reaching out for help is a sign of strength, not weakness.
              </p>

              <h3>3. Professional Help</h3>
              <p>
                In addition to peer support, we believe in the importance of
                professional mental health services. We aim to make it easier
                for people to access counseling, therapy, and other professional
                resources by providing guidance and information on how to seek
                help.
              </p>

              <h3>4. Community and Advocacy</h3>
              <p>
                We collaborate with organizations and communities to advocate
                for mental health policy changes and improved mental health care
                systems. Together, we can build a world where mental health is
                treated with the same urgency and care as physical health.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
  <div className="content">
    <h2>Get Involved</h2>
    <p>
      Whether you're someone who is passionate about mental health or someone in need of support, 
      you can make a difference. Join us in spreading awareness, advocating for mental health policies, 
      or contributing your time and skills to support our cause. Every step taken toward breaking the stigma matters.
    </p>
    <button 
      className="cta-button" 
      onClick={() => window.location.href = '/forum'}
    >
      Learn More
    </button>
  </div>
</section>


        {/* Footer Section */}
        <footer className="footer-section">
          <div className="content">
            <p>
              Follow us on social media for more updates on mental health
              awareness.
            </p>
            <div className="social-media-buttons">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-button instagram"
              >
                <i className="fab fa-instagram" style={{paddingRight: 5 + 'px'}}></i> Instagram
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-button facebook"
              >
                <i className="fab fa-facebook" style={{paddingRight: 5 + 'px'}}></i> Facebook
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-button twitter"
              >
                <i className="fab fa-twitter" style={{paddingRight: 5 + 'px'}}></i> Twitter
              </a>
            </div>
          </div>
        </footer>
      </div>
      <Footer />
    </>
  );
};

export default Mission;
