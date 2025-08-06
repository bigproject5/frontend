// src/notices/NoticeDetail.jsx - 하이브리드 라우팅 적용
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Container
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'

function NoticeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, role } = useSelector((state) => state.auth)

  const isAdmin = role === 'admin'

  const [notice, setNotice] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)

  useEffect(() => {
    // 샘플 공지사항 데이터
    const sampleNotice = {
      id: parseInt(id),
      title: '시스템 점검 안내',
      content: '안녕하세요. 2024년 1월 20일 오후 6시부터 8시까지 시스템 점검을 실시합니다...',
      author: '김관리자',
      adminId: 1,
      viewCount: 245,
      createdAt: '2024-01-15T09:00:00',
      updatedAt: '2024-01-15T09:00:00',
      hasAttachment: true,
      fileUrl: 'https://example.com/attachment.pdf',
      fileName: '점검계획서.pdf'
    }
    setNotice(sampleNotice)
  }, [id])

  const handleEdit = () => {
    navigate(`/admin/notices/${id}/edit`)
  }

  const handleDelete = () => {
    // 삭제 로직
    console.log('공지사항 삭제:', id)
    setDeleteDialog(false)
    navigate('/admin/notices') // 관리자는 관리 페이지로
  }

  const handleBack = () => {
    if (isAdmin) {
      navigate('/admin/notices') // 관리자는 관리 페이지로
    } else {
      navigate('/notices') // 작업자는 일반 목록으로
    }
  }

  const handleDownload = (attachment) => {
    // 실제로는 파일 다운로드 구현
    console.log('파일 다운로드:', attachment.name)
    // window.open(attachment.url, '_blank')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!notice) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <Typography variant="h6">로딩 중...</Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        {/* 헤더 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ color: '#002c5f' }}
          >
            목록으로
          </Button>

          {/* 관리자만 보이는 관리 버튼들 */}
          {isAdmin && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{ color: '#002c5f', borderColor: '#002c5f' }}
              >
                수정
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialog(true)}
              >
                삭제
              </Button>
            </Box>
          )}
        </Box>

        {/* 공지사항 제목 */}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#002c5f', mb: 3 }}>
          {notice.title}
        </Typography>

        {/* 공지사항 정보 */}
        <Table sx={{ mb: 3 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '120px', borderBottom: 'none' }}>
                작성자
              </TableCell>
              <TableCell sx={{ borderBottom: 'none' }}>{notice.author}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                작성일
              </TableCell>
              <TableCell sx={{ borderBottom: 'none' }}>
                {new Date(notice.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                조회수
              </TableCell>
              <TableCell sx={{ borderBottom: 'none' }}>{notice.viewCount}</TableCell>
            </TableRow>
            {notice.hasAttachment && (
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                  첨부파일
                </TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>
                  <Button
                    startIcon={<DownloadIcon />}
                    href={notice.fileUrl}
                    target="_blank"
                    sx={{ color: '#002c5f' }}
                  >
                    {notice.fileName}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Divider sx={{ my: 3 }} />

        {/* 공지사항 내용 */}
        <Box sx={{ lineHeight: 1.8, fontSize: '16px', minHeight: '200px' }}>
          {notice.content}
        </Box>

        {/* 사용자 역할별 안내 메시지 */}
        {isAdmin ? (
          <Alert severity="info" sx={{ mt: 3 }}>
            관리자로 로그인됨 - 수정/삭제 권한이 있습니다.
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mt: 3 }}>
            작업자 {user.name}님, 공지사항을 확인해주세요.
          </Alert>
        )}
      </Paper>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>공지사항 삭제</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            정말로 이 공지사항을 삭제하시겠습니까? 삭제된 공지사항은 복구할 수 없습니다.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>취소</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default NoticeDetail
