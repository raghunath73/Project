import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import requests
from bs4 import BeautifulSoup
import re

app = Flask(__name__)
CORS(app)

# Database connection
def get_db_connection():
    conn = sqlite3.connect("db.sqlite3")
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn

def get_codechef_score(username):
    """
    Fetches the CodeChef score for the given username.
    """
    url = f'https://www.codechef.com/users/{username}'
    try:
        res = requests.get(url)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            data_tags = soup.select('.user-profile-container .content-area .rating-data-section h3')
            return re.sub(r'\D', '', data_tags[-1].text.strip()) if data_tags else '0'
    except Exception as e:
        print(f"Error fetching CodeChef score for {username}: {e}")
    return '0'


def get_codechef_rating(username):
    """
    Fetches the CodeChef rating for the given username.
    """
    url = f'https://www.codechef.com/users/{username}'
    try:
        res = requests.get(url)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            rating_tag = soup.select_one('.user-profile-container .sidebar .widget.widget-rating .rating-ranks ul li strong')
            if rating_tag:
                return rating_tag.text.strip()
    except Exception as e:
        print(f"Error fetching CodeChef rating for {username}: {e}")
    return '0'
def get_codeforces_score(username):
        try:
            url = f'https://codeforces.com/api/user.status?handle={username}&from=1&count=1000'
            res = requests.get(url)
            if res.status_code == 200:
                data = res.json()
                if data['status'] == 'OK' and 'result' in data:
                    accepted_submissions = [submission for submission in data['result'] if submission['verdict'] == 'OK']
                    unique_problems = set(submission['problem']['name'] for submission in accepted_submissions)
                    return str(len(unique_problems))
        except requests.RequestException as e:
            print(f"Request error: {e}")
        except json.JSONDecodeError:
            print("Error: Unable to parse JSON response.")
        return '0'


def get_codeforces_rating(username):
    """
    Fetches the CodeForces rating for the given username.
    """
    url = f'https://codeforces.com/api/user.rating?handle={username}'
    try:
        res = requests.get(url)
        if res.status_code == 200:
            data = res.json()
            if data['status'] == 'OK' and data['result']:
                last_rating_data = data['result'][-1]
                return str(last_rating_data['newRating']) if 'newRating' in last_rating_data else '0'
    except Exception as e:
        print(f"Error fetching CodeForces rating for {username}: {e}")
    return '0'
def get_leetcode_score(username):
    """
    Fetches the total problems solved on LeetCode for the given username.
    """
    url = "https://leetcode.com/graphql/"
    headers = {"Content-Type": "application/json"}
    query = """
    query userProfile($username: String!) {
        matchedUser(username: $username) {
            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                }
            }
        }
    }
    """
    try:
        response = requests.post(url, json={"query": query, "variables": {"username": username}}, headers=headers)
        data = response.json()
        stats = data['data']['matchedUser']['submitStats']['acSubmissionNum']
        total_solved = sum(stat['count'] for stat in stats)
        return str(int(total_solved/2)) if total_solved else '0'
    except Exception as e:
        print(f"Error fetching LeetCode stats for {username}: {e}")
    return '0'


def get_leetcode_rating(username):
    """
    Fetches the LeetCode ranking for the given username.
    """
    url = "https://leetcode.com/graphql/"
    headers = {"Content-Type": "application/json"}
    query = """
    query userProfile($username: String!) {
        matchedUser(username: $username) {
            profile {
                ranking
            }
        }
    }
    """
    try:
        response = requests.post(url, json={"query": query, "variables": {"username": username}}, headers=headers)
        data = response.json()
        ranking = data['data']['matchedUser']['profile']['ranking']
        return str(ranking) if ranking else '0'
    except Exception as e:
        print(f"Error fetching LeetCode rating for {username}: {e}")
    return '0'
# Admin login
@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    conn = get_db_connection()
    admin = conn.execute(
        "SELECT * FROM admin WHERE username = ? AND password = ?",
        (username, password)
    ).fetchone()
    conn.close()

    if admin:
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

# Student signup
@app.route('/student/signup', methods=['POST'])
def student_signup():
    data = request.get_json()
    username = data.get('username')
    roll_no = data.get('rollno')
    section = data.get('section')
    password = data.get('password')
    email = data.get('email')
    codechef = data.get('codechef')
    codeforces = data.get('codeforces')
    leetcode = data.get('leetcode')
    platform_data = {
        "codechef": data.get('codechef', ''),
        "codechefscore" : get_codechef_score(codechef),
        "codechefrating" : get_codechef_rating(codechef),
        "codeforces": data.get('codeforces', ''),
        "codeforcesscore" : get_codeforces_score(codeforces),
        "codeforcesrating" : get_codeforces_rating(codeforces),
        "leetcode": data.get('leetcode', ''),
        "leetcodescore" : get_leetcode_score(leetcode),
        "leetcoderating" : get_leetcode_rating(leetcode)
}

    if not username or not roll_no or not section or not password or not email:
        return jsonify({"error": "All fields are required"}), 400

    conn = get_db_connection()
    existing_student = conn.execute(
        "SELECT * FROM students WHERE roll_no = ? OR email = ?",
        (roll_no, email)
    ).fetchone()

    if existing_student:
        conn.close()
        return jsonify({"error": "Roll number or email already exists"}), 400

    try:
        conn.execute("""
            INSERT INTO students (roll_no, name, section, email, password, platform_data)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (roll_no, username, section, email, password, json.dumps(platform_data)))
        conn.commit()
        conn.close()
        return jsonify({"message": "Signup successful"}), 201
    except sqlite3.Error as e:
        conn.close()
        return jsonify({"error": f"Database error: {e}"}), 500

# Student login
@app.route('/student/login', methods=['POST'])
def student_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    conn = get_db_connection()
    student = conn.execute(
        "SELECT * FROM students WHERE name = ? AND password = ?",
        (username, password)
    ).fetchone()
    conn.close()

    if student:
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

if __name__ == "__main__":
    app.run(debug=True)
