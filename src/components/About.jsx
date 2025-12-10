import { motion } from 'framer-motion';
import { FaCode, FaRocket, FaHeart } from 'react-icons/fa';

const About = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: <FaCode />,
      title: 'Clean Code',
      description: 'Writing maintainable and scalable code following best practices.',
    },
    {
      icon: <FaRocket />,
      title: 'Fast Delivery',
      description: 'Efficient development process ensuring timely project completion.',
    },
    {
      icon: <FaHeart />,
      title: 'Passionate',
      description: 'Love for technology and continuous learning drives my work.',
    },
  ];

  return (
    <section id="about" className="about">
      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.h2 className="section-title" variants={itemVariants}>
          About Me
        </motion.h2>
        <motion.div className="about-content" variants={itemVariants}>
          <div className="about-text">
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              I'm a passionate software engineer with over 3 to 4 years of experience building
              web applications and digital solutions. I specialize in modern PHP and Python
              frameworks and have a strong foundation in both frontend and backend development.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              My journey in software development started with a curiosity about how things
              work, and it has evolved into a career where I get to solve complex problems
              and create impactful solutions. I believe in writing clean, efficient code and
              staying updated with the latest technologies.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              When I'm not coding, I enjoy contributing to open-source projects, reading
              tech blogs, and exploring new frameworks and tools that can improve my
              development workflow.
            </motion.p>
          </div>
          <motion.div
            className="about-features"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;

