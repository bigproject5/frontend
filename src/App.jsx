import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import ReportDashboard from './pages/Report/ReportDashboard.jsx'
import ReportDetail from './pages/Report/ReportDetail.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReportDashboard />} />
        <Route path="/reports/:reportId" element={<ReportDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
