import { useState } from 'react';

export default function Contact() {
    const [result, setResult] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();
        setResult('Sending...');
        const formData = new FormData(event.target);
        formData.append('access_key', '3df89f65-f039-4d24-bc1f-2f2c87f85be4');

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            setResult('Message sent successfully! I\'ll be in touch soon.');
            event.target.reset();
        } else {
            setResult(data.message || 'Something went wrong. Please try again.');
        }
    };

    const isSuccess = result.includes('successfully');

    return (
        <div className="inner-page">

            <div className="page-header">
                <div className="page-header-inner">
                    <span className="section-kicker">Get In Touch</span>
                    <h1 className="page-title">Contact</h1>
                </div>
            </div>

            <div className="section-inner">
                <p className="contact-intro">
                    I love hearing from readers! Whether you want to share your thoughts on my books,
                    ask a question, or just say hello — I'd love to connect with you.
                </p>

                <div className="contact-form-wrap">
                    <form className="contact-form" onSubmit={onSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Your Name</label>
                                <input type="text" id="name" name="name" placeholder="Jane Smith" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" name="email" placeholder="jane@example.com" required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input type="text" id="subject" name="subject" placeholder="What's on your mind?" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Your Message</label>
                            <textarea id="message" name="message" rows="6" placeholder="Write your message here..." required></textarea>
                        </div>
                        <div>
                            <button type="submit" className="btn btn-primary">Send Message</button>
                        </div>
                    </form>

                    {result && (
                        <div className={`form-result${isSuccess ? ' success' : ' error'}`}>
                            {result}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
