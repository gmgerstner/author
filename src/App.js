import React, { useEffect } from 'react';
import './App.css';
import authorData from './data/author.json';
import booksData from './data/books.json';
import newsData from './data/news.json';

function App() {
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
            document.removeEventListener('click', handleAnchorClick);
            observer.disconnect();
        };
    }, []);

    return (
        <div className="container">
            <header>
                <div className="hero-content">
                    <img src={authorData.profileImage} alt="George M. Gerstner" className="profile-image" />
                    <h1>{authorData.name}</h1>
                    <p className="subtitle">{authorData.title}</p>
                </div>
            </header>

            <div className="main-content">
                <section className="section">
                    <h2>About Me</h2>
                    {authorData.bio.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </section>

                <section className="section">
                    <h2>Latest News</h2>
                    {newsData.newsItems.map((newsItem) => (
                        <div key={newsItem.id} style={{ borderLeft: '4px solid #667eea', paddingLeft: '20px', marginBottom: '20px' }}>
                            <h3 style={{ color: '#764ba2', marginBottom: '10px' }}>{newsItem.title}</h3>
                            {newsItem.date && (
                                <p style={{ marginBottom: '10px' }}><strong>Expected Release:</strong> {newsItem.date}</p>
                            )}
                            <p>{newsItem.content}</p>
                            {newsItem.upcomingReleases && newsItem.upcomingReleases.map((release, index) => (
                                <p key={index}><strong>{release.title}:</strong> {release.date}</p>
                            ))}
                        </div>
                    ))}
                </section>

                <section className="section full-width">
                    <h2>{booksData.series.name}</h2>
                    <div className="book-grid">
                        {booksData.series.books.map((book) => (
                            <div key={book.id} className={`book-card ${!book.isAvailable ? 'coming-soon' : ''}`}>
                                <div className="book-cover">
                                    {book.url ? (
                                        <a
                                            href={book.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ display: 'block' }}
                                        >
                                            <img
                                                src={book.coverImage}
                                                alt={`${book.title} book cover`}
                                                onError={(e) => {
                                                    e.target.parentElement.classList.add('placeholder');
                                                    e.target.parentElement.innerHTML = book.title;
                                                }}
                                            />
                                        </a>
                                    ) : (
                                        <img
                                            src={book.coverImage}
                                            alt={`${book.title} book cover`}
                                            onError={(e) => {
                                                e.target.parentElement.classList.add('placeholder');
                                                e.target.parentElement.innerHTML = book.title;
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="book-title">{book.title}</div>
                                <div className="book-year">{book.year} - {book.status}</div>
                            </div>
                        ))}
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '30px', fontStyle: 'italic', color: '#666' }}>
                        {booksData.series.description}
                    </p>
                </section>

                {/* Commented out sections - uncomment when ready to use */}
                {/* 
        <section className="section full-width">
          <h2>What Readers Say</h2>
          <blockquote style={{borderLeft: '4px solid #667eea', paddingLeft: '20px', marginBottom: '20px', fontStyle: 'italic', color: '#555'}}>
            "Sentinel's Dilemma kept me on the edge of my seat from start to finish. The moral complexity of the protagonist's choices made for compelling reading."
            <footer style={{marginTop: '10px', fontWeight: 'bold', color: '#764ba2'}}>— Early Reader</footer>
          </blockquote>
          <blockquote style={{borderLeft: '4px solid #667eea', paddingLeft: '20px', fontStyle: 'italic', color: '#555'}}>
            "Can't wait for the next book in The Sentinel Series. This author has created a world I want to keep exploring."
            <footer style={{marginTop: '10px', fontWeight: 'bold', color: '#764ba2'}}>— Beta Reader</footer>
          </blockquote>
        </section>
        */}

                {/* 
        <section className="section full-width">
          <h2>Get In Touch</h2>
          <p style={{textAlign: 'center', marginBottom: '30px'}}>I love hearing from readers! Whether you want to share your thoughts on my books, invite me to an event, or just say hello, I'd love to connect with you.</p>
          
          <form className="contact-form" onSubmit={(e) => {
            e.preventDefault();
            alert('Thank you for your message! I\'ll get back to you soon.');
          }}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>

          <div className="social-links">
            {authorData.socialLinks.map((link, index) => (
              <a key={index} href={link.url} className="social-link">{link.name}</a>
            ))}
          </div>
        </section>
        */}
            </div>

            <footer>
                <p>&copy; 2025 {authorData.name}. All rights reserved. Contact the author at gmgerstner@gmail.com</p>
            </footer>
        </div>
    );
}

export default App;
