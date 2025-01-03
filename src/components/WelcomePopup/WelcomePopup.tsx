import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MdOutlineAdsClick,
    MdSportsEsports,
    MdLockOpen,
    MdLightbulb,
    MdKeyboardArrowRight,
    MdKeyboardArrowLeft,
    MdClose,
} from 'react-icons/md';
import './WelcomePopup.css';

interface WelcomePopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
    const [currentSection, setCurrentSection] = useState(0);
    const sections = ['Goal', 'How to Play', 'Level Unlocking', 'Tips'];

    const nextSection = () => {
        setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
    };

    const prevSection = () => {
        setCurrentSection((prev) => Math.max(prev - 1, 0));
    };

    const renderSection = () => {
        switch (currentSection) {
            case 0:
                return (
                    <section className="welcome-section">
                        <div className="section-header">
                            <MdOutlineAdsClick className="section-icon" />
                            <h3>Goal</h3>
                        </div>
                        <p>
                            Your goal is to complete each level by finding a way to leave a 0% tip.
                            <br />
                            <br />
                            There is{' '}
                            <u>
                                <strong>always</strong>
                            </u>{' '}
                            a way to escape without tipping.
                        </p>
                    </section>
                );
            case 1:
                return (
                    <section className="welcome-section">
                        <div className="section-header">
                            <MdSportsEsports className="section-icon" />
                            <h3>How to Play</h3>
                        </div>
                        <div className="instruction-list">
                            <div className="instruction-item">
                                <MdKeyboardArrowRight />
                                <p>Start with Level 1 and work your way up</p>
                            </div>
                            <div className="instruction-item">
                                <MdKeyboardArrowRight />
                                <p>Each level presents different tipping scenarios</p>
                            </div>
                            <div className="instruction-item">
                                <MdKeyboardArrowRight />
                                <p>Think creatively to find ways to avoid tipping</p>
                            </div>
                            <div className="instruction-item">
                                <MdKeyboardArrowRight />
                                <p>You can retry levels as many times as needed</p>
                            </div>
                        </div>
                    </section>
                );
            case 2:
                return (
                    <section className="welcome-section">
                        <div className="section-header">
                            <MdLockOpen className="section-icon" />
                            <h3>Level Unlocking</h3>
                        </div>
                        <p>New levels unlock based on your performance:</p>
                        <div className="instruction-list">
                            <div className="instruction-item">
                                <MdKeyboardArrowRight />
                                <p>Complete a level with 0% tip to unlock more levels</p>
                            </div>
                            <div className="instruction-item">
                                <MdKeyboardArrowRight />
                                <p>If you tip on a level, fewer future levels will be available</p>
                            </div>
                        </div>
                    </section>
                );
            case 3:
                return (
                    <section className="welcome-section">
                        <div className="section-header">
                            <MdLightbulb className="section-icon" />
                            <h3>Tips</h3>
                        </div>
                        <div className="instruction-list">
                            <div className="instruction-item">
                                <MdKeyboardArrowRight />
                                <p>
                                    Pay attention to anything on the screen - normal elements might hide escape routes
                                </p>
                            </div>
                            <div className="instruction-item">
                                <MdKeyboardArrowRight />
                                <p>Sometimes the obvious solution isn't the right one</p>
                            </div>
                            <div className="instruction-item">
                                <MdKeyboardArrowRight />
                                <p>Think outside the box - there's always a way out!</p>
                            </div>
                        </div>
                    </section>
                );
            default:
                return null;
        }
    };

    const handleClose = () => {
        onClose();
        setCurrentSection(0);
    };

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
                        <button className="popup-close-x" onClick={handleClose}>
                            <MdClose />
                        </button>

                        {renderSection()}

                        <div className="navigation-buttons">
                            {currentSection > 0 && (
                                <button className="welcome-button" onClick={prevSection}>
                                    <MdKeyboardArrowLeft /> Previous
                                </button>
                            )}
                            {currentSection < sections.length - 1 ? (
                                <button className="welcome-button" onClick={nextSection}>
                                    Next <MdKeyboardArrowRight />
                                </button>
                            ) : (
                                <button className="welcome-button" onClick={handleClose}>
                                    Let's Begin!
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomePopup;
