# 1단계: 빌드 환경
# --------------------------------
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 빌드 시 사용할 환경 변수를 ARG로 선언
ARG VITE_API_BASE_URL

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (npm ci는 package-lock.json을 사용하여 더 빠르고 일관된 설치를 보장)
RUN npm ci

# 소스 코드 전체 복사
COPY . .

# 애플리케이션 빌드 (ARG로 받은 변수를 빌드 시점에 환경변수로 주입)
RUN VITE_API_BASE_URL=$VITE_API_BASE_URL npm run build


# 2단계: 프로덕션 환경
# --------------------------------
FROM nginx:stable-alpine

# 빌드 단계에서 생성된 정적 파일들을 Nginx의 기본 서빙 디렉토리로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 위에서 준비한 Nginx 설정 파일을 이미지 안으로 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx가 80번 포트를 사용함을 명시
EXPOSE 80

# 컨테이너가 시작될 때 Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
