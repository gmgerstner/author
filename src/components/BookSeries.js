import React from 'react';
import booksData from '../data/books.json';

function BookSeries() {
    return (
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
    );
}

export default BookSeries;
