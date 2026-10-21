import React, { useState } from 'react';
import {
  ShieldCheck,
  Download,
  Trash2,
  Plus,
  FileSpreadsheet,
  Layers,
  Heart,
  Calendar,
  User,
  ExternalLink,
  Code2,
  Lock,
  FolderArchive,
} from 'lucide-react';
import { IdeaItem, VibeAppItem, AdminUser, SiteStats } from '../types';
import { retroSound } from '../utils/audio';

interface AdminDashboardViewProps {
  ideas: IdeaItem[];
  apps: VibeAppItem[];
  stats: SiteStats;
  adminUser: AdminUser | null;
  onLogin: (email: string, password?: string) => Promise<boolean>;
  onLogout: () => void;
  onDeleteIdea: (id: string) => Promise<void>;
  onOpenAppAddModal: () => void;
  onDeleteApp: (id: string) => Promise<void>;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  ideas,
  apps,
  stats,
  adminUser,
  onLogin,
  onLogout,
  onDeleteIdea,
  onOpenAppAddModal,
  onDeleteApp,
}) => {
  const [emailInput, setEmailInput] = useState('lbymeet06@gmail.com');
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const totalLikes = ideas.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  const handleDownloadCsv = () => {
    retroSound.playClick();
    window.location.href = '/api/admin/export-csv';
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMsg('');
    retroSound.playClick();
    const ok = await onLogin(emailInput.trim(), pinInput.trim());
    setIsLoggingIn(false);
    if (ok) {
      retroSound.playHeartSound();
    } else {
      setErrorMsg('지정된 운영자 계정(lbymeet06@gmail.com) 또는 관리자 암호로 로그인해주세요.');
    }
  };

  const handleDirectGoogle = async () => {
    setIsLoggingIn(true);
    setErrorMsg('');
    retroSound.playClick();
    const ok = await onLogin('lbymeet06@gmail.com');
    setIsLoggingIn(false);
    if (ok) {
      retroSound.playHeartSound();
    }
  };

  const handleDeleteIdeaConfirm = (id: string) => {
    if (window.confirm('정말 이 제안글을 삭제하시겠습니까?')) {
      retroSound.playClick();
      onDeleteIdea(id);
    }
  };

  const handleDeleteAppConfirm = (id: string) => {
    if (window.confirm('정말 이 바이브코딩 웹앱 카드를 삭제하시겠습니까?')) {
      retroSound.playClick();
      onDeleteApp(id);
    }
  };

  // If not logged in, show elegant login panel
  if (!adminUser) {
    return (
      <div className="max-w-md mx-auto py-8">
        <div className="bg-[#fffdfa] border-2 border-slate-300 rounded-xl p-6 shadow-sm">
          <div className="text-center mb-5">
            <div className="w-12 h-12 bg-slate-800 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2 shadow">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-800">교직원 게시판 운영자 전용관</h2>
            <p className="text-xs text-slate-500 mt-1">
              등록된 운영자 계정(lbymeet06@gmail.com)으로 로그인해주세요.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-2.5 bg-rose-50 border border-rose-300 rounded text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* 1-Click Fast Google Sign-in */}
          <button
            onClick={handleDirectGoogle}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white border-2 border-slate-300 hover:border-slate-400 rounded-lg text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition-all active:scale-98 mb-4"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>lbymeet06@gmail.com 계정으로 간편 인증</span>
          </button>

          <div className="flex items-center gap-2 text-slate-400 text-[10px] mb-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span>또는 이메일/암호 입력</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                관리자 이메일
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                관리자 암호 / PIN <span className="font-normal text-slate-400">(선택)</span>
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="지정 이메일인 경우 비워두셔도 됩니다"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded shadow-xs active:scale-95 transition-all mt-2"
            >
              {isLoggingIn ? '인증 진행 중...' : '운영자 로그인'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard when authenticated
  return (
    <div className="space-y-6">
      {/* Top Banner with admin info and logout */}
      <div className="bg-slate-900 text-white rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">교직원 아이디어 게시판 운영자 대시보드</h2>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                인증됨
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              접속 계정: <span className="text-slate-200 font-mono font-medium">{adminUser.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* GitHub ZIP Download Button */}
          <button
            onClick={() => {
              retroSound.playClick();
              window.location.href = '/api/download-zip';
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded shadow-xs active:scale-95 transition-all border border-slate-700"
            title="GitHub 업로드용 전체 소스코드 ZIP 다운로드"
          >
            <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
            <span>GitHub ZIP 다운로드</span>
          </button>

          {/* CSV Export Button */}
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-xs active:scale-95 transition-all"
            title="엑셀 호환 CSV 파일 다운로드"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV 내보내기</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              retroSound.playClick();
              onLogout();
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded border border-slate-700 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">수집된 아이디어</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{ideas.length}건</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">누적 공감 투표</span>
          <p className="text-xl font-bold text-rose-600 mt-1">{totalLikes}회</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">구현된 웹앱</span>
          <p className="text-xl font-bold text-orange-600 mt-1">{apps.length}개</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">오늘 / 총 방문자</span>
          <p className="text-xl font-bold text-sky-600 mt-1">
            {stats.today} / {stats.total}
          </p>
        </div>
      </div>

      {/* Section 1: Manage Ideas with Delete Action */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              전체 제안 목록 관리 ({ideas.length}건)
            </h3>
          </div>
          <button
            onClick={handleDownloadCsv}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV 다운로드</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2 px-3 font-semibold">카테고리</th>
                <th className="py-2 px-3 font-semibold">제목 & 내용</th>
                <th className="py-2 px-3 font-semibold">작성자</th>
                <th className="py-2 px-3 font-semibold">공감수</th>
                <th className="py-2 px-3 font-semibold">등록일</th>
                <th className="py-2 px-3 font-semibold text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ideas.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 text-orange-600 font-bold whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="py-2.5 px-3 max-w-xs">
                    <p className="font-bold text-slate-900 truncate" title={item.title}>
                      {item.title}
                    </p>
                    {item.content && (
                      <p className="text-[11px] text-slate-500 truncate" title={item.content}>
                        {item.content}
                      </p>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{item.nickname}</td>
                  <td className="py-2.5 px-3 text-rose-600 font-bold whitespace-nowrap">
                    ♥ {item.likes}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteIdeaConfirm(item.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      title="제안 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Manage Vibe Coding Apps */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-orange-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              바이브코딩 구현 웹앱 관리 ({apps.length}개)
            </h3>
          </div>
          <button
            onClick={() => {
              retroSound.playClick();
              onOpenAppAddModal();
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 웹앱 등록</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apps.map((item) => (
            <div
              key={item.id}
              className="p-3 border border-slate-200 rounded-lg flex items-start justify-between gap-3 bg-slate-50/50"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                  <span className="font-bold text-orange-600">{item.category}</span>
                  <span>·</span>
                  <span className="text-slate-700">{item.badge}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{item.description}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-sky-600 hover:underline mt-2"
                >
                  <span>{item.url}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <button
                onClick={() => handleDeleteAppConfirm(item.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded shrink-0"
                title="웹앱 삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
