export type TodaySubtitleState =
  | 'fresh_start'
  | 'calm_day'
  | 'busy_day'
  | 'light_day'
  | 'evening_wrap_up'
  | 'empty_today';

export type TodayTimeBlock = 'morning' | 'day' | 'evening';

export const subtitleSets: Record<TodaySubtitleState, string[]> = {
  fresh_start: [
    'A new day, gently ahead.',
    'Let’s begin with clarity.',
    'A fresh start for what matters.',
    'The day starts here.',
    'One clear step at a time.',
    'A good moment to begin.',
    'Start light, move clearly.',
    'Today begins with focus.',
    'Let’s set the tone for today.',
    'A calm start goes far.',
  ],
  calm_day: [
    'A calm day to move forward.',
    'Let’s keep today clear.',
    'Steady progress starts here.',
    'There’s room to focus today.',
    'A clear day for meaningful work.',
    'Keep it simple today.',
    'One thing, then the next.',
    'A balanced day ahead.',
    'Let today unfold clearly.',
    'Quiet progress counts.',
  ],
  busy_day: [
    'One clear step at a time.',
    'Let’s keep the day in order.',
    'Focus on what matters first.',
    'A full day, handled calmly.',
    'Keep space for the important.',
    'Clarity helps on busy days.',
    'Start with one thing.',
    'A lot today, but still manageable.',
    'Move through it with focus.',
    'Let’s make today feel lighter.',
  ],
  light_day: [
    'A lighter day ahead.',
    'Room to breathe today.',
    'Just a few things for today.',
    'A calm day with space.',
    'Light progress is still progress.',
    'There’s time to move gently.',
    'A simple day can go far.',
    'Keep today easy and clear.',
    'A little structure, plenty of space.',
    'Not much — just enough.',
  ],
  evening_wrap_up: [
    'Let’s close the day gently.',
    'A good time to wrap things up.',
    'Finish what still matters.',
    'The day is slowing down.',
    'A few final steps for today.',
    'Let the day land softly.',
    'Time to clear the last things.',
    'Wrap up with clarity.',
    'A quiet close to the day.',
    'End the day a little lighter.',
  ],
  empty_today: [
    'Nothing planned for today.',
    'A clear page for today.',
    'Today is open.',
    'A calm day, unplanned.',
    'Space is part of the plan.',
    'Nothing waiting right now.',
    'The day is yours.',
    'An open day ahead.',
    'No tasks, just room.',
    'A quiet start with no agenda.',
  ],
};

export type TodaySubtitleContext = {
  dateKey: string;
  subtitle: string;
  state: TodaySubtitleState;
  timeBlock: TodayTimeBlock;
  contextKey: string;
};

export function getCurrentTimeBlock(date: Date): TodayTimeBlock {
  const hour = date.getHours();
  if (hour < 11) {
    return 'morning';
  }
  if (hour >= 18) {
    return 'evening';
  }
  return 'day';
}

export function getTodaySubtitleState(todayTasksCount: number, now: Date): TodaySubtitleState {
  const hour = now.getHours();

  if (todayTasksCount === 0) {
    return 'empty_today';
  }
  if (hour >= 18) {
    return 'evening_wrap_up';
  }
  if (hour < 11) {
    return 'fresh_start';
  }
  if (todayTasksCount >= 1 && todayTasksCount <= 3) {
    return 'light_day';
  }
  if (todayTasksCount >= 4 && todayTasksCount <= 6) {
    return 'calm_day';
  }
  return 'busy_day';
}

export function getStableSubtitleForContext(params: {
  dateKey: string;
  state: TodaySubtitleState;
  timeBlock: TodayTimeBlock;
}): string {
  const { dateKey, state, timeBlock } = params;
  const lines = subtitleSets[state];
  const stableSeed = `${dateKey}:${state}:${timeBlock}`;
  const index = hashString(stableSeed) % lines.length;
  return lines[index];
}

export function getTodaySubtitleContext(params: {
  now: Date;
  todayTasksCount: number;
}): TodaySubtitleContext {
  const { now, todayTasksCount } = params;
  const dateKey = getLocalDateKey(now);
  const timeBlock = getCurrentTimeBlock(now);
  const state = getTodaySubtitleState(todayTasksCount, now);
  const subtitle = getStableSubtitleForContext({ dateKey, state, timeBlock });
  const contextKey = `${dateKey}:${state}:${timeBlock}`;

  return {
    dateKey,
    state,
    timeBlock,
    subtitle,
    contextKey,
  };
}

export function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}
