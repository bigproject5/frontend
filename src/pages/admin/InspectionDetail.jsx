import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  Avatar,
  Stack,
} from "@mui/material";
import {
  PlayCircleOutline,
  PersonOutline,
  Assignment,
  SmartToy,
  AccessTime,
} from "@mui/icons-material";

const InspectionDetail = () => {
  const { inspectionId } = useParams();
  const [vehicleId, part] = inspectionId?.split("-") || ["", ""];

  return (
    <Box
      sx={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        p: { xs: 2, md: 3 }
      }}
    >
      {/* 헤더 섹션 */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white"
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
            <Assignment />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              차량 {vehicleId}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              검사 파츠: {part}
            </Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Chip
              label="진행 중"
              sx={{
                bgcolor: "#22c55e",
                color: "white",
                fontWeight: 600,
                px: 2
              }}
            />
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {/* 검사 영상 섹션 */}
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <PlayCircleOutline color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  검사 영상
                </Typography>
              </Stack>
              <Box
                sx={{
                  width: "100%",
                  height: 300,
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  border: "2px dashed #cbd5e1",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#e2e8f0",
                    borderColor: "#94a3b8"
                  }
                }}
              >
                <Stack alignItems="center" spacing={1}>
                  <PlayCircleOutline sx={{ fontSize: 48, color: "#64748b" }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    검사 영상을 불러오는 중...
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI 리포트 섹션 */}
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <SmartToy color="secondary" />
                <Typography variant="h6" fontWeight={600}>
                  AI 분석 리포트
                </Typography>
              </Stack>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: "#fef7f0",
                  borderRadius: 2,
                  border: "1px solid #fed7aa"
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.6,
                    fontWeight: 500,
                    color: "#ea580c"
                  }}
                >
                  🚨 와이퍼 작동 불량 감지
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={1}
                  sx={{ lineHeight: 1.5 }}
                >
                  우측 와이퍼가 정상적으로 작동하지 않습니다.
                  모터 연결부 점검이 필요합니다.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 작업자 정보 섹션 */}
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <PersonOutline color="info" />
                <Typography variant="h6" fontWeight={600}>
                  작업자 정보
                </Typography>
              </Stack>
              <Stack spacing={2.5}>
                <TextField
                  label="담당 작업자"
                  fullWidth
                  size="small"
                  value="김작업"
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f8fafc"
                    }
                  }}
                />
                <TextField
                  label="조치 시작 시간"
                  fullWidth
                  size="small"
                  value="2025-07-30 14:25:08"
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f8fafc"
                    }
                  }}
                />
                <TextField
                  label="조치 완료 시간"
                  fullWidth
                  size="small"
                  value="2025-07-30 15:30:22"
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f8fafc"
                    }
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 조치 내용 섹션 */}
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <Assignment color="success" />
                <Typography variant="h6" fontWeight={600}>
                  조치 내용
                </Typography>
              </Stack>
              <TextField
                multiline
                rows={8}
                fullWidth
                value="우측 와이퍼 모터 교체 완료. 연결부 점검 후 정상 작동 확인. 방수 처리도 재시행하였음. 향후 정기 점검 시 재확인 필요."
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc"
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 하단 정보 - 관리자용 */}
      <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
        <Button
          variant="outlined"
          size="large"
          onClick={() => window.history.back()}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600
          }}
        >
          목록으로 돌아가기
        </Button>

        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label="조치 완료"
            color="success"
            sx={{
              px: 2,
              py: 1,
              fontWeight: 600,
              fontSize: "0.875rem"
            }}
          />
          <Typography variant="body2" color="text.secondary">
            최종 업데이트: 2025-07-30 15:35:10
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default InspectionDetail;