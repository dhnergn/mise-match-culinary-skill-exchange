export type SkillCategory = 
  | 'baking'
  | 'wok'
  | 'pasta'
  | 'fermentation'
  | 'knife'
  | 'sauces'
  | 'regional'
  | 'confectionery';

export type SkillDifficulty = 'Foundational' | 'Intermediate' | 'Mastery';
export type ExchangeFormat = 'In-Person Kitchen' | 'Virtual Video Exchange' | 'Either Format';

export interface SyllabusPhase {
  phaseNumber: number;
  phaseTitle: string;
  durationMinutes: number;
  keyTechnique: string;
  instructions: string;
}

export interface CulinarySkill {
  id: string;
  title: string;
  category: SkillCategory;
  difficulty: SkillDifficulty;
  duration: string;
  summary: string;
  heroImage: string;
  syllabus: SyllabusPhase[];
  equipmentNeeded: string[];
  pantryPrerequisites: string[];
  safetyNotes?: string;
}

export interface WantedSkill {
  id: string;
  title: string;
  category: SkillCategory;
  notes: string;
  urgency: 'Active Search' | 'Next Project' | 'Casual Curiosity';
}

export interface CookReview {
  id: string;
  authorName: string;
  authorLocation: string;
  authorAvatar: string;
  swappedSkill: string;
  learnedSkill: string;
  comment: string;
  date: string;
  rating: number;
}

export interface CookProfile {
  id: string;
  name: string;
  tagline: string;
  location: string;
  bio: string;
  avatar: string;
  completedSwapsCount: number;
  rating: number;
  formatPreference: ExchangeFormat;
  kitchenSetup: {
    title: string;
    highlights: string[];
  };
  teachingSkills: CulinarySkill[];
  wantedSkills: WantedSkill[];
  endorsements: string[];
  reviews: CookReview[];
}

export interface SwapProposal {
  id: string;
  proposerId: string;
  receiverId: string;
  proposerSkillId: string;
  receiverSkillId: string;
  status: 'pending' | 'accepted' | 'scheduled' | 'in_session' | 'completed' | 'declined';
  proposedDate: string;
  proposedTime: string;
  format: 'In-Person Kitchen' | 'Virtual Video Exchange';
  hostLocationNote: string;
  mutualAgreementNotes: string;
  createdAt: string;
  syllabusChecklist: Array<{ id: string; label: string; done: boolean }>;
}

export interface MatchRecommendation {
  partner: CookProfile;
  myOfferedSkill: CulinarySkill;
  partnerOfferedSkill: CulinarySkill;
  matchScore: number;
  matchType: 'direct' | 'high_affinity';
  synergyReason: string;
}
