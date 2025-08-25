import React from 'react';
import { Box, Typography, Container, Grid, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import RssFeedIcon from '@mui/icons-material/RssFeed';

const PrivacyPolicyBar = () => {
  return (
    <Box component="footer" id="footer" sx={{ backgroundColor: '#133c65ff', mt: 16 }}>
      <Box sx={{ py: 2, px: 3 }}>
        {/* Logo and Company Info in one line */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #003d82 0%, #0066cc 50%, #004080 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                C
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffffffff', fontSize: '18px' }}>
              CHECKAR
            </Typography>
          </Box>
          
          {/* Address */}
          <Typography variant="body2" sx={{ color: '#ffffffff', fontSize: '14px' }}>
            경기도 성남시 분당구 불정로 90 (정자동)
          </Typography>
          
          {/* Phone */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography component="span" sx={{ fontWeight: 'bold', color: '#ffffffff', fontSize: '14px' }}>
              대표전화 054-638-0009
            </Typography>
            <Typography component="span" sx={{ color: '#c7c6c6ff', fontSize: '14px', ml: 1 }}>
              (평일 09시~18시)
            </Typography>
          </Box>
        </Box>


        {/* Bottom Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3, mb: 2, ml: 8 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#dadadaff', 
              fontSize: '14px', 
              fontWeight: 'bold',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            개인정보처리방침
          </Typography>
          <Typography variant="body2" sx={{ color: '#dadadaff', fontSize: '14px', cursor: 'pointer' }}>
            저작권 정책
          </Typography>
          <Typography variant="body2" sx={{ color: '#dadadaff', fontSize: '14px', cursor: 'pointer' }}>
            웹 접근성 품질인증 마크 획득
          </Typography>
        </Box>

        {/* Copyright */}
        <Box sx={{ ml: 8 }}>
          <Typography variant="body2" sx={{ color: '#999', fontSize: '12px' }}>
            © 2025 Outo Quality Control Check Service. All rights reserved.
          </Typography>
        </Box>


      </Box>
    </Box>
  );
};

export default PrivacyPolicyBar;