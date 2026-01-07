# NEXTSTEP

개발자의 학습 로드맵을 **시각화·관리·공유**하는 프로젝트입니다. 개인 워크스페이스에서 기술 로드맵을 구성하고, 다른 사용자와 공유하며 피드백을 주고받을 수 있습니다.

## 배포 주소

https://nextstep-kt-2025.vercel.app/

---

## 🔥 핵심 기능

- **개인 워크스페이스**
  - 사용자별 워크스페이스 생성
  - 기술(Tech) 기반 로드맵 구성 (트리 구조)
  - 완료 여부 관리

- **로드맵(Roadmap)**
  - 기술 단위 로드맵 관리
  - 부모/자식 구조 지원
  - 학습 진행 상태 체크

- **공유 & 커뮤니티**
  - 워크스페이스 공유 게시글
  - 좋아요 / 댓글 / 대댓글
  - 리스트(카테고리) 기반 분류

- **커스터마이징 요소**
  - 프로필 장식 아이템(테두리, 타이틀, 컬러 등)
  - 장식 구매(Order) 시스템

---

## 🛠 기술 스택

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS / Shadcn
- Feature-Sliced Design (FSD)
- React Query
- Zustand

### Backend / DB

- Supabase (PostgreSQL)
- Row Level Security (RLS)

### AI

- Gemini
- Claude

---

## 📂 프로젝트 구조 (요약)

```
app/
 ├─ (auth)/
 ├─ (workspace)/
 ├─ api/
 └─ layout.tsx

features/
widgets/
shared/
```

> FSD 아키텍처를 기반으로 **도메인 단위 분리**를 목표로 합니다.

---

## 🧱 데이터베이스 구조

### 주요 테이블

- **users**: 사용자 정보 및 프로필 장식
- **workspaces**: 개인 학습 공간
- **roadmaps**: 기술 학습 로드맵 (트리 구조)
- **techs**: 기술 스택 정보
- **posts**: 공유된 워크스페이스 게시글
- **comments**: 댓글 / 대댓글
- **decorations / orders**: 커스터마이징 아이템 및 구매 내역

---

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

`.env.local`에 Supabase 환경변수를 설정해야 합니다.

---

## 📌 프로젝트 목표

- 학습 과정을 **시각적으로 정리**할 수 있는 도구 제공
- 혼자만의 기록이 아닌 **공유와 피드백 중심의 성장**
- 프론트엔드 중심의 **실전 아키텍처 실험 프로젝트**

---

## 👥 팀 소개

| 이름              | 역할                     | 담당 기능         |
| ----------------- | ------------------------ | ----------------- |
| **김근영** (팀장) | 프론트엔드 / 백엔드 / DB | AI, 뉴스          |
| **강두연**        | 프론트엔드 / 백엔드 / DB | 메인 페이지       |
| **이주형**        | 프론트엔드 / 백엔드 / DB | 관리자 / 커뮤니티 |
| **배예진**        | 프론트엔드 / 백엔드 / DB | 회원 / 상점       |

---

## 👤 Author

김근영 (팀장)
Frontend Developer

강두연
Frontend Developer

배예진
Frontend Developer

이주형
Frontend Developer

---

## 📄 License

This project is licensed under the MIT License.
