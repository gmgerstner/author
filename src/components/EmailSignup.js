import { useState } from 'react';

function EmailSignup() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: '3df89f65-f039-4d24-bc1f-2f2c87f85be4',
                    subject: 'New Newsletter Signup',
                    from_name: 'Author Website Newsletter',
                    email,
                    message: 'New newsletter signup request',
                }),
            });

            const data = await response.json();
            setStatus(data.success ? 'success' : 'error');
            if (data.success) setEmail('');
        } catch {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="email-signup">
            <h2>Stay Connected</h2>
            <p className="email-signup-desc">
                Sign up to receive news, updates, and exclusive opportunities — including ARC
                (Advanced Reader Copy) access to upcoming releases.
            </p>

            <form onSubmit={handleSubmit} className="email-signup-form">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="email-signup-input"
                />
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>

            {status === 'success' && (
                <div className="email-status success">
                    Thank you for signing up! You'll be the first to hear about new releases.
                </div>
            )}
            {status === 'error' && (
                <div className="email-status error">
                    Something went wrong. Please try again.
                </div>
            )}

            <p className="email-privacy">We respect your privacy. Unsubscribe at any time.</p>
        </div>
    );
}

export default EmailSignup;
