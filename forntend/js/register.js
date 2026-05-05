// 👁️ Toggle Password
function togglePassword(id){
    let input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

// 💪 Password Strength
document.getElementById("password").addEventListener("input", function(){
    let val = this.value;
    let text = document.getElementById("strengthText");

    if(val.length < 6){
        text.innerText = "Weak";
        text.style.color = "red";
    }
    else if(/[A-Za-z]/.test(val) && /\d/.test(val)){
        text.innerText = "Medium";
        text.style.color = "orange";
    }
    if(/[A-Za-z]/.test(val) && /\d/.test(val) && /[@$!%*?&]/.test(val)){
        text.innerText = "Strong";
        text.style.color = "green";
    }
});

document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let form = document.getElementById("registerForm");

    let loader = document.getElementById("loader");
    let errorMsg = document.getElementById("errorMsg");
    let btn = document.getElementById("registerBtn");

    // Reset UI
    errorMsg.innerText = "";
    loader.style.display = "block";
    btn.disabled = true;

    if (!form.checkValidity()) {
        loader.style.display = "none";
        btn.disabled = false;
        form.reportValidity();
        return;
    }

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();
    let role = document.getElementById("role").value;

    let emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|mahindra\.edu\.in)$/;

    if (!emailPattern.test(email)) {
        loader.style.display = "none";
        btn.disabled = false;
        errorMsg.innerText = "Only Gmail, Outlook or college emails allowed!";
        return;
    }

    if (password !== confirmPassword) {
        loader.style.display = "none";
        btn.disabled = false;
        errorMsg.innerText = "Passwords do not match!";
        return;
    }

    let strongPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!strongPattern.test(password)) {
        loader.style.display = "none";
        btn.disabled = false;
        errorMsg.innerText = "Password must include letters, numbers & special character!";
        return;
    }

    try {
        let res = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, email, password, role })
        });

        let data = await res.json();

        loader.style.display = "none";
        btn.disabled = false;

        if (!res.ok) {
            errorMsg.innerText = data.message || "Registration failed!";
            return;
        }

        // ✅ SUCCESS POPUP
        let popup = document.getElementById("successPopup");
        popup.style.display = "block";

        setTimeout(()=>{
            popup.style.display = "none";
            window.location.href = "login.html";
        }, 2000);

    } catch (err) {
        loader.style.display = "none";
        btn.disabled = false;
        errorMsg.innerText = "Server error! Try again.";
    }
});