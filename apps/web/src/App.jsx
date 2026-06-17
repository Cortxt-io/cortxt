import Nav from './components/course/Nav';
import Hero from './components/course/Hero';
import Problem from './components/course/Problem';
import Curriculum from './components/course/Curriculum';
import Method from './components/course/Method';
import Audience from './components/course/Audience';
import Pricing from './components/course/Pricing';
import Faq from './components/course/Faq';
import Footer from './components/course/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Curriculum />
        <Method />
        <Audience />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
