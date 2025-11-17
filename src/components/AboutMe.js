import React from 'react';
import authorData from '../data/author.json';

function AboutMe() {
    return (
        <section className="section">
            <h2>About Me</h2>
            {authorData.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </section>
    );
}

export default AboutMe;
