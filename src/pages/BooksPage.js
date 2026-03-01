import { Link } from 'react-router-dom';
import booksData from '../data/books.json';

function BooksPage() {
    return (
        <div className="inner-page">

            <div className="page-header">
                <div className="page-header-inner">
                    <span className="section-kicker">George M. Gerstner</span>
                    <h1 className="page-title">Books</h1>
                </div>
            </div>

            <div className="section-inner">
                <div className="series-header">
                    <h2 className="series-name">{booksData.series.name}</h2>
                    <p className="series-desc">{booksData.series.description}</p>
                </div>

                <div className="books-grid books-grid-large">
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
                                    <p className="book-card-year">{book.year} · {book.status}</p>
                                    {book.tagline && (
                                        <p className="book-card-tagline">"{book.tagline}"</p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default BooksPage;
