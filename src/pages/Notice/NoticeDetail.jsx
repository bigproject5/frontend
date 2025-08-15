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
  Container, Stack, CircularProgress
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import {getNoticeDetail, deleteNotice, downloadFile} from '../../api/NoticeAPI.js' // API import 추가

function NoticeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, role } = useSelector((state) => state.auth)
  const [downloading, setDownloading] = useState(null); // 다운로드 중인 파일 ID 저장
  const [error, setError] = useState(null);
  const isAdmin = role === 'ADMIN' || role === "DEV";

  const [notice, setNotice] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)

  useEffect(() => {
    // 공지사항 상세 조회 API 호출
    const fetchNoticeDetail = async () => {
      try {
        const response = await getNoticeDetail(id)
        console.log('공지사항 상세 응답:', response) // 디버깅용

        // API 응답 구조에 맞게 데이터 설정
        if (response && response.data) {
          setNotice(response.data)
        } else if (response) {
          // 직접 응답이 데이터인 경우
          setNotice(response)
        }


      } catch (error) {
        console.error('공지사항 상세 조회 실패:', error)
        // 에러 발생 시 사용자에게 알림
        alert('공지사항을 불러오는데 실패했습니다.')
        navigate('/admin/dashboard') // 에러 시 대시보드로 이동
      }
    }

    fetchNoticeDetail()
  }, [id, isAdmin, navigate])

  const handleEdit = () => {
    navigate(`/admin/notices/${id}/edit`)
  }

  const handleDelete = async () => {
    try {
      // 삭제 API 호출
      await deleteNotice(id)
      setDeleteDialog(false)

      // 삭제 후 목록 페이지로 이동
      navigate('/notices') // 관리자는 관리 페이지로
    } catch (error) {
      console.error('공지사항 삭제 실패:', error)
    }
  }

  const handleBack = () => {
    navigate('/notices') // 관리자는 관리 페이지로
  }

  const handleDownload = async (fileId, fileName) => {
    try {
      setDownloading(fileId);
      setError(null);

      const accessToken = sessionStorage.getItem('accessToken');

      const response = await downloadFile(accessToken, fileId);

      if (!response.ok) {
        throw new Error(`다운로드 실패: ${response.status}`);
      }

      // Blob으로 변환
      const blob = await response.blob();

      // 브라우저 기본 다운로드 (다운로드 폴더에 자동 저장)
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      // 정리
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

    } catch (err) {
      setError(err.message);
      console.error('파일 다운로드 오류:', err);
    } finally {
      setDownloading(null);
    }
  };

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
    <Container sx={{
      width: '80% !important',
      maxWidth: 800,
      minWidth: 300 ,
      minHeight: 1000,
      margin: '0 auto',
      p: 10,
    }}>
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
              <TableCell sx={{ borderBottom: 'none' }}>{notice.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                작성일
              </TableCell>
              <TableCell sx={{ borderBottom: 'none' }}>
                {new Date(notice.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
            {notice.updatedAt !== notice.createdAt && (
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                  수정일
                </TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>
                  {new Date(notice.updatedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                조회수
              </TableCell>
              <TableCell sx={{ borderBottom: 'none' }}>{notice.viewCount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none', verticalAlign: 'top' }}>
                첨부파일
              </TableCell>
              <TableCell sx={{ borderBottom: 'none' }}>
                <Stack spacing={0.5}> {/* 파일마다 간격 */}
                  {notice.files.map((file) => (
                      <Button
                          key={file.fileId}
                          startIcon={
                            downloading === file.fileId ?
                                <CircularProgress size={16} /> :
                                <DownloadIcon />
                          }
                          onClick={() => handleDownload(file.fileId, file.fileName)}
                          disabled={downloading === file.fileId}
                          sx={{
                            color: downloading === file.fileId ? '#999' : '#002c5f',
                            fontSize: '0.875rem',
                            minWidth: 0,
                            padding: '2px 8px',
                            justifyContent: 'flex-start',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                      >
                        {downloading === file.fileId ?
                            '다운로드 중...' :
                            `${file.fileName} (${formatFileSize(file.fileSize)})`
                        }
                      </Button>
                  ))}
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Divider sx={{ my: 3 }} />

        {/* 공지사항 내용 */}
        <Box
            sx={{
              lineHeight: 1.8,
              fontSize: '16px',
              minHeight: '300px',
              wordBreak: 'break-word',      // 긴 단어 줄바꿈
              overflowWrap: 'break-word',   // 추가 안전 장치
              whiteSpace: 'pre-wrap',       // 줄바꿈 + 공백 유지
            }}
        >
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
