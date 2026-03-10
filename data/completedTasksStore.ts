import { useSyncExternalStore } from 'react';

import { ScreenTab, Task } from './tasks';

export type CompletedTask = Task & {
  completedAt: string;
  sourceTab: ScreenTab;
};

let completedTasks: CompletedTask[] = [];
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function addTaskToCompleted(task: Task, sourceTab: ScreenTab) {
  const alreadyAdded = completedTasks.some(
    (item) => item.id === task.id && item.sourceTab === sourceTab,
  );

  if (alreadyAdded) {
    return;
  }

  completedTasks = [
    {
      ...task,
      completed: true,
      sourceTab,
      completedAt: new Date().toISOString(),
    },
    ...completedTasks,
  ];

  emitChange();
}

export function getCompletedTasks(): CompletedTask[] {
  return completedTasks;
}

export function clearCompletedTasks() {
  completedTasks = [];
  emitChange();
}

export function subscribeCompletedTasks(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useCompletedTasks() {
  return useSyncExternalStore(
    subscribeCompletedTasks,
    getCompletedTasks,
    getCompletedTasks,
  );
}
