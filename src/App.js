import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import authorData from './data/author.json';
import Home from './components/Home';
import Contact from './components/Contact';

function App() {
    const location = useLocation();

    useEffect(() => {
        // Smooth scrolling for anchor links
        const handleAnchorClick = (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);

        return () => {
            document.removeEventListener('click', handleAnchorClick);
        };
    }, []);

    return (
        <div className="container">
            <header>
                <div className="hero-content">
                    <img src={`${process.env.PUBLIC_URL}/${authorData.profileImage}`} alt="George M. Gerstner" className="profile-image" />
                    <h1>{authorData.name}</h1>
                    <p className="subtitle">{authorData.title}</p>
                </div>
            </header>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/contact" element={<Contact />} />
                {/* Catch all route - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <div className="navigation-links" style={{ 
                textAlign: 'center', 
                margin: '40px 0',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px'
            }}>
                {location.pathname === '/' ? (
                    <Link to="/contact" className="social-link">Contact Me</Link>
                ) : (
                    <Link to="/" className="social-link">← Back to Home</Link>
                )}
            </div>

            <footer>
                <p>&copy; 2025 {authorData.name}. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
