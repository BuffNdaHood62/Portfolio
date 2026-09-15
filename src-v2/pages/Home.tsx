import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../sections/Hero';
import Work from '../sections/Work';
import Approach from '../sections/Approach';
import Services from '../sections/Services';
import About from '../sections/About';
import Testimonials from '../sections/Testimonials';
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
      <Work />
      <Approach />
      <Services />
      <About />
      <Testimonials />
      <Contact />
    </>
  );
}
