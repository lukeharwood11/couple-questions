import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import comments from '../../pages/meta/comments.json';
import './LevelOverModal.css';

interface LevelOverModalProps {
    isOpen: boolean;
    tipPercentage: number;
    onClose: () => void;
}

const LevelOverModal: React.FC<LevelOverModalProps> = ({ isOpen, tipPercentage, onClose }) => {
    const getMessage = (percentage: number) => {
        // Get random index for selecting a comment
        const getRandomComment = (array: string[]) => {
            const randomIndex = Math.floor(Math.random() * array.length);
            return array[randomIndex];
        };

        if (percentage === 0) {
            return getRandomComment(comments.noTip);
        } else if (percentage < 10) {
            return getRandomComment(comments.badTip);
        } else if (percentage < 20) {
            return getRandomComment(comments.mediumTip);
        } else {
            return getRandomComment(comments.greatTip);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="modal-content"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                    >
                        <h2>Level Complete!</h2>
                        <p className="tip-result">You tipped: {tipPercentage.toFixed(2)}%</p>
                        <p className="completion-message">{getMessage(tipPercentage)}</p>
                        <motion.button
                            className="continue-button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                        >
                            Continue
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LevelOverModal;
