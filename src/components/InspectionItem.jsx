import React from "react";
import "./InspectionItem.css";

const InspectionItem = ({ car, line, worker, time, status, defect }) => {
  return (
    <div className="inspection-item">
      <div className="car-info">
        <div className="car-name">{car}</div>
        <div className="car-meta">
          {line} · {worker} · {time}
        </div>
      </div>
      <div className="status-area">
        {status && <span className="status-tag">{status}</span>}
        {defect && <span className="defect-tag">{defect}</span>}
      </div>
    </div>
  );
};

export default InspectionItem;
