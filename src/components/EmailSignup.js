import React, { useState } from 'react';
import SocialLinks from './SocialLinks';

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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_key: '3df89f65-f039-4d24-bc1f-2f2c87f85be4',
                    subject: 'New Book Release Notification Signup',
                    from_name: 'Author Website Newsletter',
                    email: email,
                    message: 'New newsletter signup request'
                }),
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Get Notified</h2>
            <p style={{ marginBottom: '20px', color: '#555' }}>
                Be the first to know when new books are available! Sign up to get notified about future releases and eclusive updates.
            </p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        style={{
                            flex: '1',
                            minWidth: '250px',
                            padding: '12px 20px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '25px',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s ease',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '12px 30px',
                            background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '25px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        {loading ? 'Subscribing...' : 'Notify Me'}
                    </button>
                </div>

                {status === 'success' && (
                    <div style={{
                        padding: '12px',
                        background: '#d4edda',
                        color: '#155724',
                        borderRadius: '8px',
                        border: '1px solid #c3e6cb',
                        textAlign: 'center'
                    }}>
                        You're on th elist. We'll nofity you when new books become available.
                    </div>
                )}

                {status === 'error' && (
                    <div style={{
                        padding: '12px',
                        background: '#f8d7da',
                        color: '#721c24',
                        borderRadius: '8px',
                        border: '1px solid #f5c6cb',
                        textAlign: 'center'
                    }}>
                        Oops! Something went wrong. Please try again.
                    </div>
                )}
            </form>

            <p style={{ 
                marginTop: '15px', 
                fontSize: '0.85rem', 
                color: '#999',
                textAlign: 'center'
            }}>
                We respect your privacy. Unsubscribe at any time.
            </p>

            <SocialLinks />
        </div>
    );
}

export default EmailSignup;
