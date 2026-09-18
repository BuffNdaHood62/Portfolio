import Nav from './components/Nav';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="relative min-h-screen">
      <SmoothScroll />
      <Nav />
      <Home />
      <Footer />
    </div>
  );
}
