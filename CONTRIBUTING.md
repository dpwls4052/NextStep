# KT 3팀 프로젝트 가이드

## 📋 목차
1. [커밋 메시지 규칙](#커밋-메시지-규칙)
2. [브랜치 전략](#브랜치-전략)
3. [배포 방법](#배포-방법)
4. [Git 작업 흐름](#git-작업-흐름)

---

## 커밋 메시지 규칙

커밋 메시지는 다음 형식을 따릅니다.

```
[타입]_MM/DD - 변경 내용
```

### 규칙
1. **타입 `[타입]`**  
   - 커밋 목적을 명시  

2. **날짜 `_MM/DD`**  
   - 커밋한 날짜 표기  

3. **변경 내용 `- 메시지`**  
   - **명사형**으로 끝내기  
   - 변경 내용을 구체적으로 작성  

4. **작업 단위 커밋**  
   - 한 커밋에는 한 가지 작업/기능만 포함  
   - 작업한 기능이 여러 개라면 **커밋도 나눠서**, **작업한 파일도 기능별로 나눠서 올리기**  
   - 이렇게 하면 히스토리 관리와 코드 리뷰가 쉬워짐  

5. **파일 단위 커밋**
   - 커밋 메시지에 연관된 파일만 선택해서 올리기
   - 전체 파일을 한번에 올리지 말고, 작업한 기능과 관련된 파일만 추가

---

### 타입별 설명

| 타입     | 의미                                     | 예시 커밋 메시지                     |
|----------|----------------------------------------|-----------------------------------|
| feat     | 새로운 기능 추가                        | `[feat]_10/22 - 알람 기능 추가`    |
| fix      | 버그 수정                                | `[fix]_10/23 - 로그인 오류 수정`   |
| docs     | 문서 수정                                | `[docs]_10/24 - README 설치 방법 업데이트` |
| style    | 코드 포맷팅, 세미콜론 누락 등 기능 변화 없음 | `[style]_10/25 - 버튼 마진 통일`  |
| refactor | 코드 구조 개선, 기능 변화 없음            | `[refactor]_10/26 - 사용자 데이터 처리 구조 개선` |
| perf     | 성능 개선                                | `[perf]_10/27 - 이미지 로딩 속도 개선` |
| test     | 테스트 코드 추가/수정                     | `[test]_10/28 - 로그인 유닛 테스트 추가` |
| chore    | 빌드, 패키지, 잡일 등                     | `[chore]_10/29 - 패키지 버전 업데이트` |

---

### 예시: 작업 단위 커밋

로그인 기능 개발 중 UI, API, 테스트 각각 별도로 커밋
```
[feat]_10/22 - 로그인 UI 추가
[feat]_10/22 - 로그인 API 연결
[test]_10/22 - 로그인 유닛 테스트 작성
```

이렇게 커밋을 나누면 코드 리뷰, 히스토리 확인, 롤백이 훨씬 용이

---

### 예시: 파일 단위로 나눠서 커밋하기

**잘못된 예시 ❌**
```bash
# 모든 파일을 한번에 커밋
git add .
git commit -m "[feat]_10/31 - 여러 기능 추가"
```

**올바른 예시 ✅**
```bash
# 로그인 관련 파일만 커밋
git add src/components/Login.jsx src/pages/LoginPage.jsx
git commit -m "[feat]_10/31 - 로그인 UI 추가"

# 상품 목록 관련 파일만 커밋
git add src/components/ProductList.jsx src/api/productApi.js
git commit -m "[feat]_10/31 - 상품 목록 조회 기능 추가"

# 스타일 변경 관련 파일만 커밋
git add src/styles/button.css
git commit -m "[style]_10/31 - 버튼 스타일 통일"
```

---

> 🔹 포인트  
> - 메시지는 항상 **명사형**으로 끝내기  
> - **작업 단위별 커밋**으로 분리  
> - **연관된 파일만 선택**해서 커밋
> - 타입과 날짜는 **정해진 형식**으로 작성  
> - 일관성 있는 커밋 메시지로 히스토리 관리와 협업 효율 향상

---

## 브랜치 전략

### 브랜치 구조

| 브랜치명 | 용도 | 설명 |
|---------|------|------|
| `main` | **총 배포** | 실제 배포되는 안정적인 코드. 직접 작업 금지 |
| `dev` | **배포 테스트** | 개발 완료된 기능을 통합하고 테스트하는 브랜치 |
| `gh-pages` | **GitHub Pages** | 자동 생성되는 배포용 브랜치. 건드리지 않음 |
| `이름` | **개인 작업** | 각자 이름으로 개인 브랜치 생성 (예: `john`, `sarah`) |

---

### 브랜치 작업 흐름

```
개인 브랜치 → dev → main → gh-pages (자동 배포)
```

#### 1️⃣ 개인 브랜치에서 작업
```bash
# 자신의 이름으로 브랜치 생성
git checkout -b john

# 작업 후 커밋
git add src/components/Header.jsx
git commit -m "[feat]_10/31 - 헤더 컴포넌트 추가"

# 개인 브랜치를 GitHub에 푸시
git push origin john
```

#### 2️⃣ dev 브랜치로 병합 (테스트)
```bash
# dev 브랜치로 이동
git checkout dev

# 최신 코드 받기
git pull origin dev

# 개인 브랜치 내용을 dev에 병합
git merge john

# 충돌 해결 후 푸시
git push origin dev

# 테스트 후 문제 없으면 다음 단계로
```

#### 3️⃣ main 브랜치로 병합 (배포)
```bash
# main 브랜치로 이동
git checkout main

# 최신 코드 받기
git pull origin main

# dev 브랜치를 main에 병합
git merge dev

# main에 푸시
git push origin main
```

---

### 브랜치 규칙

✅ **해야 할 것**
- 항상 자신의 개인 브랜치에서 작업
- dev에 병합하기 전 로컬에서 테스트
- main 병합 전 팀원들에게 공유
- 충돌 발생 시 팀원과 상의 후 해결

❌ **하지 말아야 할 것**
- main 브랜치에서 직접 코드 작성
- gh-pages 브랜치 건드리기
- 다른 사람의 브랜치에 직접 푸시
- 테스트 없이 main에 병합

---

## 배포 방법

### 배포 순서

#### 1️⃣ 코드 준비
```bash
# dev 또는 main 브랜치로 이동
git checkout main

# 최신 코드 받기
git pull origin main

# 작업한 내용이 모두 커밋되었는지 확인
git status
```

#### 2️⃣ 로컬 빌드 테스트
```bash
# 빌드가 정상적으로 되는지 확인
npm run build

# 빌드 결과물 미리보기 (선택사항)
npm run preview
```

#### 3️⃣ 배포 실행
```bash
# GitHub Pages에 배포
npm run deploy
```

이 명령어가 자동으로:
1. `npm run build` 실행 (dist 폴더 생성)
2. dist 폴더를 gh-pages 브랜치에 푸시
3. GitHub Pages에 자동 배포

#### 4️⃣ 배포 확인
```bash
# 몇 분 후 배포 URL 접속
https://your-username.github.io/kt_3team_project_2025/
```

GitHub 저장소 → Settings → Pages에서 배포 상태 확인 가능

---

### 배포 전 체크리스트

- [ ] 모든 변경사항이 커밋되었는가?
- [ ] `npm run build`가 에러 없이 실행되는가?
- [ ] dev 브랜치에서 테스트를 완료했는가?
- [ ] 팀원들에게 배포 예정을 공유했는가?
- [ ] vite.config.js의 base 경로가 올바른가?

---

### 배포 문제 해결

**빌드 오류 발생 시**
```bash
# node_modules 재설치
rm -rf node_modules
npm install
npm run build
```

**배포 후 페이지가 안 보일 때**
- vite.config.js의 `base` 경로 확인
- GitHub Pages 설정에서 gh-pages 브랜치가 선택되었는지 확인
- 5-10분 정도 기다린 후 새로고침

**라우팅이 안 될 때**
- `BrowserRouter` 대신 `HashRouter` 사용 확인

---

## Git 작업 흐름

### 일반적인 작업 흐름

```bash
# 1. 개인 브랜치로 이동
git checkout john

# 2. 최신 dev 내용 가져오기
git checkout dev
git pull origin dev
git checkout john
git merge dev

# 3. 작업하기
# 파일 수정...

# 4. 관련 파일만 선택해서 커밋
git add src/components/ProductCard.jsx
git commit -m "[feat]_10/31 - 상품 카드 컴포넌트 추가"

git add src/styles/product.css
git commit -m "[style]_10/31 - 상품 카드 스타일 추가"

# 5. 개인 브랜치 푸시
git push origin john

# 6. dev로 병합 (팀원과 상의 후)
git checkout dev
git merge john
git push origin dev
```

---

### 유용한 Git 명령어

```bash
# 현재 브랜치 확인
git branch

# 변경된 파일 확인
git status

# 변경 내역 확인
git diff

# 특정 파일만 추가
git add src/components/Header.jsx src/pages/Home.jsx

# 커밋 히스토리 보기
git log --oneline

# 마지막 커밋 메시지 수정
git commit --amend

# 원격 브랜치 목록 보기
git branch -r

# 로컬 변경사항 임시 저장
git stash

# 임시 저장한 내용 다시 가져오기
git stash pop
```

---

## 협업 시 주의사항

1. **충돌 방지**
   - 작업 시작 전 항상 `git pull` 받기
   - 같은 파일을 동시에 수정하지 않기
   - 정기적으로 dev에 병합하기

2. **코드 리뷰**
   - dev에 병합하기 전 팀원에게 코드 공유
   - 중요한 변경사항은 미리 공지

3. **커밋 습관**
   - 자주 커밋하기 (하루 종료 시 반드시)
   - 의미 있는 단위로 커밋 분리
   - 커밋 메시지 규칙 준수

---

## 📞 문제 발생 시

- Git 충돌: 팀원과 상의 후 해결
- 배포 오류: 빌드 로그 확인 후 팀원과 공유
- 브랜치 꼬임: `git log`로 히스토리 확인

---

**Happy Coding! 🚀**