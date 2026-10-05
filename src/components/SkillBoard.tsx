import React, { useState, useMemo } from 'react';
import { CookProfile, CulinarySkill, SkillCategory } from '../types/exchange';
import { SkillCard } from './SkillCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SkillBoardProps {
  cooks: CookProfile[];
  currentUser: CookProfile;
  onViewDetails: (skill: CulinarySkill, cook: CookProfile) => void;
  onProposeSwap: (partner: CookProfile, partnerSkill: CulinarySkill, mySkill: CulinarySkill) => void;
}

export const SkillBoard: React.FC<SkillBoardProps> = ({
  cooks,
  currentUser,
  onViewDetails,
  onProposeSwap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Crafts' },
    { id: 'baking', label: 'Baking & Lamination' },
    { id: 'wok', label: 'Wok & High-Heat' },
    { id: 'pasta', label: 'Hand-Rolled Pasta' },
    { id: 'fermentation', label: 'Fermentation & Koji' },
    { id: 'knife', label: 'Knife & Sharpening' },
    { id: 'regional', label: 'Heritage & Regional' },
  ];

  // Flatten all skills with cook owner
  const allSkillItems = useMemo(() => {
    const list: Array<{ cook: CookProfile; skill: CulinarySkill }> = [];
    cooks.forEach((c) => {
      c.teachingSkills.forEach((s) => {
        list.push({ cook: c, skill: s });
      });
    });
    return list;
  }, [cooks]);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return allSkillItems.filter(({ cook, skill }) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSkill =
          skill.title.toLowerCase().includes(q) ||
          skill.summary.toLowerCase().includes(q) ||
          skill.pantryPrerequisites.some((p) => p.toLowerCase().includes(q)) ||
          skill.syllabus.some((ph) => ph.phaseTitle.toLowerCase().includes(q));
        const matchesCook =
          cook.name.toLowerCase().includes(q) ||
          cook.location.toLowerCase().includes(q);
        const matchesWanted = cook.wantedSkills.some((ws) =>
          ws.title.toLowerCase().includes(q)
        );

        if (!matchesSkill && !matchesCook && !matchesWanted) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all') {
        if (skill.category !== selectedCategory) {
          return false;
        }
      }

      // Format
      if (selectedFormat !== 'all') {
        if (cook.formatPreference !== 'Either Format' && cook.formatPreference !== selectedFormat) {
          return false;
        }
      }

      // Difficulty
      if (selectedDifficulty !== 'all') {
        if (skill.difficulty !== selectedDifficulty) {
          return false;
        }
      }

      return true;
    });
  }, [allSkillItems, searchQuery, selectedCategory, selectedFormat, selectedDifficulty]);

  return (
    <div className="space-y-8">
      {/* Board Controls & Search Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-3xl font-bold text-[#1C1A17]">
              The Culinary Exchange Board
            </h2>
            <p className="text-xs text-[#6B6559] mt-0.5">
              Showing {filteredSkills.length} vetted peer-to-peer culinary techniques open for barter.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7F796E]" />
            <input
              type="text"
              placeholder="Search technique, tool, ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white rounded-md border border-[#D5D0C5] text-xs text-[#1C1A17] placeholder:text-[#8C867B] focus:outline-none focus:ring-1 focus:ring-[#1C1A17] focus:border-[#1C1A17] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C867B] hover:text-[#1C1A17] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar: Categories as Interactive Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#1C1A17] text-white shadow-sm font-semibold'
                  : 'bg-[#EDEAE3] text-[#595347] hover:bg-[#E2DED5]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary filters row: Format & Difficulty */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EAE7DF] text-xs text-[#6B6559]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#8A8477]">Format:</span>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="bg-white border border-[#D5D0C5] rounded px-2 py-1 text-xs text-[#1C1A17] cursor-pointer focus:outline-none"
              >
                <option value="all">All Exchange Formats</option>
                <option value="In-Person Kitchen">In-Person Kitchen</option>
                <option value="Virtual Video Exchange">Virtual Video Exchange</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#8A8477]">Skill Level:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-white border border-[#D5D0C5] rounded px-2 py-1 text-xs text-[#1C1A17] cursor-pointer focus:outline-none"
              >
                <option value="all">All Difficulty Levels</option>
                <option value="Foundational">Foundational</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Mastery">Mastery</option>
              </select>
            </div>
          </div>

          {(searchQuery || selectedCategory !== 'all' || selectedFormat !== 'all' || selectedDifficulty !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedFormat('all');
                setSelectedDifficulty('all');
              }}
              className="text-xs text-[#87653F] hover:underline cursor-pointer flex items-center gap-1 font-medium"
            >
              <X className="w-3 h-3" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Skill Cards */}
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredSkills.map(({ cook, skill }) => (
            <SkillCard
              key={`${cook.id}_${skill.id}`}
              cook={cook}
              skill={skill}
              currentUser={currentUser}
              onViewDetails={onViewDetails}
              onProposeSwap={onProposeSwap}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-xl border border-[#DFDAD0] space-y-4 max-w-lg mx-auto p-8">
          <h3 className="font-editorial text-2xl font-bold text-[#1C1A17]">
            No culinary techniques found
          </h3>
          <p className="text-xs text-[#6B6559] leading-relaxed">
            No active exchanges match your selected filter criteria. Try expanding your search or resetting filters to explore all community barters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedFormat('all');
              setSelectedDifficulty('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1C1A17] hover:bg-[#33302B] rounded-md transition-colors cursor-pointer"
          >
            Show All Techniques
          </button>
        </div>
      )}
    </div>
  );
};
