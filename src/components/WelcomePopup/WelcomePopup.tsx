import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './WelcomePopup.css';

interface WelcomePopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="welcome-popup-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="welcome-popup"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                    >
                        <h2>Welcome to a Tipping Game!</h2>
                        <p>Think you're good at evading tips? Let's test you!</p>
                        <p>
                            You'll have to pretend you don't care about the social pressure of tipping. The rules are
                            simple, try to leave as little of a tip as possible. But here's the twist: while it's{' '}
                            <u>
                                <strong>always</strong>
                            </u>{' '}
                            possible to leave a 0% tip, it might be trickier than you'd expect!
                        </p>
                        <p>Ready to challenge yourself? Start with Level 1 and see how much of a jerk you can be!</p>
                        <button className="popup-close-button" onClick={onClose}>
                            Let's Begin!
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomePopup;
