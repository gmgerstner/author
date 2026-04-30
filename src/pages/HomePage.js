import { Link } from 'react-router-dom';
import booksData from '../data/books.json';
import testimonialData from '../data/testimonials.json';
import authorData from '../data/author.json';
import KitSignup from '../components/KitSignup';

function HomePage() {
    const featuredBook = booksData.series.books.find(b => b.isAvailable) || booksData.series.books[0];

    return (
        <div className="home-page">

            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-text">
                        <span className="hero-tagline">Author of The Sentinel Trilogy</span>
                        <h1 className="hero-title">George M.<br />Gerstner</h1>
                        <p className="hero-subtitle">Science Fiction Storyteller</p>
                        <div className="hero-ctas">
                            <Link to="/books" className="btn btn-primary">Explore Books</Link>
                            <Link to="/about" className="btn btn-outline">About the Author</Link>
                        </div>
                    </div>
                    <div className="hero-cover">
                        <Link to={`/books/${featuredBook.id}`}>
                            <img
                                src={`${process.env.PUBLIC_URL}/${featuredBook.coverImage}`}
                                alt={featuredBook.title}
                                className="hero-book-img"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Featured Book ── */}
            <section className="featured-section">
                <div className="section-inner">
                    <div className="featured-book">
                        <div className="featured-cover">
                            <img
                                src={`${process.env.PUBLIC_URL}/${featuredBook.coverImage}`}
                                alt={featuredBook.title}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                        <div className="featured-info">
                            <span className="series-label">
                                {booksData.series.name} · Book {featuredBook.number}
                            </span>
                            <h2 className="featured-title">{featuredBook.title}</h2>
                            {featuredBook.tagline && (
                                <p className="featured-tagline">"{featuredBook.tagline}"</p>
                            )}
                            {featuredBook.description && (
                                <p className="featured-description">{featuredBook.description[0]}</p>
                            )}
                            <div className="featured-ctas">
                                {featuredBook.isAvailable && featuredBook.url && (
                                    <a
                                        href={featuredBook.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                    >
                                        Buy Now
                                    </a>
                                )}
                                <Link to={`/books/${featuredBook.id}`} className="btn btn-outline">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Series Overview ── */}
            <section className="series-section">
                <div className="section-inner">
                    <span className="section-kicker">The Complete Series</span>
                    <h2 className="section-title">{booksData.series.name}</h2>
                    <p className="section-desc">{booksData.series.description}</p>
                    <div className="books-grid">
                        {booksData.series.books.map(book => (
                            <Link to={`/books/${book.id}`} key={book.id} className="book-card-link">
                                <div className={`book-card${!book.isAvailable ? ' book-coming-soon' : ''}`}>
                                    <div className="book-card-cover">
                                        <img
                                            src={`${process.env.PUBLIC_URL}/${book.coverImage}`}
                                            alt={book.title}
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                        {!book.isAvailable && (
                                            <div className="book-card-overlay">Coming {book.year}</div>
                                        )}
                                    </div>
                                    <div className="book-card-info">
                                        <p className="book-card-number">Book {book.number}</p>
                                        <h3 className="book-card-title">{book.title}</h3>
                                        <p className="book-card-year">{book.year}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '48px' }}>
                        <Link to="/books" className="btn btn-outline">View All Books</Link>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            {testimonialData.testimonials.length > 0 && (
                <section className="testimonials-section">
                    <div className="section-inner">
                        <span className="section-kicker">Reader Reviews</span>
                        <h2 className="section-title">What Readers Are Saying</h2>
                        <div className="testimonials-list">
                            {testimonialData.testimonials.map(t => (
                                <blockquote key={t.id} className="testimonial">
                                    <p className="testimonial-quote">"{t.quote}"</p>
                                    <footer className="testimonial-author">— {t.author}</footer>
                                </blockquote>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Newsletter / Free Story ── */}
            {/* {authorData.showFreeStory && (
                <section className="newsletter-section">
                    <div className="section-inner">
                        <KitSignup />
                    </div>
                </section>
            )} */}

        </div>
    );
}

export default HomePage;
