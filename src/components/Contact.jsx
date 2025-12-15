import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

// Xano Backend Configuration
const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:WpZv-jLF';
const API_KEY = import.meta.env.VITE_API_KEY || '';

// Google reCAPTCHA v3 Configuration
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_USER_ID = import.meta.env.VITE_EMAILJS_USER_ID || '';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // Load reCAPTCHA v3 script when component mounts
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;

    // Check if script is already loaded
    if (window.grecaptcha && window.grecaptcha.ready) {
      setRecaptchaLoaded(true);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
    if (existingScript) {
      // Script exists, wait for it to load
      const checkLoaded = () => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          setRecaptchaLoaded(true);
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    // Load reCAPTCHA v3 script dynamically
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          setRecaptchaLoaded(true);
        });
      } else {
        setRecaptchaLoaded(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      const scriptToRemove = document.querySelector(`script[src*="recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}"]`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [RECAPTCHA_SITE_KEY]);

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

    // Get reCAPTCHA v3 token
    let recaptchaToken = null;
    if (window.grecaptcha && RECAPTCHA_SITE_KEY && recaptchaLoaded) {
      try {
        // reCAPTCHA v3: execute on form submit
        recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' });
        if (!recaptchaToken) {
          setSubmitStatus({
            type: 'error',
            message: 'reCAPTCHA verification failed. Please try again.',
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
    // The query input expects: name (trim), email (trim|lower), message (trim), recaptcha_token
    // Send fields directly as the Xano input section defines them as direct parameters
    const formSubmissionData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      message: formData.message.trim(),
      ...(recaptchaToken && { recaptcha_token: recaptchaToken }),
    };

    try {
      // Submit to both Xano (database) and EmailJS (email notification) in parallel
      const promises = [];

      // 1. Submit to Xano database
      const xanoPromise = fetch(`${API_BASE_URL}/submit_form`, {
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
      promises.push(xanoPromise);

      // 2. Send email via EmailJS (if configured)
      let emailjsPromise = null;
      const isEmailJSConfigured = EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_USER_ID;
      
      if (isEmailJSConfigured) {
        // Initialize EmailJS with Public Key (User ID)
        emailjs.init(EMAILJS_USER_ID);
        
        // Prepare EmailJS template parameters
        // These variable names should match your EmailJS template
        const emailjsTemplateParams = {
          from_name: formData.name.trim(),
          from_email: formData.email.trim().toLowerCase(),
          message: formData.message.trim(),
          to_name: 'Marshal Johnsan', // Your name
          reply_to: formData.email.trim().toLowerCase(), // For reply functionality
          user_name: formData.name.trim(), // Alternative variable name
          user_email: formData.email.trim().toLowerCase(), // Alternative variable name
        };

        // Send email via EmailJS API
        // Note: After init(), user ID is not needed in send()
        emailjsPromise = emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          emailjsTemplateParams
        ).then((response) => {
          console.log('EmailJS Success:', response.status, response.text);
          return response;
        }).catch((error) => {
          // Log EmailJS errors for debugging
          console.error('EmailJS Error:', error);
          throw error;
        });
        
        promises.push(emailjsPromise);
      } else {
        // Log if EmailJS is not configured (only in development)
        if (import.meta.env.DEV) {
          console.warn('EmailJS not configured. Missing environment variables:', {
            hasServiceId: !!EMAILJS_SERVICE_ID,
            hasTemplateId: !!EMAILJS_TEMPLATE_ID,
            hasUserId: !!EMAILJS_USER_ID
          });
        }
      }

      // Wait for all promises to complete
      const results = await Promise.allSettled(promises);
      
      // Check Xano response
      const xanoResult = results[0];
      let xanoSuccess = false;
      let xanoResponseData = {};

      if (xanoResult.status === 'fulfilled') {
        const response = xanoResult.value;
        xanoResponseData = await response.json().catch(() => ({}));
        xanoSuccess = response.ok && xanoResponseData.success;
      }

      // Check EmailJS response (if it was sent)
      let emailjsSuccess = true; // Default to true if EmailJS is not configured
      let emailjsError = null;
      if (emailjsPromise) {
        const emailjsResult = results[1];
        emailjsSuccess = emailjsResult.status === 'fulfilled';
        if (!emailjsSuccess) {
          emailjsError = emailjsResult.reason;
          console.error('EmailJS failed:', emailjsError);
        }
      }

      // Determine overall success and message
      if (xanoSuccess) {
        // Xano succeeded - form is saved
        let emailStatus = '';
        if (isEmailJSConfigured) {
          if (emailjsSuccess) {
            emailStatus = ' Email notification sent successfully!';
          } else {
            emailStatus = ' (Email notification failed, but your message was saved to database)';
          }
        }
        
        setSubmitStatus({
          type: 'success',
          message: (xanoResponseData.message || 'Thank you for your message! I will get back to you soon.') + emailStatus,
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        // Xano failed - show error
        const errorMessage = xanoResponseData.message || xanoResponseData.error || xanoResponseData.code || 'Failed to save message. Please try again.';
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

