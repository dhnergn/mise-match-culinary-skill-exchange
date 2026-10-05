import React, { useState, useEffect } from 'react';
import { CookProfile, CulinarySkill, SwapProposal } from '../types/exchange';
import { Play, Pause, RotateCcw, Check, MessageSquare, Video, VideoOff, Mic, MicOff, Award, Star, ChefHat, Clock, AlertTriangle } from 'lucide-react';

interface LiveKitchenSessionProps {
  proposal: SwapProposal | null;
  currentUser: CookProfile;
  allCooks: CookProfile[];
  onCompleteSession: (proposalId: string, rating: number, endorsement: string) => void;
  onExitSession: () => void;
}

interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  time: string;
  isSelf: boolean;
}

export const LiveKitchenSession: React.FC<LiveKitchenSessionProps> = ({
  proposal,
  currentUser,
  allCooks,
  onCompleteSession,
  onExitSession,
}) => {
  // If no proposal is passed, grab a fallback or create simulated session
  const fallbackPartner = allCooks.find((c) => c.id !== currentUser.id) || allCooks[1];
  const partner = proposal
    ? allCooks.find((c) => (proposal.proposerId === currentUser.id ? c.id === proposal.receiverId : c.id === proposal.proposerId)) || fallbackPartner
    : fallbackPartner;

  const mySkill = currentUser.teachingSkills[0];
  const partnerSkill = partner.teachingSkills[0];

  // Camera & Mic states
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);

  // Active Station Focus: either Teacher Demo or Hands-on Practice
  const [activeStage, setActiveStage] = useState<'teacher_demo' | 'learner_practice'>('teacher_demo');

  // Interactive Checklist of milestones
  const [milestones, setMilestones] = useState([
    { id: 'm1', label: 'Station Sanitization & Mise en Place temperature check', done: true },
    { id: 'm2', label: 'Live Demonstration: Hand placement & dough/flame dynamics', done: true },
    { id: 'm3', label: 'Guided Hands-on Attempt: Partner performs fold & cut', done: false },
    { id: 'm4', label: 'Baking / Sauté execution under synchronous supervision', done: false },
    { id: 'm5', label: 'Crumb / Flavor evaluation & reciprocal culinary critique', done: false },
  ]);

  // Dual Kitchen Timers
  const [timer1Seconds, setTimer1Seconds] = useState(15 * 60); // 15 min
  const [timer1Running, setTimer1Running] = useState(false);
  const [timer1Label, setTimer1Label] = useState('Dough Chill & Rest');

  const [timer2Seconds, setTimer2Seconds] = useState(8 * 60); // 8 min
  const [timer2Running, setTimer2Running] = useState(false);
  const [timer2Label, setTimer2Label] = useState('Convection Oven Spring');

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      senderName: partner.name,
      senderAvatar: partner.avatar,
      text: 'My station is all prepped. Thermometer says the marble slab is 15°C.',
      time: '11:02 AM',
      isSelf: false,
    },
    {
      id: 'c2',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: 'Perfect temperature! Look at my camera — I am squaring the butter block now.',
      time: '11:03 AM',
      isSelf: true,
    },
    {
      id: 'c3',
      senderName: partner.name,
      senderAvatar: partner.avatar,
      text: 'Got it, copying your finger placement right now.',
      time: '11:05 AM',
      isSelf: false,
    },
  ]);
  const [inputChat, setInputChat] = useState('');

  // Endorse & Complete Modal
  const [showEndorseModal, setShowEndorseModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [endorsementText, setEndorsementText] = useState('Exceptional teacher with surgical precision and deep ingredient respect.');

  // Timer 1 effect
  useEffect(() => {
    let interval: any = null;
    if (timer1Running && timer1Seconds > 0) {
      interval = setInterval(() => setTimer1Seconds((s) => s - 1), 1000);
    } else if (timer1Seconds === 0) {
      setTimer1Running(false);
    }
    return () => clearInterval(interval);
  }, [timer1Running, timer1Seconds]);

  // Timer 2 effect
  useEffect(() => {
    let interval: any = null;
    if (timer2Running && timer2Seconds > 0) {
      interval = setInterval(() => setTimer2Seconds((s) => s - 1), 1000);
    } else if (timer2Seconds === 0) {
      setTimer2Running(false);
    }
    return () => clearInterval(interval);
  }, [timer2Running, timer2Seconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: inputChat.trim(),
      time: 'Just now',
      isSelf: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputChat('');
  };

  const handleConfirmCompletion = () => {
    if (proposal) {
      onCompleteSession(proposal.id, selectedRating, endorsementText);
    } else {
      setShowEndorseModal(false);
      onExitSession();
    }
  };

  const completedCount = milestones.filter((m) => m.done).length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  return (
    <div className="space-y-6">
      
      {/* Session Top Bar */}
      <div className="p-4 bg-white rounded-xl border border-[#DFDAD0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#87653F] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Kitchen Session Active</span>
            <span aria-hidden="true">·</span>
            <span>{proposal?.format || 'Virtual Dual-Kitchen'}</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[#1C1A17]">
            {mySkill.title} &harr; {partnerSkill.title}
          </h2>
          <div className="text-xs text-[#6B6559] mt-0.5">
            Mentoring exchange with <span className="font-semibold text-[#1C1A17]">{partner.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEndorseModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1C1A17] hover:bg-[#33302B] rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Certify &amp; Complete Swap</span>
          </button>

          <button
            onClick={onExitSession}
            className="px-3.5 py-2 text-xs font-medium text-[#6B6559] hover:text-[#1C1A17] bg-[#F1EFEA] hover:bg-[#E5E1D6] rounded-md transition-colors cursor-pointer"
          >
            Leave Session
          </button>
        </div>
      </div>

      {/* Main Grid: Left Dual Camera & Timers (8 cols), Right Checklist & Intercom (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Video Stations & Kitchen Timers */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Dual Camera Station Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Camera Feed 1: Host / Teacher Station */}
            <div className="bg-[#1C1A17] rounded-xl overflow-hidden border border-[#38342D] relative flex flex-col justify-between aspect-video sm:aspect-4/3 text-white">
              {/* Top info overlay */}
              <div className="p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-xs z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold">Station 1: {currentUser.name} (You)</span>
                </div>
                <span className="text-[11px] text-stone-300">Teaching Mode</span>
              </div>

              {/* Simulated Camera Video Surface */}
              {cameraActive ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#292621]">
                  <img
                    src={mySkill.heroImage || currentUser.avatar}
                    alt="Kitchen stream"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#262420] text-stone-400">
                  <VideoOff className="w-8 h-8 mb-2" />
                  <span className="text-xs">Camera Feed Paused</span>
                </div>
              )}

              {/* Bottom control bar */}
              <div className="p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between z-10 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCameraActive(!cameraActive)}
                    className="p-1.5 rounded bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
                    title={cameraActive ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {cameraActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setMicActive(!micActive)}
                    className="p-1.5 rounded bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
                    title={micActive ? 'Mute microphone' : 'Unmute microphone'}
                  >
                    {micActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <span className="text-[11px] text-stone-300 font-mono">1080p · 60fps Kitchen Cam</span>
              </div>
            </div>

            {/* Camera Feed 2: Partner / Student Station */}
            <div className="bg-[#1C1A17] rounded-xl overflow-hidden border border-[#38342D] relative flex flex-col justify-between aspect-video sm:aspect-4/3 text-white">
              {/* Top info overlay */}
              <div className="p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-xs z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold">Station 2: {partner.name}</span>
                </div>
                <span className="text-[11px] text-stone-300">Hands-on Student</span>
              </div>

              {/* Simulated Camera Video Surface */}
              <div className="absolute inset-0 flex items-center justify-center bg-[#292621]">
                <img
                  src={partnerSkill.heroImage || partner.avatar}
                  alt="Partner kitchen stream"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Bottom bar */}
              <div className="p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between z-10 text-xs">
                <span className="text-[11px] text-stone-300">{partner.location.split('·')[0]}</span>
                <span className="text-[11px] text-stone-300 font-mono">Mic Live · Audio Clear</span>
              </div>
            </div>

          </div>

          {/* Precision Kitchen Timers */}
          <div className="p-5 bg-white rounded-xl border border-[#DFDAD0] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider">
                Precision Culinary Timers
              </span>
              <span className="text-xs text-[#706B5F]">Synchronous countdown</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Timer 1 */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE9E0] flex items-center justify-between">
                <div>
                  <input
                    type="text"
                    value={timer1Label}
                    onChange={(e) => setTimer1Label(e.target.value)}
                    className="text-xs font-semibold text-[#1C1A17] bg-transparent border-b border-transparent hover:border-[#C4BEB2] focus:outline-none"
                  />
                  <div className="font-mono text-3xl font-bold tabular-nums text-[#1C1A17] mt-1">
                    {formatTime(timer1Seconds)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setTimer1Running(!timer1Running)}
                    className="p-2 rounded-md bg-[#1C1A17] hover:bg-[#33302B] text-white cursor-pointer transition-colors"
                  >
                    {timer1Running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setTimer1Running(false);
                      setTimer1Seconds(15 * 60);
                    }}
                    className="p-2 rounded-md bg-[#EDEAE3] hover:bg-[#DDD8CD] text-[#544F43] cursor-pointer transition-colors"
                    title="Reset to 15 min"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Timer 2 */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE9E0] flex items-center justify-between">
                <div>
                  <input
                    type="text"
                    value={timer2Label}
                    onChange={(e) => setTimer2Label(e.target.value)}
                    className="text-xs font-semibold text-[#1C1A17] bg-transparent border-b border-transparent hover:border-[#C4BEB2] focus:outline-none"
                  />
                  <div className="font-mono text-3xl font-bold tabular-nums text-[#1C1A17] mt-1">
                    {formatTime(timer2Seconds)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setTimer2Running(!timer2Running)}
                    className="p-2 rounded-md bg-[#1C1A17] hover:bg-[#33302B] text-white cursor-pointer transition-colors"
                  >
                    {timer2Running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setTimer2Running(false);
                      setTimer2Seconds(8 * 60);
                    }}
                    className="p-2 rounded-md bg-[#EDEAE3] hover:bg-[#DDD8CD] text-[#544F43] cursor-pointer transition-colors"
                    title="Reset to 8 min"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Milestones & Live Intercom */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Technique Milestones Checklist */}
          <div className="p-5 bg-white rounded-xl border border-[#DFDAD0] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider block">
                  Curriculum Progress
                </span>
                <span className="text-[11px] text-[#706B5F]">
                  {completedCount} of {milestones.length} milestones complete
                </span>
              </div>
              <span className="font-mono tabular-nums text-xs font-bold text-[#1C1A17]">
                {progressPercent}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#EAE7DF] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1C1A17] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-2 pt-1">
              {milestones.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-start gap-2.5 p-2 rounded-md transition-colors cursor-pointer text-xs ${
                    m.done ? 'bg-[#F5F8F5] text-[#345942]' : 'hover:bg-[#FAF8F5] text-[#33302A]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={m.done}
                    onChange={() => handleToggleMilestone(m.id)}
                    className="mt-0.5 accent-[#1C1A17]"
                  />
                  <span className={m.done ? 'line-through text-[#666053]' : 'font-medium'}>
                    {m.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Live Kitchen Intercom & Chat */}
          <div className="p-5 bg-white rounded-xl border border-[#DFDAD0] flex flex-col h-88 justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE7DF]">
              <span className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider">
                Kitchen Intercom
              </span>
              <span className="text-[11px] text-[#706B5F]">Instant culinary notes</span>
            </div>

            {/* Message list */}
            <div className="overflow-y-auto space-y-2.5 my-2 pr-1 scrollbar-none">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col text-xs ${msg.isSelf ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-[#8C867B] mb-0.5">
                    {msg.senderName} · {msg.time}
                  </div>
                  <div
                    className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed ${
                      msg.isSelf
                        ? 'bg-[#1C1A17] text-white rounded-br-none'
                        : 'bg-[#F2EFE8] text-[#292621] rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#EAE7DF]">
              <input
                type="text"
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                placeholder="Ask about dough, flame, or temp..."
                className="flex-1 bg-[#FAF8F5] border border-[#D5D0C5] rounded px-3 py-1.5 text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1C1A17] hover:bg-[#33302B] rounded transition-colors cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Certification Modal */}
      {showEndorseModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#D5D0C5] p-6 space-y-5 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#1C1A17] text-amber-300 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#1C1A17]">
                Certify Culinary Exchange
              </h3>
              <p className="text-xs text-[#6B6559]">
                Award verified technique completion and leave an endorsement for {partner.name}.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block font-semibold text-[#1C1A17]">
                Mentorship Rating:
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= selectedRating
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-[#D5D0C5]'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-[#1C1A17] mb-1">
                  Culinary Endorsement &amp; Written Review:
                </label>
                <textarea
                  rows={3}
                  value={endorsementText}
                  onChange={(e) => setEndorsementText(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5D0C5] rounded p-2.5 text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEndorseModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#706B5F] hover:text-[#1C1A17]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCompletion}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1C1A17] hover:bg-[#33302B] rounded-md transition-colors"
              >
                Confirm &amp; Award Badge
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
