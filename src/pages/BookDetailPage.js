import { Link, useParams, Navigate } from 'react-router-dom';
import booksData from '../data/books.json';

function BookDetailPage() {
    const { bookId } = useParams();
    const book = booksData.series.books.find(b => b.id === bookId);
    const otherBooks = booksData.series.books.filter(b => b.id !== bookId);

    if (!book) return <Navigate to="/books" replace />;

    return (
        <div className="inner-page">

            <div className="page-header">
                <div className="page-header-inner">
                    <nav className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <Link to="/books">Books</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span>{book.title}</span>
                    </nav>
                    <p className="section-kicker" style={{ marginBottom: 0 }}>
                        {booksData.series.name} · Book {book.number}
                    </p>
                </div>
            </div>

            <div className="section-inner">
                <div className="book-detail">

                    <div className="book-detail-cover">
                        <img
                            src={`${process.env.PUBLIC_URL}/${book.coverImage}`}
                            alt={`${book.title} book cover`}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>

                    <div className="book-detail-info">
                        <h1 className="book-detail-title">{book.title}</h1>
                        <p className="book-detail-year">{book.year} · {book.status}</p>

                        {book.tagline && (
                            <p className="book-detail-tagline">"{book.tagline}"</p>
                        )}

                        <div className="book-detail-description">
                            {book.description && book.description.map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>

                        <div className="book-detail-ctas">
                            {book.isAvailable && book.url ? (
                                <a
                                    href={book.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                >
                                    Buy Now on Amazon
                                </a>
                            ) : (
                                <span className="btn btn-disabled">Coming {book.year}</span>
                            )}
                        </div>
                    </div>

                </div>

                {otherBooks.length > 0 && (
                    <div className="other-books">
                        <h2 className="section-title">Also in {booksData.series.name}</h2>
                        <div className="books-grid">
                            {otherBooks.map(b => (
                                <Link to={`/books/${b.id}`} key={b.id} className="book-card-link">
                                    <div className={`book-card${!b.isAvailable ? ' book-coming-soon' : ''}`}>
                                        <div className="book-card-cover">
                                            <img
                                                src={`${process.env.PUBLIC_URL}/${b.coverImage}`}
                                                alt={b.title}
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                            {!b.isAvailable && (
                                                <div className="book-card-overlay">Coming {b.year}</div>
                                            )}
                                        </div>
                                        <div className="book-card-info">
                                            <p className="book-card-number">Book {b.number}</p>
                                            <h3 className="book-card-title">{b.title}</h3>
                                            <p className="book-card-year">{b.year}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default BookDetailPage;
