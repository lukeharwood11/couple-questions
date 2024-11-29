import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './PSAPage.css';

const PSAPage: React.FC = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <motion.div 
            className="psa-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="psa-content">
                <h1>Note from the Author</h1>
                <div className="psa-message">
                    <p>
                        Disclaimer: This game was created as a joke.
                    </p>
                    <h3>To Normal People</h3>
                    <p>
                        In some cases, tips are bonuses for good service, and in other cases, they're the only way some people make any money.
                        There are many people that think that companies should just pay their workers more instead of relying on tips, and that's all fine and dandy. 
                        However, choosing not to tip people that fully rely on tips to make a living doesn't do anything to help their situation and actually hurts them.
                    </p>
                    <p>Also note that if companies don't rely on tips, they'll just pass the cost onto the customer.</p>
                    <p>When I was a server, I made $2.33 an hour and relied on tips to make any money. For those that didn't tip, I just served them for free. So please please please tip those that rely on tips! And tip them even more if they did great work.</p>
                    <h3>To Companies</h3>
                    <p>Don't guilt your customers into tipping (especially when they already make hourly wages), instead make it easy for customers to tip your staff when they're happy with their service. And overall, just treat your employees well.</p>
                    <br/>
                    <p>Thanks for playing!</p>
                    <p>-LH</p>
                </div>
                <button className="home-nav-button" onClick={() => navigate('/')}>
                    Back to Home
                </button>
            </div>
        </motion.div>
    );
};

export default PSAPage; 