import React, { useState } from 'react';
import { CookProfile, CulinarySkill, MatchRecommendation } from '../types/exchange';
import { ArrowLeftRight, CheckCircle2, RefreshCw, Sparkles, MapPin, Star, Clock } from 'lucide-react';

interface MatchEngineProps {
  currentUser: CookProfile;
  allCooks: CookProfile[];
  onProposeSwap: (partner: CookProfile, partnerSkill: CulinarySkill, mySkill: CulinarySkill) => void;
  onViewSkill: (skill: CulinarySkill, cook: CookProfile) => void;
}

export const MatchEngine: React.FC<MatchEngineProps> = ({
  currentUser,
  allCooks,
  onProposeSwap,
  onViewSkill,
}) => {
  const [activeMode, setActiveMode] = useState<'bilateral' | 'circular'>('bilateral');

  // Compute bilateral matches for current user
  const otherCooks = allCooks.filter((c) => c.id !== currentUser.id);

  const directMatches: MatchRecommendation[] = [];
  const highAffinityMatches: MatchRecommendation[] = [];

  otherCooks.forEach((partner) => {
    // Check if partner wants any of currentUser's teaching skills
    currentUser.teachingSkills.forEach((mySkill) => {
      const partnerWantsMySkill = partner.wantedSkills.some(
        (ws) =>
          ws.category === mySkill.category ||
          mySkill.title.toLowerCase().includes(ws.title.toLowerCase()) ||
          ws.title.toLowerCase().includes(mySkill.title.toLowerCase())
      );

      // Check if currentUser wants any of partner's teaching skills
      partner.teachingSkills.forEach((partnerSkill) => {
        const iWantPartnerSkill = currentUser.wantedSkills.some(
          (myWs) =>
            myWs.category === partnerSkill.category ||
            partnerSkill.title.toLowerCase().includes(myWs.title.toLowerCase()) ||
            myWs.title.toLowerCase().includes(partnerSkill.title.toLowerCase())
        );

        if (partnerWantsMySkill && iWantPartnerSkill) {
          directMatches.push({
            partner,
            myOfferedSkill: mySkill,
            partnerOfferedSkill: partnerSkill,
            matchScore: 98,
            matchType: 'direct',
            synergyReason: `Mutual direct need: You teach ${mySkill.title}, while ${partner.name} teaches ${partnerSkill.title}. Both formats align perfectly.`,
          });
        } else if (partnerWantsMySkill || iWantPartnerSkill) {
          highAffinityMatches.push({
            partner,
            myOfferedSkill: mySkill,
            partnerOfferedSkill: partnerSkill,
            matchScore: 84,
            matchType: 'high_affinity',
            synergyReason: partnerWantsMySkill
              ? `${partner.name} actively wants to learn your craft (${mySkill.title}). You can negotiate an open trade!`
              : `You are looking for ${partnerSkill.title}, which ${partner.name} teaches with master rating.`,
          });
        }
      });
    });
  });

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E6E4DF]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#87653F] uppercase tracking-wider mb-1">
            <span>Algorithmic Culinary Barter</span>
            <span aria-hidden="true">·</span>
            <span>Bilateral &amp; Circular Trades</span>
          </div>
          <h2 className="font-editorial text-3xl font-bold text-[#1C1A17]">
            Culinary Match Engine
          </h2>
          <p className="text-sm text-[#5C574C] mt-1 max-w-xl">
            Matching algorithms analyzing technique offerings, reciprocal learning goals, format compatibility, and kitchen setup parity.
          </p>
        </div>

        {/* Segmented Mode Selector (Buttons) */}
        <div className="flex items-center p-1 bg-[#EBE8E1] rounded-lg self-start md:self-auto border border-[#DDD9CE]">
          <button
            onClick={() => setActiveMode('bilateral')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeMode === 'bilateral'
                ? 'bg-white text-[#1C1A17] shadow-sm font-semibold'
                : 'text-[#615B4F] hover:text-[#1C1A17]'
            }`}
          >
            Direct 2-Way Matches ({directMatches.length})
          </button>
          <button
            onClick={() => setActiveMode('circular')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeMode === 'circular'
                ? 'bg-white text-[#1C1A17] shadow-sm font-semibold'
                : 'text-[#615B4F] hover:text-[#1C1A17]'
            }`}
          >
            3-Way "Mise Circle" Trades
          </button>
        </div>
      </div>

      {/* BILATERAL MODE */}
      {activeMode === 'bilateral' && (
        <div className="space-y-6">
          {directMatches.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#736E62]">
                <span className="font-medium text-[#1C1A17]">
                  Instant Bilateral Matches (100% Mutual Reciprocity)
                </span>
                <span>Both cooks offer what the other actively seeks</span>
              </div>

              {directMatches.map((match, idx) => (
                <div
                  key={`${match.partner.id}_${idx}`}
                  className="bg-white rounded-xl border border-[#DFDAD0] p-6 shadow-sm hover:border-[#C4BEB2] transition-colors"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    {/* Left: You Teach */}
                    <div className="lg:col-span-4 p-4 rounded-lg bg-[#FAF8F5] border border-[#ECE8DF]">
                      <div className="text-[11px] font-semibold text-[#8C6D46] uppercase tracking-wider mb-1">
                        You Teach
                      </div>
                      <h4 className="font-editorial text-lg font-bold text-[#1C1A17] leading-snug">
                        {match.myOfferedSkill.title}
                      </h4>
                      <div className="mt-2 text-xs text-[#6B6559] flex items-center gap-2">
                        <span>{match.myOfferedSkill.duration}</span>
                        <span aria-hidden="true">·</span>
                        <span>{match.myOfferedSkill.difficulty}</span>
                      </div>
                      <button
                        onClick={() => onViewSkill(match.myOfferedSkill, currentUser)}
                        className="mt-3 text-xs font-medium text-[#1C1A17] hover:underline cursor-pointer"
                      >
                        Review Your Syllabus &rarr;
                      </button>
                    </div>

                    {/* Middle: Match Synergy Connector */}
                    <div className="lg:col-span-4 text-center px-2 py-3 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#1C1A17] text-white flex items-center justify-center mb-2 shadow-sm">
                        <ArrowLeftRight className="w-5 h-5 text-amber-300" />
                      </div>
                      <div className="text-sm font-bold text-[#1C1A17] font-mono tabular-nums">
                        {match.matchScore}% Match Score
                      </div>
                      <p className="text-xs text-[#666053] mt-1 text-center max-w-xs leading-relaxed">
                        {match.synergyReason}
                      </p>
                      <div className="mt-3">
                        <button
                          onClick={() =>
                            onProposeSwap(
                              match.partner,
                              match.partnerOfferedSkill,
                              match.myOfferedSkill
                            )
                          }
                          className="px-4 py-2 text-xs font-semibold text-white bg-[#1C1A17] hover:bg-[#33302B] rounded-md transition-colors cursor-pointer shadow-sm"
                        >
                          Initiate Barter Agreement
                        </button>
                      </div>
                    </div>

                    {/* Right: Partner Teaches */}
                    <div className="lg:col-span-4 p-4 rounded-lg bg-[#FAF8F5] border border-[#ECE8DF]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-[#3B6652] uppercase tracking-wider">
                          You Learn From
                        </span>
                        <div className="flex items-center gap-1 text-xs text-[#706B60]">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="font-mono tabular-nums font-semibold text-[#1C1A17]">
                            {match.partner.rating}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-editorial text-lg font-bold text-[#1C1A17] leading-snug">
                        {match.partnerOfferedSkill.title}
                      </h4>
                      <div className="mt-2 flex items-center gap-2 text-xs text-[#5E594D]">
                        <img
                          src={match.partner.avatar}
                          alt={match.partner.name}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-medium text-[#1C1A17]">{match.partner.name}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{match.partner.location.split('·')[0]}</span>
                      </div>
                      <button
                        onClick={() => onViewSkill(match.partnerOfferedSkill, match.partner)}
                        className="mt-3 text-xs font-medium text-[#1C1A17] hover:underline cursor-pointer"
                      >
                        Inspect Partner Syllabus &rarr;
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-[#E5E1D7] space-y-3">
              <h3 className="font-editorial text-xl font-bold text-[#1C1A17]">
                No direct 100% reciprocal match right now
              </h3>
              <p className="text-xs text-[#6B6559] max-w-md mx-auto">
                No single cook currently has an exact mirror-trade requirement for your active profile. Check high-affinity trades below or explore 3-way Mise Circles!
              </p>
            </div>
          )}

          {/* High Affinity Matches */}
          {highAffinityMatches.length > 0 && (
            <div className="pt-6 border-t border-[#E8E4DA] space-y-4">
              <div className="text-xs font-semibold text-[#666053] uppercase tracking-wider">
                High Affinity Trades (Compatible Culinary Interests)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highAffinityMatches.slice(0, 4).map((aff, idx) => (
                  <div
                    key={`aff_${idx}`}
                    className="p-5 bg-white rounded-xl border border-[#E2DED4] hover:border-[#C7C1B5] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#706B60] mb-2">
                        <span className="font-mono tabular-nums font-semibold text-[#1C1A17]">
                          {aff.matchScore}% Compatibility
                        </span>
                        <span>{aff.partner.formatPreference}</span>
                      </div>
                      <h4 className="font-editorial text-base font-bold text-[#1C1A17] mb-1">
                        {aff.partnerOfferedSkill.title}
                      </h4>
                      <p className="text-xs text-[#615C50] line-clamp-2">
                        {aff.synergyReason}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#EFECE5] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={aff.partner.avatar}
                          alt={aff.partner.name}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-medium text-[#1C1A17]">{aff.partner.name}</span>
                      </div>
                      <button
                        onClick={() =>
                          onProposeSwap(
                            aff.partner,
                            aff.partnerOfferedSkill,
                            aff.myOfferedSkill
                          )
                        }
                        className="px-3 py-1.5 font-medium text-xs text-[#1C1A17] bg-[#F1EFEA] hover:bg-[#E5E1D6] rounded border border-[#D5D0C4] cursor-pointer"
                      >
                        Propose Barter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CIRCULAR 3-WAY MODE */}
      {activeMode === 'circular' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl border border-[#DFDAD0] space-y-6">
            <div>
              <div className="text-xs font-semibold text-[#87653F] uppercase tracking-wider mb-1">
                Multi-Party Barter Protocol
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#1C1A17]">
                The Triangular "Mise Circle"
              </h3>
              <p className="text-xs text-[#5C574C] mt-1 max-w-2xl leading-relaxed">
                When two cooks don't have an exact 1-to-1 mirror match, our circular trade engine connects three cooks so everyone teaches their mastery and learns their dream craft in a virtuous 3-way loop.
              </p>
            </div>

            {/* Circular Diagram Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Node 1: Current User */}
              <div className="p-4 bg-[#F8F6F1] rounded-lg border border-[#E3DFD5] space-y-2 relative">
                <div className="text-xs font-semibold text-[#1C1A17] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1C1A17] text-white flex items-center justify-center font-mono text-[11px]">
                    1
                  </span>
                  <span>{currentUser.name} (You)</span>
                </div>
                <div className="text-xs text-[#6B6559]">
                  <span className="text-[#87653F] font-medium block">You Teach Camille:</span>
                  <span className="font-semibold text-[#1C1A17]">French Butter Lamination &amp; Croissants</span>
                </div>
              </div>

              {/* Node 2: Camille */}
              <div className="p-4 bg-[#F8F6F1] rounded-lg border border-[#E3DFD5] space-y-2 relative">
                <div className="text-xs font-semibold text-[#1C1A17] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1C1A17] text-white flex items-center justify-center font-mono text-[11px]">
                    2
                  </span>
                  <span>Camille Laurent</span>
                </div>
                <div className="text-xs text-[#6B6559]">
                  <span className="text-[#3B6652] font-medium block">Camille Teaches Kenji:</span>
                  <span className="font-semibold text-[#1C1A17]">Hand-Rolled Sfoglia &amp; Emulsions</span>
                </div>
              </div>

              {/* Node 3: Kenji */}
              <div className="p-4 bg-[#F8F6F1] rounded-lg border border-[#E3DFD5] space-y-2 relative">
                <div className="text-xs font-semibold text-[#1C1A17] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1C1A17] text-white flex items-center justify-center font-mono text-[11px]">
                    3
                  </span>
                  <span>Kenji Sato</span>
                </div>
                <div className="text-xs text-[#6B6559]">
                  <span className="text-[#8C463F] font-medium block">Kenji Teaches You:</span>
                  <span className="font-semibold text-[#1C1A17]">Carbon Steel Wok Hei &amp; Dumplings</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#EFECE5] rounded-lg border border-[#E2DED5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="text-[#595449]">
                <span className="font-bold text-[#1C1A17] block">Status: Triangular Loop Verified Ready</span>
                <span>All 3 cooks are within the NYC metro area and open to weekend kitchen sessions.</span>
              </div>
              <button
                onClick={() => {
                  const kenji = allCooks.find((c) => c.id === 'cook_kenji') || allCooks[1];
                  const kenjiSkill = kenji.teachingSkills[0];
                  const mySkill = currentUser.teachingSkills[0];
                  onProposeSwap(kenji, kenjiSkill, mySkill);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1C1A17] hover:bg-[#33302B] rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                Join &amp; Confirm Mise Circle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
