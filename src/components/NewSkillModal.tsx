import React, { useState } from 'react';
import { CulinarySkill, SkillCategory, SkillDifficulty, SyllabusPhase } from '../types/exchange';
import { X, Plus, Trash2, ChefHat } from 'lucide-react';

interface NewSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSkill: (skill: CulinarySkill) => void;
}

export const NewSkillModal: React.FC<NewSkillModalProps> = ({
  isOpen,
  onClose,
  onAddSkill,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SkillCategory>('baking');
  const [difficulty, setDifficulty] = useState<SkillDifficulty>('Intermediate');
  const [duration, setDuration] = useState('2.0 hours');
  const [summary, setSummary] = useState('');
  const [equipmentInput, setEquipmentInput] = useState('Digital kitchen scale, Heavy cutting board, Thermometer');
  const [pantryInput, setPantryInput] = useState('High-protein unbleached flour, High-fat butter, Sea salt');
  const [safetyNotes, setSafetyNotes] = useState('Keep ambient kitchen temperatures controlled.');

  const [phases, setPhases] = useState<Array<{ title: string; technique: string; duration: number }>>([
    { title: 'Substrate & Ingredient Preparation', technique: 'Accurate thermal and hydration measurement', duration: 30 },
    { title: 'Core Manipulation & Technique Execution', technique: 'Precise motor mechanics and gluten/heat control', duration: 45 },
    { title: 'Baking / Finishing & Evaluation', technique: 'Visual and aromatic doneness indicators', duration: 45 },
  ]);

  const handleAddPhase = () => {
    setPhases((prev) => [
      ...prev,
      { title: 'Advanced Refinement', technique: 'Micro-adjustment based on texture feedback', duration: 30 },
    ]);
  };

  const handleRemovePhase = (index: number) => {
    if (phases.length <= 1) return;
    setPhases((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const syllabus: SyllabusPhase[] = phases.map((p, idx) => ({
      phaseNumber: idx + 1,
      phaseTitle: p.title,
      durationMinutes: p.duration,
      keyTechnique: p.technique,
      instructions: `Step-by-step hands-on training focusing on ${p.technique}.`,
    }));

    const newSkill: CulinarySkill = {
      id: `skill_${Date.now()}`,
      title: title.trim(),
      category,
      difficulty,
      duration,
      summary: summary.trim(),
      heroImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80',
      syllabus,
      equipmentNeeded: equipmentInput.split(',').map((s) => s.trim()).filter(Boolean),
      pantryPrerequisites: pantryInput.split(',').map((s) => s.trim()).filter(Boolean),
      safetyNotes: safetyNotes.trim() || undefined,
    };

    onAddSkill(newSkill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-[#FBFBF9] rounded-2xl max-w-2xl w-full border border-[#D5D0C5] shadow-2xl overflow-hidden">
        
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-[#E7E4DC] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#706B5F]">
            <span className="font-semibold text-[#87653F] uppercase tracking-wider">
              Curriculum Builder
            </span>
            <span aria-hidden="true">·</span>
            <span>List a Technique to Barter</span>
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
              List a Technique You Can Teach
            </h2>
            <p className="text-xs text-[#595448] mt-1">
              Specify your culinary craft and structured curriculum for fellow barter cooks.
            </p>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1A17] mb-1">
                Technique Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Traditional Roman Cacio e Pepe Emulsion"
                className="w-full bg-white border border-[#D5D0C5] rounded px-3 py-2 text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1A17] mb-1">
                Craft Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
                className="w-full bg-white border border-[#D5D0C5] rounded px-3 py-2 text-xs text-[#1C1A17] focus:outline-none"
              >
                <option value="baking">Baking &amp; Lamination</option>
                <option value="wok">Wok &amp; High-Heat</option>
                <option value="pasta">Hand-Rolled Pasta</option>
                <option value="fermentation">Fermentation &amp; Koji</option>
                <option value="knife">Knife &amp; Sharpening</option>
                <option value="sauces">Stocks &amp; Emulsified Sauces</option>
                <option value="regional">Heritage &amp; Regional</option>
                <option value="confectionery">Confectionery &amp; Chocolate</option>
              </select>
            </div>
          </div>

          {/* Difficulty & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1A17] mb-1">
                Proficiency Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as SkillDifficulty)}
                className="w-full bg-white border border-[#D5D0C5] rounded px-3 py-2 text-xs text-[#1C1A17] focus:outline-none"
              >
                <option value="Foundational">Foundational</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Mastery">Mastery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1A17] mb-1">
                Estimated Session Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2.5 hours"
                className="w-full bg-white border border-[#D5D0C5] rounded px-3 py-2 text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                required
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1A17] mb-1">
              Technique Summary &amp; Learning Value
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What makes this skill unique? What will your barter partner achieve by the end of the session?"
              className="w-full bg-white border border-[#D5D0C5] rounded p-3 text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
              required
            />
          </div>

          {/* Hands-on Curriculum Milestones */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#1C1A17] uppercase tracking-wider">
                Hands-on Technique Milestones ({phases.length} Phases)
              </label>
              <button
                type="button"
                onClick={handleAddPhase}
                className="text-xs text-[#87653F] hover:underline cursor-pointer flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Milestone
              </button>
            </div>

            <div className="space-y-2.5">
              {phases.map((ph, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-lg border border-[#DFDAD0] flex items-center gap-3 text-xs"
                >
                  <span className="font-mono font-bold text-[#8C867B] w-6 shrink-0">
                    0{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={ph.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPhases((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, title: val } : item))
                      );
                    }}
                    placeholder="Milestone title..."
                    className="flex-1 bg-transparent border-b border-[#EAE7DF] pb-1 focus:outline-none focus:border-[#1C1A17]"
                  />
                  <input
                    type="text"
                    value={ph.technique}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPhases((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, technique: val } : item))
                      );
                    }}
                    placeholder="Core technique focus..."
                    className="flex-1 bg-transparent border-b border-[#EAE7DF] pb-1 focus:outline-none focus:border-[#1C1A17]"
                  />
                  <div className="w-20 shrink-0 flex items-center gap-1">
                    <input
                      type="number"
                      value={ph.duration}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 15;
                        setPhases((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, duration: val } : item))
                        );
                      }}
                      className="w-12 bg-transparent border-b border-[#EAE7DF] pb-1 font-mono text-center focus:outline-none focus:border-[#1C1A17]"
                    />
                    <span className="text-[#8C867B]">min</span>
                  </div>
                  {phases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhase(idx)}
                      className="p-1 text-[#8C867B] hover:text-[#99281B] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Equipment & Pantry Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1A17] mb-1">
                Required Equipment (comma separated)
              </label>
              <input
                type="text"
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                className="w-full bg-white border border-[#D5D0C5] rounded px-3 py-2 text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1A17] mb-1">
                Pantry Ingredients (comma separated)
              </label>
              <input
                type="text"
                value={pantryInput}
                onChange={(e) => setPantryInput(e.target.value)}
                className="w-full bg-white border border-[#D5D0C5] rounded px-3 py-2 text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
              />
            </div>
          </div>

          {/* Safety note */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1A17] mb-1">
              Safety or Temperature Instructions
            </label>
            <input
              type="text"
              value={safetyNotes}
              onChange={(e) => setSafetyNotes(e.target.value)}
              placeholder="e.g. High heat warning or knife grip safety"
              className="w-full bg-white border border-[#D5D0C5] rounded px-3 py-2 text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
            />
          </div>

          {/* Action buttons */}
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
              Publish Technique to Barter Board
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
