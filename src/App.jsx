// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import AppInitializer from './components/AppInitializer';
import Login from "./pages/Login/login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import WorkerProfile from "./pages/WokerProfile/WorkerProfile.jsx";
import AdminNotice from './pages/Notice/AdminNotice.jsx'    // 관리자 대시보드
import NoticeList from './pages/Notice/NoticeList.jsx'      // 작업자용 - 조회만
import NoticeDetail from './pages/Notice/NoticeDetail.jsx'  // 관리자용 - 수정/삭제 가능
import NoticeForm from './pages/Notice/NoticeForm.jsx'
import WorkerForm from "./pages/Workers/WorkerForm.jsx";
import WorkerList from "./pages/Workers/WorkerList.jsx";
import Workerpartdetail from "./pages/WorkerPartDetail/workerpartdetail.jsx";
import Cartest from "./pages/WorkerPartDetail/cartest.jsx";
import InspectionDetail from "./pages/admin/InspectionDetail.jsx";
import Dashboard from "./pages/admin/Dashboard";
import WorkerMainContent from "./pages/WorkerMain/WorkerMainContent.jsx";
import MainLayout from "./components/Layout/MainLayout.jsx";

function App() {

  return (
      <Router>
          <AppInitializer />

          <Routes>
              {/* 🔓 공개 페이지 */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* 🔐 공통 로그인 사용자 접근 가능 */}
              <Route element={<ProtectedRoute />}>
                  <Route element={<MainLayout />}>
                      <Route path="/notices" element={<NoticeList />} />
                      <Route path="/notices/:id" element={<NoticeDetail />} />
                      <Route path="/inspections/:inspectionId" element={<Workerpartdetail />} />
                  </Route>
              </Route>

              {/* 🔐 관리자 전용 페이지 */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                  <Route element={<MainLayout />}>
                      <Route path="/admin/dashboard" element={<Dashboard />} />
                      <Route path="/admin/inspections/:inspectionId" element={<InspectionDetail />} />
                      <Route path="/admin/notices" element={<AdminNotice />} />
                      <Route path="/admin/notices/new" element={<NoticeForm />} />
                      <Route path="/admin/notices/:id/edit" element={<NoticeForm />} />
                      <Route path="/admin/notices/:id" element={<NoticeDetail />} />
                      <Route path="/admin/workers" element={<WorkerList />} />
                      <Route path="/admin/workers/register" element={<WorkerForm />} />
                  </Route>
              </Route>

              {/* 🔐 작업자 전용 페이지 */}
              <Route element={<ProtectedRoute requiredRole="worker" />}>
                  <Route element={<MainLayout />}>
                      <Route path="/worker/profile" element={<WorkerProfile />} />
                      <Route path="/worker/main" element={<WorkerMainContent />} />
                      <Route path="/worker-partdetail/:inspectionId" element={<Workerpartdetail />} />
                      <Route path="/car-test" element={<Cartest />} />
                  </Route>
              </Route>
          </Routes>
      </Router>
  );
}

export default App;
