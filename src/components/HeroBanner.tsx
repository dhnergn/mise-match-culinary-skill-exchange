import React from 'react';
import { CookProfile } from '../types/exchange';
import { ArrowRight, Flame, Clock, Award, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/hero_culinary_exchange_1790895610674.jpg';

interface HeroBannerProps {
  currentUser: CookProfile;
  onExploreClick: () => void;
  onMatchEngineClick: () => void;
  directMatchCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentUser,
  onExploreClick,
  onMatchEngineClick,
  directMatchCount,
}) => {
  return (
    <section className="relative border-b border-[#E6E4DF] bg-[#F7F5F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Editorial Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#87653F]">
              <span>Culinary Barter Network</span>
              <span aria-hidden="true">·</span>
              <span>1-for-1 Skill Trading</span>
              <span aria-hidden="true">·</span>
              <span>Zero Currency Exchanged</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1C1A17] leading-[1.08] text-balance">
              Teach one culinary craft. Master another in return.
            </h1>

            <p className="text-base sm:text-lg text-[#524E44] max-w-2xl leading-relaxed">
              Trade authentic wild sourdough lamination for carbon-steel wok hei, or Japanese waterstone knife geometry for Roman egg pasta emulsions. Connect directly with passionate cooks for hands-on kitchen exchanges.
            </p>

            {/* Currently logged-in barter stance */}
            <div className="p-4 bg-[#EFECE5] rounded-lg border border-[#E0DCD3] space-y-2.5 max-w-xl">
              <div className="flex items-center justify-between text-xs text-[#6B6559]">
                <span className="font-medium text-[#2E2B25]">Your Active Barter Stance</span>
                <span>Logged in as {currentUser.name}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#787164] block">You Offer to Teach:</span>
                  <span className="font-semibold text-[#1C1A17] truncate block">
                    {currentUser.teachingSkills[0]?.title || 'None listed yet'}
                  </span>
                </div>
                <div>
                  <span className="text-[#787164] block">You Seek to Learn:</span>
                  <span className="font-semibold text-[#1C1A17] truncate block">
                    {currentUser.wantedSkills[0]?.title || 'Open to all crafts'}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onMatchEngineClick}
                className="px-5 py-3 text-sm font-semibold text-[#FBFBF9] bg-[#1C1A17] hover:bg-[#33302B] rounded-md transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Find Matches for You</span>
                {directMatchCount > 0 && (
                  <span className="px-1.5 py-0.5 text-xs font-mono tabular-nums bg-amber-600 text-white rounded">
                    {directMatchCount} Instant
                  </span>
                )}
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={onExploreClick}
                className="px-5 py-3 text-sm font-medium text-[#1C1A17] bg-[#FFFFFF] hover:bg-[#F2EFE8] border border-[#DDD9CE] rounded-md transition-colors cursor-pointer"
              >
                Browse All 1-for-1 Exchanges
              </button>
            </div>

            {/* Claim-to-Proof Adjacency */}
            <div className="pt-4 border-t border-[#E5E1D7] flex flex-wrap items-center gap-y-3 gap-x-8 text-xs text-[#666053]">
              <div>
                <span className="font-bold text-[#1C1A17] font-mono tabular-nums text-sm">124</span>
                <span className="ml-1.5">Completed Swaps</span>
              </div>
              <div className="hidden sm:block text-[#D1CCC2]" aria-hidden="true">/</div>
              <div>
                <span className="font-bold text-[#1C1A17] font-mono tabular-nums text-sm">100%</span>
                <span className="ml-1.5">Free Culinary Barters</span>
              </div>
              <div className="hidden sm:block text-[#D1CCC2]" aria-hidden="true">/</div>
              <div>
                <span className="font-bold text-[#1C1A17] font-mono tabular-nums text-sm">4.97 / 5.0</span>
                <span className="ml-1.5">Average Mentor Rating</span>
              </div>
            </div>
          </div>

          {/* Right Image Showcase Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-[#DCD7CB] bg-[#EFECE5] shadow-sm">
              <img
                src={heroImg}
                alt="Artisanal kitchen exchange table with sourdough and pasta ribbons"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase tracking-wider text-amber-200 font-semibold mb-1">
                  Community Spotlight
                </span>
                <h3 className="font-editorial text-2xl font-bold text-white leading-snug">
                  The Sourdough &amp; Wok Hei Exchange
                </h3>
                <p className="text-xs text-stone-200 mt-1 line-clamp-2">
                  Marco (Brooklyn) and Kenji (Queens) swapped croissant butter lamination for high-heat carbon steel flame tossing.
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-stone-300">
                  <span>2.5 hours hands-on</span>
                  <span aria-hidden="true">·</span>
                  <span>Both earned Master Endorsement</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
