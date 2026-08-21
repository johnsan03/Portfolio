import { motion } from 'framer-motion';
import {
  FaLinkedin,
  FaExternalLinkAlt,
  FaFilePdf,
  FaCalendarAlt,
  FaAward,
} from 'react-icons/fa';
import { SiLinkedin } from 'react-icons/si';

/**
 * Certificate PDFs were referenced as plain strings pointing into `src/`,
 * e.g. "src/assets/certificates/Foo.pdf". Vite only emits assets that are
 * actually imported, so none of them shipped and every "View PDF" link 404'd
 * once deployed. Globbing them as URLs makes Vite bundle each file and hand
 * back a correctly base-prefixed, URL-safe path (which also sidesteps the
 * spaces and "·" in some of these filenames).
 */
const certificatePdfs = import.meta.glob('../assets/certificates/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
});

const pdfUrl = (fileName) => certificatePdfs[`../assets/certificates/${fileName}`];

const Certificates = () => {

  const certificates = [
    {
      title: 'Machine Learning Essentials for Business and Technical Decision Makers',
      issuer: 'AWS Training and Certification',
      date: 'June 2026',
      skills: ['Business Intelligence', 'Technical Decision Making', 'Machine Learning', 'Cloud Computing'],
      linkedinUrl: 'https://www.linkedin.com/in/johnsan-marshal-a1307535a/details/certifications',
      pdf: pdfUrl('Business and Technical Decision Makers.pdf'),
    },
    {
      title: 'Getting Started with DevOps on AWS',
      issuer: 'AWS Training and Certification',
      date: 'June 2026',
      skills: ['AWS', 'Cloud Computing', 'DevOps', 'Continuous Integration', 'Continuous Delivery'],
      linkedinUrl: 'https://www.linkedin.com/in/johnsan-marshal-a1307535a/details/certifications/',
      pdf: pdfUrl('GettingStartedWithDevopsAWS.pdf'),
    },
    {
      title: 'Machine Learning Terminology and Process',
      issuer: 'AWS Training and Certification',
      date: 'June 2026',
      skills: ['Machine Learning', 'Data Science', 'Python', 'Data Analysis', 'Cloud Computing'],
      linkedinUrl: 'https://www.linkedin.com/in/johnsan-marshal-a1307535a/details/certifications/',
      pdf: pdfUrl('TerminologyAndProcess.pdf'),
    },
    {
      title: 'Introduction to Machine Learning: Art of the Possible',
      issuer: 'AWS Training and Certification',
      date: 'June 2026',
      skills: ['Machine Learning', 'Data Science', 'Python', 'Data Analysis', 'Cloud Computing'],
      linkedinUrl: 'https://www.linkedin.com/in/johnsan-marshal-a1307535a/details/certifications/',
      pdf: pdfUrl('MachineLearningArtOfThePossible.pdf'),
    },
    {
      title: 'Planning a Machine Learning Project',
      issuer: 'AWS Training and Certification',
      date: 'June 2026',
      skills: ['Machine Learning', 'Data Science', 'Python', 'Data Analysis', 'Cloud Computing'],
      linkedinUrl: 'https://www.linkedin.com/in/johnsan-marshal-a1307535a/details/certifications/',
      pdf: pdfUrl('PlanningAMachine.pdf'),
    },
    {
      title: 'Machine Learning and AI Foundations: Recommendations',
      issuer: 'AWS Training and Certification',
      date: 'June 2026',
      skills: [ 'Data Analysis', 'Machine Learning', 'AI', 'Cloud Computing'],
      linkedinUrl: 'https://www.linkedin.com/in/johnsan-marshal-a1307535a/details/certifications/',
      pdf: pdfUrl('MachineLearningPLAN.pdf'),
    },
    {
      title: 'Claude 101: An Introduction to Claude AI',
      issuer: 'Anthropic',
      date: 'July 2026',
      skills: ['AI', 'Machine Learning', 'Natural Language Processing', 'Cloud Computing'],
      linkedinUrl: 'https://www.linkedin.com/in/johnsan-marshal-a1307535a/details/certifications/',
      pdf: pdfUrl('Claude101.pdf'),
    },
    {
      title: 'Claude Code 101: An Introduction to Claude AI for Developers',
      issuer: 'Anthropic',
      date: 'August 2026',
      skills: ['AI', 'Machine Learning', 'Natural Language Processing', 'Cloud Computing', 'Software Development'],
      linkedinUrl: 'https://www.linkedin.com/in/johnsan-marshal-a1307535a/details/certifications/',
      pdf: pdfUrl('ClaudeCode101.pdf'),
    },
     {
      title: 'Claude with the Anthropic API',
      issuer: 'Anthropic',
      date: 'August 2026',
      skills: ['AI', 'Machine Learning', 'Natural Language Processing', 'Cloud Computing', 'API Integration'],
      linkedinUrl: 'https://www.linkedin.com/in/johnsan-marshal-a1307535a/details/certifications/',
      pdf: pdfUrl('claude-with-the-anthropic-api.pdf'),
    },
     {
      title: 'Intro to Claude AI',
      issuer: 'Anthropic',
      date: 'August 2026',
      skills: ['AI', 'Machine Learning', 'Natural Language Processing', 'Cloud Computing'],
      linkedinUrl: 'https://www.linkedin.com/in/johnsan-marshal-a1307535a/details/certifications/',
      pdf: pdfUrl('IntroToClaudeAI.pdf'),
    },
      {
      title: 'AI Capabilities and Limitations',
      issuer: 'Claude Academy',
      date: 'August 2026',
      skills: ['AI', 'Machine Learning', 'Natural Language Processing', 'Cloud Computing'],
      linkedinUrl: 'https://www.linkedin.com/in/johnsan-marshal-a1307535a/details/certifications/',
      pdf: pdfUrl('AI-CapAndLimitations.pdf'),
    },
      {
      title: 'Claude AI for Business',
      issuer: 'Claude Academy',
      date: 'August 2026',
      skills: ['AI', 'Machine Learning', 'Natural Language Processing', 'Cloud Computing', 'Business'],
      linkedinUrl: 'https://www.linkedin.com/in/johnsan-marshal-a1307535a/details/certifications/',
      pdf: pdfUrl('Completion badge · Claude Academy.pdf'),
    },
     {
      title: 'AI Fluency for Educators',
      issuer: 'Anthropic',
      date: 'July 2026',
      skills: ['AI', 'Machine Learning', 'Natural Language Processing', 'Cloud Computing', 'Education'],
      linkedinUrl: 'https://www.linkedin.com/in/johnsan-marshal-a1307535a/details/certifications/',
      pdf: pdfUrl('AiFluencyForEducators.pdf'),
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
