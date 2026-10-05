import React, { useState } from 'react';
import { CookProfile, CulinarySkill, SwapProposal, WantedSkill } from './types/exchange';
import { INITIAL_COOKS, INITIAL_PROPOSALS } from './data/mockExchangeData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MatchEngine } from './components/MatchEngine';
import { SkillBoard } from './components/SkillBoard';
import { SkillDetailModal } from './components/SkillDetailModal';
import { ProposeSwapModal } from './components/ProposeSwapModal';
import { BarterHub } from './components/BarterHub';
import { LiveKitchenSession } from './components/LiveKitchenSession';
import { NewSkillModal } from './components/NewSkillModal';
import { ProfileSwitcherModal } from './components/ProfileSwitcherModal';
import { Check, Info } from 'lucide-react';

export default function App() {
  const [cooks, setCooks] = useState<CookProfile[]>(INITIAL_COOKS);
  const [currentUserId, setCurrentUserId] = useState<string>('cook_marco');
  const [proposals, setProposals] = useState<SwapProposal[]>(INITIAL_PROPOSALS);
  const [activeTab, setActiveTab] = useState<'explore' | 'matcher' | 'hub' | 'live'>('explore');

  // Live session state
  const [activeLiveProposal, setActiveLiveProposal] = useState<SwapProposal | null>(null);

  // Modals
  const [isSkillDetailOpen, setIsSkillDetailOpen] = useState(false);
  const [inspectingSkill, setInspectingSkill] = useState<CulinarySkill | null>(null);
  const [inspectingCook, setInspectingCook] = useState<CookProfile | null>(null);

  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [proposePartner, setProposePartner] = useState<CookProfile | null>(null);
  const [proposePartnerSkill, setProposePartnerSkill] = useState<CulinarySkill | null>(null);

  const [isNewSkillModalOpen, setIsNewSkillModalOpen] = useState(false);
  const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const currentUser = cooks.find((c) => c.id === currentUserId) || cooks[0];

  // Count incoming pending proposals
  const pendingIncomingCount = proposals.filter(
    (p) => p.receiverId === currentUser.id && p.status === 'pending'
  ).length;

  // Compute how many instant direct matches currentUser has
  const directMatchCount = cooks.filter((other) => {
    if (other.id === currentUser.id) return false;
    const wantsMy = other.wantedSkills.some((ws) =>
      currentUser.teachingSkills.some(
        (ts) => ts.category === ws.category || ts.title.toLowerCase().includes(ws.title.toLowerCase())
      )
    );
    const iWant = currentUser.wantedSkills.some((myWs) =>
      other.teachingSkills.some(
        (ts) => ts.category === myWs.category || ts.title.toLowerCase().includes(myWs.title.toLowerCase())
      )
    );
    return wantsMy && iWant;
  }).length;

  // Handlers
  const handleViewSkill = (skill: CulinarySkill, cook: CookProfile) => {
    setInspectingSkill(skill);
    setInspectingCook(cook);
    setIsSkillDetailOpen(true);
  };

  const handleOpenProposeSwap = (
    partner: CookProfile,
    partnerSkill: CulinarySkill,
    mySkill?: CulinarySkill
  ) => {
    setProposePartner(partner);
    setProposePartnerSkill(partnerSkill);
    setIsProposeModalOpen(true);
  };

  const handleProposalCreated = (newProposal: SwapProposal) => {
    setProposals((prev) => [newProposal, ...prev]);
    showToast(`Barter proposal sent to ${proposePartner?.name}! Track it in your Barter Hub.`);
    setActiveTab('hub');
  };

  const handleAcceptProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'scheduled' } : p))
    );
    showToast('Proposal accepted! The kitchen exchange has been scheduled.');
  };

  const handleDeclineProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'declined' } : p))
    );
    showToast('Proposal declined.');
  };

  const handleStartLiveSession = (proposal: SwapProposal) => {
    setActiveLiveProposal(proposal);
    setActiveTab('live');
  };

  const handleCompleteLiveSession = (proposalId: string, rating: number, endorsement: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'completed' } : p))
    );
    showToast(`Culinary exchange certified! You awarded ${rating} stars and an official technique badge.`);
    setActiveTab('hub');
  };

  const handleAddTeachingSkill = (newSkill: CulinarySkill) => {
    setCooks((prev) =>
      prev.map((c) =>
        c.id === currentUser.id
          ? {
              ...c,
              teachingSkills: [...c.teachingSkills, newSkill],
            }
          : c
      )
    );
    showToast(`"${newSkill.title}" published to your teaching repertoire!`);
  };

  const handleAddWantedSkill = (title: string, category: any, notes: string) => {
    const newWs: WantedSkill = {
      id: `want_${Date.now()}`,
      title,
      category,
      notes,
      urgency: 'Active Search',
    };
    setCooks((prev) =>
      prev.map((c) =>
        c.id === currentUser.id
          ? {
              ...c,
              wantedSkills: [...c.wantedSkills, newWs],
            }
          : c
      )
    );
    showToast(`Added "${title}" to your learning wishlist.`);
  };

  const handleRemoveWantedSkill = (wantedId: string) => {
    setCooks((prev) =>
      prev.map((c) =>
        c.id === currentUser.id
          ? {
              ...c,
              wantedSkills: c.wantedSkills.filter((w) => w.id !== wantedId),
            }
          : c
      )
    );
    showToast('Removed from learning wishlist.');
  };

  const handleCreateCustomCook = (name: string, location: string, skillTitle: string) => {
    const newCookId = `cook_${Date.now()}`;
    const newCook: CookProfile = {
      id: newCookId,
      name,
      tagline: 'Passionate Culinary Craftsperson',
      location: `${location} · Local Cook`,
      bio: `Dedicated home cook and culinary enthusiast based in ${location}.`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      completedSwapsCount: 0,
      rating: 5.0,
      formatPreference: 'Either Format',
      kitchenSetup: {
        title: 'Home Prep Station',
        highlights: ['Seasoned cookware', 'Prep knives', 'Standard domestic range'],
      },
      teachingSkills: [
        {
          id: `skill_${Date.now()}`,
          title: skillTitle,
          category: 'regional',
          difficulty: 'Intermediate',
          duration: '2.0 hours',
          summary: `Hands-on training in ${skillTitle} using authentic preparation steps.`,
          heroImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80',
          syllabus: [
            {
              phaseNumber: 1,
              phaseTitle: 'Ingredient Selection & Prep',
              durationMinutes: 30,
              keyTechnique: 'Mise en place and accurate measuring',
              instructions: 'Verify fresh ingredients and proper tool staging.',
            },
            {
              phaseNumber: 2,
              phaseTitle: 'Cooking Execution',
              durationMinutes: 60,
              keyTechnique: 'Hands-on thermal control',
              instructions: 'Execute primary technique step by step.',
            },
            {
              phaseNumber: 3,
              phaseTitle: 'Finishing & Tasting',
              durationMinutes: 30,
              keyTechnique: 'Flavor balancing and critique',
              instructions: 'Evaluate seasoning and texture.',
            },
          ],
          equipmentNeeded: ['Chef knife', 'Cutting board', 'Measuring spoons'],
          pantryPrerequisites: ['Sea salt', 'Olive oil', 'Fresh aromatics'],
        },
      ],
      wantedSkills: [
        {
          id: `ws_${Date.now()}`,
          title: 'Hand-Rolled Fresh Pasta & Emulsions',
          category: 'pasta',
          notes: 'Looking for an experienced pasta artisan.',
          urgency: 'Active Search',
        },
      ],
      endorsements: ['Dedicated Learner', 'Clean Station'],
      reviews: [],
    };

    setCooks((prev) => [newCook, ...prev]);
    setCurrentUserId(newCookId);
    showToast(`Welcome ${name}! Your culinary profile is active.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#1C1A17]">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-[#1C1A17] text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-stone-700 flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract (1 row, 3 zones) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenProfileSwitcher={() => setIsProfileSwitcherOpen(true)}
        onOpenNewSkillModal={() => setIsNewSkillModalOpen(true)}
        pendingProposalsCount={pendingIncomingCount}
      />

      {/* Hero Banner only shown on Explore tab */}
      {activeTab === 'explore' && (
        <HeroBanner
          currentUser={currentUser}
          onExploreClick={() => {
            const el = document.getElementById('board-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onMatchEngineClick={() => setActiveTab('matcher')}
          directMatchCount={directMatchCount}
        />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === 'explore' && (
          <section id="board-section">
            <SkillBoard
              cooks={cooks}
              currentUser={currentUser}
              onViewDetails={handleViewSkill}
              onProposeSwap={handleOpenProposeSwap}
            />
          </section>
        )}

        {activeTab === 'matcher' && (
          <MatchEngine
            currentUser={currentUser}
            allCooks={cooks}
            onProposeSwap={handleOpenProposeSwap}
            onViewSkill={handleViewSkill}
          />
        )}

        {activeTab === 'hub' && (
          <BarterHub
            currentUser={currentUser}
            allCooks={cooks}
            proposals={proposals}
            onAcceptProposal={handleAcceptProposal}
            onDeclineProposal={handleDeclineProposal}
            onStartLiveSession={handleStartLiveSession}
            onOpenNewSkillModal={() => setIsNewSkillModalOpen(true)}
            onAddWantedSkill={handleAddWantedSkill}
            onRemoveWantedSkill={handleRemoveWantedSkill}
          />
        )}

        {activeTab === 'live' && (
          <LiveKitchenSession
            proposal={activeLiveProposal}
            currentUser={currentUser}
            allCooks={cooks}
            onCompleteSession={handleCompleteLiveSession}
            onExitSession={() => setActiveTab('hub')}
          />
        )}
      </main>

      {/* Quiet, Compliant Editorial Footer */}
      <footer className="border-t border-[#E6E4DF] bg-[#F7F5F0] py-8 text-xs text-[#706B5F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-base font-bold text-[#1C1A17]">
              Mise &amp; Match
            </span>
            <span aria-hidden="true" className="text-[#DDD8CE]">·</span>
            <span>The Peer-to-Peer Culinary Skill Barter Network</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('explore')}
              className="hover:text-[#1C1A17] cursor-pointer"
            >
              Exchange Board
            </button>
            <button
              onClick={() => setActiveTab('matcher')}
              className="hover:text-[#1C1A17] cursor-pointer"
            >
              Match Engine
            </button>
            <button
              onClick={() => setIsProfileSwitcherOpen(true)}
              className="hover:text-[#1C1A17] cursor-pointer"
            >
              Switch Persona ({currentUser.name})
            </button>
            <span className="text-[#8C867B]">
              1-for-1 Kitchen Skill Barter
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SkillDetailModal
        skill={inspectingSkill}
        cook={inspectingCook}
        currentUser={currentUser}
        isOpen={isSkillDetailOpen}
        onClose={() => setIsSkillDetailOpen(false)}
        onProposeSwap={(partner, partnerSkill, mySkill) => {
          setIsSkillDetailOpen(false);
          handleOpenProposeSwap(partner, partnerSkill, mySkill);
        }}
      />

      <ProposeSwapModal
        isOpen={isProposeModalOpen}
        onClose={() => setIsProposeModalOpen(false)}
        partner={proposePartner}
        partnerSkill={proposePartnerSkill}
        currentUser={currentUser}
        onProposalCreated={handleProposalCreated}
      />

      <NewSkillModal
        isOpen={isNewSkillModalOpen}
        onClose={() => setIsNewSkillModalOpen(false)}
        onAddSkill={handleAddTeachingSkill}
      />

      <ProfileSwitcherModal
        isOpen={isProfileSwitcherOpen}
        onClose={() => setIsProfileSwitcherOpen(false)}
        cooks={cooks}
        currentUserId={currentUserId}
        onSelectCook={(cookId) => {
          setCurrentUserId(cookId);
          const found = cooks.find((c) => c.id === cookId);
          if (found) showToast(`Switched active cook profile to ${found.name}.`);
        }}
        onCreateCustomCook={handleCreateCustomCook}
      />
    </div>
  );
}
