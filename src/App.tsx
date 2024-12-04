import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage/HomePage';
import LevelOnePage from './pages/01_LevelOnePage/LevelOnePage';
import LevelTwoPage from './pages/02_LevelTwoPage/LevelTwoPage';
import LevelThreePage from './pages/03_LevelThreePage/LevelThreePage';
import Layout from './components/Layout/Layout';
import ProtectedLevel from './components/ProtectedLevel/ProtectedLevel';
import './App.css';
import LevelFourPage from './pages/04_LevelFourPage/LevelFourPage';
import LevelFivePage from './pages/05_LevelFivePage/LevelFivePage';
import LevelSixPage from './pages/06_LevelSixPage/LevelSixPage';
import LevelSevenPage from './pages/07_LevelSevenPage/LevelSeven';
import LevelEightPage from './pages/08_LevelEightPage/LevelEightPage';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/level" element={<ProtectedLevel />}>
                            <Route path="1" element={<LevelOnePage />} />
                            <Route path="2" element={<LevelTwoPage />} />
                            <Route path="3" element={<LevelThreePage />} />
                            <Route path="4" element={<LevelFourPage />} />
                            <Route path="5" element={<LevelFivePage />} />
                            <Route path="6" element={<LevelSixPage />} />
                            <Route path="7" element={<LevelSevenPage />} />
                            <Route path="8" element={<LevelEightPage />} />
                            {/* Add new levels here */}
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>

                    <Route path="/reset" element={<Reset />} />
                </Routes>

                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#333',
                            color: '#fff',
                        },
                    }}
                />
            </div>
        </BrowserRouter>
    );
}

function Reset() {
    localStorage.clear();
    return <Navigate to="/" replace />;
}

export default App;
