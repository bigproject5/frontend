import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    IconButton,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';

const ProfileEditModal = ({ open, onClose, userInfo, onSave, isLoading = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        loginId: ''
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // 모달이 열릴 때 기존 사용자 정보로 초기화
    useEffect(() => {
        if (open && userInfo) {
            setFormData({
                name: userInfo.name || '',
                email: userInfo.email || '',
                phoneNumber: userInfo.phoneNumber || '',
                loginId: userInfo.loginId || ''
            });
            setErrors({});
        }
    }, [open, userInfo]);

    // 입력값 변경 핸들러
    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // 에러 메시지 초기화
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // 유효성 검사
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = '이름을 입력해주세요.';
        }

        if (!formData.email.trim()) {
            newErrors.email = '이메일을 입력해주세요.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = '올바른 이메일 형식을 입력해주세요.';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = '전화번호를 입력해주세요.';
        } else if (!/^[0-9-+\s()]+$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = '올바른 전화번호 형식을 입력해주세요.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 저장 핸들러
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('프로필 수정 실패:', error);
            // 에러 처리는 부모 컴포넌트에서 처리
        } finally {
            setIsSaving(false);
        }
    };

    // 취소 핸들러
    const handleCancel = () => {
        // 변경사항이 있는지 확인
        const hasChanges =
            formData.name !== (userInfo?.name || '') ||
            formData.email !== (userInfo?.email || '') ||
            formData.phoneNumber !== (userInfo?.phoneNumber || '');

        if (hasChanges) {
            if (window.confirm('변경사항이 저장되지 않았습니다. 정말 닫으시겠습니까?')) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    }
                }
            }}
        >
            {/* 헤더 */}
            <DialogTitle
                sx={{
                    background: 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)',
                    color: 'white',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 3
                }}
            >
                <PersonIcon />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    프로필 수정
                </Typography>
                <IconButton
                    onClick={handleCancel}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* 컨텐츠 */}
            <DialogContent sx={{ py: 4, px: 4, paddingTop: '32px !important', }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* 이름 */}
                    <TextField
                        label="이름"
                        value={formData.name}
                        onChange={handleChange('name')}
                        error={!!errors.name}
                        helperText={errors.name}
                        fullWidth
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1976d2',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#1976d2',
                            },
                        }}
                    />

                    {/* 이메일 */}
                    <TextField
                        label="이메일"
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        error={!!errors.email}
                        helperText={errors.email}
                        fullWidth
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1976d2',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#1976d2',
                            },
                        }}
                    />

                    {/* 전화번호 */}
                    <TextField
                        label="전화번호"
                        value={formData.phoneNumber}
                        onChange={handleChange('phoneNumber')}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                        fullWidth
                        variant="outlined"
                        placeholder="010-1234-5678"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1976d2',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#1976d2',
                            },
                        }}
                    />

                    {/* 로그인 ID (읽기 전용) */}
                    <TextField
                        label="로그인 ID"
                        value={formData.loginId}
                        fullWidth
                        variant="outlined"
                        disabled
                        helperText="로그인 ID는 변경할 수 없습니다."
                        sx={{
                            '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: '#64748b',
                            },
                        }}
                    />

                    {/* 안내 메시지 */}
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                        변경된 정보는 즉시 적용됩니다. 신중하게 입력해주세요.
                    </Alert>
                </Box>
            </DialogContent>

            {/* 액션 버튼 */}
            <DialogActions sx={{ px: 4, pb: 4, gap: 2 }}>
                <Button
                    onClick={handleCancel}
                    variant="outlined"
                    sx={{
                        borderColor: '#64748b',
                        color: '#64748b',
                        '&:hover': {
                            borderColor: '#475569',
                            backgroundColor: 'rgba(100, 116, 139, 0.04)'
                        },
                        px: 3,
                        py: 1
                    }}
                    disabled={isSaving}
                >
                    취소
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(135deg, #002c5f 0%, #1976d2 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #001a40 0%, #1565c0 100%)',
                            boxShadow: '0 6px 20px rgba(0, 44, 95, 0.4)',
                        },
                        px: 3,
                        py: 1,
                        boxShadow: '0 4px 12px rgba(0, 44, 95, 0.3)',
                    }}
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {isSaving ? '저장 중...' : '저장'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProfileEditModal;