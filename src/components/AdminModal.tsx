import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  Database,
  FileSpreadsheet,
  FolderArchive,
} from 'lucide-react';
import { AdminUser, IdeaItem } from '../types';
import { retroSound } from '../utils/audio';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminUser: AdminUser | null;
  onLogin: (email: string, password?: string) => Promise<boolean>;
  onLogout: () => void;
  ideasCount: number;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  adminUser,
  onLogin,
  onLogout,
  ideasCount,
}) => {
  const [emailInput, setEmailInput] = useState('lbymeet06@gmail.com');
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    retroSound.playClick();

    const ok = await onLogin(emailInput.trim(), pinInput.trim());
    setIsSubmitting(false);

    if (ok) {
      retroSound.playHeartSound();
    } else {
      setErrorMessage(
        '지정된 운영자 이메일(lbymeet06@gmail.com) 또는 올바른 관리자 PIN을 입력해주세요.'
      );
    }
  };

  const handleDirectGoogleLogin = async () => {
    retroSound.playClick();
    setIsSubmitting(true);
    setErrorMessage('');
    const ok = await onLogin('lbymeet06@gmail.com');
    setIsSubmitting(false);
    if (ok) {
      retroSound.playHeartSound();
    }
  };

  const handleDownloadCsv = () => {
    retroSound.playClick();
    window.location.href = '/api/admin/export-csv';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-slate-400 rounded-lg w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">교직원 게시판 운영자 모드</h3>
              <p className="text-[10px] text-slate-500">지정된 관리자 계정 전용</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {adminUser ? (
          /* Logged In State */
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900">운영자 인증이 완료되었습니다.</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  계정: <span className="font-mono font-bold">{adminUser.email}</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  모든 화면에서 게시글 삭제 및 바이브코딩 웹앱 추가/수정/삭제 권한이 활성화되었습니다.
                </p>
              </div>
            </div>

            {/* Admin Action: CSV Download */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>의견 목록 CSV 데이터 다운로드</span>
                </div>
                <span className="text-[10px] text-slate-500">총 {ideasCount}건</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                교직원들의 제안 일자, 카테고리, 제목, 내용, 작성자, 공감 수가 포함된 엑셀 호환 UTF-8 BOM CSV 파일을
                내려받습니다.
              </p>
              <button
                onClick={handleDownloadCsv}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-xs active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV 파일 즉시 다운로드 (.csv)</span>
              </button>
            </div>

            {/* Admin Action: GitHub Source ZIP Download */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <FolderArchive className="w-4 h-4 text-orange-600" />
                  <span>GitHub 업로드용 소스코드 (.ZIP)</span>
                </div>
                <span className="text-[10px] text-slate-500">전체 소스</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                현재 프로젝트의 모든 소스코드와 설정을 ZIP으로 내려받아 GitHub 저장소로 바로 푸시할 수 있습니다.
              </p>
              <button
                onClick={() => {
                  retroSound.playClick();
                  window.location.href = '/api/download-zip';
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded shadow-xs active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>GitHub용 소스코드 ZIP 다운로드 (.zip)</span>
              </button>
            </div>

            {/* Logout button */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  retroSound.playClick();
                  onLogout();
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded border border-rose-200 transition-colors"
              >
                운영자 로그아웃
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="space-y-4">
            <div className="bg-amber-50/70 border border-amber-200 rounded p-2.5 text-xs text-amber-900 leading-relaxed">
              운영자 권한은 등록된 구글 계정(<strong>lbymeet06@gmail.com</strong>)에게 부여됩니다.
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick 1-Click Google Account Sign-In */}
            <button
              type="button"
              onClick={handleDirectGoogleLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-300 hover:border-slate-400 rounded-lg text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition-all active:scale-98"
            >
              {/* Google 4-Color Logo SVG */}
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
              <span>lbymeet06@gmail.com 계정으로 빠른 운영자 인증</span>
            </button>

            <div className="flex items-center gap-2 text-slate-400 text-[10px]">
              <div className="flex-1 h-px bg-slate-200" />
              <span>또는 직접 이메일/PIN 입력</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  운영자 이메일 주소
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="lbymeet06@gmail.com"
                    required
                    className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-orange-500 font-mono text-slate-900"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  관리자 PIN / 패스워드 <span className="font-normal text-slate-400">(선택)</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="지정된 관리자 이메일이면 비워두셔도 됩니다"
                    className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-orange-500 font-mono"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded border border-slate-300"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded shadow-xs active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? '확인 중...' : '운영자 로그인'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
