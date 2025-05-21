// src/components/common/ProgressBar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaFlag, FaStar, FaCheckCircle } from 'react-icons/fa';

const ProgressBar = ({ progress, showMilestones = true }) => {
  const [milestone, setMilestone] = useState(null);
  
  // Define milestone messages
  const milestones = [
    { threshold: 25, icon: <FaFlag className="milestone-icon-svg" />, message: "Great start! You're on your way!" },
    { threshold: 50, icon: <FaTrophy className="milestone-icon-svg" />, message: "Halfway there! Keep going!" },
    { threshold: 75, icon: <FaStar className="milestone-icon-svg" />, message: "Almost there! Final stretch!" },
    { threshold: 100, icon: <FaCheckCircle className="milestone-icon-svg" />, message: "You did it! Form completed!" }
  ];
  
  // Check for milestones when progress changes
  useEffect(() => {
    const currentMilestone = milestones.find(m => {
      // Find the first milestone that matches the current progress
      return progress >= m.threshold && progress < m.threshold + 5;
    });
    
    if (currentMilestone) {
      setMilestone(currentMilestone);
      
      // Clear milestone after 3 seconds
      const timer = setTimeout(() => {
        setMilestone(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [progress]);
  
  return (
    <div className="custom-progress-container">
      <div className="custom-progress-bar">
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Milestone markers */}
          {showMilestones && milestones.slice(0, -1).map((m, index) => (
            <div 
              key={index}
              className={`milestone-marker ${progress >= m.threshold ? 'achieved' : ''}`}
              style={{ left: `${m.threshold}%` }}
            >
              <div className="milestone-dot" />
            </div>
          ))}
        </div>
        <div className="progress-text">{Math.round(progress)}%</div>
      </div>
      
      {/* Milestone celebration animation */}
      <AnimatePresence>
        {milestone && showMilestones && (
          <motion.div 
            className="milestone-celebration"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <span className="milestone-icon">{milestone.icon}</span>
            <span className="milestone-message">{milestone.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx>{`
        .custom-progress-container {
          position: relative;
          margin-bottom: 2rem;
        }
        
        .custom-progress-bar {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .progress-track {
          position: relative;
          height: 10px;
          background-color: #e9ecef;
          border-radius: 5px;
          flex-grow: 1;
          overflow: hidden;
          margin-right: 10px;
        }
        
        .progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #4a6cf7, #1e40af);
          border-radius: 5px;
        }
        
        .progress-text {
          font-weight: bold;
          min-width: 40px;
          text-align: right;
        }
        
        .milestone-marker {
          position: absolute;
          top: -5px;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          transition: all 0.3s ease;
        }
        
        .milestone-dot {
          width: 12px;
          height: 12px;
          background-color: #e9ecef;
          border: 2px solid #fff;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .milestone-marker.achieved .milestone-dot {
          background-color: #4a6cf7;
          transform: scale(1.2);
        }
        
        .milestone-celebration {
          display: flex;
          align-items: center;
          padding: 8px 15px;
          background: linear-gradient(90deg, #4a6cf7, #1e40af);
          color: white;
          border-radius: 20px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(74, 108, 247, 0.25);
          margin-top: 10px;
          max-width: fit-content;
        }
        
        .milestone-icon {
          margin-right: 10px;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
        }
        
        .milestone-icon-svg {
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;