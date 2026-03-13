export type Task = {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  completed: boolean;
  sortOrder?: number;
};

export type ScreenTab = 'Today' | 'Upcoming' | 'Project';

type TabContent = {
  title: string;
  summaryPrefix: string;
  summaryValue: string;
  tasks: Task[];
};

const todayTasks: Task[] = [
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

const upcomingTasks: Task[] = [
  {
    id: 'upcoming-1',
    title: 'Prepare release notes draft',
    project: 'Product',
    dueDate: 'Tomorrow, 09:30',
    completed: false,
  },
  {
    id: 'upcoming-2',
    title: 'Finalize animation specs',
    project: 'Design',
    dueDate: 'Tomorrow, 12:00',
    completed: false,
  },
  {
    id: 'upcoming-3',
    title: 'Load test notifications service',
    project: 'Backend',
    dueDate: 'Thu, 11:00',
    completed: false,
  },
];

const projectTasks: Task[] = [
  {
    id: 'project-1',
    title: 'TaskFlow iOS polishing pass',
    project: 'TaskFlow Mobile',
    dueDate: 'Sprint 12',
    completed: false,
  },
  {
    id: 'project-2',
    title: 'Shared API contracts review',
    project: 'Core Platform',
    dueDate: 'Sprint 12',
    completed: false,
  },
  {
    id: 'project-3',
    title: 'Design system token sync',
    project: 'Foundation',
    dueDate: 'Sprint 13',
    completed: false,
  },
];

export const todayScreenData: {
  greetingName: string;
  tabs: Record<ScreenTab, TabContent>;
} = {
  greetingName: 'Max',
  tabs: {
    Today: {
      title: 'Today',
      summaryPrefix: 'You have',
      summaryValue: '7 tasks today',
      tasks: todayTasks,
    },
    Upcoming: {
      title: 'Upcoming',
      summaryPrefix: 'You have',
      summaryValue: '3 tasks soon',
      tasks: upcomingTasks,
    },
    Project: {
      title: 'Project',
      summaryPrefix: 'You have',
      summaryValue: '3 active now',
      tasks: projectTasks,
    },
  },
};

// Backward-compatible exports for components that still import the old API.
export const todayScreenMeta = {
  greetingName: todayScreenData.greetingName,
  summaryPrefix: todayScreenData.tabs.Today.summaryPrefix,
  summaryValue: todayScreenData.tabs.Today.summaryValue,
  tasksRemaining: 4,
} as const;

export const tasks: Task[] = todayTasks;
