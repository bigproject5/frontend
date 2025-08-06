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
import { getNotices, deleteNotice } from '../../api/NoticeAPI.js' // API import 추가

function AdminNotice() {
  const [allNotices, setAllNotices] = useState([])
  const [notices, setNotices] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, noticeId: null, noticeTitle: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const itemsPerPage = 10

  useEffect(() => {
    fetchNotices()
  }, [page])

  const fetchNotices = async () => {
    try {
      setLoading(true)
      const response = await getNotices(page - 1, itemsPerPage) // 페이지는 0부터 시작

      if (response && response.content) {
        // 스프링 페이지네이션 응답 형식
        setAllNotices(response.content)
        setNotices(response.content)
        setTotalPages(response.totalPages)
      } else if (Array.isArray(response)) {
        // 배열 형식 응답 (기존 형식)
        setAllNotices(response)
        setNotices(response)
        setTotalPages(Math.ceil(response.length / itemsPerPage))
      }
    } catch (error) {
      console.error('공지사항 목록 조회 실패:', error)
      // API 실패 시 빈 배열로 설정
      setAllNotices([])
      setNotices([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

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

  const confirmDelete = async () => {
    try {
      await deleteNotice(deleteDialog.noticeId)

      // 삭제 성공 후 목록 새로고침
      await fetchNotices()

      setDeleteDialog({ open: false, noticeId: null, noticeTitle: '' })
    } catch (error) {
      console.error('공지사항 삭제 실패:', error)
      alert('공지사항 삭제에 실패했습니다.')
    }
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
          onClick={() => navigate('/admin/notices/new')}
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
                      onClick={() => navigate(`/admin/notices/${notice.id}`)}
                    >
                      보기
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/admin/notices/${notice.id}/edit`)}
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
