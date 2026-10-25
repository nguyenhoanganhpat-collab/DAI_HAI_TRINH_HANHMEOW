import { useState } from 'react';
import { Team, GameScreen } from './types';
import { INITIAL_QUESTIONS } from './data/questions';
import { ScreenIntro } from './components/ScreenIntro';
import { ScreenTeamSetup } from './components/ScreenTeamSetup';
import { ScreenMainArena } from './components/ScreenMainArena';
import { sounds } from './utils/audio';

const DEFAULT_TEAMS: Team[] = [
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
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('INTRO');
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sounds.enabled = nextState;
  };

  const handleResetGame = () => {
    setTeams(DEFAULT_TEAMS.map((t) => ({ ...t, position: 0, score: 0 })));
    setCurrentScreen('INTRO');
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
