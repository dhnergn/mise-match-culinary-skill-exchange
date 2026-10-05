import React, { useState } from 'react';
import { CookProfile } from '../types/exchange';
import { X, Check, Star, UserPlus } from 'lucide-react';

interface ProfileSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  cooks: CookProfile[];
  currentUserId: string;
  onSelectCook: (cookId: string) => void;
  onCreateCustomCook: (name: string, location: string, skillTitle: string) => void;
}

export const ProfileSwitcherModal: React.FC<ProfileSwitcherModalProps> = ({
  isOpen,
  onClose,
  cooks,
  currentUserId,
  onSelectCook,
  onCreateCustomCook,
}) => {
  if (!isOpen) return null;

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customLocation, setCustomLocation] = useState('San Francisco, CA');
  const [customSkill, setCustomSkill] = useState('Oaxacan Mole Negro & Hand-Pressed Tortillas');

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onCreateCustomCook(customName.trim(), customLocation.trim(), customSkill.trim());
    setShowCustomForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-[#FBFBF9] rounded-2xl max-w-xl w-full border border-[#D5D0C5] shadow-2xl overflow-hidden">
        
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-[#E7E4DC] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#706B5F]">
            <span className="font-semibold text-[#87653F] uppercase tracking-wider">
              Cook Persona Switcher
            </span>
            <span aria-hidden="true">·</span>
            <span>Test Different Barter Perspectives</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F2EFE8] flex items-center justify-center text-[#706B5F] hover:text-[#1C1A17] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#1C1A17]">
              Select Active Cook Profile
            </h2>
            <p className="text-xs text-[#615C50] mt-1 leading-relaxed">
              Switching accounts lets you see how the bilateral match engine instantly recomputes compatibility scores based on what each cook teaches and seeks.
            </p>
          </div>

          {/* Cook cards */}
          <div className="space-y-3">
            {cooks.map((c) => {
              const isSelected = c.id === currentUserId;
              const primarySkill = c.teachingSkills[0];
              const primaryWanted = c.wantedSkills[0];

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCook(c.id);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#F4F1EA] border-[#1C1A17] shadow-xs'
                      : 'bg-white border-[#DFDAD0] hover:border-[#BFB9AC]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-[#D5D0C5] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1C1A17]">{c.name}</span>
                        <div className="flex items-center gap-0.5 text-xs text-[#706B60]">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span className="font-mono tabular-nums font-semibold">{c.rating}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-[#7A7467] truncate">
                        {c.location} · {c.completedSwapsCount} trades
                      </div>
                      <div className="text-xs text-[#33302B] truncate mt-1">
                        <span className="font-semibold text-[#87653F]">Teaches:</span>{' '}
                        {primarySkill?.title || 'None listed'}
                      </div>
                      <div className="text-xs text-[#33302B] truncate">
                        <span className="font-semibold text-[#3B6652]">Seeks:</span>{' '}
                        {primaryWanted?.title || 'Open to all'}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#1C1A17] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Custom Cook Trigger */}
          {!showCustomForm ? (
            <button
              onClick={() => setShowCustomForm(true)}
              className="w-full py-2.5 px-4 text-xs font-semibold text-[#1C1A17] bg-[#F1EFEA] hover:bg-[#E5E1D6] border border-[#D5D0C5] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Your Own Cook Persona</span>
            </button>
          ) : (
            <form onSubmit={handleCreateCustom} className="p-4 bg-white rounded-xl border border-[#DFDAD0] space-y-3">
              <span className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider block">
                Create New Cook Persona
              </span>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Your Full Name (e.g. Elena Rostova)"
                className="w-full bg-[#FAF8F5] border border-[#D5D0C5] rounded px-3 py-1.5 text-xs text-[#1C1A17] focus:outline-none"
                required
              />
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Your City & Neighborhood"
                className="w-full bg-[#FAF8F5] border border-[#D5D0C5] rounded px-3 py-1.5 text-xs text-[#1C1A17] focus:outline-none"
                required
              />
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="The Technique You Offer to Teach"
                className="w-full bg-[#FAF8F5] border border-[#D5D0C5] rounded px-3 py-1.5 text-xs text-[#1C1A17] focus:outline-none"
                required
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="px-3 py-1.5 text-xs text-[#7A7467] hover:text-[#1C1A17]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1C1A17] hover:bg-[#33302B] rounded"
                >
                  Create &amp; Log In
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
