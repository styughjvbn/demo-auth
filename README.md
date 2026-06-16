# demo-auth

`demo-auth`는 k3s 데모 프로젝트들의 공통 임시 로그인을 제공하는 경량 인증 API입니다.

초기 목표는 Keycloak/OIDC가 아니라, 버튼 클릭만으로 임시 demo user를 발급하고 `.sjw-project.site` 전체에서 동일한 로그인 쿠키를 공유하는 것입니다.

## API

### `POST /api/demo-login`

임시 사용자를 생성하고 `DEMO_TOKEN` HttpOnly 쿠키를 발급합니다.

```json
{
  "user": {
    "id": "temp-user-xxxxxxxx",
    "nickname": "tempUser-xxxxxxxx",
    "role": "DEMO"
  }
}
```

### `GET /api/me`

현재 `DEMO_TOKEN` 쿠키를 검증하고 로그인 상태를 반환합니다.

```json
{
  "loggedIn": true,
  "user": {
    "id": "temp-user-xxxxxxxx",
    "nickname": "tempUser-xxxxxxxx",
    "role": "DEMO"
  }
}
```

비로그인 상태:

```json
{
  "loggedIn": false,
  "user": null
}
```

### `POST /api/logout`

`DEMO_TOKEN` 쿠키를 만료시킵니다.

## 환경 변수

| 이름 | 기본값 | 설명 |
| --- | --- | --- |
| `JWT_SECRET` | `change-me-in-kubernetes` | HS256 JWT 서명 secret |
| `JWT_ALGORITHM` | `HS256` | JWT 알고리즘 |
| `COOKIE_NAME` | `DEMO_TOKEN` | 인증 쿠키 이름 |
| `COOKIE_DOMAIN` | `.sjw-project.site` | 서브도메인 공유 쿠키 도메인 |
| `COOKIE_SECURE` | `true` | HTTPS 전용 쿠키 |
| `COOKIE_SAMESITE` | `lax` | SameSite 정책 |
| `TOKEN_TTL_SECONDS` | `86400` | 토큰 TTL |
| `ALLOWED_ORIGINS` | `https://auth.sjw-project.site,https://coco.sjw-project.site` | credentials CORS 허용 origin 목록 |

## 로컬 실행

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

## 테스트

```bash
pytest
```

## DemoHeader

React 또는 Next.js 프로젝트에 `frontend/react/DemoHeader.tsx`와
`frontend/react/DemoHeader.module.css`를 복사한 뒤 라우터 바깥에 배치합니다.

```tsx
import DemoHeader from "./components/DemoHeader";

export default function App() {
  return (
    <>
      <DemoHeader />
      {/* routes */}
    </>
  );
}
```

Next.js App Router에서도 같은 컴포넌트를 사용할 수 있습니다. 컴포넌트 상단에
`"use client"`가 포함되어 있습니다.

## Docker

```bash
docker build -t demo-auth:local .
docker run --rm -p 8000:8000 -e JWT_SECRET=dev-secret demo-auth:local
```

## k3s 적용

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.example.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```
