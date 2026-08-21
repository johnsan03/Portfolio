import { lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Footer from './components/Footer';
import Background3D from './components/Background3D';
import HolidayGreeting from './components/HolidayGreeting';
import SectionFlow from './components/SectionFlow';
import Grain from './components/effects/Grain';
import CursorRing from './components/effects/CursorRing';
import Hud from './components/effects/Hud';
import Preloader from './components/effects/Preloader';
import HeroParticles from './components/effects/HeroParticles';
import './App.css';
import './styles/effects.css';

/* Below-the-fold sections load as separate chunks so the first paint only
   ships the hero, about and skills. Games alone is ~51KB of source. Each gets
   its own boundary so they stream in independently rather than as one block. */
const Education = lazy(() => import('./components/Education'));
const Certificates = lazy(() => import('./components/Certificates'));
const Quotes = lazy(() => import('./components/Quotes'));
const Games = lazy(() => import('./components/Games'));
const Projects = lazy(() => import('./components/Projects'));
const VisitCounter = lazy(() => import('./components/VisitCounter'));
const Contact = lazy(() => import('./components/Contact'));

const Deferred = ({ children }) => (
  <Suspense fallback={<div className="fx-section-fallback" aria-hidden="true" />}>
    {children}
  </Suspense>
);

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Preloader />
        <Grain />
        <CursorRing />
        <HolidayGreeting />
        <Background3D />
        <HeroParticles />
        <Header />
        <main>
          <SectionFlow>
            <Hero />
            <About />
            <Skills />
            <Deferred><Education /></Deferred>
            <Deferred><Certificates /></Deferred>
            <Deferred><Quotes /></Deferred>
            <Deferred><Games /></Deferred>
            <Deferred><Projects /></Deferred>
            <Deferred><VisitCounter /></Deferred>
            <Deferred><Contact /></Deferred>
          </SectionFlow>
        </main>
        <Footer />
        <Hud />
      </div>
    </ThemeProvider>
  );
}

export default App;
