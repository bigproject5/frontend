# CHECKAR :: Frontend

CHECKAR 서비스의 프론트엔드 애플리케이션입니다. 이 프로젝트는 Vite를 사용하여 빌드된 React 기반의 싱글 페이지 애플리케이션(SPA)입니다.

## 💻 주요 기술 스택

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: JavaScript
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Routing**: [React Router](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/) & [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- **Styling**: [Material-UI (MUI)](https://mui.com/)
- **CI/CD**: [Docker](https://www.docker.com/), [Jenkins](https://www.jenkins.io/), [Kubernetes](https://kubernetes.io/)

## 📁 프로젝트 구조

```
/
├── kubernetes/              # Kubernetes 배포 설정 (Deployment, Service)
├── public/                  # 정적 에셋 (이미지, 폰트 등)
├── src/
│   ├── api/                 # 백엔드 API 연동 함수
│   ├── components/          # 재사용 가능한 React 컴포넌트
│   ├── pages/               # 라우팅 단위의 페이지 컴포넌트
│   ├── store/               # Redux 상태 관리 (Slices, Store)
│   └── ...
├── .dockerignore            # Docker 빌드 시 제외할 파일 목록
├── .gitignore               # Git 버전 관리 제외 목록
├── Dockerfile               # 프로덕션용 Docker 이미지 빌드 설정
├── entrypoint.sh            # Docker 컨테이너 시작 시 실행될 스크립트
├── Jenkinsfile              # Jenkins CI/CD 파이프라인 정의
├── nginx.conf               # Nginx 웹 서버 설정
├── package.json             # 프로젝트 의존성 및 스크립트
└── vite.config.js           # Vite 개발 서버 및 빌드 설정
```

## ⚙️ 로컬 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 로컬 환경 변수 설정

로컬 개발 시에만 사용되는 환경 변수를 설정합니다. `.env.example` 파일을 복사하여 `.env` 파일을 생성하고, 필요한 변수(예: `VITE_API_BASE_URL`)를 정의합니다.

```bash
cp .env.example .env
```
> **Note**: `.env` 파일은 Vite 개발 서버(`npm run dev`)에서만 사용됩니다. 프로덕션 환경의 변수 설정은 아래의 '동적 런타임 환경설정' 부분을 참고하세요.

### 3. 개발 서버 실행

```bash
npm run dev
```
- 애플리케이션은 `http://localhost:5173`에서 실행됩니다.
- `vite.config.js`의 프록시 설정에 따라 `/api/**` 요청은 `http://localhost:8080`으로 전달됩니다.

## 🚀 빌드 및 배포

이 프로젝트는 Docker, Jenkins, Kubernetes를 통해 자동화된 빌드 및 배포 파이프라인을 갖추고 있습니다.

### 1. 동적 런타임 환경설정

프로덕션 환경에서는 빌드 시점이 아닌 **컨테이너 실행 시점(Runtime)**에 API 서버 주소와 같은 주요 환경 변수를 주입합니다.

- **`config.template.js`**: 환경 변수 템플릿 파일입니다.
- **`entrypoint.sh`**: 컨테이너가 시작될 때 이 스크립트가 실행됩니다. `envsubst` 명령어를 통해 `config.template.js` 파일 내의 `${VITE_API_BASE_URL}` 같은 변수를 실제 환경 변수 값으로 치환하여 `/usr/share/nginx/html/config.js` 파일을 생성합니다.
- **`index.html`**: `config.js`를 로드하여 `window.API_CONFIG` 전역 객체를 생성하고, 애플리케이션 코드에서는 이 객체를 통해 API 주소를 참조합니다.

이러한 구조 덕분에 단일 Docker 이미지를 여러 환경(개발, 스테이징, 운영)에 재사용할 수 있습니다.

### 2. Docker

`Dockerfile`은 Multi-stage 빌드를 사용하여 최적화된 프로덕션 이미지를 생성합니다.

1.  **Builder Stage**: Node.js 환경에서 `npm install` 및 `npm run build`를 실행하여 React 앱을 빌드합니다.
2.  **Production Stage**: 경량 Nginx 이미지에 빌드 결과물과 `nginx.conf`, `entrypoint.sh` 스크립트를 복사하여 최종 이미지를 완성합니다.

로컬에서 Docker 이미지를 빌드하고 실행하는 방법:
```bash
# 이미지 빌드
docker build -t checkar-frontend .

# 컨테이너 실행 (런타임 환경 변수 전달)
docker run -d -p 8080:80 \
  -e VITE_API_BASE_URL=http://your-api-server.com \
  --name checkar-frontend-container \
  checkar-frontend
```

### 3. CI/CD (Jenkins & Kubernetes)

`Jenkinsfile`은 Git 푸시가 발생했을 때 아래의 파이프라인을 자동으로 실행합니다.

1.  **Build**: `Dockerfile`을 사용하여 새 버전의 이미지를 빌드합니다.
2.  **Push**: 빌드된 이미지를 사내 Docker Registry (`jinee-docker`)에 푸시합니다.
3.  **Deploy**: `kubectl` 명령어를 사용하여 Kubernetes 클러스터의 Deployment를 업데이트합니다. `kubernetes/deployment.yaml`에 정의된 이미지 태그를 방금 푸시한 새 버전으로 변경하여 롤링 업데이트를 트리거합니다.

`kubernetes/` 디렉토리의 설정 파일들은 다음과 같습니다.

- **`deployment.yaml`**:
  - `replicas: 2`로 설정되어 2개의 Pod를 유지하여 가용성을 확보합니다.
  - 컨테이너에 `VITE_API_BASE_URL` 환경 변수를 주입하여 백엔드 API 서비스의 내부 주소(`http://checkar-api-service.checkar.svc.cluster.local:8080`)를 알려줍니다.
- **`service.yaml`**:
  - `type: ClusterIP`로 설정되어 Deployment가 생성한 Pod들에 대한 안정적인 내부 IP와 로드 밸런싱을 제공합니다.
  - 외부 트래픽은 Ingress Controller를 통해 이 Service로 라우팅됩니다.

## 📜 주요 NPM 스크립트

- `npm run dev`: 개발 모드로 Vite 서버를 실행합니다.
- `npm run build`: 프로덕션용으로 애플리케이션을 빌드합니다. (`dist` 디렉토리)
- `npm run lint`: ESLint로 코드 스타일을 검사합니다.
- `npm run preview`: 프로덕션 빌드 결과물을 로컬에서 미리 봅니다.
