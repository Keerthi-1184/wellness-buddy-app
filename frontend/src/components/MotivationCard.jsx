import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, Quote } from 'lucide-react';

const MotivationCard = ({ motivation, loading, onRefresh }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card p-8 text-center"
      >
        <div className="mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Daily Motivation</h2>
          <p className="text-gray-600">Start your day with inspiration</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <motion.div
            key={motivation?.quote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="relative">
              <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary-200" />
              <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed italic">
                "{motivation?.quote || 'You are enough just as you are. – Meghan Markle'}"
              </blockquote>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Get New Quote</span>
            </motion.button>
          </motion.div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg"
          >
            <h3 className="font-semibold text-blue-900 mb-2">Mindfulness</h3>
            <p className="text-sm text-blue-700">Take a moment to breathe and center yourself</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg"
          >
            <h3 className="font-semibold text-green-900 mb-2">Gratitude</h3>
            <p className="text-sm text-green-700">Reflect on three things you're grateful for today</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg"
          >
            <h3 className="font-semibold text-purple-900 mb-2">Growth</h3>
            <p className="text-sm text-purple-700">Every day is a new opportunity to grow</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MotivationCard;
