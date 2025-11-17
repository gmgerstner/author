import React from 'react';
import authorData from '../data/author.json';

function AboutMe() {
    return (
        <section className="section">
            <h2>About Me</h2>
            {authorData.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
            
            {/* Social Media Links */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '20px', 
                marginTop: '30px',
                flexWrap: 'wrap'
            }}>
                {authorData.socialLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px) scale(1.1)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        title={link.name} // Tooltip on hover
                    >
                        {link.icon && (
                            <img 
                                src={link.icon} 
                                alt={`${link.name} icon`}
                                style={{ 
                                    width: '24px', 
                                    height: '24px',
                                    filter: 'brightness(0) saturate(100%) invert(20%) sepia(8%) saturate(665%) hue-rotate(314deg) brightness(99%) contrast(94%)', // Makes icons a nice dark gray (#333)
                                    transition: 'all 0.3s ease',
                                    pointerEvents: 'none' // Prevents image from interfering with hover
                                }}
                            />
                        )}
                    </a>
                ))}
            </div>
        </section>
    );
}

export default AboutMe;
