import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {

  const projects = [
    {
      title: 'MedriAi',
      description:
        'Medirai is a mobile-based skin cancer detection solution that uses a machine learning model trained on dermatology images to identify various types of skin cancer from a single photo. We developed the ML model and integrated it into a user-friendly mobile application where users can capture or upload an image, which is then processed to generate accurate and fast prediction results. The application was thoroughly tested on multiple devices to ensure reliability, smooth performance, and real-world usability.',
      technologies: ['Flutter', 'Firebase', 'Azure', 'ML'],
    //   github: 'https://github.com',
      demo: 'https://medirai.com/fr/',
      image: 'project1',
    },
    {
      title: 'Fillegourment',
      description:
        'Fillegourment is a WordPress-based project where I developed custom PHP plugins to enhance site functionality, including a tailored rule-creation system and advanced admin-panel features. I also handled translation adjustments, resolving unmatched strings by implementing custom code-level overrides for accurate multilingual support. Additionally, I managed various content updates and optimization tasks across the website to ensure a smooth and consistent user experience.',
      technologies: ['React', 'PHP', 'Wordpress','MySQL'],
      github: 'https://github.com/MDataZone/Multiple-Location-Selector',
      demo: 'https://www.filetgourmet.ca/',
      image: 'project2',
    },
    {
      title: 'Patisserie-Rolland',
      description:
        'Patisserie-Rolland is a WordPress project where I integrated the GoLivro delivery service through a custom-built plugin tailored to the client’s workflow. I managed theme translations using a POD file to ensure accurate multilingual content across the site. In addition, I performed ongoing content updates and implemented custom admin-panel functionalities to enhance usability and streamline site management.',
      technologies: ['React', 'PHP', 'Wordpress', 'MySQL'],
    //   github: 'https://github.com',
    //   demo: 'https://demo.com',
      image: 'project3',
    },
    {
      title: 'RearVu',
      description:
        'RearVu is a Next.js-powered competitor analysis platform that uses AI-driven web scraping to collect detailed information from websites and LinkedIn profiles. The system automatically compares competitor data added by the user and generates insightful summaries. It then delivers these results via email, providing users with clear, structured comparisons to support decision-making.',
      technologies: ['Next.Js', 'React', 'PostgresSQL'],
    //   github: 'https://github.com',
      demo: 'https://rearvu.com/',
      image: 'project4',
    },
       {
      title: 'Morts Driving School',
      description:
        'Morty’s Driving School is a Next.js and React-based web application built on Replit to streamline operations across multiple driving school branches. It supports Admins, Instructors, and Students with dedicated workflows for enrollment, class booking, progress tracking, scheduling, payments, and document management. The system also includes features like automated notifications, permit tracking, and bulk student imports, serving as a complete management hub for driving schools.',
         technologies: ['Next.Js', 'React', 'PostgresSQL', 'Replit'],
    //   github: 'https://github.com',
      demo: 'https://morty.empowerdemos.com/',
      image: 'project4',
    },
    {
        title: 'SLUDI',
        description:
          'SLUDI is a Java and MySQL–based system where I contributed to application deployment, UAT testing, and production verification. My role involved installing the application on testing devices, reporting installation and functional issues, and documenting all test-related data. I also assisted in registering citizens within the system and validating workflows in the production environment to ensure smooth and reliable system performance.',
        technologies: ['Java', 'MySql', 'Node'],
        // github: 'https://github.com',
        // demo: '',
        image: 'project4',
      },
      {
        title: 'CatchCost',
        description:
          'CatchCost is an ML-driven application built with React.js and AWS that predicts fish prices based on weather and environmental data. I developed the machine learning model using multiple algorithms to generate accurate price forecasts and integrated it with a React.js frontend for a seamless user experience. The predicted prices—based on fish type and date—are automatically stored in AWS DynamoDB, enabling efficient data retrieval and analysis.',
        technologies: ['React.js', 'AWS', 'ML'],
        // github: 'https://github.com',
        // demo: '',
        image: 'project4',
      },
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className="project-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="project-image">
                <div className="project-placeholder">
                  <span>{project.title.charAt(0)}</span>
                </div>
                <div className="project-overlay">
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaGithub />
                  </motion.a>
                  <motion.a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaExternalLinkAlt />
                  </motion.a>
                </div>
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-technologies">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

