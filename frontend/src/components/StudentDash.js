import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaSignOutAlt } from "react-icons/fa";
import "./StudentDash.css";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StudentDash = () => {
  const [studentData, setStudentData] = useState(null);
  const [performanceData, setPerformanceData] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch student data from API
    fetch("http://localhost:5000/api/student_data")
      .then((response) => response.json())
      .then((data) => {
        setStudentData(data);
        setPerformanceData({
          codeforces: data.performance.codeforces,
          codechef: data.performance.codechef,
          leetcode: data.performance.leetcode,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    // Perform logout logic (e.g., remove token)
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfileEdit = () => {
    navigate("/edit-profile");
  };

  // Chart data for performance (example: Codeforces)
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Codeforces Rating",
        data: performanceData.codeforces?.ratings || [0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Codeforces Solved",
        data: performanceData.codeforces?.solved || [0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>{studentData?.username}'s Dashboard</h1>
        </div>
        <div className="header-right">
          <button className="profile-btn" onClick={handleProfileEdit}>
            <FaEdit /> Edit Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="profile-section">
          <h2>Profile Details</h2>
          <div className="profile-card">
            <p><strong>Username:</strong> {studentData?.username}</p>
            <p><strong>Email:</strong> {studentData?.email}</p>
            <p><strong>Roll Number:</strong> {studentData?.rollNo}</p>
            <p><strong>Section:</strong> {studentData?.section}</p>
          </div>
        </section>

        <section className="scorecards-section">
          <h2>Scorecards</h2>
          <div className="scorecards">
            <div className="scorecard">
              <h3>Codeforces</h3>
              <p>Rating: {studentData?.platform_data.codeforces?.rating || 'N/A'}</p>
              <p>Solved: {studentData?.platform_data.codeforces?.solved || 'N/A'}</p>
            </div>
            <div className="scorecard">
              <h3>CodeChef</h3>
              <p>Rating: {studentData?.platform_data.codechef?.rating || 'N/A'}</p>
              <p>Solved: {studentData?.platform_data.codechef?.solved || 'N/A'}</p>
            </div>
            <div className="scorecard">
              <h3>LeetCode</h3>
              <p>Rating: {studentData?.platform_data.leetcode?.rating || 'N/A'}</p>
              <p>Solved: {studentData?.platform_data.leetcode?.solved || 'N/A'}</p>
            </div>
          </div>
        </section>

        <section className="performance-section">
          <h2>Performance Charts</h2>
          <div className="charts">
            <Line data={chartData} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDash;
