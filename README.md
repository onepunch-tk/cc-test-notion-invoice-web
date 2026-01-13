# Claude RR7 Starterkit

React Router v7 + Cloudflare Workers를 기반으로 한 프로덕션 레디 풀스택 웹 애플리케이션 스타터킷입니다.

## 🚀 주요 기능

### 핵심 기술 스택
- **React Router v7** - 풀스택 React 프레임워크 (SSR 지원)
- **Cloudflare Workers** - 엣지 컴퓨팅 배포 플랫폼
- **Better-auth** - 프레임워크 독립적 인증 라이브러리
- **Drizzle ORM** - Code-first 데이터베이스 스키마 관리
- **Supabase** - PostgreSQL 데이터베이스 (로컬 개발 환경 포함)
- **shadcn/ui** - 고품질 UI 컴포넌트 라이브러리
- **Tailwind CSS v4** - CSS Variables 기반 스타일링
- **TypeScript** - 타입 안전성

### 주요 특징
- ✅ 3단계 중첩 Layout 구조 (공개 → 인증 → 앱)
- ✅ Better-auth 통합 (이메일/비밀번호, OAuth, 2FA/TOTP)
- ✅ Resend 기반 실제 이메일 전송 (회원가입, 비밀번호 재설정)
- ✅ React Router 7 네이티브 Form + Zod 검증
- ✅ Drizzle ORM Code-first 접근 방식
- ✅ Docker 기반 로컬 개발 환경 (Supabase CLI)
- ✅ 재사용 가능한 Form 컴포넌트 (FormField, SubmitButton)
- ✅ GitHub Actions CI/CD 파이프라인
- ✅ 타입스크립트 엄격 모드
- ✅ Biome 린터/포맷터

## ⚡ 빠른 시작

```bash
# 1. 의존성 설치
bun install

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 필요한 값 입력

# 3. Supabase 로컬 환경 시작 (Docker 필요)
bunx supabase start

# 4. 데이터베이스 마이그레이션
bun run db:push

# 5. 개발 서버 실행
bun run dev
```

애플리케이션이 `http://localhost:5173`에서 실행됩니다! 🎉

---

## 📋 사전 요구사항

- **Bun** >= 1.0 (패키지 매니저)
- **Docker Desktop** (로컬 개발용)
- **Node.js** >= 20 (선택사항)
- **Cloudflare 계정** (배포용)

## 🛠️ 설치 및 설정

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 의존성 설치
bun install
```

### 2. 로컬 테스트 환경 (Supabase CLI + Docker)

이 프로젝트는 로컬 개발을 위해 **Docker 기반 Supabase**를 사용합니다.

#### 사전 요구사항
- **Docker Desktop** 설치 및 실행
- **Supabase CLI** (프로젝트에 포함됨)

#### 로컬 Supabase 시작

**1. Supabase 초기화** (최초 1회만)
```bash
bunx supabase init
```

**2. Docker로 로컬 Supabase 시작**
```bash
bunx supabase start
```

이 명령어는 다음 서비스를 Docker 컨테이너로 실행합니다:
- PostgreSQL (포트: 54322)
- Supabase Studio (포트: 54323)
- PostgREST API (포트: 54321)
- Inbucket (이메일 테스트, 포트: 54324)

**3. 연결 정보 확인**
```bash
bunx supabase status
```

출력 예시:
```
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
Inbucket URL: http://localhost:54324
```

#### Supabase Studio 사용

브라우저에서 `http://localhost:54323`을 열어 Supabase Studio에 접속:
- 테이블 확인 및 수정
- SQL 에디터
- 데이터 조회/편집

#### 이메일 테스트

로컬 환경에서는 실제 이메일이 전송되지 않고 Inbucket에 저장됩니다:
- URL: `http://localhost:54324`
- 회원가입/비밀번호 재설정 이메일 확인 가능

#### 로컬 Supabase 중지

```bash
bunx supabase stop
```

#### 로컬 Supabase 완전 삭제 (데이터 초기화)

```bash
bunx supabase stop --no-backup
```

### 3. 환경 변수 설정

```bash
# .env.example을 .env로 복사
cp .env.example .env
```

`.env` 파일을 열어 다음 값들을 설정하세요:

```bash
# 데이터베이스 설정
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
BASE_URL=http://localhost:5173

# Better-auth 설정 (필수!)
BETTER_AUTH_SECRET=m93eRhpinFSwxkJYbsdsTy330WzUpSIj

# Resend 이메일 서비스 (필수!)
# https://resend.com/api-keys에서 API 키 발급
RESEND_API_KEY=
# 로컬 테스트: claude-rr7@resend.dev 사용 가능
# 프로덕션: 도메인 인증 후 noreply@yourdomain.com 형식
RESEND_FROM_EMAIL=claude-rr7@resend.dev

# OAuth 프로바이더 (선택사항)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
```

**필수 설정:**
- `BETTER_AUTH_SECRET`: 암호화에 사용되는 비밀 키 (최소 32자)
  - 생성 방법: `openssl rand -base64 32`
  - 프로덕션에서는 반드시 다른 값으로 변경
- `RESEND_API_KEY`: Resend 이메일 서비스 API 키
  - 로컬 개발: 무료 플랜 사용 가능 (월 100통)
  - 프로덕션: 유료 플랜 필요
- `RESEND_FROM_EMAIL`: 발신자 이메일 주소

**OAuth 앱 설정 (선택사항):**
- GitHub: https://github.com/settings/developers
- Google: https://console.cloud.google.com/apis/credentials
- Kakao: https://developers.kakao.com/console/app

### 4. 데이터베이스 마이그레이션

```bash
# Drizzle로 데이터베이스 스키마 생성
bun run db:push

# 또는 마이그레이션 파일 생성 후 적용
bun run db:generate
bun run db:migrate

# Drizzle Studio로 데이터베이스 확인 (선택사항)
bun run db:studio
```

## 🚀 개발

### 개발 서버 실행

```bash
bun run dev
```

애플리케이션이 `http://localhost:5173`에서 실행됩니다.

### 타입 체크

```bash
bun run typecheck
```

### 린트

```bash
bunx @biomejs/biome check .

# 자동 수정
bunx @biomejs/biome check --write .
```

## 📦 빌드

프로덕션 빌드 생성:

```bash
bun run build
```

빌드 결과물:
```
build/
├── client/     # 정적 에셋
└── server/     # 서버 사이드 코드
```

## 🌐 배포

### Cloudflare Workers 배포

#### 1. Cloudflare 설정

먼저 Cloudflare 계정에 로그인합니다:

```bash
bunx wrangler login
```

#### 2. wrangler.toml 설정

`wrangler.toml` 파일을 열어 프로젝트에 맞게 수정하세요:

```toml
#:schema node_modules/wrangler/config-schema.json
name = "your-project-name"  # ⭐ 프로젝트 이름으로 변경 (예: my-app)
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

main = "./workers/app.ts"

[build]
command = "bun run build"

[env.production]
name = "your-project-name-production"  # ⭐ 프로덕션 Worker 이름 (예: my-app-production)

[env.staging]
name = "your-project-name-staging"  # ⭐ 스테이징 Worker 이름 (예: my-app-staging)
```

**중요 설정 항목:**
- `name`: 기본 Worker 이름 (영문, 숫자, 하이픈만 사용 가능)
- `env.production.name`: Production 환경 Worker 이름
- `env.staging.name`: Staging 환경 Worker 이름

**배포 후 URL:**
- Production: `https://your-project-name-production.workers.dev`
- Staging: `https://your-project-name-staging.workers.dev`

> 💡 **팁**: 커스텀 도메인을 사용하려면 Cloudflare Dashboard에서 Route 설정을 추가하세요.

#### 3. Secrets 설정

Cloudflare Workers에서 환경 변수를 안전하게 관리:

```bash
# Staging 환경
bunx wrangler secret put VITE_SUPABASE_URL --env staging
bunx wrangler secret put VITE_SUPABASE_ANON_KEY --env staging
bunx wrangler secret put DATABASE_URL --env staging
bunx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env staging
bunx wrangler secret put RESEND_API_KEY --env staging
bunx wrangler secret put RESEND_FROM_EMAIL --env staging

# Production 환경
bunx wrangler secret put VITE_SUPABASE_URL --env production
bunx wrangler secret put VITE_SUPABASE_ANON_KEY --env production
bunx wrangler secret put DATABASE_URL --env production
bunx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env production
bunx wrangler secret put RESEND_API_KEY --env production
bunx wrangler secret put RESEND_FROM_EMAIL --env production
```

#### 4. 배포 실행

```bash
# Staging 배포
bun run deploy:staging

# Production 배포
bun run deploy:production
```

배포가 완료되면 터미널에 배포된 URL이 표시됩니다:
```
✨  Success! Uploaded to Cloudflare Workers
 ⛅️ https://your-project-name-production.workers.dev
```

---

### GitHub Actions 자동 배포

프로젝트에 GitHub Actions CI/CD 파이프라인이 설정되어 있습니다.

#### 1. GitHub Secrets 설정

Repository → Settings → Secrets and variables → Actions에서 다음 Secret을 추가:

##### CLOUDFLARE_API_TOKEN
Cloudflare API 토큰을 생성합니다:

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → My Profile → API Tokens
2. "Create Token" 클릭
3. "Edit Cloudflare Workers" 템플릿 선택
4. **Account Resources**: Include → Your Account 선택
5. **Zone Resources**: All zones 선택
6. "Continue to summary" → "Create Token" 클릭
7. 생성된 토큰을 복사하여 GitHub Secret에 추가

##### CLOUDFLARE_ACCOUNT_ID
Cloudflare 계정 ID를 찾습니다:

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages
2. 우측 사이드바에서 "Account ID" 확인 및 복사
3. GitHub Secret에 추가

#### 2. .github/workflows/deploy.yml 설정

워크플로우 파일에서 배포 URL을 수정하세요:

```yaml
deploy-staging:
  environment:
    name: staging
    url: https://your-project-name-staging.workers.dev  # ⭐ 변경

deploy-production:
  environment:
    name: production
    url: https://your-project-name-production.workers.dev  # ⭐ 변경
```

**URL 형식:**
- `https://[wrangler.toml의 env.staging.name].workers.dev`
- `https://[wrangler.toml의 env.production.name].workers.dev`

#### 3. 자동 배포 트리거

설정이 완료되면 다음과 같이 자동 배포됩니다:

- ✅ `main` 브랜치에 push → **Production 배포**
- ✅ `staging` 브랜치에 push → **Staging 배포**
- ✅ Pull Request 생성 → 타입 체크 및 빌드 테스트

**첫 배포 시작하기:**
```bash
# Staging 브랜치 생성 및 푸시
git checkout -b staging
git push origin staging

# Production 배포 (main 브랜치에 푸시)
git checkout main
git push origin main
```

GitHub Actions 탭에서 배포 진행 상황을 확인할 수 있습니다.

---

### 📋 배포 체크리스트

실제 배포 전에 다음 사항을 확인하세요:

#### wrangler.toml
- [ ] `name` 변경 (your-project-name)
- [ ] `env.production.name` 변경 (your-project-name-production)
- [ ] `env.staging.name` 변경 (your-project-name-staging)

#### Cloudflare Secrets
- [ ] Staging 환경 Secrets 설정 완료
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
  - DATABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - RESEND_API_KEY
  - RESEND_FROM_EMAIL
- [ ] Production 환경 Secrets 설정 완료
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
  - DATABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - RESEND_API_KEY
  - RESEND_FROM_EMAIL

#### GitHub Secrets
- [ ] CLOUDFLARE_API_TOKEN 추가
- [ ] CLOUDFLARE_ACCOUNT_ID 추가

#### GitHub Workflow
- [ ] `.github/workflows/deploy.yml`의 URL 수정
  - staging URL
  - production URL

#### 배포 테스트
- [ ] `bun run build` 성공 확인
- [ ] `bun run typecheck` 에러 없음 확인
- [ ] Staging 배포 테스트
- [ ] Production 배포 전 최종 확인

---

## 📁 프로젝트 구조 가이드

### 🎯 핵심 원칙

1. **단순함**: 카테고리를 최소화하고 역할을 명확히
2. **직관성**: 폴더명만 봐도 무엇이 들어가야 할지 알 수 있어야 함
3. **확장성**: 새로운 기능 추가 시 어디에 넣을지 고민 없어야 함

---

### 📂 전체 구조

```
app/
├── components/          # 모든 React 컴포넌트 (UI만)
│   ├── ui/             # shadcn/ui 기본 컴포넌트
│   ├── forms/          # FormField, SubmitButton 등
│   ├── app-sidebar.tsx
│   ├── navigation-bar.tsx
│   └── (기타 섹션 컴포넌트들)
│
├── features/           # 도메인별 비즈니스 로직
│   ├── auth/
│   │   ├── api/       # Better-auth API 라우트
│   │   ├── lib/       # 도메인 전용 헬퍼
│   │   ├── services/  # 비즈니스 로직 함수
│   │   ├── errors.ts  # 에러 처리
│   │   └── types.ts   # 타입 & Zod 스키마
│   └── user/
│       └── services/  # 사용자 관련 로직
│
├── lib/                 # 앱 전체 설정 & 유틸리티
│   ├── auth.server.ts   # Better-auth 서버
│   ├── auth.client.ts   # Better-auth 클라이언트
│   ├── email.server.ts  # Resend 이메일 서비스
│   ├── form-helpers.ts  # Form 검증 유틸
│   └── utils.ts         # 공통 유틸리티
│
├── db/                 # 데이터베이스 계층
│   ├── schema.ts      # Drizzle 스키마
│   ├── relations.ts   # 테이블 관계
│   └── index.ts       # DB 클라이언트
│
├── hooks/             # 전역 공유 커스텀 훅
│   └── use-mobile.ts
│
├── middleware/        # 요청 처리 미들웨어
│   ├── auth.middleware.ts
│   └── guest.middleware.ts
│
├── routes/            # React Router 페이지
│   ├── auth/
│   ├── dashboard/
│   └── index.tsx
│
├── root.tsx           # 루트 레이아웃
├── routes.ts          # 라우트 설정
└── entry.server.tsx   # 서버 진입점
```

---

### 📋 폴더별 역할

#### 1. `components/` - React 컴포넌트 (UI 재사용 가능)

**역할**: 모든 재사용 가능한 UI 컴포넌트. props만 받아서 화면에 표시하는 역할

**하위 폴더**:
- `ui/`: shadcn/ui 기본 컴포넌트 (Button, Input, Card 등)
- `forms/`: 폼 관련 컴포넌트 (FormField, SubmitButton)
- 기타: 레이아웃 컴포넌트 (AppSidebar, NavigationBar), 섹션 컴포넌트

**규칙**:
- ✅ 순수 UI 렌더링만 담당
- ✅ props를 받아서 화면에 표시
- ❌ 비즈니스 로직 금지 (로직은 `features/`에서 담당)
- ❌ API 호출, 데이터 처리 금지

**예시**:
```tsx
// ✅ 좋은 예: 순수 UI 컴포넌트
export default function LoginForm({ onSubmit, isLoading }: Props) {
  return (
    <FormField name="email" label="이메일" />
  );
}

// ❌ 나쁜 예: 로직이 포함되면 안됨
export default function LoginForm() {
  const [email, setEmail] = useState('');
  const handleSubmit = async () => {
    await fetch('/api/login'); // 로직은 features/auth에서!
  };
}
```

---

#### 2. `features/` - 도메인별 비즈니스 로직

**역할**: 특정 도메인의 모든 로직을 중앙 집중식으로 관리. UI는 `components/`에서 담당

**하위 구조**:
```
features/
└── {도메인}/
    ├── api/        # 도메인에서만 사용하는 API 라우트
    ├── lib/        # 도메인 전용 헬퍼 함수
    ├── hooks/      # 도메인 전용 커스텀 훅
    ├── services/   # DB 연결, 비즈니스 로직, 데이터 처리
    ├── types.ts    # 도메인 타입 & Zod 스키마
    └── errors.ts   # 도메인 전용 에러 처리
```

**각 폴더의 역할**:
- `api/`: 도메인의 API 라우트 (Better-auth 콜백 등)
- `lib/`: 도메인 전용 유틸리티 (비밀번호 검증, 에러 포맷팅 등)
- `hooks/`: 도메인 전용 React 훅 (이 도메인에서만 사용)
- `services/`: DB 쿼리, 비즈니스 로직 처리 (가장 핵심 로직)
- `types.ts`: 도메인의 타입 정의와 Zod 스키마

**규칙**:
- ✅ UI는 절대 `features/`에 위치하지 않음
- ✅ 도메인의 모든 로직을 통합 관리
- ✅ 다른 도메인의 기능과 독립적

**예시**:
```typescript
// features/auth/services/auth.service.ts
// DB 연결, 비즈니스 로직 처리
export const createUser = async (email: string, password: string) => {
  const hashedPassword = await hashPassword(password);
  return db.insert(users).values({ email, password: hashedPassword });
};

// features/auth/lib/password.ts
// 도메인 전용 헬퍼
export const validatePasswordStrength = (password: string) => {
  return password.length >= 8;
};

// features/auth/types.ts
// 도메인 타입 & 검증
export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

---

#### 3. `lib/` - 앱 전체 설정 & 유틸리티

**역할**: 여러 feature에서 공통으로 사용하는 설정 및 유틸리티

**파일 예시**:
- `auth.server.ts`: Better-auth 서버 인스턴스 생성
- `email.server.ts`: 이메일 전송 인프라
- `utils.ts`: 공통 유틸리티 함수 (예: `cn()`)

**규칙**:
- ✅ 앱 전체에서 사용되는 설정/인프라
- ✅ 2개 이상의 feature에서 사용하는 유틸리티
- ❌ 특정 도메인 전용 로직 금지 (→ `features/`로)

**차이점**:
```typescript
// ✅ lib/ - 앱 전체 설정
lib/auth.server.ts      // Better-auth 초기화 (모든 feature 사용)
lib/email.server.ts     // 이메일 전송 인프라 (여러 feature 사용)

// ✅ features/ - 도메인 비즈니스 로직
features/auth/services/ // 인증 관련 비즈니스 로직만
features/user/services/ // 사용자 관련 비즈니스 로직만
```

---

#### 4. `db/` - 데이터베이스 계층

**역할**: Drizzle ORM 스키마 및 DB 클라이언트 관리

**파일 구성**:
- `schema.ts`: 데이터베이스 테이블 스키마 정의
- `relations.ts`: 테이블 간 관계 정의
- `index.ts`: DB 클라이언트 생성 함수

**규칙**:
- ✅ Drizzle ORM 전용
- ✅ DB 스키마 정의만
- ❌ 비즈니스 로직 금지

---

#### 5. `hooks/` - 전역 공유 커스텀 훅

**역할**: 앱 전체에서 사용하는 범용 React 훅

**규칙**:
- ✅ 2개 이상의 feature에서 사용하는 훅
- ❌ 특정 도메인 전용 훅 금지 (→ `features/*/hooks/`로)

**차이점**:
```typescript
// ✅ hooks/ - 전역 공유 훅
hooks/use-mobile.ts      // 모든 페이지에서 사용 가능

// ✅ features/auth/hooks/ - auth 도메인 전용 훅
features/auth/hooks/use-login.ts  // 로그인 기능 전용
```

---

#### 6. `middleware/` - 요청 처리 미들웨어

**역할**: React Router 라우트 보호

**파일**:
- `auth.middleware.ts`: 인증 확인 미들웨어

**사용법**:
```typescript
// routes/dashboard/layout.tsx
export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const user = await requireAuth({ request, context });
  return { user };
};
```

---

#### 7. `routes/` - React Router 페이지

**역할**: 애플리케이션 페이지 정의

**구조**:
```
routes/
├── layouts/        # Layout 컴포넌트 (navgation, private, app)
├── auth/           # 인증 관련 페이지
├── dashboard/      # 대시보드 페이지
├── settings/       # 설정 페이지
└── index.tsx       # 홈 페이지
```

**규칙**:
- ✅ 페이지 컴포넌트만
- ✅ loader, action 함수 포함 가능
- ❌ 복잡한 비즈니스 로직 금지 (→ `features/`로)

---

### 🚀 새로운 기능 추가 가이드

#### 예시: "결제" 기능 추가

**1단계: 도메인 폴더 생성**
```bash
mkdir -p app/features/payment/{api,hooks,services}
```

**2단계: 타입 정의**
```typescript
// app/features/payment/types.ts
import { z } from "zod";

export const checkoutSchema = z.object({
  amount: z.number().positive(),
  currency: z.string(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
```

**3단계: 서비스 로직 작성**
```typescript
// app/features/payment/services/stripe.service.ts
export const createPaymentIntent = async (amount: number) => {
  // Stripe 결제 로직
};
```

**4단계: API 핸들러 작성**
```typescript
// app/features/payment/api/checkout.tsx
export const action = async ({ request }: Route.ActionArgs) => {
  // 결제 처리
};
```

**5단계: UI 컴포넌트 작성**
```tsx
// app/components/payment-card.tsx
export default function PaymentCard({ amount }: Props) {
  return <div>결제 카드 UI</div>;
}
```

**6단계: 페이지 작성**
```tsx
// app/routes/payment/checkout.tsx
import PaymentCard from "~/components/payment-card";

export default function CheckoutPage() {
  return <PaymentCard amount={1000} />;
}
```

---

### ✅ 체크리스트

새로운 코드를 작성할 때 다음을 확인하세요:

#### UI 컴포넌트를 만들 때
- [ ] 순수 UI 렌더링만 하는가? → `components/`에 배치
- [ ] 로직이나 데이터 처리가 포함되었는가? → 로직은 `features/`로, UI는 `components/`로 분리

#### 도메인 로직을 추가할 때
- [ ] 특정 도메인에서만 사용하는가? → `features/{도메인}/`에 배치
  - 도메인별 로직: `services/`, `hooks/`, `lib/`, `api/` 등 사용
- [ ] 여러 도메인에서 사용하는가? → 앱 전체 `lib/`에 배치

#### 함수를 만들 때
- [ ] 도메인 전용 비즈니스 로직인가? → `features/{도메인}/services/`
- [ ] 도메인 전용 헬퍼인가? → `features/{도메인}/lib/`
- [ ] 앱 전체에서 공통으로 사용하는 유틸인가? → `lib/`

#### 훅을 만들 때
- [ ] 도메인 전용인가? → `features/{도메인}/hooks/`
- [ ] 여러 도메인에서 사용하는가? → `hooks/`

---

### 🎓 참고 원칙

이 구조는 다음 원칙을 따릅니다:
- **관심사의 분리 (Separation of Concerns)**: UI와 로직 분리
- **도메인 주도 설계 (DDD)**: 도메인별 독립적 모듈화
- **단일 책임 원칙 (SRP)**: 각 폴더는 하나의 역할만

## 🗄️ 데이터베이스 스키마 관리

### Code-First 접근 방식

Drizzle ORM을 사용하여 TypeScript로 스키마를 정의합니다:

```typescript
// app/db/schema.ts
export const profilesTable = pgTable("profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  // ...
});

export type Profile = typeof profilesTable.$inferSelect;
export type NewProfile = typeof profilesTable.$inferInsert;
```

### 마이그레이션 워크플로우

```bash
# 1. schema.ts 수정 후 마이그레이션 생성
bun run db:generate

# 2. 마이그레이션 적용
bun run db:migrate

# 3. 또는 개발 환경에서 직접 push
bun run db:push

# 4. Drizzle Studio로 DB 확인
bun run db:studio
```

## 🔐 인증 시스템

이 프로젝트는 **Better-auth**를 사용하여 인증을 처리합니다. Better-auth는 프레임워크 독립적인 TypeScript 인증 라이브러리로, Drizzle ORM과 완벽하게 통합됩니다.

### 지원하는 인증 방법

- ✅ 이메일/비밀번호 로그인
- ✅ 이메일 인증
- ✅ 비밀번호 재설정
- ✅ OAuth 소셜 로그인 (GitHub, Google - 설정 필요)
- ✅ 2FA/TOTP (Google Authenticator)

### 3단계 Layout 구조

프로젝트는 다음과 같이 중첩된 Layout을 사용합니다:

**1) navgation.layout.tsx (L1 - 공개 레이아웃)**
- `getOptionalAuth` 사용으로 로그인 선택적 처리
- `SidebarProvider` 전역 제공
- `NavigationBar`와 `FooterSection` 포함
- 모든 페이지의 기본 틀

**2) private.layout.tsx (L2 - 인증 레이어)**
- `requireAuth` 미들웨어로 인증 강제
- UI 없음 (인증 로직만)
- user context를 하위로 전달

**3) app.layout.tsx (L3 - 앱 사이드바)**
- `AppSidebar` 컴포넌트 렌더링
- Dashboard와 Settings 페이지가 이 레이아웃 사용

---

### React Router 7 Form + Zod 검증

기존 React Hook Form이 제거되고, React Router 7의 네이티브 Form을 사용합니다:

**Form 컴포넌트들** (`app/components/forms/`)
- `FormField`: Label, Input, 에러 메시지를 통합한 재사용 컴포넌트
- `SubmitButton`: `useNavigation`으로 자동 로딩 상태 관리

**서버 사이드 검증** (`app/lib/form-helpers.ts`)
```typescript
// Zod 스키마로 검증
const validation = validateFormData(loginSchema, formData);
if (!validation.success) {
  return { errors: validation.errors };
}
```

**Action 함수 사용 예시**
```typescript
export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  
  // Zod 검증
  const validation = validateFormData(loginSchema, formData);
  if (!validation.success) {
    return { errors: validation.errors };
  }
  
  // 서버 사이드 로그인
  await signInWithCredentials({
    request, context,
    email: validation.data.email,
    password: validation.data.password,
  });
  
  return redirect('/dashboard');
};
```

---

### Resend 이메일 서비스 통합

이메일 기반 회원가입 및 비밀번호 재설정을 Resend로 구현합니다:

**이메일 서비스** (`app/lib/email.server.ts`)
```typescript
// 이메일 인증 링크 전송
export const sendVerificationEmail = async (
  email: string,
  verificationUrl: string,
) => { ... };

// 비밀번호 재설정 링크 전송
export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string,
) => { ... };
```

**이메일 템플릿** (`app/components/`)
- `VerificationEmail`: 이메일 인증 템플릿
- `PasswordResetEmail`: 비밀번호 재설정 템플릿
- `EmailLayout`: 공통 레이아웃

**Better-auth 콜백 설정** (`app/lib/auth.server.ts`)
```typescript
emailVerification: {
  sendOnSignUp: true,
  sendVerificationEmail: async ({ user, url }) => {
    await sendVerificationEmail(user.email, url);
  },
},
emailAndPassword: {
  sendResetPassword: async ({ user, url }) => {
    await sendPasswordResetEmail(user.email, url);
  },
}
```

---

### Better-auth 구조

#### 1. 서버 설정 (`app/lib/auth.server.ts`)

모든 인증 로직이 이 파일에 집중되어 있습니다:

```typescript
// Better-auth 인스턴스 생성
export const createAuthInstance = (...)
export const createAuthFromContext = (context)

// 서버 사이드 헬퍼 함수 (action에서 사용)
export const signInWithCredentials = async (...)     // 이메일 로그인
export const signUpWithCredentials = async (...)     // 이메일 회원가입
export const signOut = async (...)                   // 로그아웃
export const requestPasswordReset = async (...)      // 비밀번호 재설정 요청
export const resetPasswordWithToken = async (...)    // 비밀번호 재설정 실행
```

**특징**:
- DrizzleAdapter를 통한 PostgreSQL 연결
- OAuth 프로바이더 설정 (GitHub, Google)
- 이메일 인증 및 비밀번호 재설정
- 모든 헬퍼 함수는 **서버 사이드 action에서만 사용**

#### 2. 클라이언트 설정 (`app/lib/auth.client.ts`)

브라우저에서 사용하는 인증 클라이언트:

```typescript
// OAuth 로그인 (현재 사용 중인 것들)
export const signInWithGitHub = async (...)
export const signInWithGoogle = async (...)

// 이메일 로그인/회원가입 (더 이상 사용하지 않음 - action으로 처리)
// @deprecated use action + signInWithCredentials instead
```

**참고**: 이메일 로그인/회원가입은 이제 **서버 사이드 action**으로 처리됩니다.

#### 3. API 라우트 (`app/routes/auth/api/$.tsx`)

Better-auth의 모든 엔드포인트를 처리하는 catch-all 라우트:

```typescript
// Better-auth가 자동으로 다음 엔드포인트들을 처리:
// POST /auth/api/sign-up
// POST /auth/api/sign-in
// POST /auth/api/sign-out
// GET /auth/api/session
// POST /auth/api/verify-email
// POST /auth/api/forget-password
// POST /auth/api/reset-password
// GET /auth/api/callback/github
// GET /auth/api/callback/google
```

#### 4. 인증 페이지 구조 (개선된 패턴)

모든 인증 페이지는 **동일한 패턴**을 따릅니다:

```typescript
// 1. auth/layout.tsx에서 getOptionalAuth로 user 로드
export const loader = async (...) => {
  const user = await getOptionalAuth({ request, context });
  return { user };
};

// 2. 각 페이지에서 useOutletContext로 user 가져오기
const { user } = useOutletContext<{ user: User | null }>();

// 3. 로그인 여부에 따라 조건부 렌더링
if (user) {
  return <Card>이미 로그인됨</Card>;
}
return <Card>로그인 폼 + action</Card>;

// 4. 폼 제출은 action 함수로 처리
export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  // ... 검증
  await signInWithCredentials({ request, context, ... });
  return redirect('/dashboard');
};
```

**이점**:
- 모든 인증 로직이 서버에서 처리됨 (보안)
- 클라이언트가 우회할 수 없음
- 세션 쿠키는 httpOnly, secure로 자동 설정
- Progressive Enhancement 지원 (JS 비활성화 시에도 작동)

## 📚 주요 라이브러리

### UI & 스타일링
- **shadcn/ui** - 고품질 컴포넌트
- **Tailwind CSS v4** - 유틸리티 퍼스트 CSS
- **lucide-react** - 아이콘 라이브러리

### 폼 관리
- **React Router 7 Form** - 서버 사이드 Form 처리
- **Zod** - 스키마 검증

### 이메일
- **Resend** - 실제 이메일 전송 서비스
- **@react-email/components** - 이메일 템플릿 작성

### 데이터베이스 & 인증
- **Drizzle ORM** - TypeScript ORM
- **Supabase** - 인증 및 PostgreSQL

### 유틸리티
- **date-fns** - 날짜/시간 처리
- **ky** - HTTP 클라이언트
- **clsx** / **tailwind-merge** - 클래스 이름 관리

## 🧪 테스트 (향후 추가 예정)

```bash
# 단위 테스트
bun test

# E2E 테스트
bun test:e2e
```

## 🤝 기여

기여를 환영합니다! Pull Request를 제출하기 전에:

1. 코드 스타일 확인: `bunx @biomejs/biome check .`
2. 타입 체크: `bun run typecheck`
3. 빌드 테스트: `bun run build`

## 📄 라이선스

MIT License

## 🙏 크레딧

- [React Router](https://reactrouter.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Supabase](https://supabase.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [shadcn/ui](https://ui.shadcn.com/)

---

Built with ❤️ using Claude Code
