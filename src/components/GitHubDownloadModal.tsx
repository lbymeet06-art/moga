import React, { useState } from 'react';
import {
  Download,
  FolderArchive,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  X,
  Sparkles,
} from 'lucide-react';
import { retroSound } from '../utils/audio';

interface GitHubDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDownloadModal: React.FC<GitHubDownloadModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const gitCommands = `cd cyworld-school-vibe-coding-github
git init
git add .
git commit -m "feat: 교직원 싸이월드 아이디어 미니홈피 첫 배포"
git branch -M main
git remote add origin https://github.com/<내_깃허브_아이디>/<저장소_이름>.git
git push -u origin main`;

  const handleDownload = () => {
    retroSound.playClick();
    window.location.href = '/api/download-zip';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopied(true);
    retroSound.playHeartSound();
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-slate-400 rounded-xl w-full max-w-lg p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <FolderArchive className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                GitHub 업로드용 전체 소스코드 다운로드
              </h3>
              <p className="text-[11px] text-slate-500">
                node_modules 제외, 모든 소스코드와 설정 파일이 포함된 .ZIP 패키지
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Download Button */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg p-4 mb-5 text-center">
          <p className="text-xs text-slate-700 mb-3 leading-relaxed">
            아래 버튼을 누르면 프로젝트 전체 압축 파일(<strong>cyworld-school-vibe-coding-github.zip</strong>)이 즉시 다운로드됩니다.
          </p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-lg shadow-md active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>프로젝트 ZIP 파일 지금 다운로드 (.zip)</span>
          </button>
        </div>

        {/* Step-by-Step GitHub Push Guide */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-slate-600" />
              GitHub에 업로드하는 초간단 3단계 가이드
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">명령어 복사됨!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>명령어 전체 복사</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner border border-slate-800 select-all">
            <p className="text-slate-400"># 1. 압축 해제 후 해당 폴더로 이동</p>
            <p className="text-amber-300">cd cyworld-school-vibe-coding-github</p>
            <p className="text-slate-400 mt-1"># 2. Git 초기화 및 파일 추가</p>
            <p className="text-emerald-300">git init</p>
            <p className="text-emerald-300">git add .</p>
            <p className="text-emerald-300">git commit -m "feat: 교직원 싸이월드 아이디어 미니홈피 첫 배포"</p>
            <p className="text-slate-400 mt-1"># 3. GitHub 레포지토리 연결 및 푸시</p>
            <p className="text-sky-300">git branch -M main</p>
            <p className="text-sky-300">git remote add origin https://github.com/&lt;내_아이디&gt;/&lt;저장소_이름&gt;.git</p>
            <p className="text-sky-300">git push -u origin main</p>
          </div>

          <div className="text-[11px] text-slate-500 space-y-1.5 pt-1">
            <p>💡 <strong>GitHub Pages 초간단 배포</strong>: 저장소 <code>Settings</code> → <code>Pages</code>에서 Branch를 <code>main</code>, Folder를 <strong><code>/docs</code></strong>로 선택하고 Save를 누르시면 10초 만에 사이트가 열립니다!</p>
            <p>💡 <strong>로컬 구동</strong>: 압축 해제 후 터미널에서 <code>npm install</code> 실행 후 <code>npm run dev</code>를 입력하면 동일하게 실행됩니다.</p>
          </div>
        </div>

        {/* Footer Close */}
        <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-semibold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
