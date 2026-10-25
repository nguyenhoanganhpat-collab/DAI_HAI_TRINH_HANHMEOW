import { useState } from 'react';
import { Team, GameScreen } from './types';
import { INITIAL_QUESTIONS } from './data/questions';
import { ScreenIntro } from './components/ScreenIntro';
import { ScreenTeamSetup } from './components/ScreenTeamSetup';
import { ScreenMainArena } from './components/ScreenMainArena';
import { sounds } from './utils/audio';

// Full palette of 8 pre-configured teams — users can pick 2–8
export const TEAM_PALETTE: Team[] = [
  {
    id: 1,
    name: 'Hải Tặc Mũ Rơm',
    emoji: '🏴‍☠️',
    color: '#ef4444',
    bgColor: 'bg-red-500',
    borderColor: '#b91c1c',
    position: 0,
    score: 0,
    history: [],
  },
  {
    id: 2,
    name: 'Chiến Hạm Hoàng Gia',
    emoji: '🚢',
    color: '#3b82f6',
    bgColor: 'bg-blue-500',
    borderColor: '#1d4ed8',
    position: 0,
    score: 0,
    history: [],
  },
  {
    id: 3,
    name: 'Thủy Quái Kraken',
    emoji: '🐙',
    color: '#10b981',
    bgColor: 'bg-emerald-500',
    borderColor: '#047857',
    position: 0,
    score: 0,
    history: [],
  },
  {
    id: 4,
    name: 'Mỏ Neo Vàng',
    emoji: '⚓',
    color: '#f59e0b',
    bgColor: 'bg-amber-500',
    borderColor: '#b45309',
    position: 0,
    score: 0,
    history: [],
  },
  {
    id: 5,
    name: 'Vương Miện Hải Vương',
    emoji: '👑',
    color: '#a855f7',
    bgColor: 'bg-purple-500',
    borderColor: '#7e22ce',
    position: 0,
    score: 0,
    history: [],
  },
  {
    id: 6,
    name: 'Pháo Hạm Sấm Sét',
    emoji: '⚡',
    color: '#06b6d4',
    bgColor: 'bg-cyan-500',
    borderColor: '#0e7490',
    position: 0,
    score: 0,
    history: [],
  },
  {
    id: 7,
    name: 'Thần Phong Hải Mã',
    emoji: '🦅',
    color: '#ec4899',
    bgColor: 'bg-pink-500',
    borderColor: '#be185d',
    position: 0,
    score: 0,
    history: [],
  },
  {
    id: 8,
    name: 'Kỳ Lân Đại Dương',
    emoji: '🦄',
    color: '#84cc16',
    bgColor: 'bg-lime-500',
    borderColor: '#4d7c0f',
    position: 0,
    score: 0,
    history: [],
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('INTRO');
  // Default 5 teams, range 2–8
  const [teamCount, setTeamCount] = useState<number>(5);
  const [teams, setTeams] = useState<Team[]>(TEAM_PALETTE.slice(0, 5).map((t) => ({ ...t })));
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sounds.enabled = nextState;
  };

  const handleResetGame = () => {
    setTeams(TEAM_PALETTE.slice(0, teamCount).map((t) => ({ ...t, position: 0, score: 0 })));
    setCurrentScreen('INTRO');
  };

  // Called from ScreenTeamSetup when user changes team count (+/-)
  const handleChangeTeamCount = (newCount: number) => {
    const clamped = Math.max(2, Math.min(8, newCount));
    setTeamCount(clamped);
    // Expand palette slice, preserving any name/emoji edits already made
    setTeams((prev) => {
      if (clamped > prev.length) {
        // Add teams from palette (fresh reset pos/score)
        const added = TEAM_PALETTE.slice(prev.length, clamped).map((t) => ({ ...t, position: 0, score: 0 }));
        return [...prev, ...added];
      }
      // Shrink
      return prev.slice(0, clamped);
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-white">
      {currentScreen === 'INTRO' && (
        <ScreenIntro
          onStart={() => setCurrentScreen('TEAM_SETUP')}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {currentScreen === 'TEAM_SETUP' && (
        <ScreenTeamSetup
          initialTeams={teams}
          teamCount={teamCount}
          fullPalette={TEAM_PALETTE}
          onChangeTeamCount={handleChangeTeamCount}
          onConfirmTeams={(updatedTeams) => {
            setTeams(updatedTeams);
            setCurrentScreen('MAIN_ARENA');
          }}
          onBack={() => setCurrentScreen('INTRO')}
        />
      )}

      {currentScreen === 'MAIN_ARENA' && (
        <ScreenMainArena
          teams={teams}
          questions={INITIAL_QUESTIONS}
          onUpdateTeams={setTeams}
          onResetGame={handleResetGame}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}
    </div>
  );
}
