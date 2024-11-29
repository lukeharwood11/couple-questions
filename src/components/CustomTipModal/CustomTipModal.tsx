import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CustomTipModal.css';

interface CustomTipModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number) => void;
    baseAmount: number;
}

const CustomTipModal: React.FC<CustomTipModalProps> = ({ isOpen, onClose, onSubmit, baseAmount }) => {
    const [tipAmount, setTipAmount] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        const amount = parseFloat(tipAmount);
        if (isNaN(amount) || amount < 0) {
            setError('Please enter a valid amount');
            return;
        }

        // Convert to percentage
        const percentage = (amount / baseAmount) * 100;
        onSubmit(percentage);
        onClose();
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
                        className="modal-content custom-tip-modal"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                    >
                        <h2>Enter Custom Tip Amount</h2>
                        <div className="input-container">
                            <span className="dollar-sign">$</span>
                            <input
                                type="number"
                                value={tipAmount}
                                onChange={(e) => {
                                    setTipAmount(e.target.value);
                                    setError('');
                                }}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <div className="modal-buttons">
                            <button className="custom-tip-cancel-button" onClick={onClose}>
                                Cancel
                            </button>
                            <button className="custom-tip-submit-button" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CustomTipModal;
