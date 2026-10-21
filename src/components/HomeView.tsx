import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Send,
  Trophy,
  Flame,
  Trash2,
  CheckCircle,
  HelpCircle,
  Calendar,
  User,
} from 'lucide-react';
import { IdeaItem, IdeaCategory, IDEA_CATEGORIES, AdminUser } from '../types';
import { retroSound } from '../utils/audio';

interface HomeViewProps {
  ideas: IdeaItem[];
  adminUser: AdminUser | null;
  onAddIdea: (data: {
    nickname: string;
    category: IdeaCategory;
    title: string;
    content: string;
  }) => Promise<boolean>;
  onLikeIdea: (id: string) => Promise<void>;
  onDeleteIdea: (id: string) => Promise<void>;
  likedIdeaIds: Set<string>;
}

export const HomeView: React.FC<HomeViewProps> = ({
  ideas,
  adminUser,
  onAddIdea,
  onLikeIdea,
  onDeleteIdea,
  likedIdeaIds,
}) => {
  const [nickname, setNickname] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('AI활용');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const MAX_CONTENT_LENGTH = 300;

  // Real-time Ranking: Sort by likes descending, top 3
  const topIdeas = [...ideas].sort((a, b) => b.likes - a.likes).slice(0, 3);

  // Recent feeds: Sort by createdAt descending
  const recentIdeas = [...ideas].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('아이디어 제목을 입력해주세요!');
      retroSound.playClick();
      return;
    }
    setValidationError('');
    setIsSubmitting(true);
    retroSound.playClick();

    const success = await onAddIdea({
      nickname: nickname.trim(),
      category,
      title: title.trim(),
      content: content.trim(),
    });

    setIsSubmitting(false);
    if (success) {
      retroSound.playHeartSound();
      setTitle('');
      setContent('');
      setNickname('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3500);
    }
  };

  const handleLike = (id: string) => {
    retroSound.playHeartSound();
    onLikeIdea(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 이 제안글을 삭제하시겠습니까? (운영자 전용)')) {
      retroSound.playClick();
      onDeleteIdea(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Intro Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70 border-2 border-amber-300 rounded-lg p-3.5 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="flex-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
              <span>반갑습니다! 교직원 바이브 코딩 & AI 아이디어 광장입니다.</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              수업 자료 준비, 업무 자동화, 나이스 문서, 미디어 제작 등 현장에서 마주친 크고 작은 아이디어를
              편하게 남겨주세요! 동료 교직원의 공감을 많이 얻은 아이디어는{' '}
              <strong className="text-orange-600 font-semibold">실제 바이브 코딩 웹앱으로 구현</strong>되어
              선물처럼 공유됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top Ranking & Idea Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Real-time Ranking: Top 3 Panel (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-[#f8fafc] border-2 border-[#cbd5e1] rounded-lg p-3.5 shadow-xs flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>실시간 공감 랭킹 TOP 3</span>
              </div>
              <span className="flex items-center gap-0.5 text-[10px] text-orange-600 font-bold bg-orange-100 px-1.5 py-0.5 rounded">
                <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                인기 주제
              </span>
            </div>

            {topIdeas.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                아직 등록된 제안이 없습니다. 첫 제안을 남겨보세요!
              </div>
            ) : (
              <div className="space-y-2.5 flex-1">
                {topIdeas.map((item, idx) => {
                  const rankBadges = [
                    { label: '1위', bg: 'bg-amber-400 text-slate-900 border-amber-500' },
                    { label: '2위', bg: 'bg-slate-300 text-slate-800 border-slate-400' },
                    { label: '3위', bg: 'bg-amber-700 text-white border-amber-800' },
                  ];
                  const rank = rankBadges[idx] || {
                    label: `${idx + 1}위`,
                    bg: 'bg-slate-100 text-slate-700 border-slate-200',
                  };

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded p-2.5 hover:border-orange-300 transition-colors shadow-xs relative group"
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${rank.bg}`}
                        >
                          {rank.label}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-0.5">
                            <span className="font-semibold text-orange-700">{item.category}</span>
                            <span>·</span>
                            <span>{item.nickname}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 truncate" title={item.title}>
                            {item.title}
                          </h4>
                        </div>
                        <button
                          onClick={() => handleLike(item.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border transition-transform active:scale-90 shrink-0 ${
                            likedIdeaIds.has(item.id)
                              ? 'bg-rose-50 text-rose-600 border-rose-300 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              likedIdeaIds.has(item.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                            }`}
                          />
                          <span>{item.likes}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
              <span>공감을 많이 받은 아이디어는 바이브코딩 우선 개발 대상이 됩니다!</span>
            </div>
          </div>
        </div>

        {/* Idea Submission Form (7 cols on lg) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-[#fffcf7] border-2 border-orange-300 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-orange-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900">
                <Send className="w-4 h-4 text-orange-600" />
                <span>아이디어 작성하기 (선생님의 생각을 남겨주세요)</span>
              </div>
              <span className="text-[10px] text-slate-500">익명 작성 가능</span>
            </div>

            {validationError && (
              <div className="mb-3 p-2 bg-rose-50 border border-rose-300 rounded text-xs text-rose-700 flex items-center gap-1.5 animate-shake">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="mb-3 p-2 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>아이디어가 성공적으로 등록되었습니다! 동료들의 공감을 기다려보세요.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* Nickname Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  닉네임 <span className="font-normal text-slate-500">(선택, 미입력 시 '익명의 작성자')</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="예: 열정담임, 나이스해방"
                    maxLength={20}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  카테고리 <span className="text-orange-600">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IdeaCategory)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-medium text-slate-800"
                >
                  {IDEA_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title Input */}
            <div className="mb-3">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                아이디어 제목 <span className="text-orange-600">* (한 줄 요약)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 나이스 공문 서식 및 기안문 초안 작성 도우미"
                maxLength={80}
                required
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-medium text-slate-900"
              />
            </div>

            {/* Content Input (Max 300) */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700">
                  부연 설명 <span className="font-normal text-slate-500">(선택)</span>
                </label>
                <span
                  className={`text-[10px] font-mono ${
                    content.length > 270 ? 'text-rose-600 font-bold' : 'text-slate-400'
                  }`}
                >
                  {content.length}/{MAX_CONTENT_LENGTH}자
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
                rows={3}
                placeholder="더 자세히 알려주시면 영상 제작에 큰 도움이 됩니다! (선택)"
                className="w-full text-xs p-2.5 border border-slate-300 rounded bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none text-slate-800 leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded shadow-sm border border-orange-600 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? '등록 중...' : '아이디어 남기기'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Recent Feed (싸이월드 방명록 & 피드 스타일) */}
      <div className="border-t-2 border-dashed border-slate-300 pt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              최근 올라온 교직원 제안글 ({ideas.length}개)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            공감 버튼을 눌러 동료 교직원의 아이디어를 응원해주세요!
          </span>
        </div>

        {recentIdeas.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500">
            등록된 제안이 없습니다. 위의 양식으로 첫 아이디어를 제안해보세요!
          </div>
        ) : (
          <div className="space-y-3">
            {recentIdeas.slice(0, 6).map((item) => {
              const isLiked = likedIdeaIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs hover:border-orange-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                    <div>
                      {/* Meta information: NO pills, clean text with separators */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <span className="font-bold text-orange-600">{item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-slate-800">{item.nickname}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-0.5 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLike(item.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold border transition-all active:scale-95 ${
                          isLiked
                            ? 'bg-rose-50 text-rose-600 border-rose-300 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                        }`}
                        title="이 아이디어에 공감 투표하기"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                          }`}
                        />
                        <span>공감 {item.likes}</span>
                      </button>

                      {/* Admin Delete Action */}
                      {adminUser && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                          title="아이디어 삭제 (운영자 전용)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {item.content && (
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap pl-1 border-l-2 border-orange-200">
                      {item.content}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
