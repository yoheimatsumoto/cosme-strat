import React, { useState, useEffect, useRef } from 'react';
import {
  Search, BarChart2, Map, Lightbulb,
  ChevronRight, CheckCircle2, Package, Send,
  AlertCircle, RefreshCw, Layers, TrendingUp,
  Target, FileText, ArrowRight, ArrowLeft, Eye, Zap
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
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--ink); }
  .font-serif { font-family: 'Cormorant Garamond', serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
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
  .anim-fade-up { animation: fadeUp .6s ease-out both; }
  .anim-fade-in { animation: fadeIn .5s ease-out both; }
  .anim-slide { animation: slideRight .5s ease-out both; }
  .delay-1 { animation-delay: .1s; }
  .delay-2 { animation-delay: .2s; }
  .delay-3 { animation-delay: .3s; }
  .delay-4 { animation-delay: .4s; }
  .delay-5 { animation-delay: .5s; }
  .delay-6 { animation-delay: .6s; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d0cbc4; border-radius: 99px; }

  .map-dot {
    transition: all .8s cubic-bezier(.34,1.56,.64,1);
  }
  .map-dot:hover .dot-label {
    opacity: 1; transform: translateX(-50%) translateY(0);
  }
  .dot-label {
    opacity: 0; transform: translateX(-50%) translateY(4px);
    transition: all .25s ease;
  }

  .comp-card {
    transition: all .3s cubic-bezier(.4,0,.2,1);
  }
  .comp-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,.08);
  }

  .table-row:hover td { background: var(--warm) !important; }

  textarea:focus { outline: none; box-shadow: 0 0 0 2px var(--accent); }

  .strat-card {
    transition: all .4s ease;
    position: relative;
    overflow: hidden;
  }
  .strat-card::before {
    content: '';
    position: absolute; top: 0; left: 0;
    width: 4px; height: 100%;
    transition: width .3s ease;
  }
  .strat-card:hover::before { width: 8px; }
`;
document.head.appendChild(style);

/* ─────────── Component ─────────── */
const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [productData, setProductData] = useState(null);
  const [description, setDescription] = useState('');
  const [competitors, setCompetitors] = useState([]);
  const [selected, setSelected] = useState([]);
  const [mapAxis, setMapAxis] = useState('price_tech');
  const [hoveredComp, setHoveredComp] = useState(null);

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
    { id: 1, label: '商品入力', sub: 'Product Input' },
    { id: 2, label: '競合選定', sub: 'Competitors' },
    { id: 3, label: '詳細比較', sub: 'Comparison' },
    { id: 4, label: '市場マップ', sub: 'Positioning' },
    { id: 5, label: '戦略提言', sub: 'Strategy' },
  ];

  const handleAnalyze = () => {
    if (!description) return;
    setIsAnalyzing(true);
    setTimeout(() => { setProductData(mockSelf); setIsAnalyzing(false); }, 1500);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => { setCompetitors(mockComps); setIsSearching(false); }, 2000);
  };

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

  /* ─── Step Progress Bar ─── */
  const StepBar = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 48 }}>
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <div
            onClick={() => {
              if (s.id <= currentStep || (s.id === 2 && productData)) setCurrentStep(s.id);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px',
              borderRadius: 99, cursor: s.id <= currentStep ? 'pointer' : 'default',
              background: currentStep === s.id ? 'var(--ink)' : currentStep > s.id ? 'var(--sage-light)' : 'transparent',
              color: currentStep === s.id ? '#fff' : currentStep > s.id ? 'var(--sage)' : '#b0a99f',
              fontWeight: 600, fontSize: 13, transition: 'all .3s ease',
              border: currentStep === s.id ? 'none' : '1px solid transparent'
            }}
          >
            <span style={{
              width: 24, height: 24, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
              background: currentStep === s.id ? 'var(--accent)' : currentStep > s.id ? 'var(--sage)' : '#d0cbc4',
              color: '#fff'
            }}>
              {currentStep > s.id ? '✓' : s.id}
            </span>
            <span>{s.label}</span>
            <span style={{ fontSize: 10, opacity: .5, letterSpacing: 1, textTransform: 'uppercase' }}>{s.sub}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: '0 0 24px', height: 1, background: currentStep > s.id ? 'var(--sage)' : 'var(--border)' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  /* ─── Navigation ─── */
  const Nav = ({ nextLabel, onNext, canNext = true, nextAccent = false }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
      {currentStep > 1 ? (
        <button onClick={() => setCurrentStep(p => p - 1)} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 12,
          border: '1px solid var(--border)', background: 'var(--card)', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', color: 'var(--slate-mid)'
        }}>
          <ArrowLeft size={16} /> 前のステップ
        </button>
      ) : <div />}
      {nextLabel && (
        <button onClick={onNext} disabled={!canNext} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 12,
          border: 'none', fontSize: 14, fontWeight: 700, cursor: canNext ? 'pointer' : 'not-allowed',
          background: !canNext ? '#e0dcd6' : nextAccent ? 'var(--accent)' : 'var(--ink)',
          color: canNext ? '#fff' : '#a09a92', transition: 'all .3s ease',
          boxShadow: canNext ? '0 8px 24px rgba(0,0,0,.15)' : 'none'
        }}>
          {nextLabel} <ArrowRight size={16} />
        </button>
      )}
    </div>
  );

  /* ─── Render ─── */
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      {/* Header */}
      <header style={{
        padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--border)', background: '#fff', position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span className="font-serif" style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)', letterSpacing: -1 }}>
            CosmeStrat
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', letterSpacing: 3, textTransform: 'uppercase' }}>
            AI Strategist
          </span>
        </div>
        {productData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13 }}>
            <span style={{ color: 'var(--slate-mid)' }}>分析中：</span>
            <span style={{
              background: 'var(--ink)', color: '#fff', padding: '6px 16px', borderRadius: 8, fontWeight: 600, fontSize: 12
            }}>{productData.name}</span>
            {selected.length > 0 && (
              <span style={{
                background: 'var(--sage-light)', color: 'var(--sage)', padding: '6px 16px', borderRadius: 8, fontWeight: 600, fontSize: 12
              }}>競合 {selected.length}件</span>
            )}
          </div>
        )}
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px 120px' }}>
        <StepBar />

        {/* ═══ STEP 1 ═══ */}
        {currentStep === 1 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 40 }}>
              <h2 className="font-serif" style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.2 }}>
                自社商品を<span style={{ color: 'var(--accent)' }}>深く理解する</span>
              </h2>
              <p style={{ fontSize: 15, color: 'var(--slate-mid)', marginTop: 12, lineHeight: 1.8 }}>
                商品の強み・特徴をAIが構造化し、最適な競合分析の土台を構築します。
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
              <div>
                <div style={{
                  background: 'var(--card)', borderRadius: 24, border: '1px solid var(--border)',
                  padding: 36, minHeight: 360, display: 'flex', flexDirection: 'column'
                }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate-mid)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
                    Product Description
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="商品名、価格、ターゲット、主要成分、伝えたい価値などを入力..."
                    style={{
                      flex: 1, padding: 20, borderRadius: 16, border: '1px solid var(--border)',
                      fontSize: 14, lineHeight: 1.9, resize: 'none', fontFamily: 'inherit',
                      background: 'var(--warm)', color: 'var(--ink)'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                    <span style={{ fontSize: 12, color: '#b0a99f', fontStyle: 'italic' }}>
                      例：VC-GLOW セラム、4980円、30代の毛穴悩み向け、高濃度ビタミンC…
                    </span>
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !description}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '14px 32px',
                        borderRadius: 14, border: 'none', fontWeight: 700, fontSize: 14,
                        background: !description ? '#e0dcd6' : 'var(--accent)', color: '#fff',
                        cursor: description ? 'pointer' : 'not-allowed',
                        boxShadow: description ? '0 8px 24px rgba(196,93,62,.3)' : 'none',
                        transition: 'all .3s ease', fontFamily: 'inherit'
                      }}
                    >
                      {isAnalyzing ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={16} />}
                      分析を開始
                    </button>
                  </div>
                </div>

                {productData && (
                  <div className="anim-fade-up" style={{
                    marginTop: 24, background: 'var(--sage-light)', borderRadius: 24,
                    border: '1px solid #c8ddd2', padding: 32
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                      <CheckCircle2 size={20} style={{ color: 'var(--sage)' }} />
                      <span style={{ fontWeight: 700, color: 'var(--sage)', fontSize: 14 }}>解析完了</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                      {[
                        { l: '商品名', v: productData.name },
                        { l: 'カテゴリ', v: 'ビタミンC美容液' },
                        { l: '価格', v: `¥${productData.price.toLocaleString()}` },
                        { l: 'ターゲット', v: '30代 / 毛穴' }
                      ].map((item, i) => (
                        <div key={i} style={{
                          background: '#fff', padding: '14px 16px', borderRadius: 14, border: '1px solid #c8ddd2'
                        }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--sage)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{item.l}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{item.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div style={{
                background: 'var(--gold-light)', borderRadius: 24, border: '1px solid #e0d6c0', padding: 28, height: 'fit-content'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Lightbulb size={16} style={{ color: 'var(--gold)' }} />
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#8a7340' }}>戦略ヒント</span>
                </div>
                <p style={{ fontSize: 13, color: '#7a6d50', lineHeight: 1.9 }}>
                  現在のD2C市場では<strong>「成分の透明性」</strong>と<strong>「エビデンス」</strong>が強く求められます。主要成分の配合率や、独自技術も含めて入力すると、より精度の高い分析が可能です。
                </p>
              </div>
            </div>

            {productData && (
              <Nav
                nextLabel="競合を自動リサーチ"
                nextAccent
                onNext={() => { setCurrentStep(2); handleSearch(); }}
              />
            )}
          </div>
        )}

        {/* ═══ STEP 2 ═══ */}
        {currentStep === 2 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 40 }}>
              <h2 className="font-serif" style={{ fontSize: 42, fontWeight: 700 }}>
                市場の<span style={{ color: 'var(--accent)' }}>主要プレイヤー</span>を特定
              </h2>
              <p style={{ fontSize: 15, color: 'var(--slate-mid)', marginTop: 12 }}>
                AIが自動で抽出した競合候補から、分析対象を3件以上選択してください。
              </p>
            </div>

            {isSearching ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '100px 0', background: 'var(--card)', borderRadius: 32, border: '1px solid var(--border)'
              }}>
                <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 32 }}>
                  <div style={{
                    position: 'absolute', inset: 0, border: '3px solid var(--accent)',
                    borderRadius: '50%', borderTopColor: 'transparent',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--slate-mid)' }}>競合データを収集しています…</p>
              </div>
            ) : (
              <>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--card)', padding: '16px 24px', borderRadius: 16,
                  border: '1px solid var(--border)', marginBottom: 24
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      background: selected.length >= 3 ? 'var(--sage-light)' : 'var(--accent-light)',
                      padding: '8px 20px', borderRadius: 12
                    }}>
                      <span style={{
                        fontSize: 22, fontWeight: 700,
                        color: selected.length >= 3 ? 'var(--sage)' : 'var(--accent)'
                      }}>{selected.length}</span>
                      <span style={{ fontSize: 12, color: 'var(--slate-mid)', marginLeft: 4 }}>/ 3〜5</span>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--slate-mid)' }}>
                      {selected.length < 3 ? 'あと' + (3 - selected.length) + '件選択してください' : '選択完了 — 次のステップへ進めます'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                  {competitors.map((c, i) => (
                    <div
                      key={c.id}
                      className={`comp-card anim-fade-up delay-${i + 1}`}
                      onClick={() => toggle(c.id)}
                      style={{
                        background: 'var(--card)', padding: 28, borderRadius: 24, cursor: 'pointer',
                        border: selected.includes(c.id) ? '2px solid var(--accent)' : '2px solid var(--border)',
                        boxShadow: selected.includes(c.id) ? '0 4px 20px rgba(196,93,62,.12)' : '0 2px 8px rgba(0,0,0,.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, fontWeight: 700,
                          background: selected.includes(c.id) ? 'var(--accent)' : 'var(--warm)',
                          color: selected.includes(c.id) ? '#fff' : '#b0a99f'
                        }}>{c.name[0]}</div>
                        <CheckCircle2 size={22} style={{
                          color: selected.includes(c.id) ? 'var(--accent)' : '#e0dcd6',
                          transition: 'color .2s'
                        }} />
                      </div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{c.name}</h4>
                      <p style={{ fontSize: 12, color: 'var(--slate-mid)', marginBottom: 16 }}>
                        {c.brand} ・ ¥{c.price.toLocaleString()}
                      </p>
                      <div style={{
                        background: 'var(--warm)', padding: '14px 16px', borderRadius: 14, fontSize: 12,
                        color: '#6b6155', lineHeight: 1.7
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#a09a92', display: 'block', marginBottom: 4, letterSpacing: 1 }}>
                          選定理由
                        </span>
                        {c.reason}
                      </div>
                    </div>
                  ))}
                </div>

                <Nav
                  nextLabel="詳細比較へ進む"
                  canNext={selected.length >= 3}
                  onNext={() => setCurrentStep(3)}
                />
              </>
            )}
          </div>
        )}

        {/* ═══ STEP 3 ═══ */}
        {currentStep === 3 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 40 }}>
              <h2 className="font-serif" style={{ fontSize: 42, fontWeight: 700 }}>
                スペック<span style={{ color: 'var(--accent)' }}>徹底比較</span>
              </h2>
              <p style={{ fontSize: 15, color: 'var(--slate-mid)', marginTop: 12 }}>
                自社商品と選定した競合{selData().length}社の詳細スペックを一覧比較します。
              </p>
            </div>

            <div style={{
              background: 'var(--card)', borderRadius: 28, border: '1px solid var(--border)',
              overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,.06)'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                  <thead>
                    <tr>
                      <th style={{
                        padding: '20px 24px', textAlign: 'left', fontSize: 12, fontWeight: 700,
                        background: 'var(--ink)', color: '#fff', letterSpacing: 1,
                        position: 'sticky', left: 0, zIndex: 10, width: 160
                      }}>比較項目</th>
                      <th style={{
                        padding: '20px 24px', textAlign: 'center', fontSize: 12, fontWeight: 700,
                        background: 'var(--accent)', color: '#fff', letterSpacing: 1
                      }}>自社: {productData?.name}</th>
                      {selData().map(c => (
                        <th key={c.id} style={{
                          padding: '20px 24px', textAlign: 'center', fontSize: 12, fontWeight: 600,
                          background: 'var(--navy)', color: '#94a3b8', letterSpacing: 1
                        }}>{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, idx) => (
                      <tr key={idx} className="table-row">
                        <td style={{
                          padding: '18px 24px', fontSize: 13, fontWeight: 700, color: 'var(--slate-mid)',
                          borderBottom: '1px solid var(--border)', position: 'sticky', left: 0,
                          background: idx % 2 === 0 ? '#fff' : 'var(--warm)', zIndex: 5
                        }}>{row.label}</td>
                        <td style={{
                          padding: '18px 24px', textAlign: 'center', fontSize: 13, fontWeight: 700,
                          color: 'var(--accent)', borderBottom: '1px solid var(--border)',
                          background: idx % 2 === 0 ? 'rgba(196,93,62,.04)' : 'rgba(196,93,62,.08)'
                        }}>{row.fmt ? row.fmt(productData?.[row.key]) : productData?.[row.key]}</td>
                        {selData().map(c => (
                          <td key={c.id} style={{
                            padding: '18px 24px', textAlign: 'center', fontSize: 13, color: '#4a5568',
                            borderBottom: '1px solid var(--border)',
                            background: idx % 2 === 0 ? '#fff' : 'var(--warm)'
                          }}>{row.fmt ? row.fmt(c[row.key]) : c[row.key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insights */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 28 }}>
              <div style={{
                background: '#eef4ff', borderRadius: 20, border: '1px solid #d4e0f5', padding: 28
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Eye size={16} style={{ color: '#4a6fa5' }} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#2d4a73' }}>データから見える「勝機」</span>
                </div>
                <p style={{ fontSize: 13, color: '#4a6fa5', lineHeight: 1.9 }}>
                  Yunthと価格帯が近く販売チャネルでの衝突が予想されます。Obagiとの圧倒的な単価差（約5倍以上）を活かした「継続しやすさ」が鍵。
                </p>
              </div>
              <div style={{
                background: 'var(--sage-light)', borderRadius: 20, border: '1px solid #c8ddd2', padding: 28
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <TrendingUp size={16} style={{ color: 'var(--sage)' }} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#2d5a46' }}>クリエイティブへの示唆</span>
                </div>
                <p style={{ fontSize: 13, color: '#4a7a66', lineHeight: 1.9 }}>
                  他社が「遮光瓶」「個包装」で鮮度を謳う中、自社の「クリーンでオープンな世界観」をどう視覚化し差別化するかが重要です。
                </p>
              </div>
            </div>

            <Nav nextLabel="市場マップを生成" onNext={() => setCurrentStep(4)} />
          </div>
        )}

        {/* ═══ STEP 4 ═══ */}
        {currentStep === 4 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 40 }}>
              <h2 className="font-serif" style={{ fontSize: 42, fontWeight: 700 }}>
                市場<span style={{ color: 'var(--accent)' }}>ポジショニング</span>マップ
              </h2>
              <p style={{ fontSize: 15, color: 'var(--slate-mid)', marginTop: 12 }}>
                2軸マップで自社と競合の相対位置を俯瞰し、戦略的な空白地帯を発見します。
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 28 }}>
              {/* Controls */}
              <div>
                <div style={{
                  background: 'var(--card)', borderRadius: 20, border: '1px solid var(--border)',
                  padding: 24, marginBottom: 20
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-mid)', letterSpacing: 2, display: 'block', marginBottom: 14 }}>
                    AXIS SETTING
                  </span>
                  {[
                    { key: 'price_tech', label: '価格 × 成分濃度・技術' },
                    { key: 'age_style', label: 'ターゲット年齢 × ブランド感' }
                  ].map(opt => (
                    <button key={opt.key} onClick={() => setMapAxis(opt.key)} style={{
                      display: 'block', width: '100%', padding: '14px 18px', borderRadius: 14,
                      border: 'none', textAlign: 'left', fontSize: 13, fontWeight: 600, marginBottom: 8,
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s',
                      background: mapAxis === opt.key ? 'var(--ink)' : 'var(--warm)',
                      color: mapAxis === opt.key ? '#fff' : 'var(--slate-mid)'
                    }}>
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div style={{
                  background: 'var(--ink)', borderRadius: 20, padding: 24, color: '#fff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <AlertCircle size={14} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>空白地帯の発見</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.9 }}>
                    高濃度だが手に取りやすい価格帯に競合が集中し始めています。「オーガニック × 高機能」という軸はまだ空いています。
                  </p>
                </div>

                {/* Legend */}
                <div style={{
                  marginTop: 20, background: 'var(--card)', borderRadius: 20, border: '1px solid var(--border)', padding: 20
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate-mid)', letterSpacing: 2, display: 'block', marginBottom: 14 }}>LEGEND</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 99, background: 'var(--accent)', border: '2px solid #fff', boxShadow: '0 0 0 2px var(--accent)' }} />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>自社商品</span>
                  </div>
                  {selData().map(c => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 99, background: 'var(--navy)', border: '2px solid #fff' }} />
                      <span style={{ fontSize: 11, color: 'var(--slate-mid)' }}>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div style={{
                background: 'var(--card)', borderRadius: 32, border: '1px solid var(--border)',
                padding: 48, position: 'relative', aspectRatio: '1 / .85', overflow: 'hidden',
                boxShadow: 'inset 0 2px 12px rgba(0,0,0,.04)'
              }}>
                {/* Grid */}
                <svg style={{ position: 'absolute', inset: 48, pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="50" y1="0" x2="50" y2="100" stroke="var(--border)" strokeWidth=".3" strokeDasharray="2 2" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border)" strokeWidth=".3" strokeDasharray="2 2" />
                  <line x1="25" y1="0" x2="25" y2="100" stroke="var(--border)" strokeWidth=".15" strokeDasharray="1 3" />
                  <line x1="75" y1="0" x2="75" y2="100" stroke="var(--border)" strokeWidth=".15" strokeDasharray="1 3" />
                  <line x1="0" y1="25" x2="100" y2="25" stroke="var(--border)" strokeWidth=".15" strokeDasharray="1 3" />
                  <line x1="0" y1="75" x2="100" y2="75" stroke="var(--border)" strokeWidth=".15" strokeDasharray="1 3" />
                </svg>

                {/* Axis Labels */}
                <div style={{
                  position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
                  fontSize: 10, fontWeight: 700, color: '#b0a99f', letterSpacing: 3, textTransform: 'uppercase'
                }}>
                  {mapAxis === 'price_tech' ? '高価格 (Premium)' : '高年齢層 (Mature)'}
                </div>
                <div style={{
                  position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
                  fontSize: 10, fontWeight: 700, color: '#b0a99f', letterSpacing: 3, textTransform: 'uppercase'
                }}>
                  {mapAxis === 'price_tech' ? '低価格 (Mass)' : '若年層 (Youth)'}
                </div>
                <div style={{
                  position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%) rotate(-90deg)',
                  fontSize: 10, fontWeight: 700, color: '#b0a99f', letterSpacing: 3, textTransform: 'uppercase', whiteSpace: 'nowrap'
                }}>
                  {mapAxis === 'price_tech' ? '低濃度 / 安全重視' : '日常ケア'}
                </div>
                <div style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%) rotate(90deg)',
                  fontSize: 10, fontWeight: 700, color: '#b0a99f', letterSpacing: 3, textTransform: 'uppercase', whiteSpace: 'nowrap'
                }}>
                  {mapAxis === 'price_tech' ? '高濃度 / ハイスペック' : 'スペシャルケア'}
                </div>

                {/* Dots Container */}
                <div style={{ position: 'absolute', inset: 48 }}>
                  {/* Self */}
                  <div className="map-dot" style={{
                    position: 'absolute', left: `${productData?.cx}%`, top: `${productData?.cy}%`,
                    transform: 'translate(-50%, -50%)', zIndex: 20, animation: 'float 3s ease-in-out infinite'
                  }}>
                    <div style={{
                      position: 'absolute', inset: -8, borderRadius: 99, border: '2px solid var(--accent)',
                      animation: 'pulse-ring 2s ease-out infinite', opacity: .5
                    }} />
                    <div style={{
                      width: 48, height: 48, borderRadius: 99, background: 'var(--accent)',
                      border: '3px solid #fff', boxShadow: '0 4px 20px rgba(196,93,62,.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 11, fontWeight: 700
                    }}>自社</div>
                    <div style={{
                      position: 'absolute', top: 56, left: '50%', transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap', background: 'var(--accent)', color: '#fff',
                      padding: '4px 12px', borderRadius: 8, fontSize: 10, fontWeight: 700
                    }}>{productData?.name}</div>
                  </div>

                  {/* Competitors */}
                  {selData().map(c => (
                    <div key={c.id} className="map-dot" style={{
                      position: 'absolute', left: `${c.cx}%`, top: `${c.cy}%`,
                      transform: 'translate(-50%, -50%)', zIndex: hoveredComp === c.id ? 15 : 10
                    }}
                      onMouseEnter={() => setHoveredComp(c.id)}
                      onMouseLeave={() => setHoveredComp(null)}
                    >
                      <div style={{
                        width: 38, height: 38, borderRadius: 99, background: 'var(--navy)',
                        border: '3px solid #fff', boxShadow: '0 2px 12px rgba(0,0,0,.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#94a3b8', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        transition: 'all .2s'
                      }}>{c.name[0]}</div>
                      <div className="dot-label" style={{
                        position: 'absolute', top: 46, left: '50%',
                        whiteSpace: 'nowrap', background: 'var(--ink)', color: '#fff',
                        padding: '4px 10px', borderRadius: 6, fontSize: 9, fontWeight: 600
                      }}>{c.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Nav nextLabel="戦略提言を生成" nextAccent onNext={() => setCurrentStep(5)} />
          </div>
        )}

        {/* ═══ STEP 5 ═══ */}
        {currentStep === 5 && (
          <div className="anim-fade-up">
            <div style={{ marginBottom: 40 }}>
              <h2 className="font-serif" style={{ fontSize: 42, fontWeight: 700 }}>
                <span style={{ color: 'var(--accent)' }}>勝つための</span>戦略ロードマップ
              </h2>
              <p style={{ fontSize: 15, color: 'var(--slate-mid)', marginTop: 12 }}>
                分析結果を基にした、具体的なアクションプランを提示します。
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                {
                  icon: <Package size={22} />, title: 'プロダクト改善', color: 'var(--accent)', bg: 'var(--accent-light)',
                  content: 'Obagi等の高価格帯と比較されるため、パッケージの重厚感や開封時の体験価値を高める工夫が必要。'
                },
                {
                  icon: <FileText size={22} />, title: '訴求・コピー', color: '#4a6fa5', bg: '#eef4ff',
                  content: '「高濃度」だけでなく「敏感肌でも使える高濃度」というポジションを強化。安心感をフックに。'
                },
                {
                  icon: <Target size={22} />, title: 'プロモーション', color: 'var(--sage)', bg: 'var(--sage-light)',
                  content: 'Yunthの既存客（個包装に不便を感じている層）をターゲットにした比較広告、乗り換えキャンペーン。'
                }
              ].map((card, i) => (
                <div key={i} className={`strat-card anim-fade-up delay-${i + 1}`} style={{
                  background: 'var(--card)', padding: 32, borderRadius: 24,
                  border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,.03)'
                }}>
                  <div style={{ '::before': { background: card.color } }} />
                  <div style={{
                    position: 'absolute', top: 0, left: 0, width: 4, height: '100%',
                    background: card.color, borderRadius: '24px 0 0 24px'
                  }} />
                  <div style={{
                    width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: card.bg, color: card.color, marginBottom: 20
                  }}>
                    {card.icon}
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{card.title}</h4>
                  <p style={{ fontSize: 13, color: 'var(--slate-mid)', lineHeight: 1.9 }}>{card.content}</p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="anim-fade-up delay-4" style={{
              marginTop: 36, background: 'var(--ink)', borderRadius: 32, padding: '56px 52px',
              position: 'relative', overflow: 'hidden', color: '#fff'
            }}>
              <div style={{
                position: 'absolute', top: -20, right: -20, width: 200, height: 200,
                borderRadius: 99, background: 'var(--accent)', opacity: .06
              }} />
              <div style={{
                position: 'absolute', bottom: -40, left: -40, width: 160, height: 160,
                borderRadius: 99, background: 'var(--gold)', opacity: .04
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 3, height: 36, background: 'var(--accent)', borderRadius: 99 }} />
                  <h3 className="font-serif" style={{ fontSize: 28, fontWeight: 700 }}>ストラテジストからの総括</h3>
                </div>
                <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 2.1, maxWidth: 800 }}>
                  貴社商品は、市場の「過当競争エリア」と「オーバースペックエリア」の中間に位置する
                  <span style={{
                    color: '#fff', fontWeight: 700, borderBottom: '2px solid var(--accent)', paddingBottom: 2
                  }}>「日常使いできる最高峰VC」</span>
                  としてのポジションが最も有力です。
                </p>
                <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 2.1, maxWidth: 800, marginTop: 16 }}>
                  次のステップとして、このポジショニングを元にした具体的な<strong style={{ color: '#fff' }}>LPのワイヤーフレーム案</strong>や、
                  <strong style={{ color: '#fff' }}>インフルエンサー選定の軸</strong>についてディスカッションしませんか？
                </p>
                <button style={{
                  marginTop: 36, display: 'flex', alignItems: 'center', gap: 10,
                  padding: '16px 36px', borderRadius: 14, border: 'none',
                  background: '#fff', color: 'var(--ink)', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 8px 24px rgba(0,0,0,.2)', transition: 'all .3s'
                }}>
                  <Send size={16} />
                  ディスカッションを続ける
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
