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
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Chip,
    Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import "./AdminProfileEditModel.css"


const AdminProfileEditModal = ({ open, onClose, userInfo, onSave, isLoading = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        loginId: '',
        employeeNumber: '',
        department: '',
        status: '활성'
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // 부서/작업타입 옵션들
    const departmentOptions = [
        'PAINT',
        'WIPER',
        'LAMP',
        'WASHER_FLUID',
        'ENGINE'
    ];

    const statusOptions = [
        '활성',
        '비활성',
        '대기'
    ];

    // 모달이 열릴 때 기존 사용자 정보로 초기화
    useEffect(() => {
        if (open && userInfo) {
            setFormData({
                name: userInfo.name || '',
                email: userInfo.email || '',
                phoneNumber: userInfo.phoneNumber || '',
                loginId: userInfo.loginId || '',
                employeeNumber: userInfo.employeeId || userInfo.employeeNumber || '',
                department: userInfo.department || '',
                status: userInfo.status || '활성'
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

        // 필수 필드 검사
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

        if (!formData.loginId.trim()) {
            newErrors.loginId = '로그인 ID를 입력해주세요.';
        } else if (formData.loginId.length < 3) {
            newErrors.loginId = '로그인 ID는 최소 3자 이상이어야 합니다.';
        }

        if (!formData.employeeNumber.trim()) {
            newErrors.employeeNumber = '사원번호를 입력해주세요.';
        }

        if (!formData.department) {
            newErrors.department = '부서를 선택해주세요.';
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
            formData.phoneNumber !== (userInfo?.phoneNumber || '') ||
            formData.loginId !== (userInfo?.loginId || '') ||
            formData.employeeNumber !== (userInfo?.employeeId || userInfo?.employeeNumber || '') ||
            formData.department !== (userInfo?.department || '') ||
            formData.status !== (userInfo?.status || '활성');

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
            maxWidth="md"
            fullWidth
            className="admin-modal"
        >
            {/* 헤더 */}
            <DialogTitle className="admin-modal-header">
                <AdminPanelSettingsIcon />
                <Typography variant="h6" component="div" className="admin-modal-title">
                    작업자 정보 수정 (관리자)
                </Typography>
                <Chip
                    label="ADMIN"
                    size="small"
                    className="admin-modal-chip"
                />
                <IconButton
                    onClick={handleCancel}
                    className="admin-modal-close-btn"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* 컨텐츠 */}
            <DialogContent className="admin-modal-content">
                <Box className="admin-modal-form">
                    {/* 관리자 권한 안내 */}
                    <Alert severity="warning" className="admin-warning-alert">
                        <strong>관리자 권한</strong>으로 작업자의 모든 정보를 수정할 수 있습니다. 신중하게 변경해주세요.
                    </Alert>

                    <Grid container spacing={4}>
                        {/* 개인 정보 섹션 제목 - 한 줄 전체 */}
                        <Grid item xs={12}>
                            <Typography variant="h6" className="section-title">
                                👤 개인 정보
                            </Typography>
                        </Grid>

                        {/* 한 줄에 3개 입력칸 */}
                        <Grid item xs={12} container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="로그인 ID"
                                    value={formData.loginId}
                                    onChange={handleChange('loginId')}
                                    error={!!errors.loginId}
                                    disabled
                                    fullWidth
                                    variant="outlined"
                                    className="admin-text-field"
                                />

                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="이름"
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    fullWidth
                                    variant="outlined"
                                    className="admin-text-field"
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="사원번호"
                                    value={formData.employeeNumber}
                                    onChange={handleChange('employeeNumber')}
                                    error={!!errors.employeeNumber}
                                    helperText={errors.employeeNumber}
                                    fullWidth
                                    variant="outlined"
                                    className="admin-text-field"
                                />
                            </Grid>
                        </Grid>

                        {/* 이메일 - 한 줄 전체 */}

                        <Grid item xs={12} container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="이메일"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    fullWidth
                                    variant="outlined"
                                    className="admin-text-field"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="전화번호"
                                    value={formData.phoneNumber}
                                    onChange={handleChange('phoneNumber')}
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber}
                                    fullWidth
                                    variant="outlined"
                                    placeholder="010-1234-5678"
                                    className="admin-text-field"
                                />

                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl
                                    fullWidth
                                    error={!!errors.department}
                                    className="admin-form-control"
                                    sx={{ width: '225px' }}
                                >
                                    <InputLabel>부서/작업타입</InputLabel>
                                    <Select
                                        value={formData.department}
                                        onChange={handleChange('department')}
                                        label="부서/작업타입"
                                    >
                                        {departmentOptions.map((dept) => (
                                            <MenuItem key={dept} value={dept}>
                                                {dept}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                        {/*/!* 상태 - 중앙 배치 *!/*/}
                        {/*<Grid item xs={8} md={6} sx={{ mx: 'auto' }}>*/}
                        {/*    <FormControl*/}
                        {/*        fullWidth*/}
                        {/*        error={!!errors.status}*/}
                        {/*        className="admin-form-control"*/}
                        {/*    >*/}
                        {/*        <InputLabel>계정 상태</InputLabel>*/}
                        {/*        <Select*/}
                        {/*            value={formData.status}*/}
                        {/*            onChange={handleChange('status')}*/}
                        {/*            label="계정 상태"*/}
                        {/*        >*/}
                        {/*            {statusOptions.map((status) => (*/}
                        {/*                <MenuItem key={status} value={status}>*/}
                        {/*                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>*/}
                        {/*                        <Box*/}
                        {/*                            sx={{*/}
                        {/*                                width: 8,*/}
                        {/*                                height: 8,*/}
                        {/*                                borderRadius: '50%',*/}
                        {/*                                backgroundColor:*/}
                        {/*                                    status === '활성' ? '#22c55e' :*/}
                        {/*                                        status === '비활성' ? '#ef4444' : '#f59e0b'*/}
                        {/*                            }}*/}
                        {/*                        />*/}
                        {/*                        {status}*/}
                        {/*                    </Box>*/}
                        {/*                </MenuItem>*/}
                        {/*            ))}*/}
                        {/*        </Select>*/}
                        {/*        {errors.status && <FormHelperText>{errors.status}</FormHelperText>}*/}
                        {/*    </FormControl>*/}
                        {/*</Grid>*/}
                    {/*</Grid>*/}

                    {/* 추가 안내 메시지 */}
                    <Alert severity="info" className="admin-info-alert">
                        변경된 정보는 즉시 적용되며, 작업자에게 별도 알림이 전송됩니다.
                    </Alert>
                </Box>
            </DialogContent>

            {/* 액션 버튼 */}
            <DialogActions className="admin-modal-actions">
                <Button
                    onClick={handleCancel}
                    variant="outlined"
                    className="admin-cancel-btn"
                    disabled={isSaving}
                >
                    취소
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    className="admin-save-btn"
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {isSaving ? '저장 중...' : '변경사항 저장'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdminProfileEditModal;