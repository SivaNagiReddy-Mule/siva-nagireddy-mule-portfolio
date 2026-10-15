import { useSmoothScroll } from './hooks/useSmoothScroll';
import Cursor from './components/Cursor';
import Hud from './components/Hud';
import Hero from './components/Hero';
import About from './components/About';

export default function App() {
  useSmoothScroll();

  return (
    <>
      <Cursor />
      <Hud />
      <main>
        <Hero />
        <About />
      </main>
    </>
  );
}




