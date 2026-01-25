import React from 'react';
import authorData from '../data/author.json';

function SocialLinks() {
    return (
        <div>
            <h2>Connect With Me</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '15px',
                marginTop: '20px'
            }}>
                {authorData.socialLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '20px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf7 100%)',
                            border: '2px solid #e0e6ed',
                            transition: 'all 0.3s ease',
                            textDecoration: 'none',
                            textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.borderColor = '#667eea';
                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = '#e0e6ed';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            flexShrink: 0
                        }}>
                            {link.icon && (
                                <img
                                    src={link.icon}
                                    alt={`${link.name} icon`}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        filter: 'brightness(0) invert(1)',
                                        transition: 'all 0.3s ease',
                                        pointerEvents: 'none'
                                    }}
                                />
                            )}
                        </div>
                        <span style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#2c3e50'
                        }}>
                            {link.name}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default SocialLinks;
