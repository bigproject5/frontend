import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import ReportDashboard from './pages/ReportDashboard'
import ReportDetail from './pages/ReportDetail'

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
