// src/App.tsx 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';
import RoomDetailPage from './pages/RoomDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import MuseumPage from './pages/MuseumPage';
import MuseumDetailPage from './pages/MuseumDetailPage';
import DashboardPage from './pages/DashboardPage';
import { CookieConsent } from './components/CookieConsent';

function App() {
  
  return (
    <HelmetProvider>
      <Router>
        <LanguageProvider>
          <DataProvider>
            <div className="min-h-screen">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/rooms/:roomSlug" element={<RoomDetailPage />} />
                  
                  {/* Blog routes */}
                  <Route path="/en/blog" element={<BlogPage />} />
                  <Route path="/es/blog" element={<BlogPage />} />
                  <Route path="/en/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/es/blog/:slug" element={<BlogPostPage />} />
                  
                  {/* Museum routes */}
                  <Route path="/en/museum" element={<MuseumPage />} />
                  <Route path="/es/museum" element={<MuseumPage />} />
                  <Route path="/en/museum/:slug" element={<MuseumDetailPage />} />
                  <Route path="/es/museum/:slug" element={<MuseumDetailPage />} />
                  
                  {/* Redirections */}
                  <Route path="/blog" element={<Navigate to="/en/blog" replace />} />
                  <Route path="/blog/:slug" element={<Navigate to="/en/blog/:slug" replace />} />
                  <Route path="/museum" element={<Navigate to="/en/museum" replace />} />
                  <Route path="/museum/:slug" element={<Navigate to="/en/museum/:slug" replace />} />

                  {/* Dashboard */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
              </main>
              <Footer />
              <WhatsAppButton />
            </div>
            <CookieConsent />
          </DataProvider>
        </LanguageProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;