// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import WorkerMainContent from "./pages/WorkerMain/WorkerMainContent.jsx";
import WorkerProfile from "./pages/WokerProfile/WorkerProfile.jsx";
import WorkerList from "./pages/Workers/WorkerList.jsx";
import WorkerForm from "./pages/Workers/WorkerForm.jsx";
import AdminNotice from "./pages/Notice/AdminNotice.jsx";
import NoticeForm from "./pages/Notice/NoticeForm.jsx";
import NoticeList from "./pages/Notice/NoticeList.jsx";
import NoticeDetail from "./pages/Notice/NoticeDetail.jsx";
import Workerpartdetail from "./pages/WorkerPartDetail/workerpartdetail.jsx";
import MainLayout from "./components/Layout/MainLayout.jsx";
import Cartest from "./pages/WorkerPartDetail/cartest.jsx";
import Dashboard from "./pages/admin/Dashboard";
import { AdminRoute, WorkerRoute, ProtectedRoute } from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* 인증 관련 페이지 (레이아웃 없음) */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 작업자 전용 페이지 */}
        <Route path="/worker" element={
          <WorkerRoute>
            <MainLayout><WorkerMainContent /></MainLayout>
          </WorkerRoute>
        } />
        <Route path="/worker/profile" element={
          <WorkerRoute>
            <MainLayout><WorkerProfile /></MainLayout>
          </WorkerRoute>
        } />

        {/* 관리자 전용 페이지 */}
        <Route path="/admin" element={
          <AdminRoute>
            <MainLayout><Dashboard /></MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <MainLayout><Dashboard /></MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/workers" element={
          <AdminRoute>
            <MainLayout><WorkerList /></MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/workers/new" element={
          <AdminRoute>
            <MainLayout><WorkerForm /></MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/workers/:workerId" element={
          <AdminRoute>
            <MainLayout><WorkerProfile /></MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/notices" element={
          <AdminRoute>
            <MainLayout><AdminNotice /></MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/notices/new" element={
          <AdminRoute>
            <MainLayout><NoticeForm /></MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/notices/:id/edit" element={
          <AdminRoute>
            <MainLayout><NoticeForm /></MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/audits/:auditId" element={
          <AdminRoute>
            <MainLayout><Cartest /></MainLayout>
          </AdminRoute>
        } />

        {/* 공통 페이지 (인증 필요) */}
        <Route path="/notices" element={
          <ProtectedRoute>
            <MainLayout><NoticeList /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/notices/:id" element={
          <ProtectedRoute>
            <MainLayout><NoticeDetail /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/inspections/:inspectionId" element={
          <ProtectedRoute>
            <MainLayout><Workerpartdetail /></MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
