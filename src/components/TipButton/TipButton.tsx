import React from 'react';
import './TipButton.css';
import { motion } from 'framer-motion';

interface TipButtonProps {
    percentage: number;
    onClick: (percentage: number) => void;
    isSelected?: boolean;
    customText?: string;
    className?: string;
}

const TipButton: React.FC<TipButtonProps> = ({ percentage, onClick, isSelected = false, customText, className }) => {
    return (
        <motion.button
            className={`tip-button ${isSelected ? 'selected' : ''} ${className}`}
            onClick={() => onClick(percentage)}
            layout={'size'}
            transition={{
                layout: {
                    duration: 0.3,
                    ease: 'easeOut',
                },
            }}
        >
            {customText || `${percentage}%`}
        </motion.button>
    );
};

export default TipButton;
