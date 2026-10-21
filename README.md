# 교직원 싸이월드 아이디어 미니홈피 (School Staff Vibe Coding Idea Minihompy)

2000년대 싸이월드 미니홈피 감성으로 교직원들이 AI 및 바이브 코딩 아이디어를 제안·공감 투표하고, 실제 구현된 웹앱을 공유하며 관리하는 풀스택 웹 플랫폼입니다.

---

## 📸 주요 기능 (Key Features)

1. **싸이월드 레트로 미니홈피 UI/UX**
   - 2000년대 감성의 이중 도트 프레임 및 우측 세로 탭
   - **TODAY / TOTAL** 실시간 방문자 카운터 위젯
   - **교직원 미니룸 (Miniroom)**: 칠판, CRT 모니터, 클릭 시 응원 말풍선과 하트가 나오는 도트 교사 아바타
   - **BGM 플레이어**: Web Audio API 기반 레트로 칩튠 BGM 및 효과음 재생, 실시간 이퀄라이저 애니메이션
   - **파도타기 & 도토리 선물**: 재미있는 레트로 상호작용

2. **메뉴 1: [홈 / 제안하기]**
   - 교직원 환영 메시지 및 아이디어 제안 인트로
   - 닉네임, 카테고리 7종 (`AI활용`, `수업자료제작`, `이미지생성`, `영상제작`, `업무자동화`, `글쓰기`, `기타`), 한 줄 제목, 부연 설명(최대 300자)
   - 실시간 공감 랭킹 TOP 3 명예의 전당 (금/은/동 메달)
   - 최신 제안 피드 및 1클릭 [♥ 공감] 투표 (중복 투표 방지)

3. **메뉴 2: [모아보기 & 검색]**
   - 최신순 / 공감 많은 순 즉각 정렬
   - 카테고리 다면 필터 탭 + 키워드(제목, 본문, 작성자) 실시간 검색
   - 번호별 페이지네이션 (`◀ 1 2 3 ▶`)

4. **메뉴 3: [바이브코딩 구현관]**
   - 교직원 아이디어가 실제 바이브 코딩으로 개발 완료된 웹앱 쇼케이스 카드
   - 외부 웹앱 바로가기 링크 (`target="_blank"`)
   - 운영자 전용: 웹앱 추가, 수정, 삭제 모달

5. **관리자(운영자) 전용 기능**
   - 푸터 하단 은은한 [운영자 로그인] 링크
   - 지정된 구글 계정(`lbymeet06@gmail.com`) 1클릭 간편 로그인
   - 부적절한 제안글 즉시 삭제 기능
   - 전체 수집된 아이디어 데이터 엑셀 호환 CSV (UTF-8 BOM) 다운로드

---

## 🛠 기술 스택 (Tech Stack)

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS (v4), Lucide React, Motion
- **Backend**: Express (Node.js / tsx)
- **Database**: File-based Persistent JSON Database (`data/database.json`)
- **Sound**: Web Audio API Synthesizer

---

## 🚀 로컬 실행 방법 (Getting Started)

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.

### 3. 프로덕션 빌드
```bash
npm run build
npm start
```

---

## 📦 GitHub 저장소에 올리는 방법 (How to Push to GitHub)

1. [GitHub](https://github.com)에서 새로운 레포지토리(New Repository)를 생성합니다.
2. 다운로드받은 압축을 해제한 폴더에서 터미널을 열고 다음 명령어를 순서대로 실행합니다:

```bash
git init
git add .
git commit -m "feat: 교직원 싸이월드 아이디어 미니홈피 초기 릴리즈"
git branch -M main
git remote add origin https://github.com/사용자아이디/레포지토리이름.git
git push -u origin main
```

---

## 🌐 GitHub Pages 무료 웹사이트 배포 방법 (초간단!)

본 프로젝트에는 사전 빌드된 완성본 웹사이트(`docs/`)와 상대경로 설정(`base: './'`)이 모두 포함되어 있습니다.

### [가장 추천] 클릭 3번으로 즉시 배포하는 방법 (/docs 폴더)
1. GitHub 레포지토리 상단 메뉴에서 **`Settings`** 클릭
2. 좌측 메뉴에서 **`Pages`** 클릭
3. **Build and deployment** 항목에서:
   - **Source**: `Deploy from a branch` (기본값)
   - **Branch**: `main` 선택
   - **Folder**: `/ (root)` 대신 **`/docs`** 를 선택하고 **`Save`** 클릭!
4. 10초 뒤 페이지 상단에 나타나는 `https://<사용자아이디>.github.io/<저장소이름>/` 주소로 접속하면 싸이월드 미니홈피가 바로 열립니다!

---

### [대체 방법] GitHub Actions로 자동 배포하는 방법
1. GitHub 저장소 `Settings` → `Pages` 로 이동
2. **Source**를 `GitHub Actions`로 변경 선택
3. 저장소에 포함된 `.github/workflows/deploy.yml` 파일이 자동으로 작동하여 배포됩니다.
