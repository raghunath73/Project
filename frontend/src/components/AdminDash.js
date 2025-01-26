import React, { useState, useEffect } from 'react';
import './AdminDash.css';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';

const AdminDash = () => {
  const [students, setStudents] = useState([]);
  const [sortOrder, setSortOrder] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterSection, setFilterSection] = useState('');
  const [searchRollNo, setSearchRollNo] = useState('');

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
      const aValue =
        column === 'totalProblemsSolved' ? a[column] : a.platform_data?.[column]?.rating || 0;
      const bValue =
        column === 'totalProblemsSolved' ? b[column] : b.platform_data?.[column]?.rating || 0;

      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setStudents(sortedStudents);
  };

  const filteredStudents = students.filter((student) => {
    return (
      (!filterSection || student.section === filterSection) &&
      (!searchRollNo || student.rollNo.includes(searchRollNo))
    );
  });

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
                Roll Number
                <button onClick={() => handleSort('rollNo')}>
                  {sortOrder['rollNo'] === 'asc' ? <FaSortUp /> : <FaSortDown />}
                </button>
              </th>
              <th>Section</th>
              <th>
                Total Problems Solved
                <button onClick={() => handleSort('totalProblemsSolved')}>
                  {sortOrder['totalProblemsSolved'] === 'asc' ? <FaSortUp /> : <FaSortDown />}
                </button>
              </th>
              <th>CodeChef<br />Rating</th>
              <th>CodeChef<br />Solved</th>
              <th>Codeforces<br />Rating</th>
              <th>Codeforces<br />Solved</th>
              <th>LeetCode<br />Rating</th>
              <th>LeetCode<br />Solved</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.rollNo || 'N/A'}</td>
                <td>{student.section || 'N/A'}</td>
                <td>{student.totalProblemsSolved || 0}</td>
                <td>{student.codechefRating || 'N/A'}</td>
                <td>{student.codechefSolved || 'N/A'}</td>
                <td>{student.codeforcesRating || 'N/A'}</td>
                <td>{student.codeforcesSolved || 'N/A'}</td>
                <td>{student.leetcodeRating || 'N/A'}</td>
                <td>{student.leetcodeSolved || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="filters">
          <div className="filter-item">
            <label htmlFor="sectionFilter">Filter by Section:</label>
            <select
              id="sectionFilter"
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
            >
              <option value="">All</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
          <div className="filter-item">
            <label htmlFor="rollSearch">Search by Roll Number:</label>
            <input
              type="text"
              id="rollSearch"
              placeholder="Enter Roll No"
              value={searchRollNo}
              onChange={(e) => setSearchRollNo(e.target.value)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDash;
