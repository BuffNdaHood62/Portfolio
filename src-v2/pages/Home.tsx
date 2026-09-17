import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../sections/Hero';
import Approach from '../sections/Approach';
import Services from '../sections/Services';
import About from '../sections/About';
import Contact from '../sections/Contact';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (target) {
      requestAnimationFrame(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [location.state]);

  return (
    <>
      <Hero />
      <Approach />
      <Services />
      <About />
      <Contact />
    </>
  );
}
