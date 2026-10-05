import React, { useState } from 'react';
import { CookProfile, CulinarySkill } from '../types/exchange';
import { Star, MapPin, Clock, ArrowRight, ChefHat } from 'lucide-react';

interface SkillCardProps {
  cook: CookProfile;
  skill: CulinarySkill;
  currentUser: CookProfile;
  onViewDetails: (skill: CulinarySkill, cook: CookProfile) => void;
  onProposeSwap: (partner: CookProfile, partnerSkill: CulinarySkill, mySkill: CulinarySkill) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  cook,
  skill,
  currentUser,
  onViewDetails,
  onProposeSwap,
}) => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const isSelf = cook.id === currentUser.id;

  // Primary wanted skill by this cook
  const primaryWanted = cook.wantedSkills[0];

  return (
    <div className="bg-white rounded-xl border border-[#DFDAD0] hover:border-[#C4BEB2] shadow-sm hover:shadow transition-all flex flex-col justify-between overflow-hidden">
      <div>
        {/* Card Visual Header */}
        <div className="relative h-48 w-full bg-[#EBE8E1] overflow-hidden">
          {skill.heroImage && imageLoaded ? (
            <img
              src={skill.heroImage}
              alt={skill.title}
              onError={() => setImageLoaded(false)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#E5E1D6] text-[#706B60] p-4 text-center">
              <ChefHat className="w-8 h-8 mb-2 text-[#999285]" />
              <span className="font-editorial text-base font-bold text-[#1C1A17]">
                {skill.title}
              </span>
            </div>
          )}

          {/* Scrim with format & duration */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3.5 text-white">
            <div className="flex items-center gap-2 text-xs font-medium text-white/90">
              <span className="tabular-nums font-mono">{skill.duration}</span>
              <span aria-hidden="true">·</span>
              <span>{skill.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>{cook.formatPreference}</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          
          {/* Cook Bio line */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={cook.avatar}
                alt={cook.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-[#DDD8CD]"
              />
              <div className="leading-tight">
                <span className="text-xs font-semibold text-[#1C1A17] block">
                  {cook.name} {isSelf && '(You)'}
                </span>
                <span className="text-[11px] text-[#787265] truncate max-w-[150px] block">
                  {cook.location.split('·')[0]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-[#706B60]">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-mono tabular-nums font-semibold text-[#1C1A17]">
                {cook.rating}
              </span>
              <span className="text-[#8C877B]">({cook.completedSwapsCount} trades)</span>
            </div>
          </div>

          {/* Skill Title & Summary */}
          <div>
            <div className="text-[11px] font-semibold text-[#87653F] uppercase tracking-wider mb-1">
              Offers to Teach
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#1C1A17] leading-snug line-clamp-1">
              {skill.title}
            </h3>
            <p className="text-xs text-[#5C574C] mt-1.5 line-clamp-2 leading-relaxed">
              {skill.summary}
            </p>
          </div>

          {/* Reciprocal Trade Request Section */}
          <div className="pt-3 border-t border-[#EFECE5]">
            <div className="text-[11px] font-semibold text-[#3B6652] uppercase tracking-wider mb-1">
              Seeks in Return
            </div>
            {primaryWanted ? (
              <div className="text-xs text-[#2E2B25] font-medium leading-tight">
                <span>{primaryWanted.title}</span>
                <p className="text-[11px] text-[#736E62] mt-0.5 line-clamp-1 font-normal">
                  {primaryWanted.notes}
                </p>
              </div>
            ) : (
              <span className="text-xs text-[#787367]">Open to any technique barter</span>
            )}
          </div>

          {/* Syllabus milestones preview count */}
          <div className="text-[11px] text-[#7A7467] flex items-center gap-2">
            <span>{skill.syllabus.length} Hands-on Milestones</span>
            <span aria-hidden="true">·</span>
            <span>{skill.equipmentNeeded.length} Tools Specified</span>
          </div>

        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 bg-[#F8F6F1] border-t border-[#EBE8E1] flex items-center gap-2">
        <button
          onClick={() => onViewDetails(skill, cook)}
          className="flex-1 py-2 px-3 text-xs font-medium text-[#1C1A17] bg-white hover:bg-[#F2EFE8] border border-[#DDD8CE] rounded-md transition-colors cursor-pointer text-center whitespace-nowrap"
        >
          Inspect Syllabus
        </button>

        {!isSelf ? (
          <button
            onClick={() => onProposeSwap(cook, skill, currentUser.teachingSkills[0])}
            className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-[#1C1A17] hover:bg-[#33302B] rounded-md transition-colors cursor-pointer text-center whitespace-nowrap"
          >
            Propose Swap
          </button>
        ) : (
          <span className="flex-1 py-2 px-3 text-xs text-center text-[#7A756A] italic">
            Your Listed Skill
          </span>
        )}
      </div>
    </div>
  );
};
