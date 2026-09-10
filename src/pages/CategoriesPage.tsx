import React from 'react';
import { useGuide } from '../context/GuideContext';
import { TALENTIO_CATEGORIES } from '../data/talentioData';
import { 
  BrainCircuit, 
  Code2, 
  Palette, 
  Cloud, 
  Smartphone, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';

const CATEGORY_DETAILS = [
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    description: 'Autonomous AI agents, RAG document pipelines, LangChain orchestration, and LLM fine-tuning.',
    subcategories: ['LLM Agents', 'RAG Pipelines', 'Vector Search', 'LangGraph', 'Python Microservices', 'OpenAI/Gemini APIs'],
    icon: BrainCircuit,
    color: 'from-violet-500 to-indigo-600',
    count: 420
  },
  {
    id: 'web-dev',
    name: 'Full-Stack Web & SaaS',
    description: 'Scalable Next.js 15, React 19, Node.js, and TypeScript SaaS platforms with Stripe billing & databases.',
    subcategories: ['React & Next.js', 'Node & Express', 'PostgreSQL & Prisma', 'Tailwind CSS', 'FastAPI & Python', 'REST & GraphQL'],
    icon: Code2,
    color: 'from-blue-500 to-cyan-600',
    count: 890
  },
  {
    id: 'ui-ux',
    name: 'UI/UX & Product Design',
    description: 'High-converting design systems, SaaS dashboards, mobile UI, and interactive prototypes in Figma.',
    subcategories: ['Figma Design Systems', 'SaaS Dashboards', 'Mobile App UI', 'Wireframing & Flows', 'Interactive Prototypes', 'User Research'],
    icon: Palette,
    color: 'from-rose-500 to-pink-600',
    count: 640
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    description: 'Enterprise AWS/GCP architecture, Kubernetes clusters, Terraform IaC, and zero-downtime CI/CD.',
    subcategories: ['Kubernetes & Docker', 'Terraform IaC', 'AWS Architecture', 'Google Cloud', 'CI/CD Pipelines', 'SOC2 Security'],
    icon: Cloud,
    color: 'from-amber-500 to-orange-600',
    count: 310
  },
  {
    id: 'mobile',
    name: 'iOS & Android Apps',
    description: 'Native and cross-platform Flutter and React Native mobile applications with 60fps animations.',
    subcategories: ['Flutter Apps', 'React Native', 'iOS Swift', 'Android Kotlin', 'Push Notifications', 'Offline Sync'],
    icon: Smartphone,
    color: 'from-emerald-500 to-teal-600',
    count: 480
  },
  {
    id: 'growth-seo',
    name: 'Growth & SEO Strategy',
    description: 'Technical SEO, programmatic search expansion, B2B conversion rate optimization, and funnel scaling.',
    subcategories: ['Technical SEO Audits', 'Programmatic SEO', 'CRO Optimization', 'GA4 Analytics', 'Ahrefs Strategy', 'B2B Funnels'],
    icon: TrendingUp,
    color: 'from-purple-500 to-fuchsia-600',
    count: 520
  },
  {
    id: 'brand-3d',
    name: 'Brand Identity & 3D',
    description: 'Visual identity systems, vector branding kits, Spline/Three.js 3D assets, and motion guidelines.',
    subcategories: ['Brand Guidelines', 'Logo Design', '3D Spline Graphics', 'Motion Design', 'Marketing Assets', 'Icon Systems'],
    icon: Layers,
    color: 'from-teal-500 to-blue-600',
    count: 390
  }
];

export const CategoriesPage: React.FC = () => {
  const { openCategoryMarketplace, setActivePage, setSearchQuery } = useGuide();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 pb-24">
      
      {/* Header Section */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#F2F0FF] text-[#3D2FD1] border border-[#A38BFF]/30">
          <Sparkles className="w-4 h-4 text-[#3D2FD1]" />
          <span>Freelance Categories &amp; Skills in Bangladesh</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#1A1633] tracking-tight font-display">
          Freelance Categories &amp; Digital Specialties in Bangladesh
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Explore top freelance specialties in Bangladesh: web development, graphic design, technical SEO, content writing, mobile apps, and video editing. Hire skilled specialists or order fixed-price gigs with milestone escrow protection.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {CATEGORY_DETAILS.map(cat => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => openCategoryMarketplace(cat.id)}
              className="group p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-[#3D2FD1]/60 shadow-sm hover:shadow-xl hover:shadow-[#3D2FD1]/10 transition-all duration-300 flex flex-col justify-between cursor-pointer space-y-6 select-none"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {cat.count}+ Gigs Available
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-black text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors font-display">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {cat.description}
                  </p>
                </div>

                {/* Subcategory Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {cat.subcategories.map(sub => (
                    <span
                      key={sub}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 group-hover:bg-[#F2F0FF] text-slate-700 group-hover:text-[#3D2FD1] transition-colors"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-[#3D2FD1]">
                <span>Browse {cat.name} Gigs</span>
                <div className="w-8 h-8 rounded-full bg-[#F2F0FF] group-hover:bg-[#3D2FD1] text-[#3D2FD1] group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
