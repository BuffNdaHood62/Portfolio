import Hero from '../sections/Hero';
import Work from '../sections/Work';
import About from '../sections/About';
import Services from '../sections/Services';
import Testimonials from '../sections/Testimonials';
import Contact from '../sections/Contact';
import Marquee from '../components/Marquee';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Work />
      <About />
      <Services />
      <Testimonials />
      <Contact />
    </>
  );
}
