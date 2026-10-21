import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Heart,
  Trash2,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { IdeaItem, IdeaCategory, IDEA_CATEGORIES, AdminUser } from '../types';
import { retroSound } from '../utils/audio';

interface BrowseViewProps {
  ideas: IdeaItem[];
  adminUser: AdminUser | null;
  onLikeIdea: (id: string) => Promise<void>;
  onDeleteIdea: (id: string) => Promise<void>;
  likedIdeaIds: Set<string>;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  ideas,
  adminUser,
  onLikeIdea,
  onDeleteIdea,
  likedIdeaIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 6;

  // Filter & Search & Sort
  const filteredIdeas = useMemo(() => {
    return ideas
      .filter((item) => {
        // Category filter
        if (selectedCategory !== '전체' && item.category !== selectedCategory) {
          return false;
        }
        // Keyword search (title, content, nickname)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchContent = item.content.toLowerCase().includes(q);
          const matchNickname = item.nickname.toLowerCase().includes(q);
          if (!matchTitle && !matchContent && !matchNickname) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'likes') {
          return b.likes - a.likes;
        }
        // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [ideas, selectedCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredIdeas.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedIdeas = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredIdeas.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredIdeas, safeCurrentPage]);

  const handleCategoryChange = (cat: string) => {
    retroSound.playClick();
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: 'newest' | 'likes') => {
    retroSound.playClick();
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (p: number) => {
    retroSound.playClick();
    setCurrentPage(p);
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
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Filter className="w-4 h-4 text-orange-600" />
            모아보기 (전체 아이디어 탐색)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            총 <span className="font-bold text-orange-600">{ideas.length}</span>개의 제안 중{' '}
            <span className="font-bold text-slate-800">{filteredIdeas.length}</span>개 표시 중
          </p>
        </div>

        {/* Sort Toggle Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => handleSortChange('newest')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              sortBy === 'newest'
                ? 'bg-white text-orange-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => handleSortChange('likes')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              sortBy === 'likes'
                ? 'bg-white text-orange-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            좋아요순
          </button>
        </div>
      </div>

      {/* Category Filter Bar (Functional Interactive Tabs) */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2">
        <button
          onClick={() => handleCategoryChange('전체')}
          className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
            selectedCategory === '전체'
              ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          전체 보기
        </button>
        {IDEA_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="검색어를 입력하세요 (예: 나이스, 퀴즈, 생기부, 담임 등)"
          className="w-full text-xs pl-8 pr-4 py-2 border border-slate-300 rounded bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-2xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-2 text-[11px] text-slate-400 hover:text-slate-600"
          >
            초기화
          </button>
        )}
      </div>

      {/* Ideas Card List */}
      {paginatedIdeas.length === 0 ? (
        <div className="text-center py-14 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <p className="text-xs text-slate-500 font-medium">검색 조건에 일치하는 제안이 없습니다.</p>
          <button
            onClick={() => {
              setSelectedCategory('전체');
              setSearchQuery('');
            }}
            className="mt-2 text-xs text-orange-600 underline font-semibold"
          >
            모든 필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {paginatedIdeas.map((item) => {
            const isLiked = likedIdeaIds.has(item.id);
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs hover:border-orange-300 flex flex-col justify-between transition-colors"
              >
                <div>
                  {/* Clean unboxed metadata with separators */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-orange-600">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-800">{item.nickname}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {item.title}
                  </h3>

                  {item.content ? (
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap line-clamp-3 mb-3 bg-slate-50/70 p-2 rounded border border-slate-100">
                      {item.content}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic mb-3">별도 부연설명 없음</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
                  <span className="text-[11px] text-slate-400">
                    공감 수: <strong className="text-orange-600">{item.likes}</strong>회
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold border transition-transform active:scale-90 ${
                        isLiked
                          ? 'bg-rose-50 text-rose-600 border-rose-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                        }`}
                      />
                      <span>공감 {item.likes}</span>
                    </button>

                    {adminUser && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded border border-transparent hover:border-rose-200"
                        title="삭제 (운영자 전용)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Retro Numbered Pagination [◀ 1 2 3 ▶] */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-4">
          <button
            onClick={() => handlePageChange(Math.max(1, safeCurrentPage - 1))}
            disabled={safeCurrentPage === 1}
            className="p-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
            aria-label="이전 페이지"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`w-7 h-7 text-xs font-semibold rounded border transition-colors ${
                safeCurrentPage === num
                  ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(Math.min(totalPages, safeCurrentPage + 1))}
            disabled={safeCurrentPage === totalPages}
            className="p-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
            aria-label="다음 페이지"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
