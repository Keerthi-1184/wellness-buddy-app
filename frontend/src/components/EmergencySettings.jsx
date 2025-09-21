import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import { 
  AlertTriangle, 
  Mail, 
  Save, 
  Edit3, 
  Shield,
  CheckCircle
} from 'lucide-react';

const EmergencySettings = () => {
  const { user, setUser } = useAuth();
  const [emergencyEmail, setEmergencyEmail] = useState(user?.emergencyEmail || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    if (!emergencyEmail.trim()) {
      setMessage('Please enter a valid emergency email address');
      return;
    }

    setSaving(true);
    try {
      // Update user data in localStorage
      const updatedUser = { ...user, emergencyEmail };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Also send to backend (optional - for future database storage)
      try {
        await api.updateEmergencyEmail(emergencyEmail);
      } catch (apiError) {
        console.log('Backend update failed, but local storage updated');
      }
      
      setMessage('Emergency contact updated successfully!');
      setIsEditing(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating emergency contact');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEmergencyEmail(user?.emergencyEmail || '');
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-12 w-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Emergency Settings</h2>
            <p className="text-gray-600">Manage your emergency contact information</p>
          </div>
        </div>

        {/* Crisis Alert Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Crisis Detection System</h3>
              <p className="text-sm text-yellow-700 mt-1">
                If our AI detects concerning keywords in your messages (like "suicide", "self-harm", "hopeless"), 
                we will automatically send an alert to your emergency contact email with your message and crisis resources.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Email Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-500" />
              Emergency Contact Email
            </h3>
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit</span>
              </motion.button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="emergencyEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="emergencyEmail"
                  type="email"
                  value={emergencyEmail}
                  onChange={(e) => setEmergencyEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter emergency contact email"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This email will receive crisis alerts if concerning keywords are detected
                </p>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving || !emergencyEmail.trim()}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {user?.emergencyEmail || 'No emergency email set'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.emergencyEmail ? 'Crisis alerts will be sent to this email' : 'Please set an emergency email for your safety'}
                  </p>
                </div>
                {user?.emergencyEmail && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
          )}

          {/* Status Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg ${
                message.includes('successfully') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Crisis Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crisis Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Emergency Services</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>988</strong> - Suicide & Crisis Lifeline</li>
              <li>• <strong>911</strong> - Emergency Services</li>
              <li>• <strong>Text HOME to 741741</strong> - Crisis Text Line</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Online Resources</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• National Suicide Prevention Lifeline</li>
              <li>• Crisis Text Line</li>
              <li>• Your local emergency room</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencySettings;
