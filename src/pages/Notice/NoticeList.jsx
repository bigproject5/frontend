import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  Container,
  Chip
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Create as CreateIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getNotices } from '../../api/NoticeAPI.js';
import { useSelector } from 'react-redux';
import './NoticeList.css';

function NoticeList() {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { role } = useSelector(state => state.auth);

  const isAdmin = role === 'ADMIN' || role === "DEV";
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotices();
  }, [page]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await getNotices(page - 1, itemsPerPage);

      if (response && response.content) {
        setNotices(response.content);
        setTotalPages(response.totalPages);
      } else if (Array.isArray(response)) {
        setNotices(response);
        setTotalPages(Math.ceil(response.length / itemsPerPage));
      }
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      setNotices([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowClick = (noticeId) => {
    navigate(`/notices/${noticeId}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 'calc(100vh - 64px - 48px)' }}>
      <Container 
      sx={{
        maxWidth: {
          md: '960px',
          lg: '1200px',
          xl: '1400px'
        },
        px: {
          xs: 2,
          sm: 4,
          md: 6
        },
        py: 4 // Add vertical padding here
      }}
    >
      <Box className="notice-list-header">
        <Typography variant="h3" component="h1" className="notice-list-title">
          공지사항
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<CreateIcon />}
            onClick={() => navigate('/admin/notices/new')}
            className="new-notice-button"
            size="large"
          >
            새 공지 작성
          </Button>
        )}
      </Box>

      <Paper className="notice-list-paper">
        <TableContainer className="notice-list-table-container">
          <Table>
            <TableHead>
              <TableRow className="notice-table-header-row">
                <TableCell align="center" className="notice-table-header-cell" sx={{ py: 2 }}>번호</TableCell>
                <TableCell align="left" className="notice-table-header-cell" sx={{ py: 2 }}>제목</TableCell>
                <TableCell align="center" className="notice-table-header-cell" sx={{ py: 2 }}>작성자</TableCell>
                <TableCell align="center" className="notice-table-header-cell" sx={{ py: 2 }}>작성일</TableCell>
                <TableCell align="center" className="notice-table-header-cell" sx={{ py: 2 }}>조회수</TableCell>
                <TableCell align="center" className="notice-table-header-cell" sx={{ py: 2 }}>첨부</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notices.map((notice) => (
                <TableRow
                  key={notice.id}
                  className="notice-table-row"
                  onClick={() => handleRowClick(notice.id)}
                >
                  <TableCell align="center" sx={{ py: 3 }}>{notice.id}</TableCell>
                  <TableCell align="left" className="notice-title-cell" sx={{ py: 2 }}>
                    {notice.title}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 3 }}>{notice.name}</TableCell>
                  <TableCell align="center" sx={{ py: 3 }}>{new Date(notice.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center" sx={{ py: 3 }}>{notice.viewCount}</TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    {notice.fileUrl && (
                      <AttachFileIcon fontSize="small" color="action" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box className="pagination-container">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Container>
  </Box>
  );
}

export default NoticeList;
