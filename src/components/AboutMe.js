import React from 'react';
import authorData from '../data/author.json';
import EmailSignup from './EmailSignup';

function AboutMe() {
    return (
        <div>
            <h2>About Me</h2>
            {authorData.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
            <EmailSignup />
        </div>
    );
}

export default AboutMe;
