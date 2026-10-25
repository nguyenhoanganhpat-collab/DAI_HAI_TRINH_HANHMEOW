export interface Team {
  id: number;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  position: number; // 0 to MAX_STEPS (e.g. 10)
  score: number;
  history: string[];
}

export interface Question {
  id: number;
  question: string;
  imageUrl?: string;   // URL hoặc base64 ảnh minh họa (tùy chọn)
  options?: string[];
  correct?: number;
  correct_text?: string;
  explain: string;
}

export type TarotActionType = 
  | 'advance_2'
  | 'advance_1'
  | 'stay'
  | 'retreat_2'
  | 'retreat_1'
  | 'prev_advance_1'
  | 'reset_all'
  | 'attack_target'
  | 'boost_last'
  | 'tongue_twister';

export interface TarotCard {
  id: number;
  title: string;
  description?: string;
  actionType: TarotActionType;
  themeColor: string;
  iconName: string;
}

export type GameScreen = 'INTRO' | 'TEAM_SETUP' | 'MAIN_ARENA';
