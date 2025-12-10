import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Education from './components/Education';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Background3D from './components/Background3D';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Background3D />
        <Header />
        <main>
          <Hero />
          <About />
          <Skills />
          <Education />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
