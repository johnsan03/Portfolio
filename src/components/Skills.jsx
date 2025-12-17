import { motion } from 'framer-motion';
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
  FaDocker,
  FaAws,
  FaDatabase,
  FaPhp,
  FaJava,
  FaFigma,
  FaShoppingCart,
  FaWordpress,
  
} from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiPostgresql, SiPhp ,SiReplit,SiMysql,SiFirebase,SiSpringboot ,SiCanva ,SiAdobephotoshop,SiAndroidstudio} from 'react-icons/si';
import { SiPostman } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { FaFlutter } from "react-icons/fa6";
import { RiNextjsFill } from "react-icons/ri";
import { VscAzure } from "react-icons/vsc";

const Skills = () => {

  const skillCategories = [
    {
      title: 'Frontend',
      skills: [
        { name: 'React', icon: <FaReact />, level: 90 },
        { name: 'JavaScript', icon: <FaJs />, level: 95 },
        { name: 'TypeScript', icon: <SiTypescript />, level: 85 },
        { name: 'HTML5', icon: <FaHtml5 />, level: 95 },
        { name: 'CSS3', icon: <FaCss3Alt />, level: 90 },
        { name: 'Flutter', icon: <FaFlutter />, level: 65 },
      ],
    },
    {
      title: 'Backend',
      skills: [
        { name: 'Node.js', icon: <FaNodeJs />, level: 90 },
        { name: 'Python', icon: <FaPython />, level: 85 },
        
        { name: 'PHP', icon: <SiPhp />, level: 85 },
        {name:'NextJS', icon: <RiNextjsFill/>, level: 75},
         {name:'Java', icon: <FaJava/>, level: 65},
        {name:'Spring Boot', icon: <SiSpringboot/>, level: 65},
      ],
    },
     {
      title: 'Database & Devops',
      skills: [
        { name: 'SQL', icon: <SiMysql />, level: 85 },
        { name: 'MongoDB', icon: <SiMongodb />, level: 80 },   
        { name: 'PostgreSQL', icon: <SiPostgresql />, level: 85 },
        { name: 'Azure', icon: <VscAzure />, level: 75 },
        { name: 'Firebase', icon: <SiFirebase />, level: 75 },
       { name: 'Xano', icon: <FaDatabase />, level: 75 },

        
      ],
    },
    {
      title: 'Tools',
      skills: [
         { name: 'Figma', icon: <FaFigma />, level: 75 },
         { name: 'Canva', icon: <SiCanva />, level: 75 },
         { name: 'Photoshop', icon: <SiAdobephotoshop />, level: 75 },
         {name:'Postman', icon: <SiPostman/>, level: 75},        
         {name:'VS Code', icon: <VscVscode/>, level: 75},
    
         {name:'Android Studio', icon: <SiAndroidstudio/>, level: 75},
       
        
      ],
    },
    {
      title: 'Others',
      skills: [
        { name: 'Git', icon: <FaGitAlt />, level: 90 },
        { name: 'Docker', icon: <FaDocker />, level: 80 },     
         { name: 'Replit', icon: <SiReplit />, level: 80 },
        { name: 'AWS', icon: <FaAws />, level: 75 },
        {name:'Duda & Websitestore',icon:<FaShoppingCart/>, level: 75},
        {name:'Wordpress',icon:<FaWordpress/>, level: 75},
        
      ],
    },
  ];

  return (
    <section id="skills" className="skills">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Skills & Technologies
        </motion.h2>
        <div className="skills-grid">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className="skill-category"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
            >
              <h3>{category.title}</h3>
              <div className="skills-list skills-icon-grid">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    className="skill-item skill-badge"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: categoryIndex * 0.2 + skillIndex * 0.1 }}
                    whileHover={{ y: -6, rotateX: 6, rotateY: -6 }}
                  >
                    <div className="skill-header">
                      <div className="skill-icon skill-favicon">{skill.icon}</div>
                      <span className="skill-name">{skill.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

