// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import AppInitializer from './components/AppInitializer';
import Login from "./pages/Login/login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import WorkerProfile from "./pages/WokerProfile/WorkerProfile.jsx";
import NoticeList from './pages/Notice/NoticeList.jsx'      // 작업자용 - 조회만
import NoticeDetail from './pages/Notice/NoticeDetail.jsx'  // 관리자용 - 수정/삭제 가능
import NoticeForm from './pages/Notice/NoticeForm.jsx'
import WorkerForm from "./pages/Workers/WorkerForm.jsx";
import WorkerList from "./pages/Workers/WorkerList.jsx";
import InspectionDetail from "./pages/admin/InspectionDetail.jsx";
import Dashboard from "./pages/admin/Dashboard";
import WorkerMainContent from "./pages/WorkerMain/WorkerMainContent.jsx";
import ManualTestContent from "./pages/ManualTest/ManualTestContent.jsx";
import MainLayout from "./components/Layout/MainLayout.jsx";
import DevPage from "./pages/devPage/devPage.jsx";
import WorkerLogin from "./pages/Login/WorkerLogin.jsx";
import ReportDashboard from './pages/Report/ReportDashboard.jsx'
import ReportDetail from './pages/Report/ReportDetail.jsx'



function App() {

  return (
      <Router>
          <AppInitializer>
              <Routes>
                  {/* 🔓 공개 페이지 */}
                  <Route path="/" element={<WorkerLogin />} />
                  <Route path="/login" element={<WorkerLogin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dev" element={<DevPage />} />
                  <Route path="/admin-login" element={<Login />} />
                  {/* 🔐 공통 로그인 사용자 접근 가능 */}
                  <Route element={<ProtectedRoute />}>
                      <Route element={<MainLayout />}>
                          <Route path="/notices" element={<NoticeList />} />
                          <Route path="/notices/:id" element={<NoticeDetail />} />
                          <Route path="/inspections/:inspectionId" element={<InspectionDetail />} />
                          <Route path="/" element={<ReportDashboard />} />
                          <Route path="/reports/:reportId" element={<ReportDetail />} />
                          <Route path="/reports" element={<ReportDashboard />} />

                      </Route>
                  </Route>

                  {/* 🔐 관리자 전용 페이지 */}
                  <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
                      <Route element={<MainLayout />}>
                          <Route path="/admin/dashboard" element={<Dashboard />} />
                          <Route path="/admin/inspections/:inspectionId" element={<InspectionDetail />} />
                          <Route path="/admin/notices/new" element={<NoticeForm />} />
                          <Route path="/admin/notices/:id/edit" element={<NoticeForm />} />
                          <Route path="/admin/workers" element={<WorkerList />} />
                          <Route path="/admin/workers/register" element={<WorkerForm />} />
                          <Route path="/admin/workers/:id" element={<WorkerProfile />} />
                      </Route>
                  </Route>

                  {/* 🔐 작업자 전용 페이지 */}
                  <Route element={<ProtectedRoute requiredRole="WORKER" />}>
                      <Route element={<MainLayout />}>
                          <Route path="/worker/profile" element={<WorkerProfile />} />
                          <Route path="/worker/main" element={<WorkerMainContent />} />
                          <Route path="/worker/manual-test" element={<ManualTestContent />} />
                          <Route path="/worker/inspections/:inspectionId" element={<InspectionDetail />} />
                      </Route>
                  </Route>
              </Routes>
          </AppInitializer>
      </Router>
  );
}

export default App;
