import React from 'react';
import { CookProfile, CulinarySkill } from '../types/exchange';
import { X, Star, Clock, AlertCircle, ChefHat, Check, ShieldCheck, MapPin } from 'lucide-react';

interface SkillDetailModalProps {
  skill: CulinarySkill | null;
  cook: CookProfile | null;
  currentUser: CookProfile;
  isOpen: boolean;
  onClose: () => void;
  onProposeSwap: (partner: CookProfile, partnerSkill: CulinarySkill, mySkill: CulinarySkill) => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  cook,
  currentUser,
  isOpen,
  onClose,
  onProposeSwap,
}) => {
  if (!isOpen || !skill || !cook) return null;

  const isSelf = cook.id === currentUser.id;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-[#FBFBF9] rounded-2xl max-w-3xl w-full border border-[#D5D0C5] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#E7E4DC] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#706B5F]">
            <span className="font-semibold text-[#87653F] uppercase tracking-wider">
              Technique Syllabus
            </span>
            <span aria-hidden="true">·</span>
            <span>{skill.category.toUpperCase()}</span>
            <span aria-hidden="true">·</span>
            <span>{skill.difficulty}</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F2EFE8] flex items-center justify-center text-[#706B5F] hover:text-[#1C1A17] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 divide-y divide-[#EAE7DF]">
          
          {/* Section 1: Hero & Instructor */}
          <div className="space-y-4">
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1C1A17] leading-tight">
              {skill.title}
            </h2>

            <p className="text-sm text-[#4E4A3F] leading-relaxed">
              {skill.summary}
            </p>

            {/* Instructor Strip */}
            <div className="p-4 bg-[#F5F3EC] rounded-xl border border-[#E3DFD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={cook.avatar}
                  alt={cook.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-[#D5D0C5]"
                />
                <div>
                  <div className="text-sm font-bold text-[#1C1A17] flex items-center gap-2">
                    <span>{cook.name}</span>
                    <span className="text-xs font-normal text-[#666053]">({cook.tagline})</span>
                  </div>
                  <div className="text-xs text-[#7A7568] flex items-center gap-2 mt-0.5">
                    <span>{cook.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{cook.completedSwapsCount} verified trades</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#706B60] self-end sm:self-auto">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-mono tabular-nums text-sm font-bold text-[#1C1A17]">
                  {cook.rating}
                </span>
                <span>/ 5.0</span>
              </div>
            </div>

            {/* Quick stats strip */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#6B6558]">
              <div>
                <span className="text-[#8F897D]">Duration:</span>{' '}
                <span className="font-semibold text-[#1C1A17] font-mono tabular-nums">{skill.duration}</span>
              </div>
              <div aria-hidden="true" className="text-[#DDD8CE]">/</div>
              <div>
                <span className="text-[#8F897D]">Format:</span>{' '}
                <span className="font-semibold text-[#1C1A17]">{cook.formatPreference}</span>
              </div>
              <div aria-hidden="true" className="text-[#DDD8CE]">/</div>
              <div>
                <span className="text-[#8F897D]">Difficulty:</span>{' '}
                <span className="font-semibold text-[#1C1A17]">{skill.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Phase-by-Phase Syllabus */}
          <div className="pt-6 space-y-4">
            <div>
              <span className="text-xs font-semibold text-[#87653F] uppercase tracking-wider block">
                Step-by-Step Curriculum
              </span>
              <h3 className="font-editorial text-2xl font-bold text-[#1C1A17]">
                Hands-on Technique Milestones
              </h3>
            </div>

            <div className="space-y-4">
              {skill.syllabus.map((phase) => (
                <div
                  key={phase.phaseNumber}
                  className="p-4 bg-white rounded-xl border border-[#DFDAD0] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-[#6B6559]">
                    <span className="font-mono font-bold text-[#1C1A17]">
                      Phase 0{phase.phaseNumber}
                    </span>
                    <span className="font-mono tabular-nums">{phase.durationMinutes} Minutes</span>
                  </div>

                  <h4 className="font-editorial text-lg font-bold text-[#1C1A17]">
                    {phase.phaseTitle}
                  </h4>

                  <div className="text-xs text-[#3B6652] font-medium">
                    <span className="text-[#787265]">Crucial Focus:</span> {phase.keyTechnique}
                  </div>

                  <p className="text-xs text-[#524E43] leading-relaxed pt-1 border-t border-[#F2EFE8]">
                    {phase.instructions}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Equipment & Pantry Prerequisites */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-xl border border-[#DFDAD0] space-y-2">
              <span className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider block">
                Required Kitchen Gear
              </span>
              <ul className="space-y-1.5 text-xs text-[#544F44]">
                {skill.equipmentNeeded.map((eq, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3B6652] shrink-0 mt-0.5" />
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#DFDAD0] space-y-2">
              <span className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider block">
                Pantry Ingredients to Prep
              </span>
              <ul className="space-y-1.5 text-xs text-[#544F44]">
                {skill.pantryPrerequisites.map((pantry, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#87653F] shrink-0 mt-0.5" />
                    <span>{pantry}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 4: Safety & Temperature notes */}
          {skill.safetyNotes && (
            <div className="pt-6">
              <div className="p-4 bg-[#F8F3EC] rounded-xl border border-[#E7DECD] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#9C5A37] shrink-0 mt-0.5" />
                <div className="text-xs text-[#6B503B]">
                  <span className="font-bold text-[#8C4626] block">
                    Critical Safety &amp; Thermal Control
                  </span>
                  <span>{skill.safetyNotes}</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Past Reviews */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-xl font-bold text-[#1C1A17]">
                Exchange Partner Endorsements
              </h3>
              <span className="text-xs text-[#706B5F]">
                {cook.reviews.length} written reviews
              </span>
            </div>

            <div className="space-y-3">
              {cook.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-white rounded-xl border border-[#DFDAD0] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.authorAvatar}
                        alt={rev.authorName}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-semibold text-[#1C1A17]">{rev.authorName}</span>
                      <span className="text-[#8A8477]">({rev.authorLocation})</span>
                    </div>
                    <span className="text-[#8C867B]">{rev.date}</span>
                  </div>
                  <p className="text-xs text-[#524E43] italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                  <div className="text-[11px] text-[#7A7569]">
                    Swapped for: <span className="font-medium text-[#1C1A17]">{rev.learnedSkill}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#E7E4DC] flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#5E594D] hover:text-[#1C1A17] transition-colors cursor-pointer"
          >
            Close Syllabus
          </button>

          {!isSelf ? (
            <button
              onClick={() => {
                onClose();
                onProposeSwap(cook, skill, currentUser.teachingSkills[0]);
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1C1A17] hover:bg-[#33302B] rounded-md transition-colors cursor-pointer shadow-sm"
            >
              Propose 1-for-1 Swap with {cook.name}
            </button>
          ) : (
            <span className="text-xs text-[#706B5F] italic">
              This is your active listed technique
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
