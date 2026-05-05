document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    let loader = document.getElementById("loader");
    let errorMsg = document.getElementById("errorMsg");
    let btn = document.getElementById("loginBtn");

    // Reset UI
    errorMsg.innerText = "";
    loader.style.display = "block";
    btn.disabled = true;

    try {
        let res = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role })
        });

        let data = await res.json();

        loader.style.display = "none";
        btn.disabled = false;

        if (res.status !== 200) {
            errorMsg.innerText = data.message || "Invalid credentials!";
            return;
        }

        // Redirect based on role from backend
        localStorage.setItem("user_id", data.id);
        localStorage.setItem("user_name", data.name);
        if (data.role === "student") {
            window.location.href = "student/dashboard.html";
        }
        else if (data.role === "teacher") {
            window.location.href = "teacher/dashboard.html";
        }
        else {
            window.location.href = "admin/dashboard.html";
        }

    } catch (err) {
        loader.style.display = "none";
        btn.disabled = false;
        errorMsg.innerText = "Server error! Please try again.";
    }
});