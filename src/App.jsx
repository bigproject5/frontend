import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/admin/Dashboard";
import Detail from "./pages/admin/Detail";
import InspectionDetail from "./pages/admin/InspectionDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 기본 경로를 대시보드로 리다이렉트 */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/vehicle/:carId" element={<Detail />} />
          <Route path="/admin/inspection/:inspectionId" element={<InspectionDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;