import { motion } from 'framer-motion';
import {
  FaLinkedin,
  FaExternalLinkAlt,
  FaFilePdf,
  FaCalendarAlt,
  FaAward,
} from 'react-icons/fa';
import { SiLinkedin } from 'react-icons/si';

const Certificates = () => {
  // Replace sample entries with your real LinkedIn certificates.
  // linkedinUrl: your certificate's public LinkedIn verification link
  // pdf: optional path after upload, e.g. import from '../assets/certificates/my-cert.pdf'
  const certificates = [
    {
      title: 'React.js Essential Training',
      issuer: 'LinkedIn Learning',
      date: 'March 2024',
      skills: ['React', 'JavaScript', 'Frontend'],
      linkedinUrl: 'https://www.linkedin.com/learning/certificates/sample-react-essential',
      pdf: null,
    },
    {
      title: 'AWS Cloud Practitioner Essentials',
      issuer: 'LinkedIn Learning',
      date: 'January 2024',
      skills: ['AWS', 'Cloud Computing', 'DevOps'],
      linkedinUrl: 'https://www.linkedin.com/learning/certificates/sample-aws-cloud-practitioner',
      pdf: null,
    },
    {
      title: 'JavaScript: The Complete Guide',
      issuer: 'LinkedIn Learning',
      date: 'November 2023',
      skills: ['JavaScript', 'ES6', 'Web Development'],
      linkedinUrl: 'https://www.linkedin.com/learning/certificates/sample-javascript-complete',
      pdf: null,
    },
    {
      title: 'Node.js: Building RESTful APIs',
      issuer: 'LinkedIn Learning',
      date: 'September 2023',
      skills: ['Node.js', 'REST API', 'Backend'],
      linkedinUrl: 'https://www.linkedin.com/learning/certificates/sample-nodejs-rest-api',
      pdf: null,
    },
    {
      title: 'Python for Data Science',
      issuer: 'LinkedIn Learning',
      date: 'June 2023',
      skills: ['Python', 'Data Analysis', 'Machine Learning'],
      linkedinUrl: 'https://www.linkedin.com/learning/certificates/sample-python-data-science',
      pdf: null,
    },
    {
      title: 'Git and GitHub Essential Training',
      issuer: 'LinkedIn Learning',
      date: 'April 2023',
      skills: ['Git', 'GitHub', 'Version Control'],
      linkedinUrl: 'https://www.linkedin.com/learning/certificates/sample-git-github',
      pdf: null,
    },
  ];

  return (
    <section id="certificates" className="certificates">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Certificates
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Professional credentials verified on LinkedIn Learning
        </motion.p>

        <div className="certificates-grid">
          {certificates.map((cert, index) => (
            <motion.article
              key={cert.title}
              className="certificate-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
            >
              <div className="certificate-preview">
                <div className="certificate-preview-inner">
                  <div className="certificate-preview-header">
                    <SiLinkedin className="certificate-linkedin-icon" />
                    <span className="certificate-preview-badge">
                      <FaAward /> Certificate
                    </span>
                  </div>
                  <div className="certificate-preview-body">
                    <p className="certificate-preview-label">Certificate of Completion</p>
                    <h3 className="certificate-preview-title">{cert.title}</h3>
                    <p className="certificate-preview-issuer">{cert.issuer}</p>
                  </div>
                  <div className="certificate-preview-footer">
                    <FaFilePdf className="certificate-pdf-icon" />
                    <span>PDF preview coming soon</span>
                  </div>
                </div>
              </div>

              <div className="certificate-content">
                <div className="certificate-meta">
                  <span className="certificate-issuer-tag">
                    <SiLinkedin />
                    {cert.issuer}
                  </span>
                  <span className="certificate-date">
                    <FaCalendarAlt />
                    {cert.date}
                  </span>
                </div>

                <h3 className="certificate-title">{cert.title}</h3>

                <div className="certificate-skills">
                  {cert.skills.map((skill) => (
                    <span key={skill} className="course-tag">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="certificate-actions">
                  <motion.a
                    href={cert.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="certificate-btn certificate-btn-primary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FaLinkedin />
                    Verify on LinkedIn
                    <FaExternalLinkAlt className="certificate-btn-arrow" />
                  </motion.a>
                  {cert.pdf && (
                    <motion.a
                      href={cert.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="certificate-btn certificate-btn-secondary"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaFilePdf />
                      View PDF
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
