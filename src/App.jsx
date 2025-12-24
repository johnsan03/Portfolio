import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Education from './components/Education';
import Quotes from './components/Quotes';
import Games from './components/Games';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import VisitCounter from './components/VisitCounter';
import Background3D from './components/Background3D';
import HolidayGreeting from './components/HolidayGreeting';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <HolidayGreeting />
        <Background3D />
        <Header />
        <main>
          <Hero />
          <About />
          <Skills />
          <Education />
          <Quotes />
          <Games />
          <Projects />
           <VisitCounter />
          <Contact />
         
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
