import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Component, Suspense, lazy } from 'react';
import Layout from './components/Layout';

// Error boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#DC2626', background: '#FEE2E2', borderRadius: '12px', margin: '2rem' }}>
          <h2>Component Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
            {this.state.error?.message}
            {'\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const HomePage = lazy(() => import('./pages/HomePage'));
const TrendsPage = lazy(() => import('./pages/TrendsPage'));
const ProjectionsPage = lazy(() => import('./pages/ProjectionsPage'));
const FactCheckerPage = lazy(() => import('./pages/FactCheckerPage'));
const FindingsPage = lazy(() => import('./pages/FindingsPage'));

const Loading = () => (
  <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
    Loading...
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/projections" element={<ProjectionsPage />} />
              <Route path="/fact-checker" element={<FactCheckerPage />} />
              <Route path="/findings" element={<FindingsPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Layout>
    </Router>
  );
}

export default App;
