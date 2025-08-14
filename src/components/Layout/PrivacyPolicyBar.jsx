import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const PrivacyPolicyBar = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        color: '#616161',
        p: 2,
        textAlign: 'center',
        borderTop: '1px solid #e0e0e0',
        mt: 16, // Add some margin top
      }}
    >
      <Typography variant="body2">
        이 사이트는 개인정보처리방침을 준수합니다.{' '}
        <Link href="/privacy" color="inherit">
          자세히 보기
        </Link>
      </Typography>
    </Box>
  );
};

export default PrivacyPolicyBar;
