import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { RetroSidebar } from './components/common/RetroSidebar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ReviewDetailPage } from './pages/ReviewDetailPage';
import { SearchPage } from './pages/SearchPage';
import { StatsPage } from './pages/StatsPage';
import { RandomReviewPage } from './pages/RandomReviewPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  const location = useLocation();

  // Instant scroll to top on route change (90s browsers had no smooth scroll)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div className="site-wrapper">
      <Navbar />
      <div className="site-layout">
        <div className="site-sidebar-column">
          <RetroSidebar />
        </div>
        <main className="site-main-column">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/reviews/:id" element={<ReviewDetailPage />} />
            <Route path="/the-dictator" element={<ReviewDetailPage />} />
            <Route path="/django-unchained" element={<ReviewDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/random" element={<RandomReviewPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
