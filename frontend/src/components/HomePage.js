import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to the Code Tracker Website</h1>
        <p>Your one-stop platform for code tracking and learning!</p>
      </header>
      <div className="signup-choice-container">
        <div className="signup-choice-box">
          <Link to="/adminlogin">
            <div className="signup-box-content">
              <h3>Admin</h3>
            </div>
          </Link>
        </div>
        <div className="signup-choice-box">
          <Link to="/studentlogin">
            <div className="signup-box-content">
              <h3>Student</h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
