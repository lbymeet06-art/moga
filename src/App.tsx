/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { RetroFrame, NavTab } from './components/RetroFrame';
import { HomeView } from './components/HomeView';
import { BrowseView } from './components/BrowseView';
import { ShowcaseView } from './components/ShowcaseView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AdminModal } from './components/AdminModal';
import { GitHubDownloadModal } from './components/GitHubDownloadModal';
import { IdeaItem, VibeAppItem, SiteStats, AdminUser, IdeaCategory } from './types';
import { INITIAL_IDEAS, INITIAL_APPS, INITIAL_STATS } from './initialData';
import { retroSound } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [apps, setApps] = useState<VibeAppItem[]>([]);
  const [stats, setStats] = useState<SiteStats>({
    today: 48,
    total: 2154,
    lastDate: new Date().toISOString().slice(0, 10),
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [likedIdeaIds, setLikedIdeaIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show temporary toast message
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Initialize data on mount
  useEffect(() => {
    // Restore admin session from localStorage if present
    const savedAdmin = localStorage.getItem('cyworld_admin_user');
    if (savedAdmin) {
      try {
        setAdminUser(JSON.parse(savedAdmin));
      } catch {
        localStorage.removeItem('cyworld_admin_user');
      }
    }

    // Restore liked ideas from localStorage
    const savedLikes = localStorage.getItem('cyworld_liked_ideas');
    if (savedLikes) {
      try {
        setLikedIdeaIds(new Set(JSON.parse(savedLikes)));
      } catch {
        // ignore
      }
    }

    // Fetch ideas, apps, and stats with visit increment
    const hasVisitedThisSession = sessionStorage.getItem('visited_session');
    const visitParam = !hasVisitedThisSession ? '?visit=true' : '';
    if (!hasVisitedThisSession) {
      sessionStorage.setItem('visited_session', 'true');
    }

    Promise.all([
      fetch('/api/ideas').then((r) => {
        if (!r.ok) throw new Error('API not available');
        return r.json();
      }),
      fetch('/api/apps').then((r) => {
        if (!r.ok) throw new Error('API not available');
        return r.json();
      }),
      fetch(`/api/stats${visitParam}`).then((r) => {
        if (!r.ok) throw new Error('API not available');
        return r.json();
      }),
    ])
      .then(([ideasList, appsList, statsData]) => {
        if (Array.isArray(ideasList)) setIdeas(ideasList);
        if (Array.isArray(appsList)) setApps(appsList);
        if (statsData && typeof statsData.today === 'number') setStats(statsData);
      })
      .catch(() => {
        // Fallback for static hosting like GitHub Pages!
        try {
          const localIdeas = localStorage.getItem('cyworld_local_ideas');
          const localApps = localStorage.getItem('cyworld_local_apps');
          const localStats = localStorage.getItem('cyworld_local_stats');

          setIdeas(localIdeas ? JSON.parse(localIdeas) : INITIAL_IDEAS);
          setApps(localApps ? JSON.parse(localApps) : INITIAL_APPS);
          if (localStats) {
            setStats(JSON.parse(localStats));
          } else {
            setStats(INITIAL_STATS);
          }
        } catch {
          setIdeas(INITIAL_IDEAS);
          setApps(INITIAL_APPS);
          setStats(INITIAL_STATS);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Add new idea
  const handleAddIdea = async (data: {
    nickname: string;
    category: IdeaCategory;
    title: string;
    content: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newIdea = await res.json();
        setIdeas((prev) => [newIdea, ...prev]);
        showToast(`🎉 "${newIdea.title}" 아이디어가 성공적으로 등록되었습니다!`);
        return true;
      }
    } catch {
      // Fallback for static GitHub Pages
    }

    // Client fallback
    const newIdea: IdeaItem = {
      id: 'idea-' + Date.now(),
      nickname: data.nickname || '익명의 작성자',
      category: data.category,
      title: data.title,
      content: data.content,
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    setIdeas((prev) => {
      const updated = [newIdea, ...prev];
      localStorage.setItem('cyworld_local_ideas', JSON.stringify(updated));
      return updated;
    });
    showToast(`🎉 "${newIdea.title}" 아이디어가 성공적으로 등록되었습니다!`);
    return true;
  };

  // Like idea
  const handleLikeIdea = async (id: string) => {
    // If already liked, prevent redundant vote
    if (likedIdeaIds.has(id)) {
      showToast('이미 공감(좋아요)을 누르신 제안입니다! 💖');
      return;
    }

    try {
      const res = await fetch(`/api/ideas/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        setIdeas((prev) => prev.map((item) => (item.id === id ? updated : item)));
        setLikedIdeaIds((prev) => {
          const next = new Set(prev).add(id);
          localStorage.setItem('cyworld_liked_ideas', JSON.stringify(Array.from(next)));
          return next;
        });
        showToast('선생님의 따뜻한 공감이 전달되었습니다! ♥');
        return;
      }
    } catch {
      // Fallback
    }

    // Client fallback for static GitHub Pages
    setIdeas((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      );
      localStorage.setItem('cyworld_local_ideas', JSON.stringify(updated));
      return updated;
    });
    setLikedIdeaIds((prev) => {
      const next = new Set(prev).add(id);
      localStorage.setItem('cyworld_liked_ideas', JSON.stringify(Array.from(next)));
      return next;
    });
    showToast('선생님의 따뜻한 공감이 전달되었습니다! ♥');
  };

  // Delete idea (Admin)
  const handleDeleteIdea = async (id: string) => {
    try {
      const res = await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setIdeas((prev) => prev.filter((item) => item.id !== id));
        showToast('제안글이 삭제되었습니다.');
        return;
      }
    } catch {
      // Fallback
    }

    // Client fallback
    setIdeas((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem('cyworld_local_ideas', JSON.stringify(updated));
      return updated;
    });
    showToast('제안글이 삭제되었습니다.');
  };

  // Add Vibe App
  const handleAddApp = async (data: Omit<VibeAppItem, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newApp = await res.json();
        setApps((prev) => [newApp, ...prev]);
        showToast(`🚀 "${newApp.title}" 웹앱이 구현관에 등록되었습니다!`);
        return true;
      }
    } catch {
      // Fallback
    }

    const newApp: VibeAppItem = {
      id: 'app-' + Date.now(),
      title: data.title,
      description: data.description,
      url: data.url,
      category: data.category,
      badge: data.badge,
      author: data.author || '운영자',
      createdAt: new Date().toISOString(),
    };
    setApps((prev) => {
      const updated = [newApp, ...prev];
      localStorage.setItem('cyworld_local_apps', JSON.stringify(updated));
      return updated;
    });
    showToast(`🚀 "${newApp.title}" 웹앱이 구현관에 등록되었습니다!`);
    return true;
  };

  // Update Vibe App
  const handleUpdateApp = async (
    id: string,
    data: Partial<VibeAppItem>
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/apps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setApps((prev) => prev.map((item) => (item.id === id ? updated : item)));
        showToast('웹앱 정보가 수정되었습니다.');
        return true;
      }
    } catch {
      // Fallback
    }

    setApps((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...data } : item));
      localStorage.setItem('cyworld_local_apps', JSON.stringify(updated));
      return updated;
    });
    showToast('웹앱 정보가 수정되었습니다.');
    return true;
  };

  // Delete Vibe App
  const handleDeleteApp = async (id: string) => {
    try {
      const res = await fetch(`/api/apps/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApps((prev) => prev.filter((item) => item.id !== id));
        showToast('웹앱 카드가 삭제되었습니다.');
        return;
      }
    } catch {
      // Fallback
    }

    setApps((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem('cyworld_local_apps', JSON.stringify(updated));
      return updated;
    });
    showToast('웹앱 카드가 삭제되었습니다.');
  };

  // Admin Login
  const handleAdminLogin = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        const user: AdminUser = {
          email: data.email,
          role: 'admin',
          token: data.token,
        };
        setAdminUser(user);
        localStorage.setItem('cyworld_admin_user', JSON.stringify(user));
        showToast(`환영합니다, 운영자(${user.email})님! 관리자 권한이 활성화되었습니다.`);
        return true;
      }
    } catch {
      // Fallback
    }

    // Client fallback for static GitHub Pages
    if (
      (email && email.toLowerCase() === 'lbymeet06@gmail.com') ||
      password === 'admin1234' ||
      password === '1999'
    ) {
      const user: AdminUser = {
        email: 'lbymeet06@gmail.com',
        role: 'admin',
        token: 'token-' + Date.now(),
      };
      setAdminUser(user);
      localStorage.setItem('cyworld_admin_user', JSON.stringify(user));
      showToast(`환영합니다, 운영자(${user.email})님! 관리자 권한이 활성화되었습니다.`);
      return true;
    }

    return false;
  };

  // Admin Logout
  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('cyworld_admin_user');
    showToast('운영자 로그아웃 되었습니다.');
  };

  // Wave Surfing: picks a random inspiring idea and navigates to Browse tab
  const handleWaveSurf = () => {
    if (ideas.length > 0) {
      const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
      setCurrentTab('browse');
      showToast(`🏄 파도타기 도착! [${randomIdea.category}] "${randomIdea.title}"`);
    } else {
      showToast('아직 등록된 아이디어가 없습니다. 첫 아이디어를 제안해보세요!');
    }
  };

  return (
    <div className="relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-3 right-3 sm:right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Cyworld Retro Frame Layout */}
      <RetroFrame
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        stats={stats}
        adminUser={adminUser}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onLogoutAdmin={handleAdminLogout}
        onWaveSurf={handleWaveSurf}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500 space-y-2">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">교직원 미니홈피 로딩 중...</span>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeView
                ideas={ideas}
                adminUser={adminUser}
                onAddIdea={handleAddIdea}
                onLikeIdea={handleLikeIdea}
                onDeleteIdea={handleDeleteIdea}
                likedIdeaIds={likedIdeaIds}
              />
            )}

            {currentTab === 'browse' && (
              <BrowseView
                ideas={ideas}
                adminUser={adminUser}
                onLikeIdea={handleLikeIdea}
                onDeleteIdea={handleDeleteIdea}
                likedIdeaIds={likedIdeaIds}
              />
            )}

            {currentTab === 'showcase' && (
              <ShowcaseView
                apps={apps}
                adminUser={adminUser}
                onAddApp={handleAddApp}
                onUpdateApp={handleUpdateApp}
                onDeleteApp={handleDeleteApp}
              />
            )}

            {currentTab === 'admin' && (
              <AdminDashboardView
                ideas={ideas}
                apps={apps}
                stats={stats}
                adminUser={adminUser}
                onLogin={handleAdminLogin}
                onLogout={handleAdminLogout}
                onDeleteIdea={handleDeleteIdea}
                onOpenAppAddModal={() => {
                  setCurrentTab('showcase');
                  setIsAdminModalOpen(false);
                }}
                onDeleteApp={handleDeleteApp}
              />
            )}
          </>
        )}
      </RetroFrame>

      {/* Admin Login Modal (Triggered from Footer or shortcuts) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        adminUser={adminUser}
        onLogin={async (email, pwd) => {
          const ok = await handleAdminLogin(email, pwd);
          if (ok) {
            setIsAdminModalOpen(false);
          }
          return ok;
        }}
        onLogout={handleAdminLogout}
        ideasCount={ideas.length}
      />

      {/* GitHub Source Code Download Modal */}
      <GitHubDownloadModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </div>
  );
}
