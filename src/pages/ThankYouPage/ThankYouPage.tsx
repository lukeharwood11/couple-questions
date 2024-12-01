import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './ThankYouPage.css';
import { MdCheck, MdContentCopy } from 'react-icons/md';

const PSAPage: React.FC = () => {
    const navigate = useNavigate();
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
        <motion.div
            className="thankyou-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="thankyou-popup"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
            >
                <h2>Thank You for Playing!</h2>
                <div className="thankyou-message">
                    <p>If you enjoyed the game, share it with your friends!</p>
                    <p>
                        Have any feedback, found an issue, or have an idea for a new level? Reach out to me at{' '}
                        <span className="email-wrapper" onClick={handleCopyEmail}>
                            <span className="email-text">lukeharwood.dev@gmail.com</span>
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
                <button className="popup-close-button" onClick={() => navigate('/')}>
                    Back to Home
                </button>
            </motion.div>
        </motion.div>
    );
};

export default PSAPage;
