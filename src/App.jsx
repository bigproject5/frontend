// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/worker" element={<WorkerProfile />} />

        <Route path="/admin" element={<AdminNotice />} />
        <Route path="/notice" element={<AdminNotice />} />
        <Route path="/admin/write" element={<NoticeForm />} />
        <Route path="/admin/edit/:id" element={<NoticeForm />} />
        <Route path="/admin/notice/:id" element={<NoticeDetail />} />

        <Route path="/NoticeList" element={<NoticeList />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />

        <Route path="/workers" element={<WorkerList />} />
        <Route path="/workers/register" element={<WorkerForm />} />

        <Route path="/Worker-partdetail/:inspectionId" element={<Workerpartdetail />} />
        <Route path="/Car-test" element={<Cartest />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/inspections/:inspectionId" element={<InspectionDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
