import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import FloatingCTA from './components/FloatingCTA';
import SmoothScroll from './components/SmoothScroll';
import Home from './pages/Home';
import CaseStudy from './pages/CaseStudy';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <SmoothScroll />
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/case-study/:slug" element={<CaseStudy />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <FloatingCTA />
      {/* film grain overlay */}
      <div
        aria-hidden
        className="noise pointer-events-none fixed inset-0 z-[60] opacity-[0.05]"
      />
    </div>
  );
}
