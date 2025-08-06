// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import AppInitializer from './components/AppInitializer';
import { Login } from "./pages/Login/login.jsx";
import { Signup } from "./pages/Signup/Signup.jsx";
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
import Layout from "./pages/admin/Layout.jsx";
import WorkerMainContent from "./pages/WorkerMain/WorkerMainContent.jsx";

function App() {

  return (
    <Router>
      <AppInitializer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 로그인된 사용자라면 모두 접근 가능한 라우트 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/NoticeList" element={<NoticeList />} />
          <Route path="/notice/:id" element={<NoticeDetail />} />
        </Route>

        {/* 관리자 전용 라우트 */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inspections/:inspectionId" element={<InspectionDetail />} />
            <Route path="notice" element={<AdminNotice />} />
            <Route path="write" element={<NoticeForm />} />
            <Route path="edit/:id" element={<NoticeForm />} />
            <Route path="notice/:id" element={<NoticeDetail />} />
            <Route path="workers" element={<WorkerList />} />
            <Route path="workers/register" element={<WorkerForm />} />
          </Route>
        </Route>

        {/* 작업자 전용 라우트 */}
        <Route element={<ProtectedRoute requiredRole="worker" />}>

            <Route path="/worker" element={<WorkerProfile />} />
            <Route path="/worker/main" element={<WorkerMainContent />} />
            <Route path="/Worker-partdetail/:inspectionId" element={<Workerpartdetail />} />
            <Route path="/Car-test" element={<Cartest />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
