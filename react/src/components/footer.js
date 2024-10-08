import React from "react";
import "../assets/footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer">&copy; 2024, All rights reserved. MindReader</div>
    </footer>
  );
};

const App = () => {
  return (
    <div id="page-container">
      <div id="content-wrap">{/* Your page content goes here */}</div>
      <Footer />
    </div>
  );
};

export default App;
