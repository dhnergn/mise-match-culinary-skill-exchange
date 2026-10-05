import React from 'react';
import { CookProfile } from '../types/exchange';
import { ChefHat, ArrowLeftRight, UserCircle2, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: 'explore' | 'matcher' | 'hub' | 'live';
  setActiveTab: (tab: 'explore' | 'matcher' | 'hub' | 'live') => void;
  currentUser: CookProfile;
  onOpenProfileSwitcher: () => void;
  onOpenNewSkillModal: () => void;
  pendingProposalsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenProfileSwitcher,
  onOpenNewSkillModal,
  pendingProposalsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#E6E4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <span className="w-8 h-8 rounded-md bg-[#1C1A17] text-[#FBFBF9] flex items-center justify-center font-editorial font-bold text-lg transition-transform group-hover:scale-105">
              M
            </span>
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#1C1A17]">
              Mise &amp; Match
            </span>
          </button>
        </div>

        {/* Zone 2: 4 single-line nav links with subtle hover underlines */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('explore')}
            className={`cursor-pointer pb-1 transition-colors relative whitespace-nowrap ${
              activeTab === 'explore'
                ? 'text-[#1C1A17] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1C1A17]'
                : 'text-[#686358] hover:text-[#1C1A17]'
            }`}
          >
            Explore Swaps
          </button>

          <button
            onClick={() => setActiveTab('matcher')}
            className={`cursor-pointer pb-1 transition-colors relative whitespace-nowrap ${
              activeTab === 'matcher'
                ? 'text-[#1C1A17] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1C1A17]'
                : 'text-[#686358] hover:text-[#1C1A17]'
            }`}
          >
            Match Engine
          </button>

          <button
            onClick={() => setActiveTab('hub')}
            className={`cursor-pointer pb-1 transition-colors relative whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'hub'
                ? 'text-[#1C1A17] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1C1A17]'
                : 'text-[#686358] hover:text-[#1C1A17]'
            }`}
          >
            <span>My Barter Hub</span>
            {pendingProposalsCount > 0 && (
              <span className="text-[11px] font-mono tabular-nums font-semibold px-1.5 py-0.2 bg-[#E9E5DD] text-[#3D3A34] rounded">
                {pendingProposalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`cursor-pointer pb-1 transition-colors relative whitespace-nowrap ${
              activeTab === 'live'
                ? 'text-[#1C1A17] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1C1A17]'
                : 'text-[#686358] hover:text-[#1C1A17]'
            }`}
          >
            Live Kitchen
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewSkillModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold tracking-wide text-[#3D3A34] bg-[#F1EFEA] hover:bg-[#E7E4DC] border border-[#DDD9CF] rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List a Technique</span>
          </button>

          <button
            onClick={onOpenProfileSwitcher}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-md hover:bg-[#F2EFE9] border border-transparent hover:border-[#E2DFD7] transition-all cursor-pointer text-left"
            title="Switch active cook persona"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-[#D5D0C5]"
            />
            <div className="hidden lg:block leading-tight">
              <div className="text-xs font-semibold text-[#1C1A17] flex items-center gap-1">
                <span>{currentUser.name}</span>
                <ArrowLeftRight className="w-3 h-3 text-[#8A8477]" />
              </div>
              <div className="text-[11px] text-[#7A756A] truncate max-w-[110px]">
                {currentUser.location.split('·')[0].trim()}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-[#EAE7E0] bg-[#F8F6F1] text-xs font-medium">
        <button
          onClick={() => setActiveTab('explore')}
          className={`py-1 px-2 ${activeTab === 'explore' ? 'text-[#1C1A17] font-semibold' : 'text-[#736E63]'}`}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveTab('matcher')}
          className={`py-1 px-2 ${activeTab === 'matcher' ? 'text-[#1C1A17] font-semibold' : 'text-[#736E63]'}`}
        >
          Matches
        </button>
        <button
          onClick={() => setActiveTab('hub')}
          className={`py-1 px-2 ${activeTab === 'hub' ? 'text-[#1C1A17] font-semibold' : 'text-[#736E63]'}`}
        >
          Barter Hub ({pendingProposalsCount})
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`py-1 px-2 ${activeTab === 'live' ? 'text-[#1C1A17] font-semibold' : 'text-[#736E63]'}`}
        >
          Live Kitchen
        </button>
      </div>
    </header>
  );
};
