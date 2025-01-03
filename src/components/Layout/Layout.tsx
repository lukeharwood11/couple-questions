import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout: React.FC = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const levelMatch = location.pathname.match(/\/level\/(\d+)/);
    const levelNumber = levelMatch ? levelMatch[1] : null;

    return (
        <div className="layout">
            {!isHomePage && (
                <motion.div
                    className="back-button-container"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link to="/" className="back-button">
                        ← Back to Levels
                    </Link>
                    {levelNumber && <span className="level-indicator">Level {levelNumber}</span>}
                </motion.div>
            )}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
