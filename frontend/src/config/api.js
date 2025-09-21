export const API_BASE_URL = '/api';

export const api = {
  // Authentication
  login: async (username, password) => {
    // For now, we'll use localStorage for demo purposes
    // In a real app, you'd make an API call here
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username && password) {
          localStorage.setItem('user', JSON.stringify({ username }));
          resolve({ success: true, user: { username } });
        } else {
          resolve({ success: false, error: 'Invalid credentials' });
        }
      }, 1000);
    });
  },

  register: async (username, email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('user', JSON.stringify({ username, email }));
        resolve({ success: true, user: { username, email } });
      }, 1000);
    });
  },

  // Wellness API
  getMotivation: async () => {
    const response = await fetch(`${API_BASE_URL}/motivation`);
    return response.json();
  },

  saveMood: async (moodData) => {
    const response = await fetch(`${API_BASE_URL}/mood`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moodData),
    });
    return response.json();
  },

  getMoods: async () => {
    const response = await fetch(`${API_BASE_URL}/moods`);
    return response.json();
  },

  generatePlan: async () => {
    const response = await fetch(`${API_BASE_URL}/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  sendChat: async (message) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    return response.json();
  },

  // Update user emergency email
  updateEmergencyEmail: async (emergencyEmail) => {
    const response = await fetch(`${API_BASE_URL}/emergency-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emergencyEmail }),
    });
    return response.json();
  },
};
