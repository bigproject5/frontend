import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './pages/Workers/Header';
import Sidebar from './pages/Workers/Sidebar';
import WorkerList from './pages/Workers/WorkerList';
import WorkerForm from './pages/Workers/WorkerForm';

// 레이아웃 컴포넌트
const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />
      <div style={{ display: 'flex', marginTop: '72px' }}>
        <Sidebar />
        <div style={{ 
          flex: 1,
          marginLeft: '240px',
          padding: '24px', 
          backgroundColor: '#f9fafb', 
          minHeight: 'calc(100vh - 72px)',
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '100vw'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<WorkerList />} />
          <Route path="/workers" element={<WorkerList />} />
          <Route path="/workers/register" element={<WorkerForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;