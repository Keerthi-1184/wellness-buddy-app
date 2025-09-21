// Tab switching
const tabs = document.querySelectorAll(".tab-btn");
const sections = document.querySelectorAll(".section");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.section).classList.add("active");
  });
});

// Load motivation quote on page load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/motivation');
    const data = await response.json();
    document.getElementById('quote').textContent = data.quote;
  } catch (error) {
    console.error('Error loading motivation:', error);
    document.getElementById('quote').textContent = "You are enough just as you are. – Meghan Markle";
  }
  
  // Load mood history
  loadMoodHistory();
});

// Mood Tracker
const moodScore = document.getElementById("mood-score");
const scoreDisplay = document.getElementById("score-display");
moodScore.addEventListener("input", () => {
  scoreDisplay.textContent = moodScore.value;
});

// Save mood
document.getElementById("save-mood").addEventListener("click", async () => {
  const mood = document.getElementById("mood-category").value;
  const score = parseInt(moodScore.value);
  
  try {
    const response = await fetch('/mood', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score: score,
        category: mood
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      alert('Mood saved successfully!');
      loadMoodHistory(); // Reload the history
    } else {
      alert('Error saving mood');
    }
  } catch (error) {
    console.error('Error saving mood:', error);
    alert('Error saving mood');
  }
});

// Load mood history
async function loadMoodHistory() {
  try {
    const response = await fetch('/moods');
    const moods = await response.json();
    const history = document.getElementById("mood-history");
    history.innerHTML = '';
    
    moods.forEach(mood => {
      const entry = document.createElement("p");
      entry.textContent = `${mood.date}: ${mood.score} (${mood.category})`;
      history.prepend(entry);
    });
  } catch (error) {
    console.error('Error loading mood history:', error);
  }
}

// Generate wellness plan
document.getElementById("generate-plan").addEventListener("click", async () => {
  const planOutput = document.getElementById("plan-output");
  planOutput.textContent = "Generating your personalized wellness plan...";
  
  try {
    const response = await fetch('/plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    if (response.ok) {
      planOutput.textContent = data.plan;
    } else {
      planOutput.textContent = "Error generating plan. Please try again.";
    }
  } catch (error) {
    console.error('Error generating plan:', error);
    planOutput.textContent = "Error generating plan. Please try again.";
  }
});

// Chat
const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-message");

document.getElementById("send-message").addEventListener("click", async () => {
  const msg = chatInput.value.trim();
  if (!msg) return;
  
  appendMessage("user", msg);
  chatInput.value = "";

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: msg
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      appendMessage("assistant", data.response);
    } else {
      appendMessage("assistant", "I'm here for you 🌸");
    }
  } catch (error) {
    console.error('Error in chat:', error);
    appendMessage("assistant", "I'm here for you 🌸");
  }
});

// Allow Enter key to send message
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("send-message").click();
  }
});

function appendMessage(role, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = role;
  msgDiv.textContent = (role === "user" ? "You: " : "Bot: ") + text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
