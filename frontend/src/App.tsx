import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { LanguageModelList } from './pages/LanguageModelList';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Language Models - single route with modal dialogs for create/edit */}
          <Route path="/models" element={<LanguageModelList />} />

          {/* Future routes can be added here:
          <Route path="/benchmarks" element={<BenchmarksList />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/comparisons" element={<Comparisons />} />
          */}
        </Routes>
        <Toaster />
      </Layout>
    </Router>
  );
}

export default App;
