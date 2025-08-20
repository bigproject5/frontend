// src/notices/NoticeForm.jsx - 파일 첨부 기능 포함
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {createNotice, getNoticeDetail, updateNotice} from "../../api/NoticeAPI.js";
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
  const location = useLocation()
  const isEdit = Boolean(id)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'published',
    removeFileIds: []
  })
  const [attachedFiles, setAttachedFiles] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [originalNotice, setOriginalNotice] = useState(null);

  useEffect(() => {
    const noticeFromState = location.state?.notice;

    const setFormState = (noticeData) => {
      if (noticeData) {
        const normalizedNotice = {
          ...noticeData,
          status: noticeData.status || 'published'
        };

        setOriginalNotice(normalizedNotice);
        setFormData({
          ...normalizedNotice,
          removeFileIds: []
        });
        setAttachedFiles(
            (normalizedNotice.files || []).map(file => ({
              id: file.fileId,
              name: file.fileName,
              savedName: file.savedName,
              url: file.fileUrl,
              size: file.fileSize,
              file: null
            }))
        );
      }
    };

    if (isEdit) {
      if (noticeFromState) {
        setFormState(noticeFromState);
      } else {
        const fetchNoticeDetail = async () => {
          try {
            const response = await getNoticeDetail(id);
            const data = response?.data || response;
            setFormState(data);
          } catch (error) {
            console.error('공지사항 상세 조회 실패:', error);
            alert('기존 공지사항 내용을 불러오는데 실패했습니다.');
          }
        };
        fetchNoticeDetail();
      }
    }
  }, [id, isEdit, location.state]);

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
      id: `new_${Date.now()}_${id}`,
      name: file.name,
      size: file.size,
      file: file
    }))

    setAttachedFiles(prev => [...prev, ...newFiles])
  }

  const handleFileDelete = (fileId) => {
    const fileToDelete = attachedFiles.find(file => file.id === fileId);

    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));

    if (fileToDelete && !fileToDelete.file) {
      setFormData(prev => ({
        ...prev,
        removeFileIds: [...(prev.removeFileIds || []), fileId]
      }));
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  let isDirty = false;
  if (isEdit && originalNotice) {
    const titleChanged = formData.title !== originalNotice.title;
    const contentChanged = formData.content !== originalNotice.content;
    const statusChanged = formData.status !== originalNotice.status;

    const newFilesAdded = attachedFiles.some(f => f.file !== null);
    const filesRemoved = (originalNotice.files?.length || 0) !== attachedFiles.filter(f => f.file === null).length;

    isDirty = titleChanged || contentChanged || statusChanged || newFilesAdded || filesRemoved;

  } else {
    isDirty = !!(formData.title || formData.content || attachedFiles.length > 0);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isEdit && !isDirty) {
      navigate(`/notices/${id}`, { state: { notice: originalNotice } });
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }
    setIsSubmitting(true);
    let response;
    try {
      if (isEdit) {
        const newFiles = attachedFiles
            .filter(file => file.file)
            .map(file => file.file);
        response = await updateNotice(id, formData, newFiles);
      } else {
        const allFiles = attachedFiles
            .filter(file => file.file)
            .map(file => file.file);
        response = await createNotice(formData, allFiles);
      }

      if (response.error) {
        alert(response.message || '요청 처리 중 문제가 발생했습니다.');
        return;
      }

      setShowSuccess(true);
      navigate(`/notices/${response.id}`, { state: { notice: response } });

    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = error.response?.data?.message || "파일 업로드 중 오류가 발생했습니다. 파일 크기를 확인해주세요.";
      alert(errorMessage);

    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCancel = () => {
    const navigateBack = () => {
      const targetPath = isEdit ? `/notices/${id}` : `/notices`;
      if (isEdit) {
        navigate(targetPath, { state: { notice: originalNotice } });
      } else {
        navigate(targetPath);
      }
    };

    if (isDirty) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        navigateBack();
      }
    } else {
      navigateBack();
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
              disabled={isSubmitting}
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
