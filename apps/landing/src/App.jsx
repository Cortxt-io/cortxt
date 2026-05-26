import { useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import CNS from './components/CNS';
import Vision from './components/Vision';
import Pipeline from './components/Pipeline';
import Stack from './components/Stack';
import Builder from './components/Builder';
import Waitlist from './components/Waitlist';
import Footer from './components/Footer';

export default function App() {
  // Scroll fade-in with MutationObserver to catch dynamically rendered elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );

    const observe = (el) => {
      if (el.classList.contains('fade-in') && !el.classList.contains('visible')) {
        observer.observe(el);
      }
    };

    // Observe elements already in the DOM
    document.querySelectorAll('.fade-in').forEach(observe);

    // Observe elements added later (e.g. Reactflow renders asynchronously)
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.classList?.contains('fade-in')) observe(node);
            node.querySelectorAll?.('.fade-in').forEach(observe);
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Nav />
      <Hero />
      <CNS />
      <Vision />
      <Pipeline />
      <Stack />
      <Builder />
      <Waitlist />
      <Footer />
    </>
  );
}
