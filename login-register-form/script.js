// Slide Form
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const container = document.querySelector(".container");

registerBtn.addEventListener("click", () => {
  container.classList.add("slide-register");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("slide-register");
});

// Password Toggle
const toggleLoginPass = document.getElementById("toggleLoginPass");
const toggleRegPass = document.getElementById("toggleRegPass");

toggleLoginPass.addEventListener("click", () => {
  const passInput = document.getElementById("loginPassword");
  passInput.type = passInput.type === "password" ? "text" : "password";
});

toggleRegPass.addEventListener("click", () => {
  const passInput = document.getElementById("regPassword");
  passInput.type = passInput.type === "password" ? "text" : "password";
});

// Dark Mode
const darkToggle = document.getElementById("darkToggle");
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

// Remember Me
const rememberMe = document.getElementById("rememberMe");

window.onload = () => {
  const savedUser = localStorage.getItem("savedUser");
  if (savedUser) {
    document.getElementById("loginUsername").value = savedUser;
    rememberMe.checked = true;
  }
};

// Fake Local Database
let users = [];

document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  const exists = users.find(u => u.username === username);
  if (exists) {
    alert("❌ Username already exists!");
    return;
  }

  users.push({ username, email, password });
  alert("✅ Registration Successful!");
  container.classList.remove("slide-register");
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    if (rememberMe.checked) {
      localStorage.setItem("savedUser", username);
    } else {
      localStorage.removeItem("savedUser");
    }
    localStorage.setItem("loginUser", username); // Store logged-in user
    // Redirect to FastAPI dashboard
    window.location.href = "http://localhost:8000/dashboard";
  } else {
    alert("❌ Invalid Credentials!");
  }
});