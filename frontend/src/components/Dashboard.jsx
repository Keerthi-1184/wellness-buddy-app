import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  LogOut, 
  Sun, 
  Moon, 
  MessageCircle, 
  Calendar, 
  TrendingUp,
  Sparkles,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  Shield
} from 'lucide-react';
import MoodTracker from './MoodTracker';
import ChatInterface from './ChatInterface';
import WellnessPlan from './WellnessPlan';
import MotivationCard from './MotivationCard';
import EmergencySettings from './EmergencySettings';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('motivation');
  const [motivation, setMotivation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMotivation();
  }, []);

  const loadMotivation = async () => {
    try {
      const data = await api.getMotivation();
      setMotivation(data);
    } catch (error) {
      console.error('Error loading motivation:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'motivation', label: 'Daily Motivation', icon: Sun },
    { id: 'mood', label: 'Mood Tracker', icon: Heart },
    { id: 'plan', label: 'Wellness Plan', icon: Calendar },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'emergency', label: 'Emergency Settings', icon: Shield },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="h-10 w-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Wellness Buddy</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.username}!</p>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'motivation' && (
              <MotivationCard motivation={motivation} loading={loading} onRefresh={loadMotivation} />
            )}
            {activeTab === 'mood' && <MoodTracker />}
            {activeTab === 'plan' && <WellnessPlan />}
            {activeTab === 'chat' && <ChatInterface />}
            {activeTab === 'emergency' && <EmergencySettings />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
