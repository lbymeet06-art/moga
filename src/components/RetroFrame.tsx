import React, { useState } from 'react';
import {
  Home,
  Grid,
  Code2,
  Shield,
  Compass,
  Heart,
  Gift,
  Users,
  Smile,
  LogOut,
  Sparkles,
  FolderArchive,
  Download,
} from 'lucide-react';
import { SiteStats, AdminUser } from '../types';
import { CyworldMiniroom } from './CyworldMiniroom';
import { BgmPlayer } from './BgmPlayer';
import { retroSound } from '../utils/audio';

export type NavTab = 'home' | 'browse' | 'showcase' | 'admin';

interface RetroFrameProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  stats: SiteStats;
  adminUser: AdminUser | null;
  onOpenAdminModal: () => void;
  onLogoutAdmin: () => void;
  children: React.ReactNode;
  onWaveSurf: () => void;
  onOpenGitHubModal: () => void;
}

export const RetroFrame: React.FC<RetroFrameProps> = ({
  currentTab,
  onTabChange,
  stats,
  adminUser,
  onOpenAdminModal,
  onLogoutAdmin,
  children,
  onWaveSurf,
  onOpenGitHubModal,
}) => {
  const [acornNotice, setAcornNotice] = useState<string | null>(null);

  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: '홈', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'browse', label: '모아보기', icon: <Grid className="w-3.5 h-3.5" /> },
    { id: 'showcase', label: '바이브구현관', icon: <Code2 className="w-3.5 h-3.5" /> },
    {
      id: 'admin',
      label: adminUser ? '운영자모드' : '관리자',
      icon: <Shield className="w-3.5 h-3.5" />,
    },
  ];

  const handleTabClick = (tabId: NavTab) => {
    retroSound.playClick();
    onTabChange(tabId);
  };

  const handleDotori = () => {
    retroSound.playHeartSound();
    setAcornNotice('🐿️ 도토리 10개가 적립되었습니다! 선생님의 열정을 응원합니다.');
    setTimeout(() => setAcornNotice(null), 3500);
  };

  const handleFriendRequest = () => {
    retroSound.playHeartSound();
    setAcornNotice('🤝 모든 교직원과 이미 [영원한 일촌] 사이입니다!');
    setTimeout(() => setAcornNotice(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#bccad6] p-2 sm:p-5 flex flex-col justify-between selection:bg-orange-200 selection:text-orange-900 font-sans">
      {/* Acorn / Friend Pop Toast */}
      {acornNotice && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border-2 border-orange-300 animate-bounce">
          {acornNotice}
        </div>
      )}

      {/* Outermost Retro Window Container */}
      <div className="max-w-6xl w-full mx-auto bg-[#8ca3ba] p-2.5 rounded-2xl shadow-2xl border-4 border-[#768e9c]">
        {/* Middle Dotted Grey Frame */}
        <div className="bg-[#f0f4f8] rounded-xl p-3 sm:p-4 border-2 border-dashed border-[#a3b8cc] relative">
          {/* Header Row: Visitor Count & Minihompy Title & BGM Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-2.5 border-b border-[#c2d4e5]">
            {/* Left: Today / Total + URL */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                <span className="text-slate-600">TODAY</span>
                <span className="text-orange-600 font-extrabold">{stats.today}</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600">TOTAL</span>
                <span className="text-slate-800 font-bold">{stats.total}</span>
              </div>
              <span className="hidden sm:inline text-[11px] text-slate-400 font-mono">
                cyworld.school/vibe-ideas
              </span>
            </div>

            {/* Center: Minihompy Title & GitHub Download Button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-orange-700">★ 사이좋은 교직원 세상 ★</span>
                <span className="text-slate-600 hidden lg:inline">- AI & 바이브코딩 제안소</span>
              </div>
              <button
                onClick={() => {
                  retroSound.playClick();
                  onOpenGitHubModal();
                }}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-bold shadow-xs transition-transform active:scale-95 ml-1"
                title="GitHub 업로드용 전체 소스코드 다운로드"
              >
                <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
                <span>GitHub용 다운로드</span>
              </button>
            </div>

            {/* Right: BGM Player */}
            <div className="w-full md:w-auto">
              <BgmPlayer />
            </div>
          </div>

          {/* Main 2-Column Body + Right Tabs Navigation */}
          <div className="relative flex flex-col md:flex-row gap-3">
            {/* Left Column: Profile & Miniroom & Widgets (w-72 on desktop) */}
            <aside className="w-full md:w-64 lg:w-72 shrink-0 bg-white border-2 border-[#c2d4e5] rounded-lg p-3 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                {/* Minihompy Subtitle & Mood */}
                <div className="border-b border-slate-200 pb-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-bold text-slate-700">TODAY IS..</span>
                    <span className="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                      <Smile className="w-3 h-3" /> 열정 가득 ♬
                    </span>
                  </div>
                  <h1 className="text-xs font-bold text-slate-800 truncate" title="교직원 아이디어 나눔터">
                    교직원 AI & 바이브코딩 나눔터
                  </h1>
                </div>

                {/* 2000s Dot Miniroom Interactive Widget */}
                <CyworldMiniroom />

                {/* Profile Message */}
                <div className="bg-[#fafbfd] border border-slate-200 rounded p-2.5 text-xs text-slate-700 leading-relaxed space-y-1.5">
                  <div className="flex items-center gap-1 font-bold text-orange-700 text-[11px]">
                    <span>선생님들의 행복한 교직 생활</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    "작은 아이디어 하나가 전국의 교직원들의 퇴근 시간을 앞당깁니다. 주저하지 말고 자유롭게 제안해주세요!"
                  </p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between">
                    <span>소속: 교무연구실</span>
                    <span>방문: 환영합니다</span>
                  </div>
                </div>

                {/* Fun Cyworld Action Buttons */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={handleDotori}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded border border-amber-300 active:scale-95 transition-all shadow-xs"
                    title="도토리 충전 패러디"
                  >
                    <Gift className="w-3 h-3 text-amber-600" />
                    <span>도토리 선물</span>
                  </button>

                  <button
                    onClick={handleFriendRequest}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold rounded border border-sky-300 active:scale-95 transition-all shadow-xs"
                    title="일촌 신청 패러디"
                  >
                    <Users className="w-3 h-3 text-sky-600" />
                    <span>일촌 맺기</span>
                  </button>
                </div>

                {/* Surfing Button */}
                <button
                  onClick={() => {
                    retroSound.playClick();
                    onWaveSurf();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white text-xs font-bold rounded border border-sky-600 active:scale-95 transition-all shadow-xs"
                >
                  <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>파도타기 (랜덤 추천 아이디어) 🏄</span>
                </button>
              </div>

              {/* Admin Badge if logged in */}
              {adminUser && (
                <div className="p-2 bg-slate-900 text-white rounded text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                    <Shield className="w-3.5 h-3.5" /> 운영자 모드
                  </span>
                  <button
                    onClick={onLogoutAdmin}
                    className="text-[10px] text-slate-300 hover:text-white underline flex items-center gap-0.5"
                  >
                    <LogOut className="w-3 h-3" /> 로그아웃
                  </button>
                </div>
              )}
            </aside>

            {/* Right Column: Dynamic Main Canvas */}
            <main className="flex-1 bg-white border-2 border-[#c2d4e5] rounded-lg p-4 sm:p-5 shadow-xs min-h-[560px]">
              {children}
            </main>

            {/* Cyworld Right Vertical Index Tabs (Floating on the right edge on desktop) */}
            <div className="flex md:flex-col gap-1 md:w-16 shrink-0 order-first md:order-last overflow-x-auto md:overflow-visible pb-1 md:pb-0">
              {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex md:flex-col items-center justify-center gap-1 px-3 py-2 md:py-3 text-xs font-bold rounded-t-md md:rounded-t-none md:rounded-r-md border transition-all whitespace-nowrap shadow-xs ${
                      isActive
                        ? 'bg-orange-500 text-white border-orange-600 md:-translate-x-1 z-10'
                        : 'bg-white text-slate-700 border-[#c2d4e5] hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    {tab.icon}
                    <span className="text-[11px]">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Area: Copyright & Discreet Admin Login Link */}
          <footer className="mt-4 pt-3 border-t border-[#c2d4e5] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">★ 교직원 바이브 코딩 & AI 연구회 ★</span>
              <span>·</span>
              <span className="text-[11px]">학교 교육 현장과 함께합니다</span>
            </div>

            <div className="flex items-center gap-4">
              {/* GitHub Source Code Download Button */}
              <button
                onClick={() => {
                  retroSound.playClick();
                  onOpenGitHubModal();
                }}
                className="text-[11px] text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold hover:underline transition-colors bg-white/70 px-2 py-0.5 rounded border border-slate-300"
                title="GitHub 업로드용 소스코드 ZIP 다운로드"
              >
                <FolderArchive className="w-3.5 h-3.5 text-orange-600" />
                <span>GitHub용 소스코드 다운로드 (.ZIP)</span>
              </button>

              {/* Subtle Admin Login Link placed at bottom footer as requested */}
              <button
                onClick={() => {
                  retroSound.playClick();
                  onOpenAdminModal();
                }}
                className="text-[11px] text-slate-400 hover:text-slate-700 hover:underline flex items-center gap-1 transition-colors"
                title="운영자 관리 모달 열기"
              >
                <Shield className="w-3 h-3 text-slate-400" />
                <span>{adminUser ? '운영자 설정 (접속중)' : '운영자 로그인'}</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
