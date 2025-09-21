// Use environment variable for API URL, fallback to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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

  // Wellness API with error handling
  getMotivation: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/motivation`);
      if (!response.ok) throw new Error('Backend not available');
      return response.json();
    } catch (error) {
      // Return demo data when backend is unavailable
      return { quote: "The best way to predict the future is to create it. – Peter Drucker" };
    }
  },

  saveMood: async (moodData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/mood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moodData),
      });
      if (!response.ok) throw new Error('Backend not available');
      return response.json();
    } catch (error) {
      // Save to localStorage when backend is unavailable
      const moods = JSON.parse(localStorage.getItem('moods') || '[]');
      moods.push({ ...moodData, date: new Date().toISOString().split('T')[0] });
      localStorage.setItem('moods', JSON.stringify(moods));
      return { message: 'Mood saved locally!', ...moodData };
    }
  },

  getMoods: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/moods`);
      if (!response.ok) throw new Error('Backend not available');
      return response.json();
    } catch (error) {
      // Return localStorage data when backend is unavailable
      return JSON.parse(localStorage.getItem('moods') || '[]');
    }
  },

  generatePlan: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Backend not available');
      return response.json();
    } catch (error) {
      // Return demo plan when backend is unavailable
      return { 
        plan: "Day 1: Take a 20-minute walk, practice 10 minutes of meditation.\nDay 2: Do 30 minutes of exercise, call a friend or family member.\nDay 3: Try a creative activity like drawing or writing, spend time relaxing with a good book."
      };
    }
  },

  sendChat: async (message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error('Backend not available');
      return response.json();
    } catch (error) {
      // Return demo response when backend is unavailable
      return { 
        response: "I'm here to support you! While the AI features are temporarily unavailable, remember that you're doing great. Take a deep breath and know that you're not alone. 💙"
      };
    }
  },

  // Update user emergency email
  updateEmergencyEmail: async (emergencyEmail) => {
    try {
      const response = await fetch(`${API_BASE_URL}/emergency-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emergencyEmail }),
      });
      if (!response.ok) throw new Error('Backend not available');
      return response.json();
    } catch (error) {
      // Save to localStorage when backend is unavailable
      localStorage.setItem('emergencyEmail', emergencyEmail);
      return { message: 'Emergency email saved locally!', emergencyEmail };
    }
  },
};
