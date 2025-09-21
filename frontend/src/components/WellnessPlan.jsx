import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../config/api';
import { 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Heart,
  Activity,
  BookOpen,
  Users,
  Coffee,
  Moon,
  Sun
} from 'lucide-react';

const WellnessPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const response = await api.generatePlan();
      setPlan(response.plan);
    } catch (error) {
      console.error('Error generating plan:', error);
      // Fallback plan
      setPlan(`Day 1: Morning walk and meditation
Day 2: Exercise and connect with a friend
Day 3: Creative activity and relaxation`);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const parsePlan = (planText) => {
    if (!planText) return [];
    
    const lines = planText.split('\n').filter(line => line.trim());
    const days = [];
    let currentDay = null;
    
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes('day') && line.match(/\d+/)) {
        if (currentDay) days.push(currentDay);
        currentDay = {
          id: `day-${days.length + 1}`,
          title: line.trim(),
          tasks: []
        };
      } else if (currentDay && line.trim()) {
        currentDay.tasks.push({
          id: `${currentDay.id}-task-${currentDay.tasks.length + 1}`,
          text: line.trim().replace(/^[-•*]\s*/, ''),
          completed: false
        });
      }
    });
    
    if (currentDay) days.push(currentDay);
    return days;
  };

  const getActivityIcon = (taskText) => {
    const text = taskText.toLowerCase();
    if (text.includes('walk') || text.includes('exercise') || text.includes('run')) return Activity;
    if (text.includes('meditation') || text.includes('mindfulness')) return Heart;
    if (text.includes('read') || text.includes('book')) return BookOpen;
    if (text.includes('friend') || text.includes('social')) return Users;
    if (text.includes('coffee') || text.includes('drink')) return Coffee;
    if (text.includes('sleep') || text.includes('rest')) return Moon;
    if (text.includes('morning') || text.includes('sunrise')) return Sun;
    return CheckCircle;
  };

  const planDays = parsePlan(plan);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 text-center"
      >
        <div className="mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4"
          >
            <Calendar className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Personalized Wellness Plan</h2>
          <p className="text-gray-600">Get your customized 3-day wellness plan based on your mood and preferences</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGeneratePlan}
          disabled={loading}
          className="btn-primary flex items-center space-x-2 py-3 px-8 text-lg"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Generate My Plan</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Wellness Plan */}
      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {planDays.map((day, dayIndex) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  {dayIndex + 1}
                </div>
                {day.title}
              </h3>

              <div className="space-y-3">
                {day.tasks.map((task, taskIndex) => {
                  const Icon = getActivityIcon(task.text);
                  const isCompleted = completedTasks.has(task.id);
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (dayIndex * 0.1) + (taskIndex * 0.05) }}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        isCompleted 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`h-6 w-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white border-2 border-gray-300 hover:border-primary-500'
                        }`}
                      >
                        {isCompleted && <CheckCircle className="h-4 w-4" />}
                      </motion.button>
                      
                      <Icon className={`h-5 w-5 ${
                        isCompleted ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      
                      <span className={`flex-1 ${
                        isCompleted 
                          ? 'text-green-700 line-through' 
                          : 'text-gray-700'
                      }`}>
                        {task.text}
                      </span>
                      
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-500"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Progress Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              Progress Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {completedTasks.size}
                </div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {planDays.reduce((total, day) => total + day.tasks.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((completedTasks.size / planDays.reduce((total, day) => total + day.tasks.length, 0)) * 100) || 0}%
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="card p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
          <h4 className="font-semibold text-yellow-900 mb-2">💡 Pro Tip</h4>
          <p className="text-sm text-yellow-700">Start with small, achievable goals to build momentum</p>
        </div>
        
        <div className="card p-4 bg-gradient-to-r from-green-50 to-emerald-50">
          <h4 className="font-semibold text-green-900 mb-2">🌱 Growth</h4>
          <p className="text-sm text-green-700">Consistency is more important than perfection</p>
        </div>
        
        <div className="card p-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <h4 className="font-semibold text-purple-900 mb-2">❤️ Self-Care</h4>
          <p className="text-sm text-purple-700">Listen to your body and adjust as needed</p>
        </div>
      </motion.div>
    </div>
  );
};

export default WellnessPlan;
