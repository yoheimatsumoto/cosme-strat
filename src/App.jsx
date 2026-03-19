import React, { useState, useEffect, useRef } from 'react';
import {
  Search, BarChart2, Map, Lightbulb,
  ChevronRight, CheckCircle2, Package, Send,
  AlertCircle, RefreshCw, Layers, TrendingUp,
  Target, FileText, ArrowRight, ArrowLeft, Eye, Zap,
  Heart, MessageCircle, Share2, ThumbsUp, ThumbsDown,
  Minus, Hash, Instagram, Twitter, Play, Star,
  Filter, ExternalLink, BarChart3, TrendingDown
} from 'lucide-react';

/* ─── Google Fonts ─── */
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

/* ─── Styles ─── */
const style = document.createElement('style');
style.textContent = `
  :root {
    --ink: #0f0f0f;
    --paper: #f8f6f3;
    --warm: #f5f0ea;
    --accent: #c45d3e;
    --accent-light: #f5e6e0;
    --gold: #b8965a;
    --gold-light: #f5f0e4;
    --sage: #5a7a6a;
    --sage-light: #e8f0ec;
    --navy: #1a2332;
    --slate-mid: #6b7280;
    --border: #e5e0d8;
    --card: #ffffff;
    --ig: #E1306C;
    --tw: #1DA1F2;
    --tk: #010101;
    --positive: #22c55e;
    --negative: #ef4444;
    --neutral: #a3a3a3;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--ink); }
  .font-serif { font-family: 'Cormorant Garamond', serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: .6; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes barGrow { from { width: 0; } }
  .anim-fade-up { animation: fadeUp .6s ease-out both; }
  .anim-fade-in { animation: fadeIn .5s ease-out both; }
  .anim-slide { animation: slideRight .5s ease-out both; }
  .delay-1 { animation-delay: .1s; }
  .delay-2 { animation-delay: .2s; }
  .delay-3 { animation-delay: .3s; }
  .delay-4 { animation-delay: .4s; }
  .delay-5 { animation-delay: .5s; }
  .delay-6 { animation-delay: .6s; }
  .delay-7 { animation-delay: .7s; }
  .delay-8 { animation-delay: .8s; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d0cbc4; border-radius: 99px; }

  .map-dot { transition: all .8s cubic-bezier(.34,1.56,.64,1); }
  .map-dot:hover .dot-label { opacity: 1; transform: translateX(-50%) translateY(0); }
  .dot-label { opacity: 0; transform: translateX(-50%) translateY(4px); transition: all .25s ease; }

  .comp-card { transition: all .3s cubic-bezier(.4,0,.2,1); }
  .comp-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,.08); }

  .table-row:hover td { background: var(--warm) !important; }
  textarea:focus { outline: none; box-shadow: 0 0 0 2px var(--accent); }

  .strat-card { transition: all .4s ease; position: relative; overflow: hidden; }
  .ugc-card { transition: all .3s ease; }
  .ugc-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,.08); }
  .sent-bar { animation: barGrow .8s ease-out both; border-radius: 0 6px 6px 0; height: 10px; }
  .tag-pill { transition: all .2s ease; cursor: default; }
  .tag-pill:hover { transform: scale(1.05); }

  @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

/* ═══════════════ MOCK UGC DATA ═══════════════ */
const mockUGC = {
  1: {
    summary: { total: 3420, positive: 68, neutral: 18, negative: 14, avgEng: 4.2 },
    topHashtags: ['#オバジ', '#Obagi', '#ビタミンC美容液', '#エイジングケア', '#毛穴ケア', '#美白', '#高濃度VC'],
    keywords: [
      { word: '即効性', count: 482, sentiment: 'positive' },
      { word: '高い', count: 391, sentiment: 'negative' },
      { word: '遮光瓶', count: 287, sentiment: 'neutral' },
      { word: '匂い', count: 265, sentiment: 'negative' },
      { word: '毛穴', count: 412, sentiment: 'positive' },
      { word: 'ツヤ', count: 198, sentiment: 'positive' },
    ],
    posts: [
      { platform: 'instagram', user: '@beauty_mika', text: 'オバジ使い始めて2週間。明らかに毛穴が目立たなくなってきた…！値段は張るけどリピ確定', likes: 1842, comments: 127, date: '2025-12-08', sentiment: 'positive' },
      { platform: 'x', user: '@cosme_otaku_33', text: 'オバジC25、正直匂いはキツいけど効果は本物。朝起きた時の肌のハリが違う', likes: 523, comments: 48, date: '2025-12-15', sentiment: 'positive' },
      { platform: 'tiktok', user: '@skincare_lab', text: '1万円超のビタミンC美容液、本当に価値あるのか1ヶ月検証してみた【結論：ある】', likes: 24500, comments: 892, date: '2025-11-22', sentiment: 'positive' },
      { platform: 'instagram', user: '@simple_skin_care', text: '正直オバジ高すぎて続けられない…代わりになるプチプラVC美容液探してます', likes: 934, comments: 213, date: '2025-12-01', sentiment: 'negative' },
      { platform: 'x', user: '@derma_nurse_y', text: 'オバジは確かに効くけど刺激も強い。敏感肌の方はパッチテスト必須です', likes: 312, comments: 67, date: '2025-12-18', sentiment: 'neutral' },
    ]
  },
  2: {
    summary: { total: 12800, positive: 61, neutral: 24, negative: 15, avgEng: 6.8 },
    topHashtags: ['#メラノCC', '#プチプラスキンケア', '#ニキビ跡', '#ドラコス', '#スキンケアルーティン', '#美白ケア'],
    keywords: [
      { word: 'コスパ', count: 1920, sentiment: 'positive' },
      { word: 'ベタつく', count: 870, sentiment: 'negative' },
      { word: 'どこでも買える', count: 650, sentiment: 'positive' },
      { word: 'ニキビ跡', count: 1430, sentiment: 'positive' },
      { word: 'チューブ', count: 320, sentiment: 'neutral' },
      { word: '効果微妙', count: 410, sentiment: 'negative' },
    ],
    posts: [
      { platform: 'tiktok', user: '@100kin_beauty', text: '1000円台で買えるメラノCC、ニキビ跡に塗り続けて3ヶ月の結果がヤバい', likes: 89200, comments: 3420, date: '2025-11-30', sentiment: 'positive' },
      { platform: 'instagram', user: '@acne_fighter', text: 'メラノCC朝晩使って1ヶ月。赤みが引いてきた気がする。この値段で十分', likes: 2340, comments: 198, date: '2025-12-10', sentiment: 'positive' },
      { platform: 'x', user: '@dry_skin_girl', text: 'メラノCCベタつきすぎて夏しか使えない問題。冬は重ねづけすると最悪', likes: 1245, comments: 342, date: '2025-12-05', sentiment: 'negative' },
      { platform: 'instagram', user: '@skincare_beginner22', text: 'とりあえずメラノCC買っておけば間違いないって先輩に言われた笑', likes: 567, comments: 23, date: '2025-12-12', sentiment: 'positive' },
      { platform: 'tiktok', user: '@derma_doc_jp', text: 'メラノCCは安定型VCなので即効性は期待しすぎないで。継続が大事', likes: 15600, comments: 1890, date: '2025-12-02', sentiment: 'neutral' },
    ]
  },
  3: {
    summary: { total: 8940, positive: 72, neutral: 14, negative: 14, avgEng: 8.5 },
    topHashtags: ['#Yunth', '#生ビタミンC', '#個包装', '#PR', '#スキンケア', '#美肌', '#30秒美容液'],
    keywords: [
      { word: '個包装', count: 1680, sentiment: 'positive' },
      { word: 'PR多い', count: 920, sentiment: 'negative' },
      { word: 'モチモチ', count: 1240, sentiment: 'positive' },
      { word: '使い切り', count: 780, sentiment: 'positive' },
      { word: '広告多すぎ', count: 650, sentiment: 'negative' },
      { word: '生ビタミン', count: 1100, sentiment: 'positive' },
    ],
    posts: [
      { platform: 'instagram', user: '@pr_yunth_official', text: '30秒で使い切る、生ビタミンCの新体験。毎朝のルーティンが変わります', likes: 12400, comments: 345, date: '2025-12-14', sentiment: 'positive' },
      { platform: 'tiktok', user: '@morning_routine_jp', text: 'Yunthの個包装ビタミンC、旅行に最高すぎる。ボトル持ち歩かなくていい', likes: 34200, comments: 2100, date: '2025-12-08', sentiment: 'positive' },
      { platform: 'x', user: '@skeptical_buyer', text: 'Yunthって広告とPR投稿ばっかりで本当の口コミが見つからない。ステマ感がすごい', likes: 2890, comments: 567, date: '2025-12-11', sentiment: 'negative' },
      { platform: 'instagram', user: '@cosme_review_daily', text: 'Yunth使ってみた。確かに肌はモチモチするけど、28包で4000円弱はコスパ悪い気も…', likes: 1890, comments: 234, date: '2025-12-06', sentiment: 'neutral' },
      { platform: 'x', user: '@eco_beauty_life', text: '個包装って便利だけどゴミが多いのが気になる。環境的にどうなんだろう', likes: 678, comments: 89, date: '2025-12-16', sentiment: 'negative' },
    ]
  },
  4: {
    summary: { total: 5670, positive: 74, neutral: 16, negative: 10, avgEng: 3.9 },
    topHashtags: ['#ラロッシュポゼ', '#敏感肌', '#皮膚科医', '#ビタミンC', '#低刺激', '#スキンケア'],
    keywords: [
      { word: '敏感肌OK', count: 890, sentiment: 'positive' },
      { word: '皮膚科推奨', count: 720, sentiment: 'positive' },
      { word: 'スポイト使いにくい', count: 340, sentiment: 'negative' },
      { word: '安心感', count: 670, sentiment: 'positive' },
      { word: '香りがいい', count: 510, sentiment: 'positive' },
      { word: '効果マイルド', count: 280, sentiment: 'neutral' },
    ],
    posts: [
      { platform: 'instagram', user: '@sensitive_skin_diary', text: 'ラロッシュポゼのVC美容液、本当に沁みない！敏感肌の救世主', likes: 3420, comments: 289, date: '2025-12-09', sentiment: 'positive' },
      { platform: 'x', user: '@pharma_cosme_lab', text: 'LRP ピュアビタミンC10は真の意味で「敏感肌向けVC」。設計思想が他とは違う', likes: 1567, comments: 124, date: '2025-12-13', sentiment: 'positive' },
      { platform: 'tiktok', user: '@skincare_101', text: 'ラロッシュポゼvs.メラノCC比較！敏感肌にはどっち？結論出ました', likes: 18900, comments: 2340, date: '2025-11-28', sentiment: 'positive' },
      { platform: 'instagram', user: '@makeup_miku', text: 'スポイトが硬くて量の調整しにくい。中身はいいのにパッケージ改善希望', likes: 456, comments: 67, date: '2025-12-17', sentiment: 'negative' },
      { platform: 'x', user: '@mild_care_fan', text: '効果がマイルドすぎて3ヶ月使っても変化わからない。もうちょっと攻めてほしい', likes: 234, comments: 45, date: '2025-12-04', sentiment: 'neutral' },
    ]
  },
  5: {
    summary: { total: 6230, positive: 66, neutral: 18, negative: 16, avgEng: 5.4 },
    topHashtags: ['#COSRX', '#韓国コスメ', '#VC美容液', '#Qoo10', '#韓国スキンケア', '#高濃度'],
    keywords: [
      { word: '高濃度', count: 1120, sentiment: 'positive' },
      { word: '冷蔵保存', count: 680, sentiment: 'negative' },
      { word: 'ツヤ', count: 890, sentiment: 'positive' },
      { word: '韓国コスメ', count: 750, sentiment: 'positive' },
      { word: 'ピリピリ', count: 420, sentiment: 'negative' },
      { word: 'コスパ', count: 560, sentiment: 'positive' },
    ],
    posts: [
      { platform: 'tiktok', user: '@kbeauty_lover', text: 'COSRX VC23%セラム、1週間でツヤ肌になった。韓国コスメの底力すごい', likes: 28900, comments: 1456, date: '2025-12-07', sentiment: 'positive' },
      { platform: 'instagram', user: '@qoo10_haul', text: 'Qoo10メガ割で買ったCOSRX VC美容液。2480円でこの濃度は破格', likes: 4560, comments: 234, date: '2025-12-03', sentiment: 'positive' },
      { platform: 'x', user: '@cold_chain_hate', text: 'COSRXのVC美容液、冷蔵保存しなきゃいけないの面倒すぎる。旅行に持っていけない', likes: 890, comments: 123, date: '2025-12-15', sentiment: 'negative' },
      { platform: 'instagram', user: '@before_after_skin', text: '初回使用で結構ピリピリした。慣れるまで2〜3日かかった', likes: 1230, comments: 178, date: '2025-12-10', sentiment: 'negative' },
      { platform: 'tiktok', user: '@budget_beauty_jp', text: '2000円台のVC美容液ランキング！1位はやっぱりCOSRX', likes: 15200, comments: 980, date: '2025-12-12', sentiment: 'positive' },
    ]
  }
};

/* ═══════════════ COMPONENT ═══════════════ */
const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isCollectingUGC, setIsCollectingUGC] = useState(false);
  const [ugcCollected, setUgcCollected] = useState(false);
  const [productData, setProductData] = useState(null);
  const [description, setDescription] = useState('');
  const [competitors, setCompetitors] = useState([]);
  const [selected, setSelected] = useState([]);
  const [mapAxis, setMapAxis] = useState('price_tech');
  const [hoveredComp, setHoveredComp] = useState(null);
  const [ugcPlatformFilter, setUgcPlatformFilter] = useState('all');
  const [ugcSentimentFilter, setUgcSentimentFilter] = useState('all');
  const [ugcCompFilter, setUgcCompFilter] = useState(null);
  const [ugcView, setUgcView] = useState('overview');

  const mockSelf = {
    name: 'VC-GLOW セラム', price: 4980, volume: '30ml', unitPrice: '166円/ml',
    target: '20代後半〜30代後半 / 毛穴・くすみ', channel: '自社EC / 楽天 / LOFT',
    design: 'イエロー / 透明感 / クリーン', concept: '高濃度ビタミンC × 低刺激',
    reviews: 'コスパが良い、刺激が少ない、毛穴が目立たなくなった', cx: 55, cy: 35
  };

  const mockComps = [
    { id: 1, name: 'Obagi C25セラム ネオ', brand: 'ロート製薬', price: 11000, volume: '12ml', unitPrice: '916円/ml', target: '40代〜 / 本格エイジング', channel: 'ドラッグストア / 百貨店', design: 'ゴールド / 遮光瓶', concept: '極限濃度ビタミンC', reviews: '即効性がすごい、高いが価値あり', reason: '高価格帯の代表格。VC濃度で最高峰', cx: 85, cy: 15 },
    { id: 2, name: 'メラノCC 集中対策美容液', brand: 'ロート製薬', price: 1200, volume: '20ml', unitPrice: '60円/ml', target: '全年代 / ニキビ予防', channel: 'ドラッグストア / Amazon', design: 'シルバー / チューブ', concept: '安定型ビタミンC', reviews: 'コスパ最強、どこでも買える', reason: 'マス市場の絶対王者。価格面での基準値', cx: 18, cy: 65 },
    { id: 3, name: 'Yunth 生ビタミンC美白美容液', brand: 'Yunth', price: 3960, volume: '1ml×28包', unitPrice: '141円/ml', target: '20代〜30代 / SNS感度高め', channel: '自社D2C / SNS広告', design: '個包装 / ピンク', concept: '使用期限30秒の生ビタミン', reviews: '個包装が便利、モチモチする', reason: 'D2C×SNSの成功例。最も直接的な競合', cx: 65, cy: 42 },
    { id: 4, name: 'La Roche-Posay ピュアVC10', brand: '日本ロレアル', price: 5500, volume: '30ml', unitPrice: '183円/ml', target: '敏感肌 / 30代〜', channel: 'バラエティショップ / 楽天', design: 'オレンジ / 皮膚科医推奨', concept: '敏感肌でも使えるピュアVC', reviews: '肌荒れしない、安心感', reason: '敏感肌×VCの先駆者。信頼訴求のベンチマーク', cx: 58, cy: 22 },
    { id: 5, name: 'COSRX VC23セラム', brand: 'COSRX', price: 2480, volume: '20ml', unitPrice: '124円/ml', target: '20代〜 / 韓国コスメ層', channel: 'Qoo10 / 楽天', design: 'ブラック×イエロー', concept: '驚異のVC23%配合', reviews: '濃度に驚き、ツヤが出る', reason: '韓国コスメ勢の筆頭。若年層のシェア拡大中', cx: 38, cy: 50 }
  ];

  const steps = [
    { id: 1, label: '商品入力', sub: 'Input' },
    { id: 2, label: '競合選定', sub: 'Select' },
    { id: 3, label: 'UGC収集', sub: 'SNS' },
    { id: 4, label: '詳細比較', sub: 'Compare' },
    { id: 5, label: '市場マップ', sub: 'Map' },
    { id: 6, label: '戦略提言', sub: 'Strategy' },
  ];

  const handleAnalyze = () => { if (!description) return; setIsAnalyzing(true); setTimeout(() => { setProductData(mockSelf); setIsAnalyzing(false); }, 1500); };
  const handleSearch = () => { setIsSearching(true); setTimeout(() => { setCompetitors(mockComps); setIsSearching(false); }, 2000); };
  const handleCollectUGC = () => { setIsCollectingUGC(true); setTimeout(() => { setIsCollectingUGC(false); setUgcCollected(true); }, 2500); };
  const toggle = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const selData = () => mockComps.filter(c => selected.includes(c.id));

  const tableRows = [
    { label: '価格（税込）', key: 'price', fmt: v => `¥${v.toLocaleString()}` },
    { label: '容量', key: 'volume' },
    { label: 'ml単価', key: 'unitPrice' },
    { label: 'ターゲット', key: 'target' },
    { label: '販路', key: 'channel' },
    { label: 'パッケージ', key: 'design' },
    { label: '訴求コンセプト', key: 'concept' },
    { label: 'レビュー傾向', key: 'reviews' },
  ];

  const platformIcon = (p) => p === 'instagram' ? <Instagram size={14} /> : p === 'x' ? <Twitter size={14} /> : p === 'tiktok' ? <Play size={14} /> : null;
  const platformColor = (p) => p === 'instagram' ? 'var(--ig)' : p === 'x' ? 'var(--tw)' : 'var(--tk)';
  const platformLabel = (p) => p === 'instagram' ? 'Instagram' : p === 'x' ? 'X' : 'TikTok';
  const sentimentColor = (s) => s === 'positive' ? 'var(--positive)' : s === 'negative' ? 'var(--negative)' : 'var(--neutral)';
  const sentimentLabel = (s) => s === 'positive' ? 'ポジティブ' : s === 'negative' ? 'ネガティブ' : 'ニュートラル';
  const sentimentIcon = (s) => s === 'positive' ? <ThumbsUp size={12} /> : s === 'negative' ? <ThumbsDown size={12} /> : <Minus size={12} />;
  const formatNum = (n) => n >= 10000 ? (n / 10000).toFixed(1) + '万' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toString();

  const SentimentBar = ({ positive, neutral, negative }) => (
    <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 10, background: '#eee' }}>
      <div className="sent-bar" style={{ width: `${positive}%`, background: 'var(--positive)' }} />
      <div className="sent-bar" style={{ width: `${neutral}%`, background: 'var(--neutral)', animationDelay: '.1s' }} />
      <div className="sent-bar" style={{ width: `${negative}%`, background: 'var(--negative)', animationDelay: '.2s' }} />
    </div>
  );

  const StepBar = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 48, flexWrap: 'wrap' }}>
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <div onClick={() => { if (s.id <= currentStep) setCurrentStep(s.id); }} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 99,
            cursor: s.id <= currentStep ? 'pointer' : 'default',
            background: currentStep === s.id ? 'var(--ink)' : currentStep > s.id ? 'var(--sage-light)' : 'transparent',
            color: currentStep === s.id ? '#fff' : currentStep > s.id ? 'var(--sage)' : '#b0a99f',
            fontWeight: 600, fontSize: 12, transition: 'all .3s ease',
          }}>
            <span style={{ width: 22, height: 22, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: currentStep === s.id ? 'var(--accent)' : currentStep > s.id ? 'var(--sage)' : '#d0cbc4', color: '#fff' }}>
              {currentStep > s.id ? '✓' : s.id}
            </span>
            <span>{s.label}</span>
            <span style={{ fontSize: 9, opacity: .5, letterSpacing: 1, textTransform: 'uppercase' }}>{s.sub}</span>
          </div>
          {i < steps.length - 1 && <div style={{ flex: '0 0 12px', height: 1, background: currentStep > s.id ? 'var(--sage)' : 'var(--border)' }} />}
        </React.Fragment>
      ))}
    </div>
  );

  const Nav = ({ nextLabel, onNext, canNext = true, nextAccent = false }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
      {currentStep > 1 ? (
        <button onClick={() => setCurrentStep(p => p - 1)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--slate-mid)', fontFamily: 'inherit' }}>
          <ArrowLeft size={16} /> 前のステップ
        </button>
      ) : <div />}
      {nextLabel && (
        <button onClick={onNext} disabled={!canNext} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: canNext ? 'pointer' : 'not-allowed', background: !canNext ? '#e0dcd6' : nextAccent ? 'var(--accent)' : 'var(--ink)', color: canNext ? '#fff' : '#a09a92', transition: 'all .3s ease', fontFamily: 'inherit', boxShadow: canNext ? '0 8px 24px rgba(0,0,0,.15)' : 'none' }}>
          {nextLabel} <ArrowRight size={16} />
        </button>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <header style={{ padding: '18px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', background: '#fff', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span className="font-serif" style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)', letterSpacing: -1 }}>CosmeStrat</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', letterSpacing: 3, textTransform: 'uppercase' }}>AI Strategist</span>
        </div>
        {productData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
            <span style={{ background: 'var(--ink)', color: '#fff', padding: '5px 14px', borderRadius: 8, fontWeight: 600, fontSize: 11 }}>{productData.name}</span>
            {selected.length > 0 && <span style={{ background: 'var(--sage-light)', color: 'var(--sage)', padding: '5px 14px', borderRadius: 8, fontWeight: 600, fontSize: 11 }}>競合 {selected.length}件</span>}
          </div>
        )}
      </header>

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 40px 120px' }}>
        <StepBar />

        {/* ═══ STEP 1 ═══ */}
        {currentStep === 1 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 40 }}>
              <h2 className="font-serif" style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.2 }}>自社商品を<span style={{ color: 'var(--accent)' }}>深く理解する</span></h2>
              <p style={{ fontSize: 15, color: 'var(--slate-mid)', marginTop: 12 }}>商品の強み・特徴をAIが構造化し、最適な競合分析の土台を構築します。</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
              <div>
                <div style={{ background: 'var(--card)', borderRadius: 24, border: '1px solid var(--border)', padding: 36, minHeight: 340, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-mid)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Product Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="商品名、価格、ターゲット、主要成分、伝えたい価値などを入力…" style={{ flex: 1, padding: 20, borderRadius: 16, border: '1px solid var(--border)', fontSize: 14, lineHeight: 1.9, resize: 'none', fontFamily: 'inherit', background: 'var(--warm)', color: 'var(--ink)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                    <span style={{ fontSize: 12, color: '#b0a99f', fontStyle: 'italic' }}>例：VC-GLOW、4980円、30代の毛穴悩み向け…</span>
                    <button onClick={handleAnalyze} disabled={isAnalyzing || !description} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 14, border: 'none', fontWeight: 700, fontSize: 14, background: !description ? '#e0dcd6' : 'var(--accent)', color: '#fff', cursor: description ? 'pointer' : 'not-allowed', boxShadow: description ? '0 8px 24px rgba(196,93,62,.3)' : 'none', fontFamily: 'inherit' }}>
                      {isAnalyzing ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={16} />} 分析を開始
                    </button>
                  </div>
                </div>
                {productData && (
                  <div className="anim-fade-up" style={{ marginTop: 24, background: 'var(--sage-light)', borderRadius: 24, border: '1px solid #c8ddd2', padding: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}><CheckCircle2 size={20} style={{ color: 'var(--sage)' }} /><span style={{ fontWeight: 700, color: 'var(--sage)', fontSize: 14 }}>解析完了</span></div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                      {[{ l: '商品名', v: productData.name }, { l: 'カテゴリ', v: 'ビタミンC美容液' }, { l: '価格', v: `¥${productData.price.toLocaleString()}` }, { l: 'ターゲット', v: '30代 / 毛穴' }].map((item, i) => (
                        <div key={i} style={{ background: '#fff', padding: '14px 16px', borderRadius: 14, border: '1px solid #c8ddd2' }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--sage)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{item.l}</div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{item.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ background: 'var(--gold-light)', borderRadius: 24, border: '1px solid #e0d6c0', padding: 28, height: 'fit-content' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Lightbulb size={16} style={{ color: 'var(--gold)' }} /><span style={{ fontWeight: 700, fontSize: 13, color: '#8a7340' }}>戦略ヒント</span></div>
                <p style={{ fontSize: 13, color: '#7a6d50', lineHeight: 1.9 }}>D2C市場では<strong>「成分の透明性」</strong>と<strong>「エビデンス」</strong>が重要です。</p>
              </div>
            </div>
            {productData && <Nav nextLabel="競合を自動リサーチ" nextAccent onNext={() => { setCurrentStep(2); handleSearch(); }} />}
          </div>
        )}

        {/* ═══ STEP 2 ═══ */}
        {currentStep === 2 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 40 }}>
              <h2 className="font-serif" style={{ fontSize: 42, fontWeight: 700 }}>市場の<span style={{ color: 'var(--accent)' }}>主要プレイヤー</span>を特定</h2>
              <p style={{ fontSize: 15, color: 'var(--slate-mid)', marginTop: 12 }}>3件以上選択してください。</p>
            </div>
            {isSearching ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 0', background: 'var(--card)', borderRadius: 32, border: '1px solid var(--border)' }}>
                <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 32 }}><div style={{ position: 'absolute', inset: 0, border: '3px solid var(--accent)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} /></div>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--slate-mid)' }}>競合データを収集しています…</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card)', padding: '14px 24px', borderRadius: 16, border: '1px solid var(--border)', marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ background: selected.length >= 3 ? 'var(--sage-light)' : 'var(--accent-light)', padding: '8px 20px', borderRadius: 12 }}>
                      <span style={{ fontSize: 22, fontWeight: 700, color: selected.length >= 3 ? 'var(--sage)' : 'var(--accent)' }}>{selected.length}</span>
                      <span style={{ fontSize: 12, color: 'var(--slate-mid)', marginLeft: 4 }}>/ 3〜5</span>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--slate-mid)' }}>{selected.length < 3 ? `あと${3 - selected.length}件` : '選択完了'}</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                  {competitors.map((c, i) => (
                    <div key={c.id} className={`comp-card anim-fade-up delay-${i + 1}`} onClick={() => toggle(c.id)} style={{ background: 'var(--card)', padding: 28, borderRadius: 24, cursor: 'pointer', border: selected.includes(c.id) ? '2px solid var(--accent)' : '2px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, background: selected.includes(c.id) ? 'var(--accent)' : 'var(--warm)', color: selected.includes(c.id) ? '#fff' : '#b0a99f' }}>{c.name[0]}</div>
                        <CheckCircle2 size={22} style={{ color: selected.includes(c.id) ? 'var(--accent)' : '#e0dcd6' }} />
                      </div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{c.name}</h4>
                      <p style={{ fontSize: 12, color: 'var(--slate-mid)', marginBottom: 16 }}>{c.brand} ・ ¥{c.price.toLocaleString()}</p>
                      <div style={{ background: 'var(--warm)', padding: '14px 16px', borderRadius: 14, fontSize: 12, color: '#6b6155', lineHeight: 1.7 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#a09a92', display: 'block', marginBottom: 4 }}>選定理由</span>{c.reason}
                      </div>
                    </div>
                  ))}
                </div>
                <Nav nextLabel="UGCを収集・分析" nextAccent canNext={selected.length >= 3} onNext={() => { setCurrentStep(3); handleCollectUGC(); }} />
              </>
            )}
          </div>
        )}

        {/* ═══ STEP 3: UGC ═══ */}
        {currentStep === 3 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 40 }}>
              <h2 className="font-serif" style={{ fontSize: 42, fontWeight: 700 }}>SNSの<span style={{ color: 'var(--accent)' }}>リアルな声</span>を収集</h2>
              <p style={{ fontSize: 15, color: 'var(--slate-mid)', marginTop: 12, lineHeight: 1.8 }}>Instagram・X・TikTokから競合商品のUGCを自動収集し、感情分析・キーワード抽出を行います。</p>
            </div>

            {isCollectingUGC ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', background: 'var(--card)', borderRadius: 32, border: '1px solid var(--border)' }}>
                <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 32 }}>
                  <div style={{ position: 'absolute', inset: 0, border: '3px solid var(--ig)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                  <div style={{ position: 'absolute', inset: 12, border: '3px solid var(--tw)', borderRadius: '50%', borderBottomColor: 'transparent', animation: 'spin 1.5s linear infinite reverse' }} />
                  <div style={{ position: 'absolute', inset: 24, border: '3px solid var(--ink)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 2s linear infinite' }} />
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>UGCデータを収集中…</p>
                <p style={{ fontSize: 13, color: 'var(--slate-mid)' }}>Instagram / X / TikTok の投稿を分析しています</p>
              </div>
            ) : ugcCollected ? (
              <>
                {/* Summary cards */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(selData().length, 5)}, 1fr)`, gap: 14, marginBottom: 24 }}>
                  {selData().map((c, i) => {
                    const ugc = mockUGC[c.id]; if (!ugc) return null;
                    const active = ugcCompFilter === c.id;
                    return (
                      <div key={c.id} className={`anim-fade-up delay-${i + 1}`} onClick={() => setUgcCompFilter(active ? null : c.id)} style={{ background: active ? 'var(--ink)' : 'var(--card)', padding: 20, borderRadius: 18, border: `1px solid ${active ? 'var(--ink)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all .3s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                          <h4 style={{ fontSize: 12, fontWeight: 700, color: active ? '#fff' : 'var(--ink)' }}>{c.name}</h4>
                          <span style={{ fontSize: 10, fontWeight: 600, color: active ? 'var(--accent)' : 'var(--slate-mid)', background: active ? 'rgba(196,93,62,.2)' : 'var(--warm)', padding: '3px 8px', borderRadius: 6 }}>{ugc.summary.total.toLocaleString()}件</span>
                        </div>
                        <SentimentBar positive={ugc.summary.positive} neutral={ugc.summary.neutral} negative={ugc.summary.negative} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                          {[{ l: 'ポジ', v: ugc.summary.positive, c: 'var(--positive)' }, { l: 'ニュー', v: ugc.summary.neutral, c: 'var(--neutral)' }, { l: 'ネガ', v: ugc.summary.negative, c: 'var(--negative)' }].map((s, j) => (
                            <span key={j} style={{ fontSize: 9, fontWeight: 600, color: active ? '#94a3b8' : 'var(--slate-mid)' }}><span style={{ color: s.c }}>●</span> {s.l} {s.v}%</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['all', 'instagram', 'x', 'tiktok'].map(p => (
                      <button key={p} onClick={() => setUgcPlatformFilter(p)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 10, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: ugcPlatformFilter === p ? 'var(--ink)' : 'var(--card)', color: ugcPlatformFilter === p ? '#fff' : 'var(--slate-mid)', boxShadow: '0 1px 3px rgba(0,0,0,.06)', transition: 'all .2s' }}>
                        {p === 'all' ? <Filter size={12} /> : platformIcon(p)} {p === 'all' ? '全て' : platformLabel(p)}
                      </button>
                    ))}
                    <div style={{ width: 1, background: 'var(--border)', margin: '0 2px' }} />
                    {['all', 'positive', 'neutral', 'negative'].map(s => (
                      <button key={s} onClick={() => setUgcSentimentFilter(s)} style={{ padding: '7px 12px', borderRadius: 10, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: ugcSentimentFilter === s ? (s === 'all' ? 'var(--ink)' : sentimentColor(s)) : 'var(--card)', color: ugcSentimentFilter === s ? '#fff' : 'var(--slate-mid)', transition: 'all .2s' }}>
                        {s === 'all' ? '全感情' : sentimentLabel(s)}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 4, background: 'var(--warm)', borderRadius: 10, padding: 3 }}>
                    {['overview', 'posts'].map(v => (
                      <button key={v} onClick={() => setUgcView(v)} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: ugcView === v ? '#fff' : 'transparent', color: ugcView === v ? 'var(--ink)' : 'var(--slate-mid)', boxShadow: ugcView === v ? '0 1px 4px rgba(0,0,0,.08)' : 'none' }}>
                        {v === 'overview' ? 'キーワード分析' : '投稿一覧'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Overview */}
                {ugcView === 'overview' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {selData().filter(c => !ugcCompFilter || ugcCompFilter === c.id).map((c, ci) => {
                      const ugc = mockUGC[c.id]; if (!ugc) return null;
                      return (
                        <div key={c.id} className={`anim-fade-up delay-${ci + 1}`} style={{ background: 'var(--card)', borderRadius: 24, border: '1px solid var(--border)', padding: 28 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h4 style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</h4>
                            <span style={{ fontSize: 11, color: 'var(--slate-mid)', fontWeight: 600 }}>Eng Rate: {ugc.summary.avgEng}%</span>
                          </div>
                          <div style={{ marginBottom: 20 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-mid)', letterSpacing: 2, display: 'block', marginBottom: 12 }}>TOP KEYWORDS</span>
                            {ugc.keywords.map((kw, ki) => (
                              <div key={ki} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <span style={{ fontSize: 12, fontWeight: 600, width: 110, textAlign: 'right' }}>{kw.word}</span>
                                <div style={{ flex: 1, height: 8, background: '#f0ede8', borderRadius: 8, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', borderRadius: 8, width: `${(kw.count / Math.max(...ugc.keywords.map(k => k.count))) * 100}%`, background: sentimentColor(kw.sentiment), animation: 'barGrow .6s ease-out both', animationDelay: `${ki * 0.1}s` }} />
                                </div>
                                <span style={{ fontSize: 10, color: 'var(--slate-mid)', width: 40, textAlign: 'right' }}>{kw.count}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-mid)', letterSpacing: 2, display: 'block', marginBottom: 10 }}>HASHTAGS</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {ugc.topHashtags.map((tag, ti) => (
                                <span key={ti} className="tag-pill" style={{ padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: 'var(--warm)', color: 'var(--gold)', border: '1px solid var(--border)' }}>{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Posts */}
                {ugcView === 'posts' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                    {selData().filter(c => !ugcCompFilter || ugcCompFilter === c.id).flatMap(c => {
                      const ugc = mockUGC[c.id]; if (!ugc) return [];
                      return ugc.posts.filter(p => ugcPlatformFilter === 'all' || p.platform === ugcPlatformFilter).filter(p => ugcSentimentFilter === 'all' || p.sentiment === ugcSentimentFilter).map(p => ({ ...p, compName: c.name }));
                    }).sort((a, b) => b.likes - a.likes).map((post, i) => (
                      <div key={i} className={`ugc-card anim-fade-up delay-${Math.min(i + 1, 8)}`} style={{ background: 'var(--card)', borderRadius: 20, border: '1px solid var(--border)', padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${platformColor(post.platform)}15`, color: platformColor(post.platform) }}>{platformIcon(post.platform)}</div>
                            <div><span style={{ fontSize: 13, fontWeight: 700 }}>{post.user}</span><span style={{ fontSize: 10, color: 'var(--slate-mid)', marginLeft: 8 }}>{post.date}</span></div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, background: `${sentimentColor(post.sentiment)}15`, color: sentimentColor(post.sentiment), fontSize: 10, fontWeight: 700 }}>
                            {sentimentIcon(post.sentiment)} {sentimentLabel(post.sentiment)}
                          </div>
                        </div>
                        <p style={{ fontSize: 13, lineHeight: 1.8, color: '#4a5568' }}>{post.text}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', gap: 14 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--slate-mid)', fontWeight: 600 }}><Heart size={13} style={{ color: '#ef4444' }} /> {formatNum(post.likes)}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--slate-mid)', fontWeight: 600 }}><MessageCircle size={13} /> {formatNum(post.comments)}</span>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: 'var(--warm)', color: 'var(--slate-mid)' }}>{post.compName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Insight */}
                <div className="anim-fade-up delay-3" style={{ marginTop: 24, background: 'var(--gold-light)', borderRadius: 24, border: '1px solid #e0d6c0', padding: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><Lightbulb size={16} style={{ color: 'var(--gold)' }} /><span style={{ fontWeight: 700, fontSize: 14, color: '#8a7340' }}>UGCインサイト</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <p style={{ fontSize: 13, color: '#7a6d50', lineHeight: 1.9 }}><strong style={{ color: '#5a4a2a' }}>メラノCC</strong>のUGC投稿数は圧倒的（12,800件）。「コスパ」が最頻出キーワードで、価格訴求が口コミ拡散の原動力。</p>
                    <p style={{ fontSize: 13, color: '#7a6d50', lineHeight: 1.9 }}><strong style={{ color: '#5a4a2a' }}>Yunth</strong>はエンゲージメント率が最高（8.5%）だが、「PR多い」「広告多すぎ」のネガ感情が目立つ。信頼性に課題。</p>
                    <p style={{ fontSize: 13, color: '#7a6d50', lineHeight: 1.9 }}><strong style={{ color: '#5a4a2a' }}>自社の勝機：</strong>「低刺激 × 高濃度」を訴求するUGCが少ない。このポジションの口コミを意図的に設計するチャンス。</p>
                  </div>
                </div>
                <Nav nextLabel="詳細比較へ進む" onNext={() => setCurrentStep(4)} />
              </>
            ) : null}
          </div>
        )}

        {/* ═══ STEP 4 ═══ */}
        {currentStep === 4 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 40 }}>
              <h2 className="font-serif" style={{ fontSize: 42, fontWeight: 700 }}>スペック<span style={{ color: 'var(--accent)' }}>徹底比較</span></h2>
              <p style={{ fontSize: 15, color: 'var(--slate-mid)', marginTop: 12 }}>自社商品と競合{selData().length}社の詳細スペック一覧です。</p>
            </div>
            <div style={{ background: 'var(--card)', borderRadius: 28, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,.06)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                  <thead><tr>
                    <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: 12, fontWeight: 700, background: 'var(--ink)', color: '#fff', position: 'sticky', left: 0, zIndex: 10, width: 160 }}>比較項目</th>
                    <th style={{ padding: '20px 24px', textAlign: 'center', fontSize: 12, fontWeight: 700, background: 'var(--accent)', color: '#fff' }}>自社: {productData?.name}</th>
                    {selData().map(c => <th key={c.id} style={{ padding: '20px 24px', textAlign: 'center', fontSize: 12, fontWeight: 600, background: 'var(--navy)', color: '#94a3b8' }}>{c.name}</th>)}
                  </tr></thead>
                  <tbody>
                    {tableRows.map((row, idx) => (
                      <tr key={idx} className="table-row">
                        <td style={{ padding: '18px 24px', fontSize: 13, fontWeight: 700, color: 'var(--slate-mid)', borderBottom: '1px solid var(--border)', position: 'sticky', left: 0, background: idx % 2 === 0 ? '#fff' : 'var(--warm)', zIndex: 5 }}>{row.label}</td>
                        <td style={{ padding: '18px 24px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--accent)', borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'rgba(196,93,62,.04)' : 'rgba(196,93,62,.08)' }}>{row.fmt ? row.fmt(productData?.[row.key]) : productData?.[row.key]}</td>
                        {selData().map(c => <td key={c.id} style={{ padding: '18px 24px', textAlign: 'center', fontSize: 13, color: '#4a5568', borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? '#fff' : 'var(--warm)' }}>{row.fmt ? row.fmt(c[row.key]) : c[row.key]}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 28 }}>
              <div style={{ background: '#eef4ff', borderRadius: 20, border: '1px solid #d4e0f5', padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><Eye size={16} style={{ color: '#4a6fa5' }} /><span style={{ fontWeight: 700, fontSize: 14, color: '#2d4a73' }}>勝機</span></div>
                <p style={{ fontSize: 13, color: '#4a6fa5', lineHeight: 1.9 }}>Yunthと価格帯が近く販売チャネルでの衝突が予想。Obagiとの単価差（約5倍）を活かした「継続しやすさ」が鍵。</p>
              </div>
              <div style={{ background: 'var(--sage-light)', borderRadius: 20, border: '1px solid #c8ddd2', padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><TrendingUp size={16} style={{ color: 'var(--sage)' }} /><span style={{ fontWeight: 700, fontSize: 14, color: '#2d5a46' }}>クリエイティブへの示唆</span></div>
                <p style={{ fontSize: 13, color: '#4a7a66', lineHeight: 1.9 }}>他社が「遮光瓶」「個包装」で鮮度を謳う中、自社の「クリーンでオープンな世界観」の視覚化が重要。</p>
              </div>
            </div>
            <Nav nextLabel="市場マップを生成" onNext={() => setCurrentStep(5)} />
          </div>
        )}

        {/* ═══ STEP 5 ═══ */}
        {currentStep === 5 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 40 }}>
              <h2 className="font-serif" style={{ fontSize: 42, fontWeight: 700 }}>市場<span style={{ color: 'var(--accent)' }}>ポジショニング</span>マップ</h2>
              <p style={{ fontSize: 15, color: 'var(--slate-mid)', marginTop: 12 }}>2軸マップで相対位置を俯瞰し、戦略的空白地帯を発見します。</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 28 }}>
              <div>
                <div style={{ background: 'var(--card)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, marginBottom: 20 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-mid)', letterSpacing: 2, display: 'block', marginBottom: 14 }}>AXIS</span>
                  {[{ key: 'price_tech', label: '価格 × 成分濃度' }, { key: 'age_style', label: '年齢 × ブランド感' }].map(o => (
                    <button key={o.key} onClick={() => setMapAxis(o.key)} style={{ display: 'block', width: '100%', padding: '14px 18px', borderRadius: 14, border: 'none', textAlign: 'left', fontSize: 13, fontWeight: 600, marginBottom: 8, cursor: 'pointer', fontFamily: 'inherit', background: mapAxis === o.key ? 'var(--ink)' : 'var(--warm)', color: mapAxis === o.key ? '#fff' : 'var(--slate-mid)' }}>{o.label}</button>
                  ))}
                </div>
                <div style={{ background: 'var(--ink)', borderRadius: 20, padding: 24, color: '#fff', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><AlertCircle size={14} style={{ color: 'var(--accent)' }} /><span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>空白地帯</span></div>
                  <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.9 }}>「オーガニック × 高機能」という軸はまだ空いています。</p>
                </div>
                <div style={{ background: 'var(--card)', borderRadius: 20, border: '1px solid var(--border)', padding: 20 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-mid)', letterSpacing: 2, display: 'block', marginBottom: 14 }}>LEGEND</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 99, background: 'var(--accent)', border: '2px solid #fff', boxShadow: '0 0 0 2px var(--accent)' }} />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>自社</span>
                  </div>
                  {selData().map(c => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 99, background: 'var(--navy)', border: '2px solid #fff' }} />
                      <span style={{ fontSize: 11, color: 'var(--slate-mid)' }}>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'var(--card)', borderRadius: 32, border: '1px solid var(--border)', padding: 48, position: 'relative', aspectRatio: '1/.85', overflow: 'hidden', boxShadow: 'inset 0 2px 12px rgba(0,0,0,.04)' }}>
                <svg style={{ position: 'absolute', inset: 48, pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="50" y1="0" x2="50" y2="100" stroke="var(--border)" strokeWidth=".3" strokeDasharray="2 2" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border)" strokeWidth=".3" strokeDasharray="2 2" />
                </svg>
                {[{ pos: 'top', text: mapAxis === 'price_tech' ? '高価格' : '高年齢層' }, { pos: 'bottom', text: mapAxis === 'price_tech' ? '低価格' : '若年層' }].map(a => (
                  <div key={a.pos} style={{ position: 'absolute', [a.pos]: 16, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: '#b0a99f', letterSpacing: 3, textTransform: 'uppercase' }}>{a.text}</div>
                ))}
                {[{ pos: 'left', text: mapAxis === 'price_tech' ? '低濃度' : '日常ケア', rot: '-90deg' }, { pos: 'right', text: mapAxis === 'price_tech' ? '高濃度' : 'スペシャルケア', rot: '90deg' }].map(a => (
                  <div key={a.pos} style={{ position: 'absolute', [a.pos]: 16, top: '50%', transform: `translateY(-50%) rotate(${a.rot})`, fontSize: 10, fontWeight: 700, color: '#b0a99f', letterSpacing: 3, whiteSpace: 'nowrap' }}>{a.text}</div>
                ))}
                <div style={{ position: 'absolute', inset: 48 }}>
                  <div className="map-dot" style={{ position: 'absolute', left: `${productData?.cx}%`, top: `${productData?.cy}%`, transform: 'translate(-50%,-50%)', zIndex: 20, animation: 'float 3s ease-in-out infinite' }}>
                    <div style={{ position: 'absolute', inset: -8, borderRadius: 99, border: '2px solid var(--accent)', animation: 'pulse-ring 2s ease-out infinite', opacity: .5 }} />
                    <div style={{ width: 48, height: 48, borderRadius: 99, background: 'var(--accent)', border: '3px solid #fff', boxShadow: '0 4px 20px rgba(196,93,62,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>自社</div>
                    <div style={{ position: 'absolute', top: 56, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: 'var(--accent)', color: '#fff', padding: '4px 12px', borderRadius: 8, fontSize: 10, fontWeight: 700 }}>{productData?.name}</div>
                  </div>
                  {selData().map(c => (
                    <div key={c.id} className="map-dot" style={{ position: 'absolute', left: `${c.cx}%`, top: `${c.cy}%`, transform: 'translate(-50%,-50%)', zIndex: hoveredComp === c.id ? 15 : 10 }} onMouseEnter={() => setHoveredComp(c.id)} onMouseLeave={() => setHoveredComp(null)}>
                      <div style={{ width: 38, height: 38, borderRadius: 99, background: 'var(--navy)', border: '3px solid #fff', boxShadow: '0 2px 12px rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{c.name[0]}</div>
                      <div className="dot-label" style={{ position: 'absolute', top: 46, left: '50%', whiteSpace: 'nowrap', background: 'var(--ink)', color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 9, fontWeight: 600 }}>{c.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Nav nextLabel="戦略提言を生成" nextAccent onNext={() => setCurrentStep(6)} />
          </div>
        )}

        {/* ═══ STEP 6 ═══ */}
        {currentStep === 6 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 40 }}>
              <h2 className="font-serif" style={{ fontSize: 42, fontWeight: 700 }}><span style={{ color: 'var(--accent)' }}>勝つための</span>戦略ロードマップ</h2>
              <p style={{ fontSize: 15, color: 'var(--slate-mid)', marginTop: 12 }}>スペック比較・UGC分析・市場マップを統合した具体的アクションプランです。</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { icon: <Package size={22} />, title: 'プロダクト改善', color: 'var(--accent)', bg: 'var(--accent-light)', content: 'Obagi等の高価格帯と比較されるため、パッケージの重厚感や開封体験の向上が必要。' },
                { icon: <FileText size={22} />, title: '訴求・コピー', color: '#4a6fa5', bg: '#eef4ff', content: '「敏感肌でも使える高濃度」というポジションを強化。安心感をフックに差別化。' },
                { icon: <Target size={22} />, title: 'UGC戦略', color: 'var(--sage)', bg: 'var(--sage-light)', content: 'Yunthの「PR疲れ」を逆手に、リアルなレビューを軸としたオーガニックUGC施策を展開。ステマ感のない口コミ設計が差別化の鍵。' }
              ].map((card, i) => (
                <div key={i} className={`strat-card anim-fade-up delay-${i + 1}`} style={{ background: 'var(--card)', padding: 32, borderRadius: 24, border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: card.color, borderRadius: '24px 0 0 24px' }} />
                  <div style={{ width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: card.bg, color: card.color, marginBottom: 20 }}>{card.icon}</div>
                  <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{card.title}</h4>
                  <p style={{ fontSize: 13, color: 'var(--slate-mid)', lineHeight: 1.9 }}>{card.content}</p>
                </div>
              ))}
            </div>
            <div className="anim-fade-up delay-4" style={{ marginTop: 36, background: 'var(--ink)', borderRadius: 32, padding: '56px 52px', position: 'relative', overflow: 'hidden', color: '#fff' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 200, height: 200, borderRadius: 99, background: 'var(--accent)', opacity: .06 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 3, height: 36, background: 'var(--accent)', borderRadius: 99 }} />
                  <h3 className="font-serif" style={{ fontSize: 28, fontWeight: 700 }}>ストラテジストからの総括</h3>
                </div>
                <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 2.1, maxWidth: 800 }}>
                  貴社商品は<span style={{ color: '#fff', fontWeight: 700, borderBottom: '2px solid var(--accent)', paddingBottom: 2 }}>「日常使いできる最高峰VC」</span>としてのポジションが最も有力です。
                </p>
                <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 2.1, maxWidth: 800, marginTop: 16 }}>
                  UGC分析から、Yunthは広告色の強さにユーザーが疲弊しています。<strong style={{ color: '#fff' }}>「本物のレビュー」を武器にしたSNS戦略</strong>と<strong style={{ color: '#fff' }}>LP上でのUGC活用</strong>が次のアクションです。
                </p>
                <button style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px', borderRadius: 14, border: 'none', background: '#fff', color: 'var(--ink)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}>
                  <Send size={16} /> ディスカッションを続ける
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
