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
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getNotices } from '../../api/NoticeAPI.js';
import { useSelector } from 'react-redux';

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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#002c5f' }}>
          공지사항
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            onClick={() => navigate('/admin/notices/new')}
            sx={{
              backgroundColor: '#002c5f',
              '&:hover': { backgroundColor: '#001a3e' }
            }}
          >
            공지사항 작성
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 2, height: '800px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell align="center" width="8%">번호</TableCell>
              <TableCell align="center" width="50%">제목</TableCell>
              <TableCell align="center" width="12%">작성자</TableCell>
              <TableCell align="center" width="15%">작성일</TableCell>
              <TableCell align="center" width="10%">조회수</TableCell>
              <TableCell align="center" width="5%">첨부</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notices.map((notice) => (
              <TableRow
                key={notice.id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f9f9f9' }
                }}
                onClick={() => handleRowClick(notice.id)}
              >
                <TableCell align="center">{notice.id}</TableCell>
                <TableCell align="left" sx={{ fontWeight: 500 }}>
                  {notice.title}
                </TableCell>
                <TableCell align="center">{notice.author}</TableCell>
                <TableCell align="center">{notice.date}</TableCell>
                <TableCell align="center">{notice.views}</TableCell>
                <TableCell align="center">
                  {notice.hasAttachment && (
                    <Chip icon={<AttachFileIcon />} label="" size="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Container>
  );
}

export default NoticeList;
