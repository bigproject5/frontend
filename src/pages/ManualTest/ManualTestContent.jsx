import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  LinearProgress,
  Paper,
  IconButton
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { createManualAudit } from '../../api/workerMainApi';

const INSPECTION_TYPES = [
  'PAINT',
  'LAMP',
  'WIPER',
  'ENGINE',
  'EM_WAVE',
  'WASHER_FLUID'
];

const ManualTestContent = () => {
  const [formData, setFormData] = useState({
    model: '',
    lineCode: ''
  });

  const [files, setFiles] = useState({});
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 에러 메시지 클리어
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTypeToggle = (type) => {
    if (selectedTypes.includes(type)) {
      // 선택 해제
      setSelectedTypes(prev => prev.filter(t => t !== type));
      setFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[type];
        return newFiles;
      });
    } else {
      // 선택
      setSelectedTypes(prev => [...prev, type]);
    }
  };

  const handleFileUpload = (type, file) => {
    if (file) {
      setFiles(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const handleFileRemove = (type) => {
    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.model.trim()) {
      newErrors.model = '자동차 모델을 입력해주세요.';
    }

    if (!formData.lineCode.trim()) {
      newErrors.lineCode = '공정 라인을 입력해주세요.';
    }

    if (selectedTypes.length === 0) {
      newErrors.types = '최소 하나의 검사 유형을 선택해주세요.';
    }

    // 선택된 타입에 대해 파일이 업로드되었는지 확인
    const missingFiles = selectedTypes.filter(type => !files[type]);
    if (missingFiles.length > 0) {
      newErrors.files = `다음 검사 유형의 파일을 업로드해주세요: ${missingFiles.join(', ')}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setErrors({});

    try {
      const auditData = {
        model: formData.model.trim(),
        lineCode: formData.lineCode.trim()
      };

      // 선택된 타입에 해당하는 파일만 전송
      const selectedFiles = {};
      selectedTypes.forEach(type => {
        if (files[type]) {
          selectedFiles[type] = files[type];
        }
      });

      const response = await createManualAudit(auditData, selectedFiles);

      setSuccessMessage('수동 테스트가 성공적으로 생성되었습니다!');

      // 폼 초기화
      setFormData({ model: '', lineCode: '' });
      setFiles({});
      setSelectedTypes([]);

    } catch (error) {
      console.error('수동 테스트 생성 실패:', error);
      setErrors({
        submit: error.message || '수동 테스트 생성 중 오류가 발생했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#002c5f',
            borderBottom: '3px solid #002c5f',
            pb: 1,
            mb: 2
          }}
        >
          수동 테스트 생성
        </Typography>
        <Typography variant="body1" color="text.secondary">
          자동차 정보를 입력하고 검사할 항목을 선택하여 수동 테스트를 생성합니다.
        </Typography>
      </Box>

      {/* 로딩 표시 */}
      {loading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {/* 성공 메시지 */}
      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setSuccessMessage('')}
            >
              <CheckCircleIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {successMessage}
        </Alert>
      )}

      {/* 에러 메시지 */}
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* 기본 정보 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#002c5f', fontWeight: 600, mb: 3 }}>
              기본 정보
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="model"
                  label="자동차 모델"
                  value={formData.model}
                  onChange={handleInputChange}
                  error={!!errors.model}
                  helperText={errors.model}
                  placeholder="예: sonata, avante"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lineCode"
                  label="공정 라인"
                  value={formData.lineCode}
                  onChange={handleInputChange}
                  error={!!errors.lineCode}
                  helperText={errors.lineCode}
                  placeholder="예: A1, A2, B1"
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* 검사 유형 선택 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#002c5f', fontWeight: 600, mb: 2 }}>
              검사 유형 선택
            </Typography>

            {errors.types && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.types}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {INSPECTION_TYPES.map(type => (
                <Chip
                  key={type}
                  label={type}
                  onClick={() => handleTypeToggle(type)}
                  color={selectedTypes.includes(type) ? 'primary' : 'default'}
                  variant={selectedTypes.includes(type) ? 'filled' : 'outlined'}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: selectedTypes.includes(type)
                        ? 'primary.dark'
                        : 'action.hover'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* 파일 업로드 */}
          {selectedTypes.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#002c5f', fontWeight: 600, mb: 2 }}>
                파일 업로드
              </Typography>

              {errors.files && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.files}
                </Alert>
              )}

              <Grid container spacing={2}>
                {selectedTypes.map(type => (
                  <Grid item xs={12} sm={6} md={4} key={type}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        border: files[type] ? '2px solid #4caf50' : '2px dashed #ddd',
                        backgroundColor: files[type] ? '#f1f8e9' : '#fafafa',
                        minHeight: 120,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#002c5f' }}>
                        {type}
                      </Typography>

                      {files[type] ? (
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, wordBreak: 'break-all' }}>
                            {files[type].name}
                          </Typography>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleFileRemove(type)}
                            startIcon={<DeleteIcon />}
                          >
                            제거
                          </Button>
                        </Box>
                      ) : (
                        <Box>
                          <input
                            accept="video/*,image/*"
                            style={{ display: 'none' }}
                            id={`file-${type}`}
                            type="file"
                            onChange={(e) => handleFileUpload(type, e.target.files[0])}
                          />
                          <label htmlFor={`file-${type}`}>
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<CloudUploadIcon />}
                              size="small"
                              sx={{ color: '#002c5f', borderColor: '#002c5f' }}
                            >
                              파일 선택
                            </Button>
                          </label>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* 제출 버튼 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading || selectedTypes.length === 0}
              sx={{
                px: 4,
                py: 1.5,
                backgroundColor: '#002c5f',
                '&:hover': {
                  backgroundColor: '#1976d2'
                }
              }}
            >
              {loading ? '생성 중...' : '수동 테스트 생성'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ManualTestContent;
