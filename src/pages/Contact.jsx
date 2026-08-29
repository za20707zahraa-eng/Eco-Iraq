import "./Contact.css";

function Contact() {
  return (
    <section className="contact-page">
      <div className="contact-glow contact-glow-one"></div>
      <div className="contact-glow contact-glow-two"></div>

      <div className="contact-container">

        <div className="contact-header">
          <div className="contact-label">
            <span className="contact-dot"></span>
            CONTACT US
          </div>

          <h1>
            Let's <span>Connect</span>
          </h1>

          <p>
            Have a question, suggestion, or environmental problem?
            Tell us about it and let Eco-Iraq hear your voice.
          </p>
        </div>

        <div className="contact-frame">

          <div className="contact-decoration contact-decoration-one">
            🌿
          </div>

          <div className="contact-decoration contact-decoration-two">
            ❀
          </div>

          <div className="contact-form-card">

            <div className="contact-card-title">
              <span>01</span>
              <div>
                <small>YOUR INFORMATION</small>
                <h2>Write to us</h2>
              </div>
            </div>

            <div className="contact-input-group">
              <label>YOUR NAME</label>
              <input
                type="text"
                placeholder="Write your name"
              />
            </div>

            <div className="contact-input-group">
              <label>YOUR EMAIL</label>
              <input
                type="email"
                placeholder="Write your email"
              />
            </div>

            <div className="contact-input-group">
              <label>PHONE NUMBER</label>
              <input
                type="tel"
                placeholder="Write your phone number"
              />
            </div>

            <div className="contact-input-group">
              <label>THE PROBLEM</label>
              <textarea
                placeholder="Write the problem"
                rows="5"
              ></textarea>
            </div>

            <button className="contact-submit">
              SEND MESSAGE
              <span>→</span>
            </button>

          </div>

          <div className="contact-info">

            <div className="contact-info-card">
              <div className="info-icon">✉</div>
              <div>
                <span>EMAIL</span>
                <h3>ecoiraq@gmail.com</h3>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="info-icon cyan-info">☎</div>
              <div>
                <span>PHONE</span>
                <h3>+964 7XX XXX XXXX</h3>
              </div>
            </div>

            <div className="contact-info-card contact-message-card">
              <div className="info-icon">❀</div>
              <div>
                <span>YOUR VOICE MATTERS</span>
                <h3>Help us protect Iraq's environment.</h3>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Contact;