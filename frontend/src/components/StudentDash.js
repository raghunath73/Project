import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "./StudentDash.css";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Registering the required chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const StudentDash = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username"); // Retrieve username from localStorage

    if (username) {
      fetch(`http://localhost:5000/student/dashboard?username=${username}`) // Make request to backend
        .then((response) => response.json())
        .then((data) => {
          setStudentData(data); // Set the fetched student data
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    } else {
      console.error("Username not found in local storage");
      navigate("/studentlogin"); // Redirect to login if username is not found
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username"); // Remove username from localStorage
    navigate("/studentlogin"); // Redirect to login page
  };

  // Pie Chart Data
  const pieChartData = {
    labels: ["Codeforces", "CodeChef", "LeetCode"],
    datasets: [
      {
        data: [
          studentData?.codeforcesscore,
          studentData?.codechefscore,
          studentData?.leetcodescore,
        ],
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF"],
      },
    ],
  };

  // Bar Chart Data
  const barChartData = {
    labels: ["Codeforces", "CodeChef", "LeetCode"],
    datasets: [
      {
        label: "Scores",
        data: [
          studentData?.codeforcesscore,
          studentData?.codechefscore,
          studentData?.leetcodescore,
        ],
        backgroundColor: "#007BFF",
      },
    ],
  };

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1 className="student-name">{studentData?.name}'s Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </header>

      <main className="dashboard-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <section className="scorecards-section">
              <h2 className="scorecards-title">Platform Scores</h2>
              <div className="scorecards">
                <div className="scorecard">
                  <h3>Codeforces Score</h3>
                  <p>{studentData?.codeforcesscore || 'N/A'}</p>
                </div>
                <div className="scorecard">
                  <h3>CodeChef Score</h3>
                  <p>{studentData?.codechefscore || 'N/A'}</p>
                </div>
                <div className="scorecard">
                  <h3>LeetCode Score</h3>
                  <p>{studentData?.leetcodescore || 'N/A'}</p>
                </div>
              </div>
            </section>

            <section className="charts-section">
              <h2 className="charts-title">Performance Visualization</h2>
              <div className="charts">
                <div className="chart">
                  <h3>Platform Scores Distribution</h3>
                  <Pie data={pieChartData} />
                </div>
                <div className="chart">
                  <h3>Platform Scores Comparison</h3>
                  <Bar data={barChartData} />
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default StudentDash;
