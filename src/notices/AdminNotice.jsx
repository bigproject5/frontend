// src/notices/AdminNotice.jsx - 스크롤 완전 제거 버전
import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
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
  Stack,
  Menu,
  MenuItem,
  ListItemAvatar
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  MonitorHeart as MonitorIcon,
  People as PeopleIcon,
  BugReport as BugReportIcon,
  Assignment as AssignmentIcon,
  Assessment as ReportIcon,
  Analytics as AnalyticsIcon,
  ExpandLess,
  ExpandMore,
  Campaign as CampaignIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AttachFile as AttachFileIcon,
  AdminPanelSettings as AdminIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function AdminNotice() {
  const [allNotices, setAllNotices] = useState([])
  const [notices, setNotices] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, noticeId: null, noticeTitle: '' })
  const [openNotice, setOpenNotice] = useState(true)
  const [selectedMenu, setSelectedMenu] = useState('공지사항관리')
  const [notificationAnchor, setNotificationAnchor] = useState(null)
  const [settingsAnchor, setSettingsAnchor] = useState(null)
  const navigate = useNavigate()

  const itemsPerPage = 5 // 화면에 맞게 줄임

  // 알림 샘플 데이터
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: '새로운 공지사항 등록',
      message: '시스템 점검 안내가 등록되었습니다.',
      time: '5분 전',
      isRead: false
    },
    {
      id: 2,
      type: 'warning',
      title: '시스템 업데이트 알림',
      message: '오늘 밤 12시에 시스템 업데이트가 예정되어 있습니다.',
      time: '1시간 전',
      isRead: false
    },
    {
      id: 3,
      type: 'success',
      title: '백업 완료',
      message: '일일 데이터 백업이 성공적으로 완료되었습니다.',
      time: '3시간 전',
      isRead: true
    }
  ]

  const unreadCount = notifications.filter(n => !n.isRead).length

  useEffect(() => {
    // 10개 샘플 데이터 (화면에 맞게 조정)
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
      },
      {
        id: 6,
        title: '업무 프로세스 개선 사항',
        author: '송개선',
        date: '2024-01-10 10:45',
        views: 92,
        hasAttachment: false,
        isPinned: false
      },
      {
        id: 7,
        title: '하반기 성과 평가 일정',
        author: '한평가',
        date: '2024-01-09 13:20',
        views: 134,
        hasAttachment: true,
        isPinned: false
      },
      {
        id: 8,
        title: '신입사원 OJT 프로그램 안내',
        author: '류신입',
        date: '2024-01-08 15:10',
        views: 167,
        hasAttachment: false,
        isPinned: false
      },
      {
        id: 9,
        title: '여름휴가 신청 안내',
        author: '홍휴가',
        date: '2024-01-07 09:30',
        views: 203,
        hasAttachment: true,
        isPinned: false
      },
      {
        id: 10,
        title: '사무용품 신청 절차 변경',
        author: '윤사무',
        date: '2024-01-06 16:40',
        views: 45,
        hasAttachment: false,
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

  const handleTitleClick = (noticeId) => {
    navigate(`/admin/notice/${noticeId}`)
  }

  const handleEdit = (noticeId, event) => {
    event.stopPropagation()
    navigate(`/admin/edit/${noticeId}`)
  }

  const handleDelete = (noticeId, noticeTitle, event) => {
    event.stopPropagation()
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

  const handleNoticeClick = () => {
    setOpenNotice(!openNotice)
  }

  const handleMenuClick = (menuName, path) => {
    setSelectedMenu(menuName)
    if (path) {
      navigate(path)
    }
  }

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget)
  }

  const handleNotificationClose = () => {
    setNotificationAnchor(null)
  }

  const handleSettingsClick = (event) => {
    setSettingsAnchor(event.currentTarget)
  }

  const handleSettingsClose = () => {
    setSettingsAnchor(null)
  }

  const handleAdminPageClick = () => {
    setSettingsAnchor(null)
    navigate('/admin-dashboard')
  }

  const menuItems = [
    { title: '대시보드', icon: <DashboardIcon />, path: '/dashboard', key: '대시보드' },
    { title: '실시간 모니터링', icon: <MonitorIcon />, path: '/monitoring', key: '실시간모니터링' },
    { title: '작업자 관리', icon: <PeopleIcon />, path: '/workers', key: '작업자관리' },
    { title: '불량 관리', icon: <BugReportIcon />, path: '/defects', key: '불량관리' },
    { title: '검사 관리', icon: <AssignmentIcon />, path: '/inspection', key: '검사관리' },
    { title: '리포트', icon: <ReportIcon />, path: '/reports', key: '리포트' },
    { title: '통계 분석', icon: <AnalyticsIcon />, path: '/analytics', key: '통계분석' }
  ]

  // 통계 계산
  const totalNotices = allNotices.length
  const pinnedNotices = allNotices.filter(notice => notice.isPinned).length
  const thisWeekNotices = allNotices.filter(notice => {
    const noticeDate = new Date(notice.date)
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    return noticeDate >= weekAgo
  }).length
  const customerInquiries = 5

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <InfoIcon sx={{ color: '#2196f3' }} />
      case 'warning':
        return <WarningIcon sx={{ color: '#ff9800' }} />
      case 'success':
        return <CheckCircleIcon sx={{ color: '#4caf50' }} />
      default:
        return <InfoIcon sx={{ color: '#2196f3' }} />
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      overflow: 'hidden' // 전체 스크롤 완전 차단
    }}>
      {/* 상단 헤더 */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#162d5a',
          boxShadow: 'none',
          zIndex: 1201
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '60px', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: 'white',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography sx={{ fontWeight: 'bold', color: '#162d5a', fontSize: '14px' }}>
                  H
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 'bold', color: 'white', fontSize: '13px', lineHeight: 1 }}>
                  Hyundai
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', lineHeight: 1 }}>
                  AI Vision System
                </Typography>
              </Box>
            </Box>

            <Box sx={{ height: 30, width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />

            <Box sx={{ ml: 1 }}>
              <Typography sx={{ color: 'white', fontWeight: 500, fontSize: '16px', lineHeight: 1 }}>
                Vision AI Platform
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>
                비전 AI 검수 시스템
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              sx={{
                color: 'white',
                p: 0.5,
                outline: 'none',
                '&:focus': { outline: 'none' },
                '&:focus-visible': { outline: 'none' }
              }}
              onClick={handleNotificationClick}
            >
              <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '10px', minWidth: 16, height: 16 } }}>
                <NotificationsIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>

            <IconButton
              sx={{
                color: 'white',
                p: 0.5,
                ml: 1,
                outline: 'none',
                '&:focus': { outline: 'none' },
                '&:focus-visible': { outline: 'none' }
              }}
              onClick={handleSettingsClick}
            >
              <SettingsIcon sx={{ fontSize: 20 }} />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: '#105096',
                  fontSize: '11px'
                }}
              >
                A
              </Avatar>
              <Typography sx={{ color: 'white', fontSize: '12px' }}>
                관리자
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 알림 메뉴 */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            mt: 1
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
            알림 ({unreadCount}개의 새 알림)
          </Typography>
        </Box>
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            sx={{
              py: 1.5,
              borderBottom: '1px solid #f5f5f5',
              backgroundColor: notification.isRead ? 'transparent' : '#f3f4f6',
              '&:hover': { backgroundColor: '#e5e7eb' }
            }}
          >
            <ListItemAvatar>
              {getNotificationIcon(notification.type)}
            </ListItemAvatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '13px' }}>
                {notification.title}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '12px', color: '#666', mt: 0.5 }}>
                {notification.message}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '11px', color: '#999', mt: 0.5 }}>
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button size="small" sx={{ fontSize: '12px' }}>
            모든 알림 보기
          </Button>
        </Box>
      </Menu>

      {/* 설정 메뉴 */}
      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={handleSettingsClose}
        PaperProps={{
          sx: {
            width: 200,
            mt: 1
          }
        }}
      >
        <MenuItem onClick={handleAdminPageClick}>
          <ListItemIcon>
            <AdminIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">관리자 페이지</Typography>
        </MenuItem>
        <MenuItem onClick={handleSettingsClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">설정</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSettingsClose}>
          <Typography variant="inherit" color="error">로그아웃</Typography>
        </MenuItem>
      </Menu>

      {/* 사이드바 */}
      <Drawer
        variant="permanent"
        sx={{
          width: 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 200,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e0e0e0',
            top: '60px',
            height: 'calc(100vh - 60px)',
            overflow: 'hidden'
          },
        }}
      >
        <Box sx={{
          height: '100%',
          overflow: 'hidden',
          py: 0.5
        }}>
          <List sx={{ px: 0.5, py: 0 }}>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.title}
                onClick={() => handleMenuClick(item.key, item.path)}
                sx={{
                  borderRadius: 0,
                  mb: 0,
                  px: 1.5,
                  py: 0.8,
                  backgroundColor: selectedMenu === item.key ? '#e8f4fd' : 'transparent',
                  borderLeft: selectedMenu === item.key ? '3px solid #1976d2' : '3px solid transparent',
                  outline: 'none',
                  '&:focus': { outline: 'none' },
                  '&:focus-visible': { outline: 'none' },
                  '&:hover': {
                    backgroundColor: selectedMenu === item.key ? '#e8f4fd' : '#f5f5f5'
                  }
                }}
              >
                <ListItemIcon sx={{
                  color: selectedMenu === item.key ? '#1976d2' : '#666666',
                  minWidth: 28
                }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 18 } })}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: '12px',
                    fontWeight: selectedMenu === item.key ? 600 : 400,
                    color: selectedMenu === item.key ? '#1976d2' : '#333333'
                  }}
                />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ my: 0.5 }} />

          <List sx={{ px: 0.5, py: 0 }}>
            <ListItemButton
              onClick={handleNoticeClick}
              sx={{
                borderRadius: 0,
                mb: 0,
                px: 1.5,
                py: 0.8,
                backgroundColor: '#e8f4fd',
                borderLeft: '3px solid #1976d2',
                outline: 'none',
                '&:focus': { outline: 'none' },
                '&:focus-visible': { outline: 'none' },
                '&:hover': {
                  backgroundColor: '#e8f4fd'
                }
              }}
            >
              <ListItemIcon sx={{ color: '#1976d2', minWidth: 28 }}>
                <CampaignIcon sx={{ fontSize: 28 }} />
              </ListItemIcon>
              <ListItemText
                primary="공지사항"
                primaryTypographyProps={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1976d2'
                }}
              />
              {openNotice ? <ExpandLess sx={{ color: '#1976d2', fontSize: 16 }} /> : <ExpandMore sx={{ color: '#1976d2', fontSize: 16 }} />}
            </ListItemButton>

            <Collapse in={openNotice} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  onClick={() => handleMenuClick('공지사항조회', '/NoticeList')}
                  sx={{
                    pl: 3,
                    borderRadius: 0,
                    mb: 0,
                    px: 1.5,
                    py: 0.6,
                    backgroundColor: selectedMenu === '공지사항조회' ? '#e8f4fd' : 'transparent',
                    borderLeft: selectedMenu === '공지사항조회' ? '3px solid #1976d2' : '3px solid transparent',
                    outline: 'none',
                    '&:focus': { outline: 'none' },
                    '&:focus-visible': { outline: 'none' },
                    '&:hover': {
                      backgroundColor: selectedMenu === '공지사항조회' ? '#e8f4fd' : '#f5f5f5'
                    }
                  }}
                >
                  <ListItemIcon sx={{
                    color: selectedMenu === '공지사항조회' ? '#1976d2' : '#666666',
                    minWidth: 24
                  }}>
                    <VisibilityIcon sx={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="공지사항 조회(작업자)"
                    primaryTypographyProps={{
                      fontSize: '11px',
                      fontWeight: selectedMenu === '공지사항조회' ? 600 : 400,
                      color: selectedMenu === '공지사항조회' ? '#1976d2' : '#555555'
                    }}
                  />
                </ListItemButton>

                <ListItemButton
                  onClick={() => handleMenuClick('공지사항관리')}
                  sx={{
                    pl: 3,
                    borderRadius: 0,
                    mb: 0,
                    px: 1.5,
                    py: 0.6,
                    backgroundColor: '#e8f4fd',
                    borderLeft: '3px solid #1976d2',
                    outline: 'none',
                    '&:focus': { outline: 'none' },
                    '&:focus-visible': { outline: 'none' },
                    '&:hover': {
                      backgroundColor: '#e8f4fd'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: '#1976d2', minWidth: 24 }}>
                    <CampaignIcon sx={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="공지사항 관리"
                    primaryTypographyProps={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#1976d2'
                    }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>

      {/* 메인 콘텐츠 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f5f7fa',
          marginTop: '60px',
          marginLeft: '200px',
          height: 'calc(100vh - 60px)', // 정확한 높이 설정
          overflow: 'hidden', // 스크롤 완전 차단
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{
          flex: 1,
          p: 2,
          overflow: 'hidden', // 내부 스크롤도 차단
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 'bold', fontSize: '20px', color: '#333' }}>
            공지사항
          </Typography>

          <Typography variant="body2" sx={{ mb: 2, color: '#666', fontSize: '12px' }}>
            시스템 공지사항을 관리합니다.
          </Typography>

          {/* 통계 카드 */}
          <Box sx={{ mb: 2, display: 'flex', gap: 1.5 }}>
            <Card sx={{ flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
                <Typography variant="body2" sx={{ color: '#888', mb: 0.5, fontSize: '11px' }}>
                  전체 공지
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 0.5, fontSize: '28px' }}>
                  {totalNotices}
                </Typography>
                <Typography variant="body2" sx={{ color: '#10b981', fontSize: '10px' }}>
                  총 공지사항
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
                <Typography variant="body2" sx={{ color: '#888', mb: 0.5, fontSize: '11px' }}>
                  고정 공지
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 0.5, fontSize: '28px' }}>
                  {pinnedNotices}
                </Typography>
                <Typography variant="body2" sx={{ color: '#f59e0b', fontSize: '10px' }}>
                  상단 고정
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
                <Typography variant="body2" sx={{ color: '#888', mb: 0.5, fontSize: '11px' }}>
                  이번 주 작성
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 0.5, fontSize: '28px' }}>
                  {thisWeekNotices}
                </Typography>
                <Typography variant="body2" sx={{ color: '#3b82f6', fontSize: '10px' }}>
                  최근 7일
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
                <Typography variant="body2" sx={{ color: '#888', mb: 0.5, fontSize: '11px' }}>
                  고객 문의
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 0.5, fontSize: '28px' }}>
                  {customerInquiries}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ef4444', fontSize: '10px' }}>
                  답변 대기
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* 공지사항 목록 */}
          <Paper sx={{
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden' // 스크롤 차단
          }}>
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #eee', backgroundColor: '#f8f9fa' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '14px', mb: 0.3, color: '#333' }}>
                공지사항 목록
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '11px' }}>
                등록된 공지사항의 목록 수 : {allNotices.length} 건 입니다. (현재 {page}페이지 / 총 {totalPages}페이지)
              </Typography>
            </Box>

            {/* 테이블 영역 */}
            <Box sx={{
              flex: 1,
              overflow: 'hidden', // 테이블 스크롤도 완전 차단
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#555', fontSize: '12px', py: 1, borderBottom: '1px solid #ddd', width: '8%' }}>
                      번호
                    </TableCell>
                    <TableCell align="left" sx={{ fontWeight: 'bold', color: '#555', fontSize: '12px', py: 1, borderBottom: '1px solid #ddd', width: '50%' }}>
                      제목
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#555', fontSize: '12px', py: 1, borderBottom: '1px solid #ddd', width: '12%' }}>
                      작성자
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#555', fontSize: '12px', py: 1, borderBottom: '1px solid #ddd', width: '15%' }}>
                      등록일
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#555', fontSize: '12px', py: 1, borderBottom: '1px solid #ddd', width: '8%' }}>
                      조회수
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#555', fontSize: '12px', py: 1, borderBottom: '1px solid #ddd', width: '7%' }}>
                      작업
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notices.map((notice) => (
                    <TableRow
                      key={notice.id}
                      sx={{
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleTitleClick(notice.id)}
                    >
                      <TableCell align="center" sx={{ color: '#007bff', fontWeight: 'bold', fontSize: '12px', py: 1.2, borderBottom: '1px solid #eee' }}>
                        {notice.id}
                      </TableCell>
                      <TableCell align="left" sx={{ fontSize: '12px', py: 1.2, borderBottom: '1px solid #eee' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {notice.isPinned && (
                            <Typography sx={{ color: '#ef4444', fontSize: '10px', fontWeight: 'bold', mr: 0.5 }}>
                              📌
                            </Typography>
                          )}
                          <Typography sx={{
                            color: '#333',
                            fontSize: '12px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            '&:hover': {
                              color: '#007bff',
                              textDecoration: 'underline'
                            }
                          }}>
                            {notice.title}
                          </Typography>
                          {notice.hasAttachment && (
                            <AttachFileIcon sx={{ fontSize: 14, color: '#888', flexShrink: 0 }} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#666', fontSize: '12px', py: 1.2, borderBottom: '1px solid #eee' }}>
                        {notice.author}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#666', fontSize: '12px', py: 1.2, borderBottom: '1px solid #eee' }}>
                        {notice.date}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#666', fontSize: '12px', py: 1.2, borderBottom: '1px solid #eee' }}>
                        {notice.views}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.2, borderBottom: '1px solid #eee' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <IconButton
                            onClick={(event) => handleEdit(notice.id, event)}
                            size="small"
                            sx={{
                              color: '#28a745',
                              p: 0.3,
                              outline: 'none',
                              '&:focus': { outline: 'none' },
                              '&:focus-visible': { outline: 'none' },
                              '&:hover': { backgroundColor: '#e8f5e8' }
                            }}
                          >
                            <EditIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          <IconButton
                            onClick={(event) => handleDelete(notice.id, notice.title, event)}
                            size="small"
                            sx={{
                              color: '#dc3545',
                              p: 0.3,
                              outline: 'none',
                              '&:focus': { outline: 'none' },
                              '&:focus-visible': { outline: 'none' },
                              '&:hover': { backgroundColor: '#fde8e8' }
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {/* 페이지네이션 - 하단 고정 */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
              px: 2,
              borderTop: '1px solid #eee',
              backgroundColor: '#f9f9f9'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '12px',
                      minWidth: '28px',
                      height: '28px',
                      outline: 'none',
                      '&:focus': { outline: 'none' },
                      '&:focus-visible': { outline: 'none' }
                    }
                  }}
                />
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                onClick={() => navigate('/admin/write')}
                sx={{
                  backgroundColor: '#007bff',
                  outline: 'none',
                  '&:focus': { outline: 'none' },
                  '&:focus-visible': { outline: 'none' },
                  '&:hover': {
                    backgroundColor: '#0056b3'
                  },
                  px: 2,
                  py: 0.8,
                  fontSize: '12px',
                  textTransform: 'none'
                }}
              >
                공지사항 작성
              </Button>
            </Box>
          </Paper>
        </Box>

        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, noticeId: null, noticeTitle: '' })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontSize: '16px' }}>공지사항 삭제</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              삭제된 공지사항은 복구할 수 없습니다.
            </Alert>
            <Typography sx={{ fontSize: '14px' }}>
              다음 공지사항을 정말 삭제하시겠습니까?
            </Typography>
            <Typography sx={{ mt: 1, fontWeight: 'bold', color: 'error.main', fontSize: '14px' }}>
              "{deleteDialog.noticeTitle}"
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialog({ open: false, noticeId: null, noticeTitle: '' })}
              sx={{
                fontSize: '12px',
                outline: 'none',
                '&:focus': { outline: 'none' },
                '&:focus-visible': { outline: 'none' }
              }}
            >
              취소
            </Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
              sx={{
                fontSize: '12px',
                outline: 'none',
                '&:focus': { outline: 'none' },
                '&:focus-visible': { outline: 'none' }
              }}
            >
              삭제
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default AdminNotice
