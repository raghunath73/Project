import sqlite3

# Connect to SQLite3 database (creates the file if it doesn't exist)
connection = sqlite3.connect("db.sqlite3")
cursor = connection.cursor()

# Create `admin` table
cursor.execute("""
CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
""")

# Create `students` table
cursor.execute("DROP TABLE IF EXISTS students")  # Remove the existing `students` table if it exists
cursor.execute("""
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roll_no TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    section TEXT,
    email TEXT,
    password TEXT,
    codechef TEXT,
    codeforces TEXT,
    leetcode TEXT,
    codechefscore INTEGER,
    codechefrating INTEGER,
    codeforcesscore INTEGER,
    codeforcesrating INTEGER,
    leetcodescore INTEGER,
    leetcoderating INTEGER
)
""")

# Insert default admin user
cursor.execute("SELECT * FROM admin WHERE username = 'admin'")
if not cursor.fetchone():
    cursor.execute("INSERT INTO admin (username, password) VALUES (?, ?)", ("admin", "admin"))
    print("Admin user created with username: 'admin' and password: 'admin'.")

# Commit the changes and close the connection
connection.commit()
connection.close()
print("Database initialized successfully.")
