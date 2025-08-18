import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import authorData from '../data/author.json';
import booksData from '../data/books.json';
import newsData from '../data/news.json';

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
            <section className="section">
                <h2>About Me</h2>
                {authorData.bio.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </section>

            <section className="section">
                <h2>Latest News</h2>
                {newsData.newsItems.map((newsItem) => (
                    <div key={newsItem.id} style={{ 
                        borderLeft: '4px solid #667eea', 
                        paddingLeft: '20px', 
                        marginBottom: '20px' 
                    }}>
                        <h3 style={{ color: '#764ba2', marginBottom: '10px' }}>
                            {newsItem.title}
                        </h3>
                        {newsItem.date && (
                            <p style={{ 
                                marginBottom: '10px', 
                                fontSize: '0.9rem', 
                                color: '#666',
                                fontStyle: 'italic'
                            }}>
                                {newsItem.date}
                            </p>
                        )}
                        <div className="markdown-content">
                            <ReactMarkdown>{newsItem.content}</ReactMarkdown>
                        </div>
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
                                            src={`${process.env.PUBLIC_URL}/${book.coverImage}`}
                                            alt={`${book.title} book cover`}
                                            onError={(e) => {
                                                e.target.parentElement.classList.add('placeholder');
                                                e.target.parentElement.innerHTML = book.title;
                                            }}
                                        />
                                    </a>
                                ) : (
                                    <img
                                        src={`${process.env.PUBLIC_URL}/${book.coverImage}`}
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
        </div>
    );
}

export default Home;