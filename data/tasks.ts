export type Task = {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  completed: boolean;
};

export const todayScreenMeta = {
  greetingName: 'Max',
  summaryPrefix: 'You have',
  summaryValue: '7 tasks today',
  tasksRemaining: 4,
} as const;

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Refine onboarding flow copy',
    project: 'Product',
    dueDate: 'Today, 10:30',
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Sync with design on empty states',
    project: 'Design',
    dueDate: 'Today, 11:45',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Review API pagination edge cases',
    project: 'Backend',
    dueDate: 'Today, 13:00',
    completed: false,
  },
  {
    id: 'task-4',
    title: 'Prepare sprint demo notes',
    project: 'Team',
    dueDate: 'Today, 14:30',
    completed: false,
  },
  {
    id: 'task-5',
    title: 'Update QA checklist for release',
    project: 'QA',
    dueDate: 'Today, 16:00',
    completed: false,
  },
  {
    id: 'task-6',
    title: 'Fix calendar timezone mismatch',
    project: 'Mobile',
    dueDate: 'Today, 17:15',
    completed: false,
  },
  {
    id: 'task-7',
    title: 'Plan priorities for tomorrow',
    project: 'Personal',
    dueDate: 'Today, 18:00',
    completed: false,
  },
];
