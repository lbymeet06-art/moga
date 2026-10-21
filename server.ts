import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const archiver = require('archiver');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

// Initial seed data to make the app alive immediately
const INITIAL_DATA = {
  stats: {
    today: 48,
    total: 2154,
    lastDate: new Date().toISOString().slice(0, 10),
  },
  ideas: [
    {
      id: 'idea-seed-1',
      nickname: '꿈꾸는교사',
      category: 'AI활용',
      title: '수업 보조 퀴즈 자동 생성기',
      content: '학생들 교과서 본문이나 단원 핵심 키워드를 넣으면 4지선다 퀴즈와 해설을 1초 만에 만들어주는 웹앱이 있으면 좋겠습니다! 형성평가 준비 시간이 획기적으로 줄어들 것 같아요.',
      likes: 29,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    },
    {
      id: 'idea-seed-2',
      nickname: '나이스해방',
      category: '업무자동화',
      title: 'NEIS(나이스) 공문 서식 및 기안문 초안 작성 도우미',
      content: '매번 결재 올릴 때 기안문 규격과 예시 서식 찾는 게 너무 번거롭습니다. 행사명, 일시, 예산만 적으면 교육청 표준 기안문 문구로 자동 변환해 주는 툴이 절실해요.',
      likes: 38,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    },
    {
      id: 'idea-seed-3',
      nickname: '열정담임',
      category: '글쓰기',
      title: '생기부 행동특성 관찰기록 어휘 추천기',
      content: '학생별 행동 특성과 장점을 몇 가지 키워드로 찍으면 학생부 기재 요령에 부합하는 정중하고 다채로운 문장 템플릿을 추천해 주는 앱을 제안합니다.',
      likes: 42,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      id: 'idea-seed-4',
      nickname: '스마트미술',
      category: '이미지생성',
      title: '학급 환경미화 및 수업용 캐릭터 일러스트 프롬프트 모음',
      content: '게시판 꾸미기나 학급 신문 만들 때 쓸 수 있는 친근한 한국형 교실 일러스트를 쉽게 생성할 수 있도록 프롬프트 생성기가 있으면 좋겠습니다.',
      likes: 19,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    },
    {
      id: 'idea-seed-5',
      nickname: '방송부담당',
      category: '영상제작',
      title: '학예회 및 졸업식 영상 자막 & 하이라이트 자동 추출',
      content: '긴 학교 행사 영상에서 소리 나는 구간이나 음성 인식을 통해 자막을 자동 생성해 주고 하이라이트 숏폼을 추천해 주는 웹앱이 필요해요.',
      likes: 24,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: 'idea-seed-6',
      nickname: '과학부장',
      category: '수업자료제작',
      title: '실험 안전 수칙 및 절차 인터랙티브 체크리스트',
      content: '과학실 실험 수업 전에 학생들이 태블릿으로 안전 규칙을 확인하고 디지털 서명을 제출하는 간편 체크리스트 웹앱을 제안합니다.',
      likes: 15,
      createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    },
  ],
  apps: [
    {
      id: 'app-seed-1',
      title: '생기부 관찰기록 문장 도우미',
      description: '학생의 활동 키워드를 입력하면 학생부 기재 규정에 맞춘 다채로운 행동발달 서술형 문장을 추천합니다.',
      url: 'https://ais-dev-3nz67njhc6656htpr6v4gy-460177613361.asia-northeast1.run.app',
      category: '글쓰기',
      badge: 'v1.2 운영중',
      createdAt: '2026-10-15T09:00:00.000Z',
      author: '바이브코딩팀',
    },
    {
      id: 'app-seed-2',
      title: '수업 맞춤형 4지선다 퀴즈봇',
      description: '단원 텍스트를 붙여넣으면 즉시 인쇄 가능한 시험지 및 인터랙티브 웹 퀴즈를 생성합니다.',
      url: 'https://ais-dev-3nz67njhc6656htpr6v4gy-460177613361.asia-northeast1.run.app',
      category: 'AI활용',
      badge: '체험가능',
      createdAt: '2026-10-18T14:30:00.000Z',
      author: '교육혁신부',
    },
    {
      id: 'app-seed-3',
      title: '가정통신문 공문 서식 초안 생성기',
      description: '체험학습, 학부모 상담, 방과후 신청 등 주요 가정통신문 양식을 표준 서식으로 1분 만에 완성합니다.',
      url: 'https://ais-dev-3nz67njhc6656htpr6v4gy-460177613361.asia-northeast1.run.app',
      category: '업무자동화',
      badge: '신규등록',
      createdAt: '2026-10-20T10:00:00.000Z',
      author: '교무행정팀',
    },
  ],
};

// Database helper functions
function initDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
  }
}

function readDatabase(): typeof INITIAL_DATA {
  initDatabase();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read database file, restoring backup', err);
    return INITIAL_DATA;
  }
}

function writeDatabase(data: typeof INITIAL_DATA) {
  initDatabase();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function startServer() {
  initDatabase();
  const app = express();

  app.use(express.json());

  // API: Get ideas
  app.get('/api/ideas', (req: Request, res: Response) => {
    const db = readDatabase();
    res.json(db.ideas || []);
  });

  // API: Create new idea
  app.post('/api/ideas', (req: Request, res: Response) => {
    const { nickname, category, title, content } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: '제목은 필수 입력 항목입니다.' });
    }

    const trimmedContent = (content || '').toString().slice(0, 300);
    const newIdea = {
      id: 'idea-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex'),
      nickname: (nickname && nickname.trim()) || '익명의 작성자',
      category: category || '기타',
      title: title.trim(),
      content: trimmedContent.trim(),
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    const db = readDatabase();
    db.ideas.unshift(newIdea);
    writeDatabase(db);

    return res.status(201).json(newIdea);
  });

  // API: Like an idea
  app.post('/api/ideas/:id/like', (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readDatabase();
    const idea = db.ideas.find((item) => item.id === id);
    if (!idea) {
      return res.status(404).json({ error: '제안을 찾을 수 없습니다.' });
    }

    idea.likes = (idea.likes || 0) + 1;
    writeDatabase(db);

    return res.json(idea);
  });

  // API: Delete idea (Admin)
  app.delete('/api/ideas/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readDatabase();
    const index = db.ideas.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: '제안을 찾을 수 없습니다.' });
    }

    const deleted = db.ideas.splice(index, 1);
    writeDatabase(db);
    return res.json({ success: true, deleted: deleted[0] });
  });

  // API: Get Vibe apps
  app.get('/api/apps', (req: Request, res: Response) => {
    const db = readDatabase();
    res.json(db.apps || []);
  });

  // API: Add Vibe app (Admin)
  app.post('/api/apps', (req: Request, res: Response) => {
    const { title, description, url, category, badge, author } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: '제목과 링크 URL은 필수입니다.' });
    }

    const newApp = {
      id: 'app-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex'),
      title: title.trim(),
      description: (description || '').trim(),
      url: url.trim(),
      category: category || '바이브코딩',
      badge: (badge || '운영중').trim(),
      author: (author || '운영자').trim(),
      createdAt: new Date().toISOString(),
    };

    const db = readDatabase();
    db.apps.unshift(newApp);
    writeDatabase(db);
    return res.status(201).json(newApp);
  });

  // API: Update Vibe app (Admin)
  app.put('/api/apps/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, url, category, badge, author } = req.body;
    const db = readDatabase();
    const appItem = db.apps.find((item) => item.id === id);
    if (!appItem) {
      return res.status(404).json({ error: '앱 정보를 찾을 수 없습니다.' });
    }

    if (title) appItem.title = title.trim();
    if (description !== undefined) appItem.description = description.trim();
    if (url) appItem.url = url.trim();
    if (category) appItem.category = category;
    if (badge) appItem.badge = badge.trim();
    if (author) appItem.author = author.trim();

    writeDatabase(db);
    return res.json(appItem);
  });

  // API: Delete Vibe app (Admin)
  app.delete('/api/apps/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readDatabase();
    const index = db.apps.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: '앱을 찾을 수 없습니다.' });
    }

    const deleted = db.apps.splice(index, 1);
    writeDatabase(db);
    return res.json({ success: true, deleted: deleted[0] });
  });

  // API: Visitor Stats (Today / Total)
  app.get('/api/stats', (req: Request, res: Response) => {
    const db = readDatabase();
    const todayStr = new Date().toISOString().slice(0, 10);

    if (db.stats.lastDate !== todayStr) {
      db.stats.today = 1;
      db.stats.lastDate = todayStr;
      db.stats.total = (db.stats.total || 0) + 1;
      writeDatabase(db);
    } else if (req.query.visit === 'true') {
      db.stats.today = (db.stats.today || 0) + 1;
      db.stats.total = (db.stats.total || 0) + 1;
      writeDatabase(db);
    }

    res.json(db.stats);
  });

  // API: Admin Authentication
  app.post('/api/admin/auth', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const targetEmail = 'lbymeet06@gmail.com';

    // Allow primary email lbymeet06@gmail.com or password match
    if (email && email.toLowerCase() === targetEmail.toLowerCase()) {
      return res.json({
        success: true,
        email: targetEmail,
        role: 'admin',
        token: 'token-' + crypto.randomBytes(16).toString('hex'),
      });
    }

    // Support quick admin login for testing/demo
    if (password === 'admin1234' || password === '1999') {
      return res.json({
        success: true,
        email: targetEmail,
        role: 'admin',
        token: 'token-' + crypto.randomBytes(16).toString('hex'),
      });
    }

    return res.status(401).json({
      error: '관리자 권한이 없습니다. 지정된 관리자 이메일(lbymeet06@gmail.com)로 로그인해주세요.',
    });
  });

  // API: Export Ideas as CSV (UTF-8 BOM for Korean Excel compatibility)
  app.get('/api/admin/export-csv', (req: Request, res: Response) => {
    const db = readDatabase();
    const ideas = db.ideas || [];

    // Header row
    const headers = ['등록일시', '카테고리', '제목', '내용', '작성자', '공감수'];
    const rows = ideas.map((item) => [
      `"${new Date(item.createdAt).toLocaleString('ko-KR')}"`,
      `"${(item.category || '').replace(/"/g, '""')}"`,
      `"${(item.title || '').replace(/"/g, '""')}"`,
      `"${(item.content || '').replace(/"/g, '""')}"`,
      `"${(item.nickname || '').replace(/"/g, '""')}"`,
      item.likes || 0,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="school_ideas_${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csvContent);
  });

  // API: Download full project source as ZIP for GitHub
  app.get('/api/download-zip', (req: Request, res: Response) => {
    try {
      const archive = new archiver.ZipArchive({ zlib: { level: 9 } });

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="cyworld-school-vibe-coding-github.zip"'
      );

      archive.on('error', (err: any) => {
        console.error('Archive error:', err);
        if (!res.headersSent) {
          res.status(500).send('압축 파일 생성 중 오류가 발생했습니다.');
        }
      });

      archive.pipe(res);

      const rootFiles = [
        'package.json',
        'tsconfig.json',
        'vite.config.ts',
        'server.ts',
        'index.html',
        'README.md',
        'PRD.md',
        'ACTION_PLAN.md',
        '.env.example',
        '.gitignore',
        'metadata.json',
      ];

      for (const file of rootFiles) {
        const fullPath = path.resolve(__dirname, file);
        if (fs.existsSync(fullPath)) {
          archive.file(fullPath, { name: file });
        }
      }

      const srcDir = path.resolve(__dirname, 'src');
      if (fs.existsSync(srcDir)) {
        archive.directory(srcDir, 'src');
      }

      const dataDir = path.resolve(__dirname, 'data');
      if (fs.existsSync(dataDir)) {
        archive.directory(dataDir, 'data');
      }

      const publicDir = path.resolve(__dirname, 'public');
      if (fs.existsSync(publicDir)) {
        archive.directory(publicDir, 'public');
      }

      const githubDir = path.resolve(__dirname, '.github');
      if (fs.existsSync(githubDir)) {
        archive.directory(githubDir, '.github');
      }

      const docsDir = path.resolve(__dirname, 'docs');
      if (fs.existsSync(docsDir)) {
        archive.directory(docsDir, 'docs');
      }

      archive.finalize();
    } catch (err) {
      console.error('Download zip failure:', err);
      res.status(500).send('ZIP 압축 생성 실패');
    }
  });

  // Serve Frontend
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server error:', err);
});
