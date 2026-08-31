import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { MONTHLY_LEADERBOARDS } from '../data/leaderboardData';
import { formatPrice } from '../utils/currency';
import { VerifiedBadge } from '../components/VerifiedBadge';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  MessageSquare, 
  ShieldCheck, 
  Zap,
  Filter,
  Users
} from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { 
    currency, 
    freelancers, 
    setSelectedFreelancer, 
    setIsHireModalOpen, 
    setActivePage,
    requireAuth,
    showToast
  } = useGuide();

  const [selectedMonthKey, setSelectedMonthKey] = useState<string>('current');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentBoard = MONTHLY_LEADERBOARDS[selectedMonthKey] || MONTHLY_LEADERBOARDS['current'];

  const filteredList = currentBoard.topFreelancers.filter(f => {
    if (selectedCategory === 'all') return true;
    return f.category === selectedCategory;
  });

  const topThree = currentBoard.topFreelancers.slice(0, 3);
  const remainingRanks = filteredList.filter(f => f.rank > 3);

  const handleFreelancerClick = (freelancerId: string) => {
    const found = freelancers.find(f => f.id === freelancerId);
    if (found) {
      setSelectedFreelancer(found);
    }
  };

  const handleHireClick = (freelancerId: string) => {
    const found = freelancers.find(f => f.id === freelancerId);
    if (found) {
      setSelectedFreelancer(found);
      setIsHireModalOpen(true);
    } else {
      if (!requireAuth('Please sign in to contact the top freelancer.')) return;
      setActivePage('chat');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#16122E] text-white border-b border-white/10 relative overflow-hidden">
        {/* Glow ambiance */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3D2FD1]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#6E5BFF]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-300 border border-amber-400/30">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Monthly Official Performance Rankings</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display text-white">
                Freelancer Leaderboard
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                Celebrating the top 10 highest-rated, verified professionals based on audited milestone escrow deliveries, client satisfaction, and response velocity.
              </p>
            </div>

            {/* Monthly Switcher Dropdown & Metric Stats */}
            <div className="p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/15 space-y-3 w-full sm:w-auto min-w-[280px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#A38BFF]" />
                  <span>Leaderboard Period</span>
                </span>
                {currentBoard.isCurrent && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    Live Score
                  </span>
                )}
              </div>

              <select
                value={selectedMonthKey}
                onChange={(e) => setSelectedMonthKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-black/60 text-white text-xs sm:text-sm font-bold border border-white/20 focus:outline-none focus:border-[#6E5BFF] cursor-pointer"
              >
                {Object.entries(MONTHLY_LEADERBOARDS).map(([key, item]) => (
                  <option key={key} value={key} className="bg-[#16122E] text-white">
                    {item.label}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Volume</span>
                  <span className="text-xs font-black text-white font-mono">
                    {formatPrice(currentBoard.totalVolumeUSD, currency)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Orders Delivered</span>
                  <span className="text-xs font-black text-emerald-400 font-mono">
                    {currentBoard.totalOrdersCompleted}+
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold pt-2">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'ai-ml', label: 'AI & Machine Learning' },
              { id: 'web-dev', label: 'Web & Full Stack' },
              { id: 'ui-ux', label: 'UI/UX & Product Design' },
              { id: 'cloud-devops', label: 'Cloud & DevOps' },
              { id: 'blockchain', label: 'Blockchain & Web3' },
              { id: 'mobile-apps', label: 'Mobile Apps' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#3D2FD1] text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* TOP 3 PODIUM / HERO HIGHLIGHT SECTION */}
        {selectedCategory === 'all' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display flex items-center gap-2">
                  <Crown className="w-6 h-6 text-amber-500" />
                  <span>Top 3 Champions of the Month</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Leading global marketplace performance with flawless milestone ratings
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              {/* Rank 2 (Silver) */}
              {topThree[1] && (
                <div className="order-2 md:order-1 rounded-3xl bg-white border-2 border-slate-300/80 p-6 sm:p-7 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-slate-400 transition-all">
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-l from-slate-200 to-slate-100 text-slate-700 text-xs font-black rounded-bl-2xl border-l border-b border-slate-300 flex items-center gap-1.5 shadow-xs">
                    <Medal className="w-4 h-4 text-slate-500" />
                    <span>#2 Silver Medalist</span>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={topThree[1].avatar}
                          alt={topThree[1].name}
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-200 shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center border-2 border-white shadow-xs">
                          2
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-base text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors">
                            {topThree[1].name}
                          </h3>
                          <VerifiedBadge size="sm" />
                        </div>
                        <p className="text-xs text-slate-500">{topThree[1].handle}</p>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">{topThree[1].countryFlag} {topThree[1].country}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium line-clamp-2">
                      {topThree[1].title}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Rating</span>
                        <div className="flex items-center justify-center gap-0.5 text-xs font-black text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{topThree[1].rating.toFixed(2)}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Orders</span>
                        <span className="text-xs font-black text-slate-800 font-mono">{topThree[1].completedOrdersCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Score</span>
                        <span className="text-xs font-black text-[#3D2FD1] font-mono">{topThree[1].monthlyScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button
                      onClick={() => handleFreelancerClick(topThree[1].freelancerId)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleHireClick(topThree[1].freelancerId)}
                      className="flex-1 py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                    >
                      Hire Now
                    </button>
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold Champion - Enlarged / Highlighted) */}
              {topThree[0] && (
                <div className="order-1 md:order-2 rounded-3xl bg-gradient-to-b from-[#FFFDF0] via-white to-[#FFFBEB] border-2 border-amber-400 shadow-2xl p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden group scale-100 md:-translate-y-2 transition-all">
                  {/* Gold Glow */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />

                  <div className="absolute top-0 right-0 px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black rounded-bl-3xl shadow-md flex items-center gap-1.5">
                    <Crown className="w-4 h-4 fill-black text-black" />
                    <span>#1 CHAMPION OF THE MONTH</span>
                  </div>

                  <div className="space-y-5 pt-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={topThree[0].avatar}
                          alt={topThree[0].name}
                          className="w-20 h-20 rounded-3xl object-cover ring-4 ring-amber-400 shadow-xl"
                        />
                        <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-black text-sm font-black flex items-center justify-center border-2 border-white shadow-md">
                          1
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-lg sm:text-xl text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors">
                            {topThree[0].name}
                          </h3>
                          <VerifiedBadge size="md" />
                        </div>
                        <p className="text-xs text-amber-700 font-bold">{topThree[0].handle}</p>
                        <p className="text-xs font-bold text-slate-700 mt-1">{topThree[0].countryFlag} {topThree[0].country}</p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                      {topThree[0].title}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-4 rounded-2xl bg-amber-100/50 border border-amber-200/80 text-center">
                      <div>
                        <span className="text-[10px] text-amber-900 font-black block uppercase">Rating</span>
                        <div className="flex items-center justify-center gap-0.5 text-sm font-black text-amber-600">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{topThree[0].rating.toFixed(2)}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-900 font-black block uppercase">Completed</span>
                        <span className="text-sm font-black text-slate-900 font-mono">{topThree[0].completedOrdersCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-900 font-black block uppercase">Score</span>
                        <span className="text-sm font-black text-amber-700 font-mono">{topThree[0].monthlyScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-3">
                    <button
                      onClick={() => handleFreelancerClick(topThree[0].freelancerId)}
                      className="flex-1 py-3 rounded-2xl bg-white border border-amber-300 hover:bg-amber-50 text-slate-900 text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleHireClick(topThree[0].freelancerId)}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#3D2FD1] text-white text-xs sm:text-sm font-black shadow-lg shadow-[#3D2FD1]/30 hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Hire Champion</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {topThree[2] && (
                <div className="order-3 rounded-3xl bg-white border-2 border-amber-600/30 p-6 sm:p-7 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-amber-600/50 transition-all">
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-l from-amber-100 to-orange-50 text-amber-900 text-xs font-black rounded-bl-2xl border-l border-b border-amber-200 flex items-center gap-1.5 shadow-xs">
                    <Medal className="w-4 h-4 text-amber-700" />
                    <span>#3 Bronze Medalist</span>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={topThree[2].avatar}
                          alt={topThree[2].name}
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-amber-100 shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center border-2 border-white shadow-xs">
                          3
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-base text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors">
                            {topThree[2].name}
                          </h3>
                          <VerifiedBadge size="sm" />
                        </div>
                        <p className="text-xs text-slate-500">{topThree[2].handle}</p>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">{topThree[2].countryFlag} {topThree[2].country}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium line-clamp-2">
                      {topThree[2].title}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Rating</span>
                        <div className="flex items-center justify-center gap-0.5 text-xs font-black text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{topThree[2].rating.toFixed(2)}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Orders</span>
                        <span className="text-xs font-black text-slate-800 font-mono">{topThree[2].completedOrdersCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Score</span>
                        <span className="text-xs font-black text-[#3D2FD1] font-mono">{topThree[2].monthlyScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button
                      onClick={() => handleFreelancerClick(topThree[2].freelancerId)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleHireClick(topThree[2].freelancerId)}
                      className="flex-1 py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                    >
                      Hire Now
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* FULL LEADERBOARD TABLE & CARDS (#4 TO #10 OR FILTERED) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1633] font-display">
                Top 10 Global Standings
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Audited performance metrics updated dynamically for {currentBoard.month} {currentBoard.year}
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-700">
              {filteredList.length} Top Ranked
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-400 text-[11px] font-extrabold uppercase tracking-wider">
                    <th className="py-4 px-4 sm:px-6 w-16 text-center">Rank</th>
                    <th className="py-4 px-4 sm:px-6">Freelancer</th>
                    <th className="py-4 px-4 sm:px-6 hidden md:table-cell">Discipline</th>
                    <th className="py-4 px-4 sm:px-6 text-center">Rating</th>
                    <th className="py-4 px-4 sm:px-6 text-center hidden sm:table-cell">Delivered</th>
                    <th className="py-4 px-4 sm:px-6 text-center">Score</th>
                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.map((f) => {
                    const isTopThree = f.rank <= 3;
                    return (
                      <tr 
                        key={f.freelancerId}
                        className={`hover:bg-slate-50/80 transition-colors group ${
                          f.rank === 1 ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-4 px-4 sm:px-6 text-center font-black">
                          {f.rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-black font-black text-xs shadow-xs">
                              1
                            </span>
                          ) : f.rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-black text-xs shadow-xs">
                              2
                            </span>
                          ) : f.rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-white font-black text-xs shadow-xs">
                              3
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono text-sm">
                              #{f.rank}
                            </span>
                          )}
                        </td>

                        {/* Freelancer Profile & Name */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={f.avatar}
                              alt={f.name}
                              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-extrabold text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors truncate">
                                  {f.name}
                                </span>
                                {f.verifiedBadge && <VerifiedBadge size="xs" />}
                                <span className="text-xs text-slate-400">{f.countryFlag}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate">{f.handle}</p>
                            </div>
                          </div>
                        </td>

                        {/* Discipline */}
                        <td className="py-4 px-4 sm:px-6 hidden md:table-cell text-slate-600 font-medium">
                          <span className="line-clamp-1">{f.title}</span>
                        </td>

                        {/* Rating */}
                        <td className="py-4 px-4 sm:px-6 text-center font-bold">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-900">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{f.rating.toFixed(2)}</span>
                            <span className="text-[10px] text-amber-700 font-normal">({f.totalReviews})</span>
                          </div>
                        </td>

                        {/* Orders */}
                        <td className="py-4 px-4 sm:px-6 text-center hidden sm:table-cell font-mono font-bold text-slate-700">
                          {f.completedOrdersCount} orders
                        </td>

                        {/* Performance Score */}
                        <td className="py-4 px-4 sm:px-6 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black font-mono bg-[#F2F0FF] text-[#3D2FD1] border border-[#A38BFF]/30">
                            <Zap className="w-3 h-3 text-[#3D2FD1]" />
                            <span>{f.monthlyScore}%</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleFreelancerClick(f.freelancerId)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Profile
                            </button>
                            <button
                              onClick={() => handleHireClick(f.freelancerId)}
                              className="px-3 py-1.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              Hire
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
