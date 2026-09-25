import Nav from './components/Nav';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import SmoothScroll from './components/SmoothScroll';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="relative min-h-screen">
      <SmoothScroll />
      <Nav />
      {/* Nav and Footer are landmarks already, but the page content had none — a
          screen-reader user could jump to the navigation and the footer and not to the
          content between them. `main` is display:block, so this is layout-neutral. */}
      <main>
        <Home />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
