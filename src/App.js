import { useState } from 'react';
import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import './App.css';
import authorData from './data/author.json';
import booksData from './data/books.json';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import AboutPage from './pages/AboutPage';
import Contact from './components/Contact';

function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [booksDropOpen, setBooksDropOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <div className="site-wrapper">
            {/* ── Header ── */}
            <header className="site-header">
                <div className="header-inner">

                    {/* Logo */}
                    <div className="header-logo">
                        <Link to="/" onClick={closeMenu}>
                            <img
                                src={`${process.env.PUBLIC_URL}/gmgnovels-logo.png`}
                                alt="GMG Novels"
                                className="logo-img"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <span className="logo-text-fallback" style={{ display: 'none' }}>
                                GMG Novels
                            </span>
                        </Link>
                    </div>

                    {/* Nav */}
                    <nav className={`main-nav${menuOpen ? ' nav-open' : ''}`}>
                        <ul className="nav-list">
                            <li>
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                                    onClick={closeMenu}
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li
                                className="nav-has-dropdown"
                                onMouseEnter={() => setBooksDropOpen(true)}
                                onMouseLeave={() => setBooksDropOpen(false)}
                            >
                                <NavLink
                                    to="/books"
                                    className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                                    onClick={closeMenu}
                                >
                                    Books
                                </NavLink>
                                <ul className={`nav-dropdown${booksDropOpen ? ' dropdown-open' : ''}`}>
                                    {booksData.series.books.map(book => (
                                        <li key={book.id}>
                                            <Link
                                                to={`/books/${book.id}`}
                                                className="dropdown-link"
                                                onClick={() => { closeMenu(); setBooksDropOpen(false); }}
                                            >
                                                {book.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                                    onClick={closeMenu}
                                >
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/contact"
                                    className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                                    onClick={closeMenu}
                                >
                                    Contact
                                </NavLink>
                            </li>
                        </ul>
                    </nav>

                    {/* Social Icons */}
                    <div className="header-social">
                        {authorData.socialLinks.map(link => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="header-social-link"
                                title={link.name}
                            >
                                <img src={link.icon} alt={link.name} />
                            </a>
                        ))}
                    </div>

                    {/* Hamburger */}
                    <button
                        className={`hamburger${menuOpen ? ' hamburger-open' : ''}`}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="site-main">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/books" element={<BooksPage />} />
                    <Route path="/books/:bookId" element={<BookDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            {/* ── Footer ── */}
            <footer className="site-footer">
                <div className="footer-inner">

                    <div className="footer-brand">
                        <Link to="/" className="footer-name">{authorData.name}</Link>
                        <p className="footer-title">{authorData.title}</p>
                        <img
                            src={`${process.env.PUBLIC_URL}/gmgnovels-logo.png`}
                            alt="GMG Novels Logo"
                            className="footer-logo"
                            width="150px"
                        />
                    </div>

                    <nav className="footer-nav">
                        <Link to="/">Home</Link>
                        <Link to="/books">Books</Link>
                        <Link to="/about">About</Link>
                        <Link to="/contact">Contact</Link>
                    </nav>

                    <div className="footer-social-section">
                        <p className="footer-social-heading">Connect with George!</p>
                        <div className="footer-social-links">
                            {authorData.socialLinks.map(link => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-social-link"
                                >
                                    <img src={link.icon} alt={link.name} />
                                    <span>{link.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="footer-copy">
                        <p>&copy; 2025 {authorData.name}. All rights reserved.</p>
                    </div>

                </div>
            </footer>
        </div>
    );
}

export default App;
