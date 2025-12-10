import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Education = () => {
  const educationData = [
    {
      degree: 'Bachelor Software Engineering',
      institution: 'Informatics Institute of Technology',
      location: 'Welawatta, Sri Lanka',
      period: '2019 - 2023',
      description: 'Focused on software engineering, algorithms, data structures, and web development. Graduated with honors.',
      courses: ['Software Engineering', 'Database Systems', 'Web Development', 'Algorithem'],
    },
    {
      
      degree: '   Secondary Education',
      institution: 'St. Josephs College, Colombo',
      location: 'Maradana, Sri Lanka',
      period: ' 2005 – 2019',
      description: 'Completed    Secondary Education  with focus on Accounts and IT.',
      courses: ['Accounts', 'Information Technology', 'Business Statistics'],
    },
  ];

  return (
    <section id="education" className="education">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Education
        </motion.h2>
        <div className="education-timeline">
          {educationData.map((edu, index) => (
            <motion.div
              key={index}
              className="education-item"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="education-icon">
                <FaGraduationCap />
              </div>
              <div className="education-content">
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.2 }}
                >
                  {edu.degree}
                </motion.h3>
                <motion.div
                  className="education-meta"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                >
                  <span className="education-institution">
                    <FaGraduationCap className="meta-icon" />
                    {edu.institution}
                  </span>
                  <span className="education-location">
                    <FaMapMarkerAlt className="meta-icon" />
                    {edu.location}
                  </span>
                  <span className="education-period">
                    <FaCalendarAlt className="meta-icon" />
                    {edu.period}
                  </span>
                </motion.div>
                <motion.p
                  className="education-description"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.4 }}
                >
                  {edu.description}
                </motion.p>
                {edu.courses && (
                  <motion.div
                    className="education-courses"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.5 }}
                  >
                    <h4>Key Courses:</h4>
                    <div className="courses-list">
                      {edu.courses.map((course, courseIndex) => (
                        <span key={courseIndex} className="course-tag">
                          {course}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;

