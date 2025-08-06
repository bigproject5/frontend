// src/notices/NoticeList.jsx - 작업자용 (조회만 가능)
import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Pagination,
  Chip
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

function NoticeList() {
  const [notices, setNotices] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    // 샘플 데이터 (실제로는 API에서 가져옴)
    const sampleNotices = [
      {
        id: 1,
        title: '시스템 점검 안내',
        author: '관리자',
        date: '2025-07-31',
        views: 125,
        hasAttachment: true
      },
      {
        id: 2,
        title: '새로운 기능 업데이트 안내',
        author: '관리자',
        date: '2025-07-30',
        views: 89,
        hasAttachment: false
      },
      {
        id: 3,
        title: '7월 이벤트 참여 방법',
        author: '운영자',
        date: '2025-07-29',
        views: 203,
        hasAttachment: true
      },
      {
        id: 4,
        title: '개인정보처리방침 변경 안내',
        author: '관리자',
        date: '2025-07-28',
        views: 67,
        hasAttachment: false
      },
      {
        id: 5,
        title: '서비스 이용약관 개정 안내',
        author: '관리자',
        date: '2025-07-27',
        views: 45,
        hasAttachment: true
      }
    ]

    setNotices(sampleNotices)
    setTotalPages(Math.ceil(sampleNotices.length / 10))
  }, [])

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handleRowClick = (noticeId) => {
    navigate(`/notice/${noticeId}`)
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
        공지사항
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell align="center" width="8%">번호</TableCell>
              <TableCell align="center" width="50%">제목</TableCell>
              <TableCell align="center" width="12%">작성자</TableCell>
              <TableCell align="center" width="15%">작성일</TableCell>
              <TableCell align="center" width="10%">조회수</TableCell>
              <TableCell align="center" width="5%">첨부</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notices.map((notice) => (
              <TableRow
                key={notice.id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f9f9f9' }
                }}
                onClick={() => handleRowClick(notice.id)}
              >
                <TableCell align="center">{notice.id}</TableCell>
                <TableCell align="left" sx={{ fontWeight: 500 }}>
                  {notice.title}
                </TableCell>
                <TableCell align="center">{notice.author}</TableCell>
                <TableCell align="center">{notice.date}</TableCell>
                <TableCell align="center">{notice.views}</TableCell>
                <TableCell align="center">
                  {notice.hasAttachment && (
                    <Chip label="📎" size="small" color="primary" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      {/* 작업자는 글쓰기 버튼 없음 */}
      <Box sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
        <Typography variant="body2">
          공지사항 조회 전용 페이지입니다.
        </Typography>
      </Box>
    </Box>
  )
}

export default NoticeList
