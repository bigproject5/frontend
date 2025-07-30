import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Grid3X3, 
  Clock, 
  Users, 
  UserCheck, 
  UserPlus,
  AlertTriangle, 
  Target, 
  BarChart3, 
  Car, 
  Eye, 
  Search, 
  Wrench, 
  FileText, 
  TrendingUp, 
  MessageSquare,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    workers: true, // 작업자 관리 기본 열림
    failure: false,
    inspection: false
  });

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    color: '#374151',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '8px',
    margin: '2px 8px',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  };

  const activeMenuItemStyle = {
    ...menuItemStyle,
    backgroundColor: '#1e40af',
    color: 'white'
  };

  const subMenuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px 10px 44px', // 들여쓰기
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '400',
    borderRadius: '8px',
    margin: '2px 8px',
    transition: 'all 0.2s ease'
  };

  const activeSubMenuItemStyle = {
    ...subMenuItemStyle,
    backgroundColor: '#1e40af',
    color: 'white'
  };

  const expandableMenuStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '8px',
    margin: '2px 8px',
    cursor: 'pointer',
    backgroundColor: '#bfdbfe', // 연한 파란색 배경
    transition: 'all 0.2s ease'
  };

  return (
    <div style={{
      width: '240px',
      height: 'calc(100vh - 72px)',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      position: 'fixed',
      left: 0,
      top: '72px',
      overflowY: 'auto',
      zIndex: 10
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#1e40af',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            H
          </div>
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#111827'
            }}>
              Hyundai
            </div>
            <div style={{
              fontSize: '12px',
              color: '#6b7280'
            }}>
              AI Vision System
            </div>
          </div>
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div style={{ padding: '16px 0' }}>
        {/* 대시보드 */}
        <Link 
          to="/dashboard" 
          style={isActive('/dashboard') ? activeMenuItemStyle : menuItemStyle}
        >
          <Grid3X3 size={20} style={{ marginRight: '12px' }} />
          대시보드
        </Link>

        {/* 실시간 모니터링 */}
        <Link 
          to="/monitoring" 
          style={isActive('/monitoring') ? activeMenuItemStyle : menuItemStyle}
        >
          <Clock size={20} style={{ marginRight: '12px' }} />
          실시간 모니터링
        </Link>

        {/* 작업자 관리 (토글 메뉴) */}
        <div>
          <div 
            style={expandableMenuStyle}
            onClick={() => toggleMenu('workers')}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Users size={20} style={{ marginRight: '12px' }} />
              작업자 관리
            </div>
            {expandedMenus.workers ? 
              <ChevronDown size={16} /> : 
              <ChevronRight size={16} />
            }
          </div>
          
          {expandedMenus.workers && (
            <div>
              <Link 
                to="/workers" 
                style={isActive('/workers') ? activeSubMenuItemStyle : subMenuItemStyle}
              >
                <UserCheck size={18} style={{ marginRight: '12px' }} />
                작업자 목록
              </Link>
              <Link 
                to="/workers/register" 
                style={isActive('/workers/register') ? activeSubMenuItemStyle : subMenuItemStyle}
              >
                <UserPlus size={18} style={{ marginRight: '12px' }} />
                작업자 등록
              </Link>
            </div>
          )}
        </div>

        {/* 불량 관리 (토글 메뉴) */}
        <div>
          <div 
            style={expandableMenuStyle}
            onClick={() => toggleMenu('failure')}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AlertTriangle size={20} style={{ marginRight: '12px' }} />
              불량 관리
            </div>
            {expandedMenus.failure ? 
              <ChevronDown size={16} /> : 
              <ChevronRight size={16} />
            }
          </div>
          
          {expandedMenus.failure && (
            <div>
              <Link 
                to="/failure/list" 
                style={isActive('/failure/list') ? activeSubMenuItemStyle : subMenuItemStyle}
              >
                <Target size={18} style={{ marginRight: '12px' }} />
                불량 목록
              </Link>
              <Link 
                to="/failure/analysis" 
                style={isActive('/failure/analysis') ? activeSubMenuItemStyle : subMenuItemStyle}
              >
                <BarChart3 size={18} style={{ marginRight: '12px' }} />
                불량 분석
              </Link>
            </div>
          )}
        </div>

        {/* 검사 관리 (토글 메뉴) */}
        <div>
          <div 
            style={expandableMenuStyle}
            onClick={() => toggleMenu('inspection')}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Car size={20} style={{ marginRight: '12px' }} />
              검사 관리
            </div>
            {expandedMenus.inspection ? 
              <ChevronDown size={16} /> : 
              <ChevronRight size={16} />
            }
          </div>
          
          {expandedMenus.inspection && (
            <div>
              <Link 
                to="/inspection/list" 
                style={isActive('/inspection/list') ? activeSubMenuItemStyle : subMenuItemStyle}
              >
                <Eye size={18} style={{ marginRight: '12px' }} />
                검사 목록
              </Link>
              <Link 
                to="/inspection/vision" 
                style={isActive('/inspection/vision') ? activeSubMenuItemStyle : subMenuItemStyle}
              >
                <Search size={18} style={{ marginRight: '12px' }} />
                비전 검사
              </Link>
              <Link 
                to="/inspection/sound" 
                style={isActive('/inspection/sound') ? activeSubMenuItemStyle : subMenuItemStyle}
              >
                <Wrench size={18} style={{ marginRight: '12px' }} />
                음성 검사
              </Link>
            </div>
          )}
        </div>

        {/* 리포트 */}
        <Link 
          to="/reports" 
          style={isActive('/reports') ? activeMenuItemStyle : menuItemStyle}
        >
          <FileText size={20} style={{ marginRight: '12px' }} />
          리포트
        </Link>

        {/* 통계 분석 */}
        <Link 
          to="/statistics" 
          style={isActive('/statistics') ? activeMenuItemStyle : menuItemStyle}
        >
          <TrendingUp size={20} style={{ marginRight: '12px' }} />
          통계 분석
        </Link>

        {/* 공지사항 */}
        <Link 
          to="/notices" 
          style={isActive('/notices') ? activeMenuItemStyle : menuItemStyle}
        >
          <MessageSquare size={20} style={{ marginRight: '12px' }} />
          공지사항
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;