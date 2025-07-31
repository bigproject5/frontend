// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'

import AdminNotice from './notices/AdminNotice'    // 관리자 대시보드
import NoticeList from './notices/NoticeList'      // 작업자용 - 조회만
import NoticeDetail from './notices/NoticeDetail'  // 관리자용 - 수정/삭제 가능
import NoticeForm from './notices/NoticeForm'      // 관리자용 - 등록/수정

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Routes>

            {/* 관리자용 경로 */}
            <Route path="/admin" element={<AdminNotice />} />
            <Route path="/" element={<AdminNotice />} />
            <Route path="/admin/write" element={<NoticeForm />} />
            <Route path="/admin/edit/:id" element={<NoticeForm />} />
            <Route path="/admin/notice/:id" element={<NoticeDetail />} />

            {/* 작업자용 경로 */}
            <Route path="/NoticeList" element={<NoticeList />} />
            <Route path="/notice/:id" element={<NoticeDetail />} />

          </Routes>
        </Container>
      </BrowserRouter>
    </>
  )
}

export default App
