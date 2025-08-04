import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const InspectionDetail = () => {
  const { inspectionId } = useParams();
  const [inspectionData, setInspectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInspectionDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/api/vehicleaudit/inspections/${inspectionId}`);

        // Enhanced Debugging
        if (!response.data || !response.data.code) {
            console.log(
                "**************************************************\n" +
                "********** 여기를 확인해주세요! **********\n" +
                "서버 응답이 비어있거나 code 필드가 없습니다.\n" +
                "받은 데이터:", response.data,
                "\n**************************************************"
            );
            throw new Error('서버로부터 비정상적인 응답을 받았습니다.');
        }

        if (response.data.code === 'SUCCESS') {
          setInspectionData(response.data.data);
        } else {
          // 서버가 에러 코드를 보냈을 경우
          console.log(
            "**************************************************\n" +
            "********** 여기를 확인해주세요! **********\n" +
            "서버가 SUCCESS 대신 보낸 응답 내용:", response.data,
            "\n**************************************************"
          );
          throw new Error(response.data.message || '데이터를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error("검사 상세 정보 조회 실패:", err);
        // Axios 에러의 경우, 실제 서버 응답을 보여주는 것이 유용
        if (err.response) {
            console.log("Axios 에러 응답:", err.response);
        }
        setError(err.message || '검사 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchInspectionDetail();
  }, [inspectionId]);

  const getStatusInfo = (status) => {
    const statusMap = {
      'PENDING': { color: '#6b7280', text: '대기중', bgcolor: '#f3f4f6' },
      'IN_ACTION': { color: '#f59e0b', text: '진행중', bgcolor: '#fef3c7' },
      'COMPLETED': { color: '#10b981', text: '완료', bgcolor: '#d1fae5' },
      'FAILED': { color: '#ef4444', text: '실패', bgcolor: '#fee2e2' }
    };
    return statusMap[status] || statusMap['PENDING'];
  };

  if (loading) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          padding: '24px 32px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '16px',
          color: '#374151'
        }}>
          로딩 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          padding: '24px 32px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '16px',
          color: '#ef4444',
          border: '1px solid #fecaca'
        }}>
          오류: {error}
        </div>
      </div>
    );
  }

  if (!inspectionData) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          padding: '24px 32px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '16px',
          color: '#6b7280'
        }}>
          검사 정보를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(inspectionData.status);

  return (
    <div style={{
      padding: '32px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 상단 헤더 */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: 0,
            color: '#111827',
            letterSpacing: '-0.025em'
          }}>
            차량 {inspectionData.audit?.model} / 검사 파츠: {inspectionData.partName}
          </h1>

          {/* 상태 표시 */}
          <span style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: statusInfo.bgcolor,
            color: statusInfo.color,
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            border: `2px solid ${statusInfo.color}`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {statusInfo.text}
          </span>
        </div>

        {/* 상단 4개 박스 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* 검사 영상 섹션 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            border: '1px solid #f3f4f6'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#111827',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%'
              }}></span>
              검사 영상
            </h3>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '240px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #d1d5db',
              overflow: 'hidden'
            }}>
              <video
                width="100%"
                height="100%"
                controls
                key={inspectionData.imageUrl}
                style={{ borderRadius: '12px' }}
              >
                <source src={inspectionData.imageUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* AI 리포트 섹션 - 더 넓게 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            border: '1px solid #f3f4f6'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#111827',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#8b5cf6',
                borderRadius: '50%'
              }}></span>
              AI 리포트
            </h3>
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
              border: '1px solid #e0e7ff',
              borderRadius: '12px',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                margin: 0,
                color: '#374151',
                fontStyle: 'italic'
              }}>
                "{inspectionData.description}"
              </p>
            </div>
          </div>

          {/* 작업자 정보 섹션 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            border: '1px solid #f3f4f6'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#111827',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#10b981',
                borderRadius: '50%'
              }}></span>
              작업자 정보
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  작업자
                </label>
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  border: '1px solid #e5e7eb'
                }}>
                  {inspectionData.workerName || '-'}
                </div>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  조치 시작 시간
                </label>
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  border: '1px solid #e5e7eb'
                }}>
                  {inspectionData.startedAt || '-'}
                </div>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  조치 완료 시간
                </label>
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  border: '1px solid #e5e7eb'
                }}>
                  {inspectionData.finishedAt || '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 조치 내용 섹션 - 읽기 전용 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        border: '1px solid #f3f4f6'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '16px',
          color: '#111827',
          margin: '0 0 16px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            backgroundColor: '#f59e0b',
            borderRadius: '50%'
          }}></span>
          조치 내용
        </h3>
        <div style={{
          minHeight: '200px',
          padding: '20px',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          fontSize: '15px',
          lineHeight: '1.6',
          color: '#374151',
          whiteSpace: 'pre-wrap',
          fontFamily: 'inherit'
        }}>
          {inspectionData.resolve || '조치 내용이 없습니다.'}
        </div>
      </div>
    </div>
  );
};

export default InspectionDetail;