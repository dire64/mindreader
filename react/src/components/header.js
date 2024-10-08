import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import logo from "../assets/logo.png";
import "../assets/header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage the menu toggle
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown toggle

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle mobile menu
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown for mobile
  };

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link to="/" className="logo">
          <img src={logo} alt="MindReader Logo" height="32px" />
        </Link>

        {/* Hamburger button for mobile */}
        <button className="hamburger" onClick={toggleMenu}>
          &#9776; {/* Hamburger icon */}
        </button>

        {/* Navbar links with conditional rendering */}
        <div className={`navbar-links ${isOpen ? "open" : ""}`}>
          <div className="dropdown">
            <button
              className="dropbtn"
              onClick={toggleDropdown} /* Add click event for mobile */
            >
              Get Help
            </button>
            {/* Conditionally render dropdown menu based on the state */}
            <div
              className={`dropdown-content ${
                isDropdownOpen ? "show" : ""
              }`} /* Show only if dropdown is open */
            >
              <Link to="/questionnaire">Mental Health Test</Link>
              <Link to="/wiki">Learn More</Link>
            </div>
          </div>
          <Link to="/forum">Support Forum</Link>
          <Link to="/mission">Our Mission</Link>
          <Link to="/help" className="find-help">
            Find Help Now
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
