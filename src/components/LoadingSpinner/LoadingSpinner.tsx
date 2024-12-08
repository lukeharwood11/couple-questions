import React from 'react';
import { motion } from 'framer-motion';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="loading-container">
            <motion.div 
                className="loading-spinner"
                animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                }}
                transition={{ 
                    rotate: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                    },
                    scale: {
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
            >
                <span className="dollar">$</span>
            </motion.div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="loading-text"
            >
                Loading today's puzzle...
            </motion.p>
        </div>
    );
};

export default LoadingSpinner; 