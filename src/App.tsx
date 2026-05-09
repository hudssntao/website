import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Resume from "./pages/Resume";
import Blog from "./pages/blog/Blog";
import BlogPost from "./pages/blog/BlogPost";
import Matching from "./pages/matching/Matching";
import TrailTracker from "./pages/trails/TrailTracker";
import CheatSheets from "./pages/cheat-sheets/page";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/trails" element={<TrailTracker />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/cheat-sheets" element={<CheatSheets />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
