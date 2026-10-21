export type IdeaCategory =
  | 'AI활용'
  | '수업자료제작'
  | '이미지생성'
  | '영상제작'
  | '업무자동화'
  | '글쓰기'
  | '기타';

export const IDEA_CATEGORIES: IdeaCategory[] = [
  'AI활용',
  '수업자료제작',
  '이미지생성',
  '영상제작',
  '업무자동화',
  '글쓰기',
  '기타',
];

export interface IdeaItem {
  id: string;
  nickname: string;
  category: IdeaCategory;
  title: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface VibeAppItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: IdeaCategory | '바이브코딩';
  badge: string;
  createdAt: string;
  author?: string;
}

export interface SiteStats {
  today: number;
  total: number;
  lastDate: string;
}

export interface AdminUser {
  email: string;
  role: 'admin';
  token: string;
}
