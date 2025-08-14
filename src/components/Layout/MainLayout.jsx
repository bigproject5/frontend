import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import PrivacyPolicyBar from './PrivacyPolicyBar';

const MainLayout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Header />
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar />
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        bgcolor: '#fafafa',
                        ml: '360px',
                        overflowY: 'auto',
                        display: 'flex',           // 추가
                        flexDirection: 'column'    // 추가
                    }}
                >
                    <Box sx={{
                        flex: 1,
                        minHeight: 'calc(100vh - 100px)'
                    }}>     {/* Outlet을 감싸는 Box 추가 */}
                        <Outlet />
                    </Box>
                    <PrivacyPolicyBar />       {/* 이제 항상 아래 고정 */}
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;

