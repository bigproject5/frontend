// src/notices/NoticeDetail.jsx - 권한별 기능 분리
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon
} from '@mui/icons-material'

function NoticeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [notice, setNotice] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)

  // 관리자 모드인지 확인 (경로로 판단)
  const isAdminMode = location.pathname.includes('/admin')

  useEffect(() => {
    // 실제로는 API 호출
    const sampleNotice = {
      id: parseInt(id),
      title: '시스템 점검 안내',
      content: `안녕하세요.

서비스 품질 향상을 위한 정기 시스템 점검을 실시합니다.

■ 점검 일시: 2025년 8월 1일(목) 02:00 ~ 06:00 (4시간)
■ 점검 내용: 서버 업그레이드 및 보안 패치
■ 영향: 해당 시간 동안 서비스 이용 불가

점검 시간 중에는 모든 서비스가 일시적으로 중단되오니 이용에 참고하시기 바랍니다.

더 나은 서비스 제공을 위한 작업이오니 양해 부탁드립니다.

감사합니다.`,
      author: '관리자',
      date: '2025-07-31',
      views: 125,
      attachments: [
        { id: 1, name: '점검_안내서.pdf', size: 1024000, url: '/files/maintenance.pdf' },
        { id: 2, name: '업데이트_가이드.docx', size: 512000, url: '/files/update_guide.docx' }
      ]
    }
    setNotice(sampleNotice)
  }, [id])

  const handleEdit = () => {
    navigate(`/admin/edit/${id}`)
  }

  const handleDelete = () => {
    setDeleteDialog(true)
  }

  const confirmDelete = () => {
    // 실제로는 API 호출
    console.log('공지사항 삭제:', id)
    setDeleteDialog(false)
    navigate('/admin')
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
    <Box sx={{ maxWidth: 1000, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
        공지사항
      </Typography>

      <Paper sx={{ p: 0, boxShadow: 2 }}>
        {/* 제목 영역 */}
        <Box sx={{ p: 3, backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {notice.title}
          </Typography>
        </Box>

        {/* 정보 테이블 */}
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '15%', textAlign: 'center' }}>
                작성자
              </TableCell>
              <TableCell sx={{ width: '35%', pl: 2 }}>{notice.author}</TableCell>
              <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '15%', textAlign: 'center' }}>
                작성일
              </TableCell>
              <TableCell sx={{ width: '35%', pl: 2 }}>{notice.date}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', textAlign: 'center' }}>
                조회수
              </TableCell>
              <TableCell sx={{ pl: 2 }}>{notice.views}</TableCell>
              <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', textAlign: 'center' }}>
                첨부파일
              </TableCell>
              <TableCell sx={{ pl: 2 }}>
                {notice.attachments.length > 0 ? `${notice.attachments.length}개` : '없음'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Divider />

        {/* 첨부파일 목록 */}
        {notice.attachments.length > 0 && (
          <>
            <Box sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                첨부파일
              </Typography>
              <List dense>
                {notice.attachments.map((attachment) => (
                  <ListItem
                    key={attachment.id}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#e3f2fd' },
                      borderRadius: 1
                    }}
                    onClick={() => handleDownload(attachment)}
                  >
                    <ListItemIcon>
                      <AttachFileIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={attachment.name}
                      secondary={formatFileSize(attachment.size)}
                    />
                    <DownloadIcon color="action" />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Divider />
          </>
        )}

        {/* 내용 영역 */}
        <Box sx={{ p: 4, minHeight: 300 }}>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: 1.8
            }}
          >
            {notice.content}
          </Typography>
        </Box>
      </Paper>

      {/* 버튼 영역 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(isAdminMode ? '/admin' : '/')}
          sx={{ px: 4, py: 1.5 }}
        >
          목록으로
        </Button>

        {/* 관리자만 수정/삭제 버튼 표시 */}
        {isAdminMode && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ px: 4, py: 1.5 }}
            >
              수정
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ px: 4, py: 1.5 }}
            >
              삭제
            </Button>
          </Box>
        )}
      </Box>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>공지사항 삭제</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            삭제된 공지사항은 복구할 수 없습니다.
          </Alert>
          <Typography>
            이 공지사항을 정말 삭제하시겠습니까?
          </Typography>
          <Typography sx={{ mt: 1, fontWeight: 'bold', color: 'error.main' }}>
            "{notice.title}"
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>
            취소
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default NoticeDetail
