import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheck, MdContentCopy, MdClose } from 'react-icons/md';
import './ThankYouPopup.css';

interface ThankYouPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const ThankYouPopup: React.FC<ThankYouPopupProps> = ({ isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('lukeharwood.dev@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const iconVariants = {
        initial: { scale: 0, rotate: -180 },
        animate: {
            scale: 1,
            rotate: 0,
            transition: {
                type: 'spring',
                stiffness: 260,
                damping: 20,
            },
        },
        exit: {
            scale: 0,
            rotate: 180,
            transition: {
                duration: 0.2,
            },
        },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="thankyou-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="thankyou-popup"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Thank You for Playing!</h2>
                        <div className="thankyou-message">
                            <p>If you enjoyed the game, share it with your friends!</p>
                            <p>
                                Have any feedback, found an issue, or have an idea for a new level?
                                <br /><br /> Reach out to me at{' '}
                                <span className="email-wrapper" onClick={handleCopyEmail}>
                                    <span className="email-text">feedback@justacouplequestions.com</span>
                                    <span className="copy-icon">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                className={'copy-icon'}
                                                key={copied ? 'check' : 'copy'}
                                                variants={iconVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                            >
                                                {copied ? <MdCheck /> : <MdContentCopy />}
                                            </motion.span>
                                        </AnimatePresence>
                                    </span>
                                </span>
                            </p>
                        </div>
                        <button className="popup-close-x" onClick={onClose}>
                            <MdClose />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ThankYouPopup;
