import React, { useEffect } from 'react';
import AboutMe from './AboutMe';
import EmailSignup from './EmailSignup';
import LatestNews from './LatestNews';
import BookSeries from './BookSeries';
import Testimonials from './Testimonials';

function Home() {
    useEffect(() => {
        // Add scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections for scroll animations
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="main-content">
            <section className="section"><AboutMe /></section>
            <section className="section"><LatestNews /></section>
            <section className="section"><EmailSignup /></section>
            <section className="section full-width"><BookSeries /></section>
            <section className="section full-width"><Testimonials /></section>
        </div>
    );
}

export default Home;
