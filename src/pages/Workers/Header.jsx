import React from 'react';

const Header = () => {
  return (
    <header style={{
      backgroundColor: '#1e40af',
      color: 'white',
      padding: '16px 24px',
      width: '100%',
      height: '72px',
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '100%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'white',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              color: '#1e40af',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>H</span>
          </div>
          <div>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold',
              margin: 0 
            }}>Vision AI Platform</h1>
            <p style={{ 
              fontSize: '14px', 
              opacity: 0.9,
              margin: 0 
            }}>완성차 검사 시스템</p>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '12px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>3</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>👤</span>
            <span>관리자</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;