import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';

// Xano Backend Configuration
const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:WpZv-jLF';
const API_KEY = import.meta.env.VITE_API_KEY || '';

// Google reCAPTCHA Configuration
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear status message when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    // Get reCAPTCHA token
    let recaptchaToken = null;
    if (window.grecaptcha && RECAPTCHA_SITE_KEY) {
      try {
        recaptchaToken = window.grecaptcha.getResponse();
        if (!recaptchaToken) {
          setSubmitStatus({
            type: 'error',
            message: 'Please complete the reCAPTCHA verification.',
          });
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        setSubmitStatus({
          type: 'error',
          message: 'reCAPTCHA verification failed. Please refresh and try again.',
        });
        setIsSubmitting(false);
        return;
      }
    }

    // Prepare form submission data (matching Xano query structure exactly)
    // The query expects: name (trim), email (trim|lower), message (trim), recaptcha_token
    const formSubmissionData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      message: formData.message.trim(),
      ...(recaptchaToken && { recaptcha_token: recaptchaToken }),
    };

    try {
      // Submit form to database (matching Xano query: submit_form)
      const response = await fetch(`${API_BASE_URL}/submit_form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(formSubmissionData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message! I will get back to you soon.',
        });
        setFormData({ name: '', email: '', message: '' });
        
        // Reset reCAPTCHA after successful submission
        if (window.grecaptcha && RECAPTCHA_SITE_KEY) {
          try {
            window.grecaptcha.reset();
          } catch (error) {
            // Ignore reset errors
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || `Failed to save message. Status: ${response.status}`;
        setSubmitStatus({
          type: 'error',
          message: errorMessage,
        });
      }
    } catch (error) {
      let errorMessage = 'Failed to send message. Please try again later.';
      
      if (error.text) {
        errorMessage = `Error: ${error.text}`;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      setSubmitStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <FaEnvelope />, text: 'john10mar28@gmail.com'},
    { icon: <FaPhone />, text: '+94 77 62 60806' },
    { icon: <FaMapMarkerAlt />, text: 'Wattala, Gampaha', link: null },
  ];

  return (
    <section id="contact" className="contact">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>
        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Let's Connect</h3>
            <p>
              I'm always open to discussing new projects, creative ideas, or opportunities
              to be part of your visions. Feel free to reach out!
            </p>
            <div className="contact-details">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="contact-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  <div className="contact-icon">{info.icon}</div>
                  {info.link ? (
                    <a href={info.link}>{info.text}</a>
                  ) : (
                    <span>{info.text}</span>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="social-contact">
              <motion.a
                href="https://www.linkedin.com/in/johnsan-marshal-a1307535a/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin />
              </motion.a>
              <motion.a
                href="https://github.com/johnsan03"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGithub />
              </motion.a>
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </motion.div>
            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </motion.div>
            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <textarea
                name="message"
                placeholder="Your Message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </motion.div>
            {RECAPTCHA_SITE_KEY && (
              <motion.div
                className="form-group recaptcha-container"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <div
                  className="g-recaptcha"
                  data-sitekey={RECAPTCHA_SITE_KEY}
                ></div>
              </motion.div>
            )}
            {submitStatus.type && (
              <motion.div
                className={`form-status ${submitStatus.type}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {submitStatus.message}
              </motion.div>
            )}
            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

