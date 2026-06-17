import { Routes, Route } from 'react-router-dom';
import BrandNav from './components/BrandNav.jsx';
import BrandFooter from './components/BrandFooter.jsx';
import Home from './pages/Home.jsx';
import Academy from './pages/Academy.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Method from './pages/Method.jsx';

export default function App() {
  return (
    <>
      <BrandNav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/academy/:slug" element={<CourseDetail />} />
          <Route path="/metod" element={<Method />} />
        </Routes>
      </main>
      <BrandFooter />
    </>
  );
}
