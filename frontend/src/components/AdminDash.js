import React, { useState, useEffect } from 'react';
import './AdminDash.css';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';

const AdminDash = () => {
  const [students, setStudents] = useState([]);
  const [sortOrder, setSortOrder] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/students')
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error('Error fetching students:', error));
  }, []);

  const handleSort = (column) => {
    const order = sortOrder[column] === 'asc' ? 'desc' : 'asc';
    setSortOrder({ [column]: order });

    const sortedStudents = [...students].sort((a, b) => {
      const aValue = column === 'totalProblemsSolved' ? a[column] : a.platform_data[column]?.rating || 0;
      const bValue = column === 'totalProblemsSolved' ? b[column] : b.platform_data[column]?.rating || 0;

      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setStudents(sortedStudents);
  };

  return (
    <div className="admin-dash">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div
          className="profile-icon"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <FaUserCircle size={30} />
          {showDropdown && (
            <div className="dropdown">
              <ul>
                <li>Edit Profile</li>
                <li>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <main className="admin-content">
        <h2>Leaderboard</h2>
        <table className="students-table">
          <thead>
            <tr>
              <th>
                Roll No
                <button onClick={() => handleSort('rollNo')}>
                  {sortOrder['rollNo'] === 'asc' ? <FaSortUp /> : <FaSortDown />}
                </button>
              </th>
              <th>
                Total Problems Solved
                <button onClick={() => handleSort('totalProblemsSolved')}>
                  {sortOrder['totalProblemsSolved'] === 'asc' ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )}
                </button>
              </th>
              <th>Section</th>
              <th>
                Codeforces Rating
                <button onClick={() => handleSort('codeforces')}>
                  {sortOrder['codeforces'] === 'asc' ? <FaSortUp /> : <FaSortDown />}
                </button>
              </th>
              <th>
                CodeChef Rating
                <button onClick={() => handleSort('codechef')}>
                  {sortOrder['codechef'] === 'asc' ? <FaSortUp /> : <FaSortDown />}
                </button>
              </th>
              <th>
                LeetCode Rating
                <button onClick={() => handleSort('leetcode')}>
                  {sortOrder['leetcode'] === 'asc' ? <FaSortUp /> : <FaSortDown />}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.rollNo}</td>
                <td>{student.totalProblemsSolved}</td>
                <td>{student.section}</td>
                <td>{student.platform_data.codeforces?.rating || 'N/A'}</td>
                <td>{student.platform_data.codechef?.rating || 'N/A'}</td>
                <td>{student.platform_data.leetcode?.rating || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AdminDash;
