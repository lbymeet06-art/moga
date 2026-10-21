import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { retroSound } from '../utils/audio';

export const BgmPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);

  const playlist = [
    { title: 'Free Style - Y (Please Tell Me Why)', duration: '03:45' },
    { title: '에픽하이 - Fly (싸이 감성 Ver.)', duration: '03:22' },
    { title: '클래지콰이 - She Is', duration: '03:48' },
    { title: '윤도현 - 사랑했나봐', duration: '04:00' },
  ];

  const handleToggle = () => {
    retroSound.playClick();
    const playing = retroSound.toggleBgm((state) => setIsPlaying(state));
    setIsPlaying(playing);
  };

  const handleMuteToggle = () => {
    retroSound.playClick();
    if (isMuted) {
      retroSound.setVolume(0.2);
      setIsMuted(false);
    } else {
      retroSound.setVolume(0);
      setIsMuted(true);
    }
  };

  const handleNextTrack = () => {
    retroSound.playClick();
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  return (
    <div className="flex items-center justify-between bg-[#f4f7fa] border border-[#c2d4e5] rounded px-2.5 py-1 text-xs select-none shadow-xs">
      {/* Left: Music Note & Animated Eq */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
          <Music className="w-3 h-3 animate-pulse" />
        </div>
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-[10px] font-bold text-orange-600 bg-orange-100 border border-orange-200 px-1 rounded">
            BGM
          </span>
          <div className="flex flex-col">
            <span
              onClick={handleNextTrack}
              className="text-[11px] font-medium text-slate-700 truncate max-w-[210px] sm:max-w-[280px] cursor-pointer hover:text-orange-600 transition-colors"
              title="클릭하여 다음 곡 선택"
            >
              {playlist[currentTrackIndex].title}
            </span>
          </div>
        </div>
      </div>

      {/* Center Equalizer Wave */}
      <div className="hidden sm:flex items-end gap-0.5 h-3.5 px-2">
        <span
          className={`w-1 bg-orange-400 rounded-t-xs transition-all ${
            isPlaying ? 'h-3 animate-bounce' : 'h-1'
          }`}
          style={{ animationDelay: '0ms' }}
        />
        <span
          className={`w-1 bg-orange-500 rounded-t-xs transition-all ${
            isPlaying ? 'h-3.5 animate-bounce' : 'h-1.5'
          }`}
          style={{ animationDelay: '150ms' }}
        />
        <span
          className={`w-1 bg-orange-600 rounded-t-xs transition-all ${
            isPlaying ? 'h-2 animate-bounce' : 'h-1'
          }`}
          style={{ animationDelay: '300ms' }}
        />
        <span
          className={`w-1 bg-orange-400 rounded-t-xs transition-all ${
            isPlaying ? 'h-3 animate-bounce' : 'h-1.5'
          }`}
          style={{ animationDelay: '100ms' }}
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleToggle}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
            isPlaying
              ? 'bg-orange-500 text-white border-orange-600 shadow-inner'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3 h-3 fill-current" /> 정지
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" /> 재생
            </>
          )}
        </button>

        <button
          onClick={handleMuteToggle}
          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
          title={isMuted ? '음소거 해제' : '음소거'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
