import React from 'react';

export default function Contact() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "3df89f65-f039-4d24-bc1f-2f2c87f85be4");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="main-content">
      <section className="section full-width">
        <h2>Get In Touch</h2>
        <p style={{textAlign: 'center', marginBottom: '30px'}}>
          I love hearing from readers! Whether you want to share your thoughts on my books, 
          ask me a question, invite me to an event, or just say hello, I'd love to connect 
          with you.
        </p>
        
        <form className="contact-form" onSubmit={onSubmit}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" name="subject" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>

        {result && (
          <div style={{
            textAlign: 'center', 
            marginTop: '20px', 
            padding: '10px',
            backgroundColor: result.includes('Successfully') ? '#d4edda' : '#f8d7da',
            color: result.includes('Successfully') ? '#155724' : '#721c24',
            border: `1px solid ${result.includes('Successfully') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '8px'
          }}>
            {result}
          </div>
        )}
      </section>
    </div>
  );
}