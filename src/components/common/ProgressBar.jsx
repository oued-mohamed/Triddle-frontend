// frontend/src/components/common/ProgressBar.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress }) => {
  return (
    <div className="custom-progress-bar">
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="progress-text">{Math.round(progress)}%</div>
    </div>
  );
};

export default ProgressBar;