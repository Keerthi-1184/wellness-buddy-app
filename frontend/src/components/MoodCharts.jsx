import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Calendar,
  Activity,
  Target,
  Award
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MoodCharts = ({ moodHistory }) => {
  const [activeTab, setActiveTab] = useState('trend');
  const [timeRange, setTimeRange] = useState('week');

  // Process mood data for different time ranges
  const processMoodData = (range) => {
    if (!moodHistory || moodHistory.length === 0) return { labels: [], scores: [], categories: [] };

    const now = new Date();
    let filteredData = moodHistory;

    if (range === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredData = moodHistory.filter(mood => new Date(mood.date) >= weekAgo);
    } else if (range === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredData = moodHistory.filter(mood => new Date(mood.date) >= monthAgo);
    }

    // Sort by date
    filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

    const labels = filteredData.map(mood => {
      const date = new Date(mood.date);
      return range === 'week' 
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const scores = filteredData.map(mood => mood.score);
    const categories = filteredData.map(mood => mood.category);

    return { labels, scores, categories, rawData: filteredData };
  };

  const { labels, scores, categories, rawData } = processMoodData(timeRange);

  // Calculate statistics
  const averageScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
  const totalEntries = rawData.length;

  // Category distribution
  const categoryCount = categories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryLabels = Object.keys(categoryCount);
  const categoryValues = Object.values(categoryCount);

  // Color schemes
  const moodColors = {
    background: 'rgba(99, 102, 241, 0.1)',
    border: 'rgba(99, 102, 241, 0.8)',
    pointBackground: 'rgba(99, 102, 241, 1)',
    pointBorder: 'rgba(255, 255, 255, 1)',
  };

  const categoryColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
  ];

  // Chart configurations
  const trendChartData = {
    labels,
    datasets: [
      {
        label: 'Mood Score',
        data: scores,
        borderColor: moodColors.border,
        backgroundColor: moodColors.background,
        pointBackgroundColor: moodColors.pointBackground,
        pointBorderColor: moodColors.pointBorder,
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Mood Trend - Last ${timeRange === 'week' ? '7 days' : '30 days'}`,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            const moodLabels = ['', 'Sad', 'Neutral', 'Happy', 'Very Happy', 'Excited'];
            return moodLabels[value] || value;
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: moodColors.pointBackground,
      },
    },
  };

  const categoryChartData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryColors.slice(0, categoryLabels.length),
        borderColor: categoryColors.slice(0, categoryLabels.length).map(color => color + '80'),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Mood Categories Distribution',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  const weeklyChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Average Mood Score',
        data: (() => {
          const weeklyData = [0, 0, 0, 0, 0, 0, 0];
          const weeklyCount = [0, 0, 0, 0, 0, 0, 0];
          
          rawData.forEach(mood => {
            const dayOfWeek = new Date(mood.date).getDay();
            const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday to last day
            weeklyData[adjustedDay] += mood.score;
            weeklyCount[adjustedDay]++;
          });
          
          return weeklyData.map((sum, index) => 
            weeklyCount[index] > 0 ? (sum / weeklyCount[index]).toFixed(1) : 0
          );
        })(),
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 0.8)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const weeklyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Weekly Mood Pattern',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const tabs = [
    { id: 'trend', label: 'Trend', icon: TrendingUp },
    { id: 'categories', label: 'Categories', icon: PieChart },
    { id: 'weekly', label: 'Weekly', icon: Calendar },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
  ];

  if (!moodHistory || moodHistory.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Mood Data Yet</h3>
        <p className="text-gray-500">Start tracking your mood to see beautiful visualizations!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mood Analytics</h2>
        <div className="flex space-x-2">
          {['week', 'month', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chart Content */}
      <div className="card p-6">
        {activeTab === 'trend' && (
          <div className="h-96">
            <Line data={trendChartData} options={trendChartOptions} />
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="h-96">
            <Doughnut data={categoryChartData} options={categoryChartOptions} />
          </div>
        )}

        {activeTab === 'weekly' && (
          <div className="h-96">
            <Bar data={weeklyChartData} options={weeklyChartOptions} />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Target className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <div className="text-3xl font-bold text-blue-700">{averageScore}</div>
              <div className="text-sm text-blue-600 font-medium">Average Score</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <div className="text-3xl font-bold text-green-700">{highestScore}</div>
              <div className="text-sm text-green-600 font-medium">Highest Score</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
              <Activity className="h-8 w-8 mx-auto mb-3 text-red-600" />
              <div className="text-3xl font-bold text-red-700">{lowestScore}</div>
              <div className="text-sm text-red-600 font-medium">Lowest Score</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <Award className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <div className="text-3xl font-bold text-purple-700">{totalEntries}</div>
              <div className="text-sm text-purple-600 font-medium">Total Entries</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodCharts;
