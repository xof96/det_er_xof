import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AtmosphereProvider } from './context/AtmosphereContext';
import { BackgroundScene } from './components/background/BackgroundScene';
import { Home } from './pages/Home';

const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const AiLab = lazy(() => import('./pages/AiLab'));
const Photography = lazy(() => import('./pages/Photography'));
const Skating = lazy(() => import('./pages/Skating'));
const Languages = lazy(() => import('./pages/Languages'));
const Music = lazy(() => import('./pages/Music'));
const Places = lazy(() => import('./pages/Places'));
const About = lazy(() => import('./pages/About'));
const CV = lazy(() => import('./pages/CV'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/ai-lab" element={<AiLab />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/photography/:collection" element={<Photography />} />
          <Route path="/skating" element={<Skating />} />
          <Route path="/languages" element={<Languages />} />
          <Route path="/music" element={<Music />} />
          <Route path="/places" element={<Places />} />
          <Route path="/about" element={<About />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <AtmosphereProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <BackgroundScene />
      <AppRoutes />
    </AtmosphereProvider>
  );
}

export default App;
