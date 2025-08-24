# 1단계: 빌드 환경 (기존과 동일)
# --------------------------------
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 전체 복사
COPY . .

# 애플리케이션 빌드 (환경 변수 없이 빌드)
RUN npm run build


# 2단계: 프로덕션 환경 (수정됨)
# --------------------------------
FROM nginx:stable-alpine

# 빌드 단계에서 생성된 정적 파일들을 Nginx의 기본 서빙 디렉토리로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 설정 파일을 이미지 안으로 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# --- ⬇️ 추가된 부분 ⬇️ ---

# 런타임에 설정 파일을 생성하기 위한 템플릿과 시작 스크립트를 복사
COPY config.template.js /usr/share/nginx/html/
COPY entrypoint.sh /

# 시작 스크립트에 실행 권한 부여
RUN chmod +x /entrypoint.sh

# --- ⬆️ 추가된 부분 ⬆️ ---

# Nginx가 80번 포트를 사용함을 명시
EXPOSE 80

# --- ⬇️ 수정된 부분 ⬇️ ---
# 컨테이너가 시작될 때 CMD 대신 entrypoint.sh 스크립트를 실행
ENTRYPOINT ["/entrypoint.sh"]
