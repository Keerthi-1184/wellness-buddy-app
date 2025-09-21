// Sample mood data generator for testing visualizations
export const generateSampleMoodData = (days = 30) => {
  const data = [];
  const categories = ['Happy', 'Sad', 'Anxious', 'Calm', 'Stressed', 'Excited', 'Tired', 'Energetic'];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic mood patterns
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Weekend tends to have higher moods
    const baseScore = isWeekend ? 3.5 : 3.0;
    const variance = 1.5;
    
    // Add some randomness and trends
    const randomFactor = (Math.random() - 0.5) * variance;
    const trendFactor = Math.sin(i / 7) * 0.5; // Weekly pattern
    const score = Math.max(1, Math.min(5, Math.round(baseScore + randomFactor + trendFactor)));
    
    // Select category based on score
    let category;
    if (score <= 2) {
      category = categories[Math.floor(Math.random() * 3)]; // Sad, Anxious, Stressed
    } else if (score === 3) {
      category = categories[Math.floor(Math.random() * 2) + 3]; // Calm, Tired
    } else {
      category = categories[Math.floor(Math.random() * 3) + 5]; // Happy, Excited, Energetic
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      score: score,
      category: category
    });
  }
  
  return data;
};

// Add some sample data to localStorage for demo purposes
export const addSampleDataToStorage = () => {
  const sampleData = generateSampleMoodData(30);
  localStorage.setItem('sampleMoodData', JSON.stringify(sampleData));
  return sampleData;
};

// Load sample data from localStorage or generate new
export const loadSampleMoodData = () => {
  const stored = localStorage.getItem('sampleMoodData');
  if (stored) {
    return JSON.parse(stored);
  }
  return addSampleDataToStorage();
};
