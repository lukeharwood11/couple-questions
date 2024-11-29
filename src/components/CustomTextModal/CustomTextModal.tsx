import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CustomTextModal.css';

interface CustomTextModalProps {
    isOpen: boolean;
    onClose: () => void;
    text: string;
    button1Text?: string;
    button2Text?: string;
    button1OnClick?: () => void;
    button2OnClick?: () => void;
}

const CustomTextModal: React.FC<CustomTextModalProps> = ({
    isOpen,
    onClose,
    text,
    button1Text = 'OK',
    button2Text,
    button1OnClick,
    button2OnClick,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="custom-text-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="custom-text-modal"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                    >
                        <p className="modal-text">{text}</p>
                        <div className="modal-buttons">
                            <button className="modal-button" onClick={button1OnClick || onClose}>
                                {button1Text}
                            </button>
                            {button2Text && (
                                <button className="modal-button" onClick={button2OnClick || onClose}>
                                    {button2Text}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CustomTextModal;
