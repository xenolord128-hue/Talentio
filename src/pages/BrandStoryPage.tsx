import React, { useEffect, useRef, useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { ArrowLeft, Copy, Check, ExternalLink, Sparkles, Compass } from 'lucide-react';

const TALENTIO_OFFICIAL_LOGO = 'https://i.ibb.co.com/qL4p0XjC/Picsart-26-11-06-08-52-47-568.jpg';
const TALENTIO_OFFICIAL_LINK = 'https://ibb.co.com/qL4p0XjC';

interface ColorCardItem {
  name: string;
  code: string;
  role: string;
  color: string;
}

const BRAND_COLORS: ColorCardItem[] = [
  { name: 'Midnight', code: '#1A1633', role: 'Foundation & Spatial Canvas', color: '#1A1633' },
  { name: 'Indigo', code: '#3D2FD1', role: 'Security & Escrow Depth', color: '#3D2FD1' },
  { name: 'Primary Purple', code: '#6E5BFF', role: 'Vibrant Innovation & Energy', color: '#6E5BFF' },
  { name: 'Lavender', code: '#A38BFF', role: 'Refined Elegance & Precision', color: '#A38BFF' },
];

export const BrandStoryPage: React.FC = () => {
  const { setActivePage, isAuthenticated, user } = useGuide();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [showEntry, setShowEntry] = useState(true);
  const [currentSection, setCurrentSection] = useState(1);
  const totalSections = 7;
  const containerRef = useRef<HTMLDivElement>(null);

  // Entry splash auto-dismiss after reveal
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEntry(false);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  // IntersectionObserver for scroll reveal animations & section counter
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reveals = container.querySelectorAll<HTMLElement>('.story-reveal');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    reveals.forEach((el) => revealObserver.observe(el));

    // Section tracker
    const sections = container.querySelectorAll<HTMLElement>('section[data-chapter]');
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chapter = entry.target.getAttribute('data-chapter');
            if (chapter) {
              const num = parseInt(chapter, 10);
              if (!isNaN(num)) setCurrentSection(num);
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => sectionObserver.observe(s));

    // Manifesto highlight observer
    const manifesto = container.querySelector<HTMLElement>('.manifesto-section');
    let manifestoObserver: IntersectionObserver | null = null;
    if (manifesto) {
      manifestoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              manifesto.classList.add('manifesto-active');
            } else {
              manifesto.classList.remove('manifesto-active');
            }
          });
        },
        { threshold: 0.4 }
      );
      manifestoObserver.observe(manifesto);
    }

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      if (manifestoObserver) manifestoObserver.disconnect();
    };
  }, []);

  // Mouse parallax for ambient glow orbs
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const orbs = document.querySelectorAll<HTMLElement>('.story-ambient');
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 14;
        orb.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0)`;
      });
    };

    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedHex(code);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleReturnHome = () => {
    if (isAuthenticated && user) {
      setActivePage('home');
    } else {
      setActivePage('explore');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#0d0920] text-[#F2F0FF] overflow-x-hidden selection:bg-[#6E5BFF] selection:text-white"
      style={{
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* Dynamic Background Noise & Ambient Lighting Gradients */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
        style={{
          background: 'radial-gradient(circle at 50% -10%, rgba(110,91,255,0.20), transparent 40%), radial-gradient(circle at 15% 25%, rgba(61,47,209,0.15), transparent 30%), radial-gradient(circle at 85% 65%, rgba(163,139,255,0.10), transparent 28%), #0d0920'
        }}
      />

      {/* Geometric Subtitle Grid Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '70px 70px',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)'
        }}
      />

      {/* Ambient Floating Orbs */}
      <div className="story-ambient pointer-events-none fixed -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-[#6E5BFF] opacity-15 blur-[110px] z-0 transition-transform duration-300 ease-out" />
      <div className="story-ambient pointer-events-none fixed top-[35%] -right-48 w-[450px] h-[450px] rounded-full bg-[#A38BFF] opacity-15 blur-[120px] z-0 transition-transform duration-300 ease-out" />
      <div className="story-ambient pointer-events-none fixed -bottom-48 left-[30%] w-[420px] h-[420px] rounded-full bg-[#3D2FD1] opacity-20 blur-[120px] z-0 transition-transform duration-300 ease-out" />

      {/* =========================================================================
          1. INTRO SPLASH OVERLAY
          ========================================================================= */}
      {showEntry && (
        <div 
          onClick={() => setShowEntry(false)}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-1000 ease-out bg-[#080611]/95 backdrop-blur-xl"
        >
          <div className="text-center px-4">
            <p className="text-[10px] tracking-[6px] font-bold text-[#A38BFF]/70 uppercase mb-8 animate-pulse">
              A VISUAL IDENTITY STORY
            </p>

            {/* Official Logo */}
            <div className="inline-block transform transition-transform duration-700 hover:scale-105">
              <a href={TALENTIO_OFFICIAL_LINK} className="brand-story-link">
                <img 
                  src={TALENTIO_OFFICIAL_LOGO} 
                  alt="Talentio Official Mark" 
                  border="0"
                  className="brand-story-img w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-2xl shadow-[0_0_80px_rgba(110,91,255,0.45)] ring-1 ring-white/10"
                />
              </a>
            </div>

            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#A38BFF] to-transparent mx-auto my-6" />

            <p className="text-[10px] tracking-[4px] text-white/50 font-medium">
              TALENTIO — BEHIND THE MARK
            </p>
            <p className="text-[9px] text-[#A38BFF]/40 tracking-widest mt-4">
              Click anywhere to continue
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. FLOATING NAVIGATION BAR
          ========================================================================= */}
      <header className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 w-[94%] max-w-[1240px] px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-[#0d0920]/75 border border-white/10 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.45)] z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleReturnHome}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all text-xs font-semibold border border-white/5"
            title="Return to Marketplace"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6E5BFF] shadow-[0_0_12px_#6E5BFF] animate-ping" />
            <span className="font-['Manrope'] text-[11px] sm:text-xs font-extrabold tracking-[2px] text-white">
              TALENTIO
            </span>
            <span className="text-[10px] tracking-widest text-[#A38BFF]/70 hidden md:inline">
              BRAND STORY
            </span>
          </div>
        </div>

        {/* Dynamic Section Indicator */}
        <div className="font-['JetBrains_Mono'] text-[11px] sm:text-xs tracking-[3px] text-white/60 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
          {String(currentSection).padStart(2, '0')} <span className="text-[#6E5BFF] font-bold">—</span> {String(totalSections).padStart(2, '0')}
        </div>

        {/* Enter Website CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReturnHome}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6E5BFF] to-[#3D2FD1] hover:brightness-110 text-white text-[10px] sm:text-xs font-bold tracking-[1.5px] uppercase shadow-[0_10px_30px_rgba(110,91,255,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Enter App</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          CHAPTER 01: HERO SECTION
          ========================================================================= */}
      <section 
        data-chapter="1"
        className="relative min-h-[100svh] pt-32 sm:pt-40 pb-20 px-6 sm:px-12 flex flex-col items-center justify-center text-center z-10"
      >
        <div className="story-reveal max-w-4xl mx-auto flex flex-col items-center">
          <span className="font-['Manrope'] text-[10px] sm:text-xs font-bold tracking-[5px] uppercase text-[#A38BFF]/80 mb-6 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
            The Story Behind The Mark
          </span>

          <h1 className="font-['Manrope'] text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight leading-[0.92] text-white">
            Every mark <br />
            <span className="font-['Playfair_Display'] italic font-medium text-[#F2F0FF]/85">
              has a reason.
            </span>
          </h1>

          {/* Central Hero Logo Display */}
          <div className="relative my-10 sm:my-14 group">
            <div className="absolute inset-0 rounded-full bg-[#6E5BFF]/30 blur-[60px] transform group-hover:scale-125 transition-transform duration-700" />
            <div className="relative p-2 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_30px_90px_rgba(110,91,255,0.3)]">
              <a href={TALENTIO_OFFICIAL_LINK} className="brand-story-link block">
                <img 
                  src={TALENTIO_OFFICIAL_LOGO} 
                  alt="Talentio Official Logo" 
                  border="0"
                  className="brand-story-img w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </a>
            </div>
          </div>

          <p className="max-w-xl text-base sm:text-lg text-white/70 leading-relaxed font-normal">
            Behind every recognizable identity is an idea, a decision, and a reason. This is the story of how a visual mark becomes the anchor of modern talent collaboration.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-[9px] tracking-[4px] uppercase">
          <span>Scroll to Explore</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#A38BFF] to-transparent animate-pulse" />
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 02: THE BEGINNING
          ========================================================================= */}
      <section 
        data-chapter="2"
        className="relative min-h-[90vh] py-24 sm:py-36 px-6 sm:px-14 border-t border-white/5 flex items-center z-10"
      >
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 items-center">
          <div className="md:col-span-5 story-reveal flex justify-center md:justify-start">
            <span className="font-['Manrope'] text-7xl sm:text-9xl md:text-[180px] font-extrabold text-[#A38BFF]/10 select-none leading-none tracking-tighter">
              01
            </span>
          </div>

          <div className="md:col-span-7 story-reveal">
            <span className="font-['Manrope'] text-[10px] font-bold tracking-[4px] uppercase text-[#A38BFF] mb-4 block">
              The Beginning
            </span>
            <h2 className="font-['Manrope'] text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              Before it became <br />
              <span className="font-['Playfair_Display'] italic font-medium text-[#A38BFF]">
                a symbol.
              </span>
            </h2>
            <div className="space-y-4 text-white/70 text-base sm:text-lg leading-relaxed max-w-xl">
              <p>
                The identity began with a simple idea: create something that could represent the character of the brand without needing unnecessary complexity.
              </p>
              <p>
                The result is a visual language designed to feel distinctive, modern, and instantly recognizable — built to inspire trust between clients and global creators across every milestone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 03: THE SYMBOL & STAGE
          ========================================================================= */}
      <section 
        data-chapter="3"
        className="relative min-h-[100vh] py-24 sm:py-36 px-6 sm:px-14 border-t border-white/5 flex flex-col items-center justify-center text-center z-10"
      >
        <div className="story-reveal max-w-5xl mx-auto w-full">
          <span className="font-['Manrope'] text-[10px] font-bold tracking-[4px] uppercase text-[#A38BFF] mb-4 inline-block">
            02 — The Symbol
          </span>
          <h2 className="font-['Manrope'] text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-10">
            More than <span className="font-['Playfair_Display'] italic text-[#A38BFF]">a logo.</span>
          </h2>

          {/* Glass Stage */}
          <div className="relative mx-auto max-w-3xl min-h-[380px] sm:min-h-[480px] rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 p-8 sm:p-14 flex items-center justify-center overflow-hidden shadow-[0_35px_100px_rgba(0,0,0,0.4)] group">
            {/* Ambient Radial Spotlight */}
            <div className="absolute w-80 h-80 rounded-full bg-[#6E5BFF]/25 blur-[50px] pointer-events-none group-hover:scale-125 transition-transform duration-700" />
            
            {/* Logo Display with Exact HTML Link */}
            <a href={TALENTIO_OFFICIAL_LINK} className="brand-story-link relative z-10 transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-2">
              <img 
                src={TALENTIO_OFFICIAL_LOGO} 
                alt="Talentio Official Mark" 
                border="0"
                className="brand-story-img w-48 sm:w-72 md:w-80 object-contain rounded-2xl shadow-[0_40px_100px_rgba(110,91,255,0.35)] ring-1 ring-white/10"
              />
            </a>
          </div>

          <p className="max-w-2xl mx-auto mt-10 text-base sm:text-lg text-white/70 leading-relaxed">
            The mark is intentionally minimal enough to remain unforgettable, yet deeply structured to carry the identity of the brand across digital platforms, high-stakes escrow deals, and enterprise workflows.
          </p>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 04: CONSTRUCTION & GEOMETRY
          ========================================================================= */}
      <section 
        data-chapter="4"
        className="relative min-h-[100vh] py-24 sm:py-36 px-6 sm:px-14 border-t border-white/5 flex flex-col items-center justify-center z-10"
      >
        <div className="story-reveal max-w-5xl mx-auto w-full">
          <span className="font-['Manrope'] text-[10px] font-bold tracking-[4px] uppercase text-[#A38BFF] mb-4 inline-block">
            03 — Construction & Precision
          </span>
          <h2 className="font-['Manrope'] text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-10">
            Designed with <span className="font-['Playfair_Display'] italic text-[#A38BFF]">intention.</span>
          </h2>

          {/* Blueprint Construction Canvas */}
          <div className="relative min-h-[380px] sm:min-h-[500px] rounded-3xl bg-[#090717]/80 border border-white/10 p-8 flex items-center justify-center overflow-hidden shadow-2xl">
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(rgba(163,139,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(163,139,255,0.08) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />

            {/* Crosshair Center Lines */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#A38BFF]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#A38BFF]/40 to-transparent pointer-events-none" />

            {/* Blueprint Annotations */}
            <div className="absolute top-6 right-6 font-['JetBrains_Mono'] text-[9px] tracking-[3px] text-[#A38BFF]/60 uppercase border border-white/10 px-3 py-1 rounded bg-black/40">
              PROPORTION / BALANCE
            </div>
            <div className="absolute bottom-6 left-6 font-['JetBrains_Mono'] text-[9px] tracking-[3px] text-[#A38BFF]/60 uppercase border border-white/10 px-3 py-1 rounded bg-black/40">
              STRUCTURE / PRECISION
            </div>

            {/* Logo in Construction */}
            <div className="relative z-10 p-4 rounded-2xl bg-black/50 border border-[#6E5BFF]/30 backdrop-blur-sm">
              <a href={TALENTIO_OFFICIAL_LINK} className="brand-story-link block">
                <img 
                  src={TALENTIO_OFFICIAL_LOGO} 
                  alt="Logo Construction" 
                  border="0"
                  className="brand-story-img w-40 sm:w-64 md:w-72 object-contain rounded-xl shadow-2xl"
                />
              </a>
            </div>
          </div>

          <p className="max-w-2xl mx-auto mt-10 text-base sm:text-lg text-white/70 leading-relaxed text-center">
            Every visual detail has a mathematical role. Proportion creates balance, spacing creates clarity, and the overall silhouette commands instant recognition at any scale.
          </p>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 05: COLOR PALETTE SYSTEM
          ========================================================================= */}
      <section 
        data-chapter="5"
        className="relative min-h-[100vh] py-24 sm:py-36 px-6 sm:px-14 border-t border-white/5 flex flex-col items-center justify-center z-10"
      >
        <div className="story-reveal max-w-5xl mx-auto w-full">
          <span className="font-['Manrope'] text-[10px] font-bold tracking-[4px] uppercase text-[#A38BFF] mb-4 inline-block">
            04 — Color System
          </span>
          <h2 className="font-['Manrope'] text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Color gives the mark <br />
            <span className="font-['Playfair_Display'] italic text-[#A38BFF]">its voice.</span>
          </h2>
          <p className="max-w-xl text-base sm:text-lg text-white/70 mb-12">
            The visual palette fuses deep spatial tones with vibrant purple hues, symbolizing technical mastery, escrow security, and creative excellence.
          </p>

          {/* Color Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRAND_COLORS.map((c) => {
              const isCopied = copiedHex === c.code;
              return (
                <div 
                  key={c.code}
                  onClick={() => handleCopy(c.code)}
                  className="relative group p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#6E5BFF]/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden shadow-lg flex flex-col justify-between h-64"
                >
                  {/* Color Glow */}
                  <div 
                    className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-300"
                    style={{ backgroundColor: c.color }}
                  />

                  <div className="flex items-center justify-between">
                    <div 
                      className="w-10 h-10 rounded-xl shadow-md border border-white/20"
                      style={{ backgroundColor: c.color }}
                    />
                    <button 
                      className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white transition-colors"
                      title="Copy HEX"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-['Manrope'] text-xl font-bold text-white mb-1">
                      {c.name}
                    </h3>
                    <p className="text-xs text-white/50 mb-3 font-mono">
                      {c.code}
                    </p>
                    <p className="text-xs text-[#A38BFF]/70">
                      {c.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 06: TYPOGRAPHY
          ========================================================================= */}
      <section 
        data-chapter="6"
        className="relative min-h-[90vh] py-24 sm:py-36 px-6 sm:px-14 border-t border-white/5 flex items-center z-10"
      >
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 items-center">
          <div className="md:col-span-6 story-reveal">
            <span className="font-['Manrope'] text-[10px] font-bold tracking-[4px] uppercase text-[#A38BFF] mb-4 block">
              05 — Typography
            </span>
            <h2 className="font-['Manrope'] text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              Every letter carries <br />
              <span className="font-['Playfair_Display'] italic text-[#A38BFF]">
                character.
              </span>
            </h2>
            <div className="space-y-4 text-white/70 text-base sm:text-lg leading-relaxed max-w-xl">
              <p>
                Typography is treated as an architectural foundation rather than superficial decoration.
              </p>
              <p>
                Geometric sans-serif forms create a high-precision digital aura, while subtle editorial serifs evoke legacy prestige, craft, and human artistry.
              </p>
            </div>
          </div>

          <div className="md:col-span-6 story-reveal">
            <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 shadow-2xl text-center space-y-4">
              <div className="font-['Manrope'] text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-[#F2F0FF]">
                TALENTIO
              </div>
              <div className="font-['Playfair_Display'] italic text-2xl sm:text-3xl text-[#A38BFF]">
                Escrow Marketplace
              </div>
              <div className="pt-4 text-xs tracking-[4px] uppercase font-['JetBrains_Mono'] text-white/40">
                MANROPE 800 + PLAYFAIR DISPLAY
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 07: MANIFESTO & THE MARK
          ========================================================================= */}
      <section 
        data-chapter="7"
        className="manifesto-section relative min-h-[100vh] py-24 sm:py-36 px-6 sm:px-14 border-t border-white/5 flex flex-col items-center justify-center text-center z-10"
      >
        <div className="story-reveal max-w-5xl mx-auto w-full">
          <span className="font-['Manrope'] text-[10px] font-bold tracking-[4px] uppercase text-[#A38BFF] mb-6 inline-block">
            06 — The Manifesto
          </span>

          <div className="font-['Manrope'] text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-white">
            A simple mark. <br />
            <span className="manifesto-dim text-white/30 transition-colors duration-700">
              A clear idea.
            </span> <br />
            A distinctive identity. <br />
            <span className="manifesto-dim text-white/30 transition-colors duration-700">
              Built to be remembered.
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINALE: THE COMPLETE IDENTITY & ENTER CTA
          ========================================================================= */}
      <section className="relative min-h-[90vh] py-24 sm:py-36 px-6 sm:px-14 border-t border-white/5 flex flex-col items-center justify-center text-center z-10">
        <div className="story-reveal max-w-4xl mx-auto flex flex-col items-center">
          <span className="font-['Manrope'] text-[10px] font-bold tracking-[4px] uppercase text-[#A38BFF] mb-6 inline-block">
            The Story Continues
          </span>

          {/* Final Logo */}
          <div className="relative my-8 group">
            <div className="absolute inset-0 rounded-full bg-[#6E5BFF]/35 blur-[70px] pointer-events-none group-hover:scale-125 transition-transform duration-700" />
            <a href={TALENTIO_OFFICIAL_LINK} className="brand-story-link relative z-10 block">
              <img 
                src={TALENTIO_OFFICIAL_LOGO} 
                alt="Picsart-26-11-06-08-52-47-568" 
                border="0"
                className="brand-story-img w-40 sm:w-56 md:w-64 object-contain rounded-2xl shadow-[0_35px_90px_rgba(110,91,255,0.4)] transition-transform duration-500 group-hover:scale-105"
              />
            </a>
          </div>

          <h2 className="font-['Manrope'] text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Built with purpose. <br />
            <span className="font-['Playfair_Display'] italic text-[#A38BFF]">
              Designed to be remembered.
            </span>
          </h2>

          <p className="max-w-xl text-base sm:text-lg text-white/70 mb-10">
            Welcome to Talentio — Bangladesh&apos;s premier freelance platform powering world-class careers and next-generation products.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleReturnHome}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#6E5BFF] via-[#5A45FF] to-[#3D2FD1] hover:brightness-110 text-white font-['Manrope'] text-xs font-bold tracking-[3px] uppercase shadow-[0_20px_50px_rgba(110,91,255,0.4)] transition-all hover:-translate-y-1"
            >
              Enter Website
            </button>
            <a
              href={TALENTIO_OFFICIAL_LINK}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-['Manrope'] text-xs font-bold tracking-[2px] uppercase border border-white/10 transition-all hover:-translate-y-1"
            >
              <span>View Source Mark</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="py-10 px-6 border-t border-white/5 text-center text-white/30 text-[10px] tracking-[4px] uppercase font-['JetBrains_Mono'] z-10 relative">
        © 2026 TALENTIO — BEHIND THE MARK • ALL RIGHTS RESERVED
      </footer>

      {/* Embedded CSS for smooth reveals and manifesto highlights */}
      <style>{`
        .story-reveal {
          opacity: 0;
          transform: translateY(45px);
          filter: blur(4px);
          transition: opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 1.1s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 1s ease;
        }
        .story-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
        .manifesto-active .manifesto-dim {
          color: rgba(242, 240, 255, 0.85) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .story-reveal {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BrandStoryPage;
