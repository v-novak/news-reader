import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NewsFeed from './components/NewsFeed';

function App() {
  return (
    <Router>
      <div className="container py-4">
        <header className="pb-3 mb-4 border-bottom">
          <h1 className="display-5 fw-bold">Zews Viewer</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/page/1" replace />} />
            <Route path="/page/:pageNumber" element={<NewsFeed />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 