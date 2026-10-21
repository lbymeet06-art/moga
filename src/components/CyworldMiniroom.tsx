import React, { useState } from 'react';
import { Sparkles, MessageCircle, Heart } from 'lucide-react';
import { retroSound } from '../utils/audio';

export const CyworldMiniroom: React.FC = () => {
  const [avatarSaying, setAvatarSaying] = useState('선생님들의 아이디어를 환영합니다! 💡');
  const [heartCount, setHeartCount] = useState(128);
  const [isJumping, setIsJumping] = useState(false);

  const bubbleQuotes = [
    '선생님들의 아이디어를 환영합니다! 💡',
    'AI로 칼퇴하는 그날까지! 🏃‍♂️',
    '바이브 코딩으로 뚝딱 만들어봐요 🚀',
    '오늘 급식 맛있는 거 나오나요? 🍱',
    '교재 연구실은 늘 열려있어요 ☕',
  ];

  const handleAvatarClick = () => {
    retroSound.playHeartSound();
    setIsJumping(true);
    setHeartCount((c) => c + 1);
    const nextSaying = bubbleQuotes[Math.floor(Math.random() * bubbleQuotes.length)];
    setAvatarSaying(nextSaying);
    setTimeout(() => setIsJumping(false), 500);
  };

  return (
    <div className="border border-sky-300 rounded bg-gradient-to-b from-sky-50 to-white p-2 shadow-inner">
      <div className="flex items-center justify-between text-[11px] text-sky-800 font-bold mb-1.5 pb-1 border-b border-sky-200">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          교직원 미니룸 (Miniroom)
        </span>
        <button
          onClick={handleAvatarClick}
          className="flex items-center gap-0.5 text-rose-500 hover:text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 transition-transform active:scale-95"
          title="미니미 클릭하여 응원하기"
        >
          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
          <span className="font-mono text-[10px]">{heartCount}</span>
        </button>
      </div>

      {/* Retro Miniroom Isometric Box */}
      <div
        onClick={handleAvatarClick}
        className="relative w-full h-44 bg-[#f2e6ce] rounded border-2 border-[#d9c49d] overflow-hidden cursor-pointer select-none group"
      >
        {/* Wall & Flooring Grid Perspective */}
        <div className="absolute inset-x-0 top-0 h-28 bg-[#faf4e6] border-b-2 border-[#d6bf96]">
          {/* Wall Wallpaper Pattern */}
          <div
            className="w-full h-full opacity-15"
            style={{
              backgroundImage:
                'radial-gradient(#ab8e65 1px, transparent 1px), radial-gradient(#ab8e65 1px, transparent 1px)',
              backgroundSize: '12px 12px',
              backgroundPosition: '0 0, 6px 6px',
            }}
          />
          {/* School Chalkboard on the Wall */}
          <div className="absolute left-4 top-3 w-32 h-16 bg-[#1f4a38] border-2 border-[#8b5a2b] rounded-sm p-1.5 shadow">
            <div className="text-[9px] text-[#e0f0e8] font-mono leading-tight">
              <span className="text-amber-300 font-bold">★ 교직원 연구실 ★</span>
              <br />
              - AI로 수업 혁신
              <br />
              - 나이스 업무 자동화
              <br />
              <span className="text-emerald-300">아이디어 대환영!</span>
            </div>
          </div>

          {/* Wall Clock */}
          <div className="absolute right-6 top-3 w-7 h-7 rounded-full bg-white border-2 border-[#8b5a2b] flex items-center justify-center shadow-xs">
            <span className="text-[8px] font-bold text-slate-700">10:20</span>
          </div>
        </div>

        {/* Isometric Wooden Floor */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 bg-[#d9bd8b] border-t border-[#bfa26d]"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #c7aa76 25%, transparent 25%), linear-gradient(-45deg, #c7aa76 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #c7aa76 75%), linear-gradient(-45deg, transparent 75%, #c7aa76 75%)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
            opacity: 0.35,
          }}
        />

        {/* Furniture: Teacher Desk with Retro Computer */}
        <div className="absolute left-8 bottom-3 w-28 h-14 bg-[#a67c52] border border-[#78522f] rounded-t-sm shadow-md">
          {/* Desk Top */}
          <div className="absolute -top-3 left-0 right-0 h-3 bg-[#b58c62] border-t border-[#78522f] rounded-xs flex items-center justify-between px-1">
            {/* Books */}
            <div className="flex gap-0.5">
              <div className="w-1.5 h-3.5 bg-rose-500 rounded-xs" />
              <div className="w-1.5 h-4 bg-sky-600 rounded-xs" />
              <div className="w-1.5 h-3 bg-emerald-600 rounded-xs" />
            </div>
            {/* Mug */}
            <div className="w-2.5 h-3 bg-white border border-slate-300 rounded-xs text-[6px] flex items-center justify-center">
              ☕
            </div>
          </div>
          {/* CRT Monitor */}
          <div className="absolute -top-10 left-10 w-9 h-8 bg-[#e8e4da] border border-[#a8a49a] rounded-sm p-0.5 shadow-xs">
            <div className="w-full h-full bg-[#1b2b3a] rounded-xs flex items-center justify-center">
              <span className="text-[6px] text-green-400 font-mono animate-pulse">&gt;VIBE_</span>
            </div>
          </div>
          {/* Keyboard */}
          <div className="absolute -top-1 left-9 w-11 h-2 bg-[#d4d0c5] border border-[#9c988e] rounded-xs" />
        </div>

        {/* Plant in corner */}
        <div className="absolute right-4 bottom-5 text-xl select-none filter drop-shadow">
          🪴
        </div>

        {/* Retro Pixel Teacher Avatar (Minimi) */}
        <div
          className={`absolute right-14 bottom-3 transition-transform duration-300 ${
            isJumping ? '-translate-y-4 scale-105' : 'translate-y-0 group-hover:scale-105'
          }`}
        >
          {/* Thought / Speech Bubble */}
          <div className="absolute -top-12 -left-20 w-36 bg-white/95 border border-sky-400 rounded-lg p-1.5 shadow-md text-[10px] text-slate-800 leading-tight">
            <div className="flex items-center gap-1 font-bold text-sky-700 text-[9px] mb-0.5">
              <MessageCircle className="w-2.5 h-2.5" />
              선생님 미니미
            </div>
            {avatarSaying}
            {/* Bubble Tail */}
            <div className="absolute -bottom-1.5 right-6 w-2.5 h-2.5 bg-white border-r border-b border-sky-400 transform rotate-45" />
          </div>

          {/* Minimi Avatar Graphic (CSS Pixel-like Art) */}
          <div className="relative flex flex-col items-center">
            {/* Hair & Head */}
            <div className="w-7 h-7 bg-[#ffdbac] rounded-full border-2 border-[#5c3e21] relative flex items-center justify-center shadow-xs">
              {/* Hair */}
              <div className="absolute -top-1 inset-x-0 h-3 bg-[#4a2e18] rounded-t-full" />
              {/* Glasses */}
              <div className="absolute top-2.5 flex gap-1">
                <div className="w-2 h-1.5 border border-slate-800 rounded-xs bg-cyan-100/40" />
                <div className="w-2 h-1.5 border border-slate-800 rounded-xs bg-cyan-100/40" />
              </div>
              {/* Smile */}
              <div className="absolute bottom-1 w-2 h-0.5 bg-rose-500 rounded-full" />
            </div>

            {/* Teacher Cardigan / Apron */}
            <div className="w-6 h-6 bg-[#ff6b6b] border border-[#c92a2a] rounded-t-sm relative flex items-center justify-center">
              <div className="w-2 h-full bg-white/80" />
            </div>

            {/* Legs */}
            <div className="flex gap-1">
              <div className="w-2 h-3 bg-[#2b3a4a]" />
              <div className="w-2 h-3 bg-[#2b3a4a]" />
            </div>
          </div>
        </div>

        {/* Click hint label */}
        <div className="absolute bottom-1 right-2 text-[9px] text-[#8c7450] bg-white/70 px-1 rounded">
          미니미를 클릭해보세요!
        </div>
      </div>
    </div>
  );
};
