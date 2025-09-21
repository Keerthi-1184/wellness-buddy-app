import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../config/api';
import MoodCharts from './MoodCharts';
import { loadSampleMoodData, addSampleDataToStorage } from '../utils/sampleMoodData';
import { 
  Smile, 
  Frown, 
  Meh, 
  Laugh, 
  Angry, 
  TrendingUp, 
  Calendar,
  Save,
  BarChart3,
  Heart,
  Activity,
  RefreshCw
} from 'lucide-react';

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Happy');
  const [moodScore, setMoodScore] = useState(3);
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeView, setActiveView] = useState('tracker');

  const moodEmojis = [
    { emoji: '😢', label: 'Sad', value: 1, icon: Frown },
    { emoji: '😐', label: 'Neutral', value: 2, icon: Meh },
    { emoji: '😊', label: 'Happy', value: 3, icon: Smile },
    { emoji: '😄', label: 'Very Happy', value: 4, icon: Laugh },
    { emoji: '🤩', label: 'Excited', value: 5, icon: TrendingUp },
  ];

  const categories = ['Happy', 'Sad', 'Anxious', 'Calm', 'Stressed', 'Excited', 'Tired', 'Energetic'];

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = async () => {
    try {
      const moods = await api.getMoods();
      // If no real data, load sample data for demonstration
      if (moods.length === 0) {
        const sampleData = loadSampleMoodData();
        setMoodHistory(sampleData);
      } else {
        setMoodHistory(moods);
      }
    } catch (error) {
      console.error('Error loading mood history:', error);
      // Fallback to sample data
      const sampleData = loadSampleMoodData();
      setMoodHistory(sampleData);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setMoodScore(mood.value);
  };

  const handleSaveMood = async () => {
    if (!selectedMood) return;
    
    setSaving(true);
    try {
      await api.saveMood({
        score: moodScore,
        category: selectedCategory,
      });
      
      // Add to local history immediately
      const newMood = {
        date: new Date().toISOString().split('T')[0],
        score: moodScore,
        category: selectedCategory,
      };
      setMoodHistory([newMood, ...moodHistory]);
      
      // Reset form
      setSelectedMood(null);
      setMoodScore(3);
      setSelectedCategory('Happy');
      
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setSaving(false);
    }
  };

  const getMoodColor = (score) => {
    if (score <= 2) return 'text-red-500';
    if (score === 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getMoodEmoji = (score) => {
    return moodEmojis.find(mood => mood.value === score)?.emoji || '😐';
  };

  const generateNewSampleData = () => {
    const newSampleData = addSampleDataToStorage();
    setMoodHistory(newSampleData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* View Toggle */}
      <div className="flex justify-center items-center space-x-4 mb-8">
        <button
          onClick={() => setActiveView('tracker')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            activeView === 'tracker'
              ? 'bg-primary-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Heart className="h-5 w-5" />
          <span>Track Mood</span>
        </button>
        <button
          onClick={() => setActiveView('analytics')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            activeView === 'analytics'
              ? 'bg-primary-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span>Analytics</span>
        </button>
        {activeView === 'analytics' && (
          <button
            onClick={generateNewSampleData}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
            title="Generate new sample data for testing"
          >
            <RefreshCw className="h-4 w-4" />
            <span>New Sample Data</span>
          </button>
        )}
      </div>

      {activeView === 'tracker' && (
        <>
          {/* Mood Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8"
          >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Heart className="h-6 w-6 mr-2 text-pink-500" />
          How are you feeling today?
        </h2>

        <div className="space-y-6">
          {/* Mood Emojis */}
          <div className="flex justify-center space-x-4">
            {moodEmojis.map((mood) => {
              const Icon = mood.icon;
              return (
                <motion.button
                  key={mood.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood)}
                  className={`p-4 rounded-full transition-all duration-200 ${
                    selectedMood?.value === mood.value
                      ? 'bg-primary-100 border-2 border-primary-500'
                      : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium text-gray-700">{mood.label}</div>
                </motion.button>
              );
            })}
          </div>

          {/* Mood Score Slider */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Mood Intensity: {moodScore}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={moodScore}
              onChange={(e) => setMoodScore(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Mood Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveMood}
            disabled={!selectedMood || saving}
            className="btn-primary w-full flex items-center justify-center py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save My Mood
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Mood History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-8"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
          Mood History
        </h3>

        {moodHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No mood entries yet. Start tracking your mood!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {moodHistory.map((mood, index) => (
                <motion.div
                  key={`${mood.date}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getMoodEmoji(mood.score)}</span>
                    <div>
                      <div className="font-medium text-gray-900">{mood.category}</div>
                      <div className="text-sm text-gray-500">{mood.date}</div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${getMoodColor(mood.score)}`}>
                    {mood.score}/5
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
        </>
      )}

      {activeView === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MoodCharts moodHistory={moodHistory} />
        </motion.div>
      )}
    </div>
  );
};

export default MoodTracker;
