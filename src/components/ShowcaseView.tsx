import React, { useState } from 'react';
import {
  ExternalLink,
  Plus,
  Code2,
  Trash2,
  Edit2,
  Sparkles,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { VibeAppItem, AdminUser, IdeaCategory, IDEA_CATEGORIES } from '../types';
import { retroSound } from '../utils/audio';

interface ShowcaseViewProps {
  apps: VibeAppItem[];
  adminUser: AdminUser | null;
  onAddApp: (data: Omit<VibeAppItem, 'id' | 'createdAt'>) => Promise<boolean>;
  onUpdateApp: (id: string, data: Partial<VibeAppItem>) => Promise<boolean>;
  onDeleteApp: (id: string) => Promise<void>;
}

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({
  apps,
  adminUser,
  onAddApp,
  onUpdateApp,
  onDeleteApp,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<IdeaCategory | '바이브코딩'>('바이브코딩');
  const [badge, setBadge] = useState('운영중');
  const [author, setAuthor] = useState('바이브코딩팀');

  const openAddModal = () => {
    retroSound.playClick();
    setEditingAppId(null);
    setTitle('');
    setDescription('');
    setUrl('https://');
    setCategory('바이브코딩');
    setBadge('신규등록');
    setAuthor('바이브코딩팀');
    setIsModalOpen(true);
  };

  const openEditModal = (appItem: VibeAppItem) => {
    retroSound.playClick();
    setEditingAppId(appItem.id);
    setTitle(appItem.title);
    setDescription(appItem.description);
    setUrl(appItem.url);
    setCategory(appItem.category);
    setBadge(appItem.badge);
    setAuthor(appItem.author || '운영자');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      alert('제목과 링크 URL을 모두 입력해주세요.');
      return;
    }
    retroSound.playClick();

    if (editingAppId) {
      const ok = await onUpdateApp(editingAppId, {
        title: title.trim(),
        description: description.trim(),
        url: url.trim(),
        category,
        badge: badge.trim(),
        author: author.trim(),
      });
      if (ok) {
        setIsModalOpen(false);
      }
    } else {
      const ok = await onAddApp({
        title: title.trim(),
        description: description.trim(),
        url: url.trim(),
        category,
        badge: badge.trim(),
        author: author.trim(),
      });
      if (ok) {
        setIsModalOpen(false);
      }
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 이 웹앱 카드를 삭제하시겠습니까?')) {
      retroSound.playClick();
      onDeleteApp(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-orange-600" />
            바이브코딩 구현관 (실제 제작 웹앱 쇼케이스)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            선생님들이 남겨주신 아이디어를 바탕으로 실제 바이브 코딩으로 개발 완료된 웹앱들입니다!
          </p>
        </div>

        {/* Admin only: Add New App Button */}
        {adminUser && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded shadow-xs active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            새 웹앱 등록 (운영자)
          </button>
        )}
      </div>

      {/* Intro Notice Box */}
      <div className="bg-[#f0f7ff] border border-sky-200 rounded-lg p-3 text-xs text-sky-900 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>바이브 코딩(Vibe Coding)이란?</strong> 자연어 프롬프트와 아이디어만으로 즉시 실무 웹앱을
          개발하는 최신 방식입니다. 게시판에서 많은 공감을 받은 주제를 골라 지속적으로 개발 및 업데이트됩니다.
        </div>
      </div>

      {/* Showcase Grid */}
      {apps.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <p className="text-xs text-slate-500">현재 등록된 구현 웹앱이 없습니다.</p>
          {adminUser && (
            <button
              onClick={openAddModal}
              className="mt-3 text-xs text-orange-600 font-semibold underline"
            >
              운영자 권한으로 첫 번째 웹앱을 등록해보세요
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-slate-200 hover:border-orange-400 rounded-lg p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Meta info: Clean unboxed metadata with separators */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-orange-600">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-700">{item.badge}</span>
                  </div>
                  {item.author && <span className="text-[11px] text-slate-400">{item.author}</span>}
                </div>

                {/* App Title */}
                <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
                {/* Open Web App Link */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded shadow-xs active:scale-95 transition-all"
                >
                  <span>웹앱 바로가기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Admin controls */}
                {adminUser && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                      title="웹앱 수정 (운영자)"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                      title="웹앱 삭제 (운영자)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-orange-400 rounded-lg w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-orange-600" />
                {editingAppId ? '바이브코딩 웹앱 수정' : '새 바이브코딩 웹앱 등록'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                닫기 ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">웹앱 제목 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 생기부 관찰기록 문장 도우미"
                  required
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">웹앱 링크 URL *</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">카테고리</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-orange-500"
                  >
                    <option value="바이브코딩">바이브코딩</option>
                    {IDEA_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">상태 뱃지</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="예: 운영중, v1.0 배포"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">설명 및 해결된 아이디어</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="웹앱에 대한 간단한 설명과 어떤 업무를 도와주는지 적어주세요."
                  className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded border border-slate-300"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded shadow-xs"
                >
                  {editingAppId ? '수정 완료' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
