import { IdeaItem, VibeAppItem, SiteStats } from './types';

export const INITIAL_IDEAS: IdeaItem[] = [
  {
    id: 'idea-seed-1',
    nickname: '꿈꾸는교사',
    category: 'AI활용',
    title: '수업 보조 퀴즈 자동 생성기',
    content: '학생들 교과서 본문이나 단원 핵심 키워드를 넣으면 4지선다 퀴즈와 해설을 1초 만에 만들어주는 웹앱이 있으면 좋겠습니다! 형성평가 준비 시간이 획기적으로 줄어들 것 같아요.',
    likes: 29,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: 'idea-seed-2',
    nickname: '나이스해방',
    category: '업무자동화',
    title: 'NEIS(나이스) 공문 서식 및 기안문 초안 작성 도우미',
    content: '매번 결재 올릴 때 기안문 규격과 예시 서식 찾는 게 너무 번거롭습니다. 행사명, 일시, 예산만 적으면 교육청 표준 기안문 문구로 자동 변환해 주는 툴이 절실해요.',
    likes: 38,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'idea-seed-3',
    nickname: '열정담임',
    category: '글쓰기',
    title: '생기부 행동특성 관찰기록 어휘 추천기',
    content: '학생별 행동 특성과 장점을 몇 가지 키워드로 찍으면 학생부 기재 요령에 부합하는 정중하고 다채로운 문장 템플릿을 추천해 주는 앱을 제안합니다.',
    likes: 42,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'idea-seed-4',
    nickname: '스마트미술',
    category: '이미지생성',
    title: '학급 환경미화 및 수업용 캐릭터 일러스트 프롬프트 모음',
    content: '게시판 꾸미기나 학급 신문 만들 때 쓸 수 있는 친근한 한국형 교실 일러스트를 쉽게 생성할 수 있도록 프롬프트 생성기가 있으면 좋겠습니다.',
    likes: 19,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
  },
  {
    id: 'idea-seed-5',
    nickname: '방송부담당',
    category: '영상제작',
    title: '학예회 및 졸업식 영상 자막 & 하이라이트 자동 추출',
    content: '긴 학교 행사 영상에서 소리 나는 구간이나 음성 인식을 통해 자막을 자동 생성해 주고 하이라이트 숏폼을 추천해 주는 웹앱이 필요해요.',
    likes: 24,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'idea-seed-6',
    nickname: '과학부장',
    category: '수업자료제작',
    title: '실험 안전 수칙 및 절차 인터랙티브 체크리스트',
    content: '과학실 실험 수업 전에 학생들이 태블릿으로 안전 규칙을 확인하고 디지털 서명을 제출하는 간편 체크리스트 웹앱을 제안합니다.',
    likes: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
];

export const INITIAL_APPS: VibeAppItem[] = [
  {
    id: 'app-seed-1',
    title: '생기부 관찰기록 문장 도우미',
    description: '학생의 활동 키워드를 입력하면 학생부 기재 규정에 맞춘 다채로운 행동발달 서술형 문장을 추천합니다.',
    url: 'https://ais-dev-3nz67njhc6656htpr6v4gy-460177613361.asia-northeast1.run.app',
    category: '글쓰기',
    badge: 'v1.2 운영중',
    createdAt: '2026-10-15T09:00:00.000Z',
    author: '바이브코딩팀',
  },
  {
    id: 'app-seed-2',
    title: '수업 맞춤형 4지선다 퀴즈봇',
    description: '단원 텍스트를 붙여넣으면 즉시 인쇄 가능한 시험지 및 인터랙티브 웹 퀴즈를 생성합니다.',
    url: 'https://ais-dev-3nz67njhc6656htpr6v4gy-460177613361.asia-northeast1.run.app',
    category: 'AI활용',
    badge: '체험가능',
    createdAt: '2026-10-18T14:30:00.000Z',
    author: '교육혁신부',
  },
  {
    id: 'app-seed-3',
    title: '가정통신문 공문 서식 초안 생성기',
    description: '체험학습, 학부모 상담, 방과후 신청 등 주요 가정통신문 양식을 표준 서식으로 1분 만에 완성합니다.',
    url: 'https://ais-dev-3nz67njhc6656htpr6v4gy-460177613361.asia-northeast1.run.app',
    category: '업무자동화',
    badge: '신규등록',
    createdAt: '2026-10-20T10:00:00.000Z',
    author: '교무행정팀',
  },
];

export const INITIAL_STATS: SiteStats = {
  today: 52,
  total: 2189,
  lastDate: new Date().toISOString().slice(0, 10),
};
