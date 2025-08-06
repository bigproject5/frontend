// src/notices/AdminNotice.jsx - 공통 레이아웃 사용 버전
import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Card,
  CardContent,
  Pagination,
  Container
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function AdminNotice() {
  const [allNotices, setAllNotices] = useState([])
  const [notices, setNotices] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, noticeId: null, noticeTitle: '' })
  const navigate = useNavigate()

  const itemsPerPage = 5

  useEffect(() => {
    // 샘플 데이터
    const sampleNotices = [
      {
        id: 1,
        title: '시스템 점검 안내',
        author: '김기자',
        date: '2024-01-15 09:00',
        views: 145,
        hasAttachment: true,
        isPinned: true
      },
      {
        id: 2,
        title: '작업 절차 감시 시스템 도입 안내',
        author: '이실장',
        date: '2024-01-14 16:30',
        views: 89,
        hasAttachment: false,
        isPinned: false
      },
      {
        id: 3,
        title: '도입 부품 시스템 지원 변경',
        author: '박팀장',
        date: '2024-01-13 14:20',
        views: 67,
        hasAttachment: true,
        isPinned: true
      },
      {
        id: 4,
        title: '새로운 보안 정책 시행 안내',
        author: '최보안',
        date: '2024-01-12 11:15',
        views: 156,
        hasAttachment: false,
        isPinned: false
      },
      {
        id: 5,
        title: '정기 교육 일정 공지',
        author: '정교육',
        date: '2024-01-11 14:30',
        views: 78,
        hasAttachment: true,
        isPinned: false
      }
    ]

    setAllNotices(sampleNotices)
    setTotalPages(Math.ceil(sampleNotices.length / itemsPerPage))
    updatePageData(1, sampleNotices)
  }, [])

  const updatePageData = (pageNumber, data = allNotices) => {
    const startIndex = (pageNumber - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const pageData = data.slice(startIndex, endIndex)
    setNotices(pageData)
  }

  const handlePageChange = (event, value) => {
    setPage(value)
    updatePageData(value)
  }

  const handleDeleteClick = (noticeId, noticeTitle) => {
    setDeleteDialog({ open: true, noticeId, noticeTitle })
  }

  const confirmDelete = () => {
    const updatedData = allNotices.filter(notice => notice.id !== deleteDialog.noticeId)
    setAllNotices(updatedData)

    const newTotalPages = Math.ceil(updatedData.length / itemsPerPage)
    setTotalPages(newTotalPages)

    const adjustedPage = page > newTotalPages ? newTotalPages : page
    setPage(adjustedPage)

    updatePageData(adjustedPage, updatedData)
    setDeleteDialog({ open: false, noticeId: null, noticeTitle: '' })
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#002c5f' }}>
          공지사항 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/write')}
          sx={{
            backgroundColor: '#002c5f',
            '&:hover': { backgroundColor: '#001a3e' }
          }}
        >
          공지사항 작성
        </Button>
      </Box>

      {/* 통계 카드 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#002c5f' }}>
              {allNotices.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              전체 공지사항
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {allNotices.filter(n => n.isPinned).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              중요 공지
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
              {allNotices.reduce((sum, n) => sum + n.views, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              총 조회수
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 공지사항 테이블 */}
      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>번호</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>제목</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>작성자</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>작성일</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>조회수</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notices.map((notice) => (
              <TableRow key={notice.id} hover>
                <TableCell>{notice.id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {notice.isPinned && <span style={{ color: '#f44336' }}>📌</span>}
                    {notice.title}
                    {notice.hasAttachment && <AttachFileIcon fontSize="small" color="action" />}
                  </Box>
                </TableCell>
                <TableCell>{notice.author}</TableCell>
                <TableCell>{notice.date}</TableCell>
                <TableCell>{notice.views}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate(`/admin/notice/${notice.id}`)}
                    >
                      보기
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/admin/edit/${notice.id}`)}
                    >
                      수정
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(notice.id, notice.title)}
                    >
                      삭제
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Paper>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, noticeId: null, noticeTitle: '' })}>
        <DialogTitle>공지사항 삭제</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            정말로 "{deleteDialog.noticeTitle}" 공지사항을 삭제하시겠습니까?
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, noticeId: null, noticeTitle: '' })}>
            취소
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AdminNotice
