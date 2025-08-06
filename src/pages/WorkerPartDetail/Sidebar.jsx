// src/components/Sidebar.jsx
import React from "react";
import "./Sidebar.css";  // 스타일 분리하고 싶으면

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo192.png" alt="로고" className="sidebar-logo-img"/>
        <div className="sidebar-title">
          <b>HYUNDAI</b>
          <span className="sidebar-desc">Manufacturing System</span>
        </div>
      </div>
      <nav className="sidebar-menu">
        <ul>
          <li>작업 공정</li>
          <li>통계</li>
          <li>관리자 등록</li>
          <li>작업자 등록</li>
          <li>작업자 조회</li>
          <li>작업자 호출</li>
          <li className="active">공지사항</li>
        </ul>
      </nav>
    </aside>
  );
}
