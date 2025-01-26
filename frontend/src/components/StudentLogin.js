import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // For redirection
import axios from "axios";
import "./StudentLogin.css";

const StudentLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Redirect to /studentdash if username is present in localStorage
    if (localStorage.getItem("username")) {
      navigate("/studentdash");
    }
  }, []); // Empty array to only run once when the component is mounted

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { username, password };
    setLoading(true); // Start loading state

    try {
      // Make a POST request to the Flask backend
      const response = await axios.post(
        "http://127.0.0.1:5000/student/login", // Adjust the URL if your Flask server runs elsewhere
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success && response.data.message === "Login successful") {
        setMessage("Login successful! Redirecting...");

        // Store the username in localStorage
        localStorage.setItem("username", username);

        // After a short delay, redirect to the student dashboard
        setTimeout(() => {
          navigate("/studentdash"); // Redirect to student dashboard
        }, 1000); // 1-second delay before redirecting
      } else {
        setMessage(response.data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      setMessage(
        error.response
          ? error.response.data.error || "An error occurred. Please try again."
          : "Unable to connect to the server."
      );
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="login-page">
      <main className="login-content">
        <h2 className="login-heading">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username Input */}
          <div className="input-container">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              className="login-input"
              required
            />
          </div>

          {/* Password Input */}
          <div className="input-container">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="login-input"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="submit-container">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Message Display */}
          {message && <p className="login-message">{message}</p>}

          {/* Signup Link */}
          <div className="signup-option">
            <p>
              Don't have an account? <Link to="/studentsignup">Sign Up</Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default StudentLogin;
