🎓 Online Exam System

A full-stack web application for conducting MCQ, Subjective, and Coding exams with auto-evaluation, PDF-based question import, and student performance tracking.

---

🚀 Features

👩‍🏫 Teacher Panel

- Create Exams (MCQ / Subjective / Coding)
- Add Questions manually or via PDF upload
- Auto-extract multiple questions from PDF
- Add coding test cases (input/output)
- View student results & analytics
- Export results as CSV

👨‍🎓 Student Panel

- Attempt exams
- Coding editor with Run Code
- Auto evaluation using test cases
- Track attempts & scores
- Performance dashboard

---

🧠 Advanced Features

- 📄 PDF Question Import
  
  - Extract multiple questions automatically
  - Supports MCQ parsing (A/B/C/D)
  - Marks missing answers as pending

- 💻 Coding Judge
  
  - Supports JavaScript / Python
  - Runs code with test cases
  - Auto scoring based on output

- 📊 Analytics
  
  - Attempts history
  - Best score tracking
  - Average score (teacher view)

---

🏗️ Tech Stack

Frontend

- HTML, CSS, JavaScript
- Quill.js (Rich text editor)
- PDF.js (PDF parsing)

Backend

- Node.js
- Express.js

Database

- MySQL

---

⚙️ Installation

1. Clone repo

git clone https://github.com/YOUR_USERNAME/online-exam-system.git
cd online-exam-system

2. Install backend dependencies

npm install

3. Setup MySQL Database

Create database and update config:

CREATE DATABASE exam_system;

Update your DB connection in server file.

---

4. Run backend

node server.js

---

5. Run frontend

Open in browser:

frontend/login.html

---

📁 Project Structure

project/
│
├── backend/
│   └── server.js
│
├── frontend/
│   ├── student/
│   ├── teacher/
│   ├── css/
│   └── login.html
│
├── package.json
└── README.md

---

📸 Screens

- Teacher Dashboard
- Question Bank with PDF Upload
- Coding Exam Interface
- Student Dashboard

---

⚠️ Notes

- Coding execution is currently client-side (JS safe only)
- For production:
  - Use sandbox (Docker / Judge0 API)
  - Add authentication (JWT)

---

🔮 Future Improvements

- AI-based question extraction
- Auto answer key detection from PDFs
- Multi-language compiler (C, Java)
- Live proctoring
- Timer + anti-cheating system

---

