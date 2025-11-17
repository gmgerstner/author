import React from 'react';
import testimonialsData from '../data/testimonials.json';

function Testimonials() {
    return (
        <div>
            <h2>What Readers Are Saying</h2>
            <div className="testimonials-grid">
                {testimonialsData.testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="testimonial-card">
                        <div className="testimonial-quote">
                            "{testimonial.quote}"
                        </div>
                        <div className="testimonial-author">
                            — {testimonial.author}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Testimonials;
