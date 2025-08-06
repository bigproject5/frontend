// src/notices/NoticeForm.jsx - 파일 첨부 기능 포함
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createNotice} from "../Api/NoticeAPI.js";
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material'
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material'

function NoticeForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'published'
  })
  const [attachedFiles, setAttachedFiles] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (isEdit) {
      // 편집 모드일 때 기존 데이터 로드
      const existingNotice = {
        title: '기존 공지사항 제목',
        content: '기존 공지사항 내용입니다.',
        status: 'published'
      }
      setFormData(existingNotice)

      // 기존 첨부파일 로드
      setAttachedFiles([
        { id: 1, name: 'document.pdf', size: 1024000 },
        { id: 2, name: 'image.jpg', size: 512000 }
      ])
    }
  }, [isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      file: file
    }))

    setAttachedFiles(prev => [...prev, ...newFiles])
  }

  const handleFileDelete = (fileId) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    // 실제로는 API 호출 (파일 업로드 포함)
    console.log('저장할 데이터:', formData)
    console.log('첨부파일:', attachedFiles)

    const Response = createNotice(formData, attachedFiles)
    console.log(Response)

    setShowSuccess(true)
    // 성공 후 관리자 대시보드로 이동
    setTimeout(() => {
      navigate('/admin')
    }, 2000)
  }

  const handleCancel = () => {
    if (formData.title || formData.content || attachedFiles.length > 0) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        navigate('/admin')
      }
    } else {
      navigate('/admin')
    }
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
        {isEdit ? '공지사항 수정' : '공지사항 작성'}
      </Typography>

      <Paper sx={{ p: 4, boxShadow: 2 }}>
        <form onSubmit={handleSubmit}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '15%', textAlign: 'center' }}>
                  제목 *
                </TableCell>
                <TableCell sx={{ width: '85%', pl: 3 }}>
                  <TextField
                    fullWidth
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="제목을 입력하세요"
                    variant="outlined"
                    size="small"
                    required
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', textAlign: 'center' }}>
                  상태
                </TableCell>
                <TableCell sx={{ pl: 3 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>상태</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      label="상태"
                    >
                      <MenuItem value="published">게시</MenuItem>
                      <MenuItem value="draft">임시저장</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', textAlign: 'center', verticalAlign: 'top', pt: 3 }}>
                  첨부파일
                </TableCell>
                <TableCell sx={{ pl: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      sx={{ mb: 2 }}
                    >
                      파일 첨부
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                      />
                    </Button>
                  </Box>

                  {attachedFiles.length > 0 && (
                    <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                      <List dense>
                        {attachedFiles.map((file) => (
                          <ListItem key={file.id}>
                            <AttachFileIcon sx={{ mr: 1, color: 'action.active' }} />
                            <ListItemText
                              primary={file.name}
                              secondary={formatFileSize(file.size)}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                color="error"
                                onClick={() => handleFileDelete(file.id)}
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}

                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    * 지원 형식: PDF, DOC, XLS, PPT, 이미지 파일 (최대 10MB)
                  </Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', textAlign: 'center', verticalAlign: 'top', pt: 3 }}>
                  내용 *
                </TableCell>
                <TableCell sx={{ pl: 3 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={15}
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="내용을 입력하세요"
                    variant="outlined"
                    required
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ px: 5, py: 1.5 }}
            >
              {isEdit ? '수정 완료' : '등록'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{ px: 5, py: 1.5 }}
            >
              취소
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          공지사항이 성공적으로 {isEdit ? '수정' : '등록'}되었습니다!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default NoticeForm
