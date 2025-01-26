import sqlite3
# Add a new student to the database
def add_student(roll_no, name, section, email, password, platform_data):
    conn = sqlite3.connect("db.sqlite3")
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO students (roll_no, name, section, email, password, platform_data)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (roll_no, name, section, email, password, platform_data))
        conn.commit()
        print("Student added successfully.")
    except sqlite3.Error as e:
        print(f"Error adding student: {e}")
    finally:
        conn.close()

# Delete a specific student by roll number
def delete_student(roll_no):
    conn = sqlite3.connect("db.sqlite3")
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM students WHERE roll_no = ?", (roll_no,))
        conn.commit()
        if cursor.rowcount > 0:
            print(f"Student with roll_no {roll_no} deleted successfully.")
        else:
            print(f"No student found with roll_no {roll_no}.")
    except sqlite3.Error as e:
        print(f"Error deleting student: {e}")
    finally:
        conn.close()

# Delete all data in the students table
def delete_all_students():
    conn = sqlite3.connect("db.sqlite3")
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM students")
        conn.commit()
        print("All student data deleted successfully.")
    except sqlite3.Error as e:
        print(f"Error deleting all students: {e}")
    finally:
        conn.close()

# Fetch all students from the database
def fetch_all_students():
    conn = sqlite3.connect("db.sqlite3")
    conn.row_factory = sqlite3.Row  # Allows accessing columns by name
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM students")
        students = cursor.fetchall()

        # Print the student data
        print("Student Data:")
        for student in students:
            print(dict(student))  # Convert Row object to dictionary for better readability
    except sqlite3.Error as e:
        print(f"Error fetching students: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    # Example usage:
    # Add a student
    #add_student("123", "John Doe", "A", "john@example.com", "password123", '{"codechef": {}, "codeforces": {}, "leetcode": {}}')

    # Fetch all students
    #fetch_all_students()

    # Delete a specific student
    #delete_student("21wh1a05h3")

    # Fetch all students again
    #fetch_all_students()

    # Delete all student data
    #delete_all_students()

    # Fetch all students after deleting all
    fetch_all_students()
