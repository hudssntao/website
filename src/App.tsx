import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Resume = lazy(() => import("./pages/resume/Resume"));
const Projects = lazy(() => import("./pages/projects/Projects"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Loader = () => (
  <div className="w-full h-screen flex items-center justify-center">Loading...</div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
