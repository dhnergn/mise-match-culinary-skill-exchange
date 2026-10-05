import React, { useState } from 'react';
import { CookProfile, CulinarySkill, SwapProposal } from '../types/exchange';
import { X, ArrowLeftRight, Calendar, Clock, MapPin, Check, Shield } from 'lucide-react';

interface ProposeSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: CookProfile | null;
  partnerSkill: CulinarySkill | null;
  currentUser: CookProfile;
  onProposalCreated: (proposal: SwapProposal) => void;
}

export const ProposeSwapModal: React.FC<ProposeSwapModalProps> = ({
  isOpen,
  onClose,
  partner,
  partnerSkill,
  currentUser,
  onProposalCreated,
}) => {
  if (!isOpen || !partner || !partnerSkill) return null;

  // Selected skill to offer
  const [selectedMySkillId, setSelectedMySkillId] = useState<string>(
    currentUser.teachingSkills[0]?.id || ''
  );
  const [format, setFormat] = useState<'In-Person Kitchen' | 'Virtual Video Exchange'>('In-Person Kitchen');
  const [proposedDate, setProposedDate] = useState<string>('Next Saturday');
  const [proposedTime, setProposedTime] = useState<string>('11:00 AM – 2:00 PM');
  const [locationChoice, setLocationChoice] = useState<string>('host_at_my_kitchen');
  const [prepNotes, setPrepNotes] = useState<string>(
    'I will bring cold European butter and baking parchment. Let’s do 90 minutes on technique A and 90 minutes on technique B.'
  );

  const selectedMySkill = currentUser.teachingSkills.find((s) => s.id === selectedMySkillId) || currentUser.teachingSkills[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMySkill) return;

    const locationText =
      format === 'Virtual Video Exchange'
        ? 'Virtual Kitchen Video Call (Dual-station web cameras)'
        : locationChoice === 'host_at_my_kitchen'
        ? `Host at ${currentUser.name}’s kitchen (${currentUser.location.split('·')[0].trim()})`
        : `Guest at ${partner.name}’s kitchen (${partner.location.split('·')[0].trim()})`;

    const newProposal: SwapProposal = {
      id: `prop_${Date.now()}`,
      proposerId: currentUser.id,
      receiverId: partner.id,
      proposerSkillId: selectedMySkill.id,
      receiverSkillId: partnerSkill.id,
      status: 'pending',
      proposedDate,
      proposedTime,
      format,
      hostLocationNote: locationText,
      mutualAgreementNotes: prepNotes,
      createdAt: 'Just now',
      syllabusChecklist: [
        { id: `chk_1`, label: `Intro & Mise en place station verification for ${selectedMySkill.title}`, done: false },
        { id: `chk_2`, label: `Mastery session: ${selectedMySkill.title} (${selectedMySkill.duration})`, done: false },
        { id: `chk_3`, label: `Station rotation & break`, done: false },
        { id: `chk_4`, label: `Mastery session: ${partnerSkill.title} (${partnerSkill.duration})`, done: false },
        { id: `chk_5`, label: `Taste test, reciprocal feedback & badge certification`, done: false },
      ],
    };

    onProposalCreated(newProposal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-[#FBFBF9] rounded-2xl max-w-2xl w-full border border-[#D5D0C5] shadow-2xl overflow-hidden">
        
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-[#E7E4DC] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#706B5F]">
            <span className="font-semibold text-[#87653F] uppercase tracking-wider">
              1-for-1 Barter Agreement
            </span>
            <span aria-hidden="true">·</span>
            <span>Zero Cash Exchanged</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F2EFE8] flex items-center justify-center text-[#706B5F] hover:text-[#1C1A17] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1C1A17]">
              Propose Culinary Exchange
            </h2>
            <p className="text-xs text-[#595448] mt-1">
              You are proposing a mutual skill barter with <span className="font-semibold text-[#1C1A17]">{partner.name}</span>.
            </p>
          </div>

          {/* Barter Exchange Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* You Offer */}
            <div className="p-4 bg-white rounded-xl border border-[#DFDAD0] space-y-2">
              <span className="text-[11px] font-semibold text-[#87653F] uppercase tracking-wider block">
                You Teach ({currentUser.name})
              </span>
              <label className="block text-xs text-[#6B6559] mb-1">
                Select from your teaching crafts:
              </label>
              <select
                value={selectedMySkillId}
                onChange={(e) => setSelectedMySkillId(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5D0C5] rounded px-3 py-2 text-xs font-semibold text-[#1C1A17] focus:outline-none"
              >
                {currentUser.teachingSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.duration})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#7A7467] line-clamp-2">
                {selectedMySkill?.summary}
              </p>
            </div>

            {/* In Return You Receive */}
            <div className="p-4 bg-white rounded-xl border border-[#DFDAD0] space-y-2">
              <span className="text-[11px] font-semibold text-[#3B6652] uppercase tracking-wider block">
                You Learn ({partner.name})
              </span>
              <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#E5E1D7]">
                <span className="text-xs font-bold text-[#1C1A17] block">
                  {partnerSkill.title}
                </span>
                <span className="text-[11px] text-[#6B6558] block mt-0.5">
                  Est. {partnerSkill.duration} · {partnerSkill.difficulty}
                </span>
              </div>
              <p className="text-[11px] text-[#7A7467] line-clamp-2">
                {partnerSkill.summary}
              </p>
            </div>

          </div>

          {/* Exchange Format Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1C1A17] uppercase tracking-wider">
              Exchange Medium &amp; Setting
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('In-Person Kitchen')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  format === 'In-Person Kitchen'
                    ? 'border-[#1C1A17] bg-[#F4F1EA] text-[#1C1A17] shadow-xs'
                    : 'border-[#DDD8CE] bg-white text-[#5E594D] hover:border-[#BFB9AC]'
                }`}
              >
                <div className="text-xs font-bold">In-Person Kitchen Session</div>
                <div className="text-[11px] text-[#706B5F] mt-0.5">
                  Hands-on side-by-side prep at one of your kitchens.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('Virtual Video Exchange')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  format === 'Virtual Video Exchange'
                    ? 'border-[#1C1A17] bg-[#F4F1EA] text-[#1C1A17] shadow-xs'
                    : 'border-[#DDD8CE] bg-white text-[#5E594D] hover:border-[#BFB9AC]'
                }`}
              >
                <div className="text-xs font-bold">Virtual Dual-Kitchen Call</div>
                <div className="text-[11px] text-[#706B5F] mt-0.5">
                  Live synchronous kitchen stream with simultaneous cooking.
                </div>
              </button>
            </div>
          </div>

          {/* Location detail if in-person */}
          {format === 'In-Person Kitchen' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#1C1A17]">
                Kitchen Host Preference
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2 p-2.5 rounded border border-[#DFDAD0] bg-white cursor-pointer">
                  <input
                    type="radio"
                    name="host"
                    checked={locationChoice === 'host_at_my_kitchen'}
                    onChange={() => setLocationChoice('host_at_my_kitchen')}
                    className="accent-[#1C1A17]"
                  />
                  <span>Host at my kitchen ({currentUser.location.split('·')[0]})</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded border border-[#DFDAD0] bg-white cursor-pointer">
                  <input
                    type="radio"
                    name="host"
                    checked={locationChoice === 'host_at_partner_kitchen'}
                    onChange={() => setLocationChoice('host_at_partner_kitchen')}
                    className="accent-[#1C1A17]"
                  />
                  <span>Visit {partner.name}’s kitchen ({partner.location.split('·')[0]})</span>
                </label>
              </div>
            </div>
          )}

          {/* Proposed Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1A17] mb-1">
                Suggested Date
              </label>
              <input
                type="text"
                value={proposedDate}
                onChange={(e) => setProposedDate(e.target.value)}
                placeholder="e.g. Saturday, Oct 17"
                className="w-full bg-white border border-[#D5D0C5] rounded px-3 py-2 text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1A17] mb-1">
                Time Window
              </label>
              <input
                type="text"
                value={proposedTime}
                onChange={(e) => setProposedTime(e.target.value)}
                placeholder="e.g. 11:00 AM – 2:00 PM"
                className="w-full bg-white border border-[#D5D0C5] rounded px-3 py-2 text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                required
              />
            </div>
          </div>

          {/* Mutual Agreement & Prep Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1A17] mb-1">
              Ingredient &amp; Prep Coordination Notes
            </label>
            <textarea
              rows={3}
              value={prepNotes}
              onChange={(e) => setPrepNotes(e.target.value)}
              className="w-full bg-white border border-[#D5D0C5] rounded p-3 text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
              placeholder="Specify ingredient splits, dietary considerations, or specialized gear to bring..."
            />
          </div>

          {/* Barter Charter Trust Notice */}
          <div className="p-3.5 bg-[#FAF7F0] rounded-lg border border-[#E7E0D0] flex items-start gap-2.5 text-xs text-[#6B5A40]">
            <Shield className="w-4 h-4 text-[#8C6D38] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#1C1A17] block">
                The Mise &amp; Match Reciprocal Code
              </span>
              <span>
                Both cooks commit to prepared mise en place, attentive mentorship, zero sales pitches, and mutual respect of knives, fire, and ingredients.
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#EAE7DF]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#6E685B] hover:text-[#1C1A17] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1C1A17] hover:bg-[#33302B] rounded-md transition-colors cursor-pointer shadow-sm"
            >
              Send Barter Proposal
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
