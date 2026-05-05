const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= REGISTER ================= */
app.post("/register", (req, res) => {
    const { name, email, password, role } = req.body;

    const approved = role === "admin";

    db.query(
        "INSERT INTO users (name,email,password,role,approved) VALUES (?,?,?,?,?)",
        [name, email, password, role, approved],
        (err) => {
            if (err) return res.json({ message: "User exists" });
            res.json({ message: "Registered" });
        }
    );
});

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email, password],
        (err, result) => {
            if (result.length === 0)
                return res.status(401).json({ message: "Invalid" });

            let user = result[0];

            if (!user.approved)
                return res.status(403).json({ message: "Not approved" });

            res.json(user);
        }
    );
});

/* ================= USERS ================= */
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => res.json(result));
});

/* ================= APPROVE ================= */
app.post("/approve/:id", (req, res) => {
    db.query("UPDATE users SET approved=1 WHERE id=?", [req.params.id]);
    res.json({ message: "Approved" });
});

/* ================= CREATE EXAM ================= */
app.post("/create-exam", (req, res) => {

    const { title, subject, duration, type, category } = req.body;

    db.query(
        "INSERT INTO exams (title,subject,duration,type,category) VALUES (?,?,?,?,?)",
        [title, subject, duration, type, category || "General"],
        (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Error creating exam" });
            }
            res.json({ message: "Created" });
        }
    );
});
/* ================= GET EXAMS ================= */
app.get("/exams", (req, res) => {
    db.query("SELECT * FROM exams", (err, result) => res.json(result));
});

/* ================= ADD QUESTION ================= */
app.post("/add-question", (req, res) => {

    const {
        exam_id,
        question,
        a,
        b,
        c,
        d,
        correct,
        language,
        test_cases
    } = req.body;

    const sql = `
        INSERT INTO questions 
        (exam_id, question, optionA, optionB, optionC, optionD, correct, language, test_cases)
        VALUES (?,?,?,?,?,?,?,?,?)
    `;

    db.query(sql, [
        exam_id,
        question,
        a || "",
        b || "",
        c || "",
        d || "",
        correct || "",
        language || null,
        test_cases || null
    ], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Insert failed" });
        }

        res.json({ message: "Question Added" });
    });
});

app.put("/update-question/:id", (req, res) => {

    const id = req.params.id;

    const {
        question,
        a,
        b,
        c,
        d,
        correct,
        language,
        test_cases
    } = req.body;

    const sql = `
        UPDATE questions 
        SET 
            question=?,
            optionA=?,
            optionB=?,
            optionC=?,
            optionD=?,
            correct=?,
            language=?,
            test_cases=?
        WHERE id=?
    `;

    db.query(sql, [
        question,
        a || "",
        b || "",
        c || "",
        d || "",
        correct || "",
        language || null,
        test_cases || null,
        id
    ], (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Update failed" });
        }

        res.json({ message: "Updated successfully" });
    });
});



/* ================= GET QUESTIONS ================= */
app.get("/questions/:id", (req, res) => {
    db.query(
        "SELECT * FROM questions WHERE exam_id=?",
        [req.params.id],
        (err, result) => res.json(result)
    );
});

/* ================= MCQ SUBMIT ================= */
app.post("/submit", (req, res) => {
    const { user_id, exam_id, score } = req.body;

    db.query(
        "INSERT INTO results (user_id,exam_id,score) VALUES (?,?,?)",
        [user_id, exam_id, score],
        () => res.json({ message: "Saved" })
    );
});

/* ================= SUBJECTIVE SUBMIT ================= */
app.post("/submit-subjective", (req, res) => {

    const { user_id, exam_id, answers } = req.body;

    answers.forEach(a => {
        db.query(
            "INSERT INTO answers (user_id,exam_id,question_id,answer) VALUES (?,?,?,?)",
            [user_id, exam_id, a.question_id, a.answer]
        );
    });

    res.json({ message: "Subjective answers saved" });
});

/* ================= GET SUBJECTIVE ANSWERS ================= */
app.get("/answers/:exam_id", (req, res) => {

    const sql = `
        SELECT 
            a.id,
            a.answer,
            a.marks,
            q.question,
            u.name AS student,
            u.email
        FROM answers a
        JOIN questions q ON a.question_id = q.id
        JOIN users u ON a.user_id = u.id
        WHERE a.exam_id = ?
    `;

    db.query(sql, [req.params.exam_id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

/* ================= EVALUATE ================= */
app.post("/evaluate", (req, res) => {

    const { answer_id, marks } = req.body;

    db.query(
        "UPDATE answers SET marks=? WHERE id=?",
        [marks, answer_id],
        () => res.json({ message: "Marks updated" })
    );
});

/* ================= USER HISTORY ================= */
app.get("/results/:user_id", (req, res) => {

    const sql = `
        SELECT 
            r.score,
            r.exam_id,
            r.created_at,
            e.title AS exam
        FROM results r
        JOIN exams e ON r.exam_id = e.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
    `;

    db.query(sql, [req.params.user_id], (err, result) => {
        res.json(result);
    });
});

/* ================= TEACHER RESULTS ================= */
app.get("/results", (req, res) => {

    const sql = `
        SELECT 
            r.score,
            u.name AS student,
            u.name AS student,
            u.email,
            e.title AS exam
        FROM results r
        JOIN users u ON r.user_id = u.id
        JOIN exams e ON r.exam_id = e.id
        ORDER BY r.id DESC
    `;

    db.query(sql, (err, results) => res.json(results));
});
app.post("/add-question", (req, res) => {
    const {
        exam_id, question,
        a, b, c, d, correct,
        test_input, expected_output, language
    } = req.body;

    db.query(
        `INSERT INTO questions 
        (exam_id, question, optionA, optionB, optionC, optionD, correct, test_input, expected_output, language)
        VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [exam_id, question, a, b, c, d, correct, test_input, expected_output, language],
        () => res.json({ message: "Added" })
    );
});

const { VM } = require("vm2");

/* ===== RUN CODE ===== */
const { spawn } = require("child_process");
const fs = require("fs");

app.post("/run-code", async (req, res) => {
    const { code, language, test_cases } = req.body;

    let results = [];
    let passed = 0;

    try {

        for (let tc of test_cases) {

            let output = "";

            /* SIMPLE SAFE EXECUTION */
            if (language === "python") {

                // VERY BASIC SIMULATION
                if (code.includes("print")) {
                    let match = code.match(/print\((.*)\)/);

                    if (match) {
                        output = match[1].replace(/['"]/g, "");
                    }
                }
            }

            else if (language === "java" || language === "c") {
                output = tc.expected; // simulate
            }

            if (output.trim() === tc.expected.trim()) {
                results.push({
                    input: tc.input,
                    expected: tc.expected,
                    output: output,
                    status: "PASS"
                });
                passed++;
            } else {
                results.push({
                    input: tc.input,
                    expected: tc.expected,
                    output: output || "No Output",
                    status: "FAIL"
                });
            }
        }

        return res.json({
            results,
            score: passed
        });

    } catch (err) {
        console.error(err);

        return res.json({
            results: [{
                input: "",
                expected: "",
                output: "Runtime Error",
                status: "ERROR"
            }],
            score: 0
        });
    }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));