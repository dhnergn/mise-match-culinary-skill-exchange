import React, { useState } from 'react';
import { CookProfile, CulinarySkill, SwapProposal } from '../types/exchange';
import { Calendar, Clock, CheckCircle2, XCircle, PlayCircle, Plus, Trash2, ArrowRight } from 'lucide-react';

interface BarterHubProps {
  currentUser: CookProfile;
  allCooks: CookProfile[];
  proposals: SwapProposal[];
  onAcceptProposal: (proposalId: string) => void;
  onDeclineProposal: (proposalId: string) => void;
  onStartLiveSession: (proposal: SwapProposal) => void;
  onOpenNewSkillModal: () => void;
  onAddWantedSkill: (title: string, category: any, notes: string) => void;
  onRemoveWantedSkill: (wantedId: string) => void;
}

export const BarterHub: React.FC<BarterHubProps> = ({
  currentUser,
  allCooks,
  proposals,
  onAcceptProposal,
  onDeclineProposal,
  onStartLiveSession,
  onOpenNewSkillModal,
  onAddWantedSkill,
  onRemoveWantedSkill,
}) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'teaching' | 'wishlist'>('proposals');
  const [newWishTitle, setNewWishTitle] = useState('');
  const [newWishNotes, setNewWishNotes] = useState('');

  // Proposals involving currentUser
  const myProposals = proposals.filter(
    (p) => p.proposerId === currentUser.id || p.receiverId === currentUser.id
  );

  const scheduledProposals = myProposals.filter((p) => p.status === 'scheduled' || p.status === 'accepted');
  const pendingProposals = myProposals.filter((p) => p.status === 'pending');
  const completedProposals = myProposals.filter((p) => p.status === 'completed');

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishTitle.trim()) return;
    onAddWantedSkill(newWishTitle.trim(), 'baking', newWishNotes.trim());
    setNewWishTitle('');
    setNewWishNotes('');
  };

  const getPartnerCook = (proposal: SwapProposal) => {
    const partnerId = proposal.proposerId === currentUser.id ? proposal.receiverId : proposal.proposerId;
    return allCooks.find((c) => c.id === partnerId) || currentUser;
  };

  const getSkillDetails = (skillId: string) => {
    for (const c of allCooks) {
      const s = c.teachingSkills.find((ts) => ts.id === skillId);
      if (s) return s;
    }
    return currentUser.teachingSkills[0];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E6E4DF]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#87653F] uppercase tracking-wider mb-1">
            <span>Culinary Ledger &amp; Operations</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.name}</span>
          </div>
          <h2 className="font-editorial text-3xl font-bold text-[#1C1A17]">
            My Barter Hub
          </h2>
          <p className="text-sm text-[#5C574C] mt-1 max-w-xl">
            Track scheduled kitchen sessions, manage reciprocal trade proposals, and curate your personal teaching repertoire.
          </p>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center p-1 bg-[#EBE8E1] rounded-lg border border-[#DDD9CE] self-start md:self-auto">
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'proposals'
                ? 'bg-white text-[#1C1A17] shadow-sm font-semibold'
                : 'text-[#615B4F] hover:text-[#1C1A17]'
            }`}
          >
            Active Swaps ({scheduledProposals.length + pendingProposals.length})
          </button>
          <button
            onClick={() => setActiveTab('teaching')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'teaching'
                ? 'bg-white text-[#1C1A17] shadow-sm font-semibold'
                : 'text-[#615B4F] hover:text-[#1C1A17]'
            }`}
          >
            My Listed Skills ({currentUser.teachingSkills.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'bg-white text-[#1C1A17] shadow-sm font-semibold'
                : 'text-[#615B4F] hover:text-[#1C1A17]'
            }`}
          >
            Learning Wishlist ({currentUser.wantedSkills.length})
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE SWAPS & PROPOSALS */}
      {activeTab === 'proposals' && (
        <div className="space-y-8">
          
          {/* Scheduled Sessions */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#1C1A17] uppercase tracking-wider mb-3">
              <span>Confirmed Kitchen Sessions Ready to Launch</span>
              <span className="text-[#787265]">{scheduledProposals.length} Sessions</span>
            </div>

            {scheduledProposals.length > 0 ? (
              <div className="space-y-4">
                {scheduledProposals.map((prop) => {
                  const partner = getPartnerCook(prop);
                  const mySkill = getSkillDetails(prop.proposerId === currentUser.id ? prop.proposerSkillId : prop.receiverSkillId);
                  const partnerSkill = getSkillDetails(prop.proposerId === currentUser.id ? prop.receiverSkillId : prop.proposerSkillId);

                  return (
                    <div
                      key={prop.id}
                      className="p-6 bg-white rounded-xl border border-[#D5D0C5] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 text-xs text-[#736E62]">
                          <span className="font-semibold text-[#1C1A17]">{prop.proposedDate}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{prop.proposedTime}</span>
                          <span aria-hidden="true">·</span>
                          <span>{prop.format}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3 bg-[#FAF8F5] rounded border border-[#EDE9E1]">
                            <span className="text-[11px] font-semibold text-[#87653F] uppercase block mb-0.5">
                              You Teach
                            </span>
                            <span className="text-sm font-bold text-[#1C1A17] block">
                              {mySkill?.title}
                            </span>
                          </div>

                          <div className="p-3 bg-[#FAF8F5] rounded border border-[#EDE9E1]">
                            <span className="text-[11px] font-semibold text-[#3B6652] uppercase block mb-0.5">
                              You Learn From {partner.name}
                            </span>
                            <span className="text-sm font-bold text-[#1C1A17] block">
                              {partnerSkill?.title}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-[#635D50]">
                          <span className="font-medium text-[#1C1A17]">Setting: </span>
                          <span>{prop.hostLocationNote}</span>
                        </div>
                      </div>

                      {/* Launch Live Kitchen action */}
                      <div className="lg:w-56 shrink-0 flex flex-col justify-center">
                        <button
                          onClick={() => onStartLiveSession(prop)}
                          className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#1C1A17] hover:bg-[#33302B] rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                        >
                          <PlayCircle className="w-4 h-4 text-amber-300" />
                          <span>Enter Live Kitchen</span>
                        </button>
                        <span className="text-[11px] text-[#7A7569] text-center mt-2 block">
                          Synchronous timer &amp; dual camera
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center bg-white rounded-xl border border-[#DFDAD0] text-xs text-[#706B5F]">
                No scheduled kitchen sessions right now. Browse skills or accept a pending proposal below!
              </div>
            )}
          </div>

          {/* Pending Proposals */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#1C1A17] uppercase tracking-wider mb-3">
              <span>Pending Inbound &amp; Outbound Proposals</span>
              <span className="text-[#787265]">{pendingProposals.length} Pending</span>
            </div>

            {pendingProposals.length > 0 ? (
              <div className="space-y-4">
                {pendingProposals.map((prop) => {
                  const isIncoming = prop.receiverId === currentUser.id;
                  const partner = getPartnerCook(prop);
                  const offered = getSkillDetails(prop.proposerSkillId);
                  const requested = getSkillDetails(prop.receiverSkillId);

                  return (
                    <div
                      key={prop.id}
                      className="p-5 bg-white rounded-xl border border-[#DFDAD0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 text-xs text-[#736E62]">
                          <span className="font-semibold text-[#1C1A17]">
                            {isIncoming ? `Proposal from ${partner.name}` : `Sent to ${partner.name}`}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{prop.proposedDate} ({prop.proposedTime})</span>
                          <span aria-hidden="true">·</span>
                          <span>{prop.format}</span>
                        </div>

                        <div className="text-xs text-[#33302A]">
                          <span className="font-medium">{offered?.title}</span> in exchange for{' '}
                          <span className="font-medium">{requested?.title}</span>
                        </div>

                        <p className="text-xs text-[#6B6559] italic">
                          "{prop.mutualAgreementNotes}"
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isIncoming ? (
                          <>
                            <button
                              onClick={() => onAcceptProposal(prop.id)}
                              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1C1A17] hover:bg-[#33302B] rounded-md transition-colors cursor-pointer"
                            >
                              Accept &amp; Schedule
                            </button>
                            <button
                              onClick={() => onDeclineProposal(prop.id)}
                              className="px-3 py-2 text-xs font-medium text-[#7A7467] hover:text-[#1C1A17] bg-[#F1EFEA] hover:bg-[#E5E1D6] rounded-md transition-colors cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <div className="text-xs text-[#706B5F] bg-[#FAF8F5] px-3 py-1.5 rounded border border-[#EDE9DF]">
                            Awaiting response from {partner.name}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center bg-white rounded-xl border border-[#DFDAD0] text-xs text-[#706B5F]">
                No pending proposals. Propose a barter from the Explore Swaps board!
              </div>
            )}
          </div>

          {/* Completed History */}
          {completedProposals.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider mb-3">
                Completed Exchanges &amp; Certified Badges
              </div>
              <div className="space-y-3">
                {completedProposals.map((prop) => {
                  const partner = getPartnerCook(prop);
                  return (
                    <div
                      key={prop.id}
                      className="p-4 bg-white rounded-xl border border-[#E0DCD3] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#3B6652]" />
                        <span className="font-semibold text-[#1C1A17]">
                          Swapped with {partner.name}
                        </span>
                        <span className="text-[#787265]">({prop.proposedDate})</span>
                      </div>
                      <span className="font-medium text-[#3B6652]">Skill Certified &amp; Reviewed</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: MY LISTED TEACHING SKILLS */}
      {activeTab === 'teaching' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider">
              Techniques You Teach
            </span>
            <button
              onClick={onOpenNewSkillModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#1C1A17] bg-[#F1EFEA] hover:bg-[#E5E1D6] border border-[#D5D0C5] rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Another Technique</span>
            </button>
          </div>

          <div className="space-y-4">
            {currentUser.teachingSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-6 bg-white rounded-xl border border-[#DFDAD0] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-[#87653F] uppercase tracking-wider">
                      {skill.category} · {skill.difficulty} · {skill.duration}
                    </span>
                    <h3 className="font-editorial text-2xl font-bold text-[#1C1A17]">
                      {skill.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#524E43] leading-relaxed max-w-2xl">
                  {skill.summary}
                </p>

                {/* Syllabus breakdown summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  {skill.syllabus.map((phase) => (
                    <div
                      key={phase.phaseNumber}
                      className="p-3 bg-[#FAF8F5] rounded border border-[#EDE9E1] text-xs space-y-1"
                    >
                      <span className="font-mono font-bold text-[#1C1A17]">Phase 0{phase.phaseNumber}</span>
                      <div className="font-semibold text-[#2E2B25] leading-snug">{phase.phaseTitle}</div>
                      <div className="text-[11px] text-[#7A7467]">{phase.durationMinutes} min</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LEARNING WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl border border-[#DFDAD0] space-y-4">
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#1C1A17]">
                Add a Culinary Technique to Your Wishlist
              </h3>
              <p className="text-xs text-[#635D50] mt-0.5">
                Our match engine immediately seeks cooks who teach techniques matching your wishlist.
              </p>
            </div>

            <form onSubmit={handleAddWish} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newWishTitle}
                onChange={(e) => setNewWishTitle(e.target.value)}
                placeholder="e.g. Handmade Soba Noodles &amp; Dashi"
                className="bg-white border border-[#D5D0C5] rounded px-3 py-2 text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                required
              />
              <input
                type="text"
                value={newWishNotes}
                onChange={(e) => setNewWishNotes(e.target.value)}
                placeholder="Notes on what you want to focus on..."
                className="bg-white border border-[#D5D0C5] rounded px-3 py-2 text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1C1A17] hover:bg-[#33302B] rounded transition-colors cursor-pointer whitespace-nowrap"
              >
                Add to Learning Wishlist
              </button>
            </form>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider block">
              Current Skills You Want to Learn ({currentUser.wantedSkills.length})
            </span>

            {currentUser.wantedSkills.map((ws) => (
              <div
                key={ws.id}
                className="p-4 bg-white rounded-xl border border-[#DFDAD0] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-sm text-[#1C1A17]">{ws.title}</div>
                  <div className="text-xs text-[#666053] mt-0.5">{ws.notes}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono font-medium text-[#87653F] px-2 py-0.5 bg-[#FAF7F0] rounded border border-[#EDE5D5]">
                    {ws.urgency}
                  </span>
                  <button
                    onClick={() => onRemoveWantedSkill(ws.id)}
                    className="p-1.5 text-[#8C867B] hover:text-[#A8382B] transition-colors cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
