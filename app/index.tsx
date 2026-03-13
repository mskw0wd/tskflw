import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FooterBar from '../components/FooterBar';
import ReorderableTaskList from '../components/ReorderableTaskList';
import TaskActionsBottomSheet from '../components/TaskActionsBottomSheet';
import TodayHeader, { type NotificationIconState } from '../components/TodayHeader';
import { Colors, Spacing, TextStyles } from '../constants/theme';
import { addTaskToCompleted } from '../data/completedTasksStore';
import { ScreenTab, Task, todayScreenData } from '../data/tasks';

const TABS: ScreenTab[] = ['Today', 'Upcoming', 'Project'];

type RemovingReason = 'complete' | 'delete';

type RemovingTaskReasonsByTab = Record<ScreenTab, Record<string, RemovingReason>>;

type TaskTargetContext = {
  tab: ScreenTab;
  taskId: string;
};

type TabPageProps = {
  tab: ScreenTab;
  tasks: Task[];
  removingTaskReasons: Record<string, RemovingReason>;
  selectedTaskId: string | null;
  isActiveTab: boolean;
  onToggleTask: (id: string) => void;
  onTaskHidden: (id: string) => void;
  onOpenTaskActions: (id: string) => void;
  onReorderTasks: (tasks: Task[]) => void;
  onTaskDragStart: (taskId: string) => void;
  onTaskDragEnd: () => void;
};

type AnimatedSegmentedHeaderProps = {
  swipeX: Animated.Value;
  pageWidth: number;
  tasksByTab: Record<ScreenTab, Task[]>;
};

function getSummaryValue(tab: ScreenTab, count: number) {
  if (tab === 'Upcoming') {
    return `${count} tasks soon`;
  }

  if (tab === 'Project') {
    return `${count} active now`;
  }

  return `${count} tasks today`;
}

function formatDueDateLabel(now: Date) {
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `Today, ${hours}:${minutes}`;
}

function buildTaskLink(taskId: string) {
  return `lumi://task/${taskId}`;
}

function withSortOrder(tasks: Task[]) {
  return tasks.map((task, index) => ({
    ...task,
    sortOrder: index,
  }));
}

function TabPage({
  tab,
  tasks,
  removingTaskReasons,
  selectedTaskId,
  isActiveTab,
  onToggleTask,
  onTaskHidden,
  onOpenTaskActions,
  onReorderTasks,
  onTaskDragStart,
  onTaskDragEnd,
}: TabPageProps) {
  return (
    <ReorderableTaskList
      tasks={tasks}
      showDueDate={tab !== 'Today'}
      removingTaskIds={Object.keys(removingTaskReasons).reduce<Record<string, boolean>>((acc, taskId) => {
        acc[taskId] = Boolean(removingTaskReasons[taskId]);
        return acc;
      }, {})}
      selectedTaskId={selectedTaskId}
      isActiveTab={isActiveTab}
      onToggleTask={onToggleTask}
      onTaskHidden={onTaskHidden}
      onOpenTaskActions={onOpenTaskActions}
      onReorderTasks={onReorderTasks}
      onDragStart={onTaskDragStart}
      onDragEnd={onTaskDragEnd}
    />
  );
}

function AnimatedSegmentedHeader({ swipeX, pageWidth, tasksByTab }: AnimatedSegmentedHeaderProps) {
  return (
    <View style={styles.segmentedAnimatedViewport}>
      {TABS.map((tab, index) => {
        const tabContent = todayScreenData.tabs[tab];
        const tasksCount = tasksByTab[tab].length;

        const opacity = swipeX.interpolate({
          inputRange: [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth],
          outputRange: [0, 1, 0],
          extrapolate: 'clamp',
        });

        const translateY = swipeX.interpolate({
          inputRange: [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth],
          outputRange: [8, 0, -8],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={tab}
            pointerEvents="none"
            style={[
              styles.segmentedLayer,
              {
                opacity,
              },
            ]}
          >
            <View style={styles.segmentedTab}>
              <Animated.View style={{ transform: [{ translateY }] }}>
                <Text style={TextStyles.screenTitle}>{tabContent.title}</Text>
              </Animated.View>

              <View style={styles.summaryRow}>
                <Text style={TextStyles.summaryMuted} numberOfLines={1}>
                  {tabContent.summaryPrefix}
                </Text>
                <Text style={TextStyles.summaryStrong} numberOfLines={1}>
                  {getSummaryValue(tab, tasksCount)}
                </Text>
              </View>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

export default function TodayScreen() {
  const { width: screenWidth } = useWindowDimensions();

  const swipeX = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState<ScreenTab>('Today');
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [tasksByTab, setTasksByTab] = useState<Record<ScreenTab, Task[]>>({
    Today: withSortOrder(todayScreenData.tabs.Today.tasks.map((task) => ({ ...task }))),
    Upcoming: withSortOrder(todayScreenData.tabs.Upcoming.tasks.map((task) => ({ ...task }))),
    Project: withSortOrder(todayScreenData.tabs.Project.tasks.map((task) => ({ ...task }))),
  });
  const [removingTaskReasonsByTab, setRemovingTaskReasonsByTab] = useState<RemovingTaskReasonsByTab>({
    Today: {},
    Upcoming: {},
    Project: {},
  });
  const [taskActionsContext, setTaskActionsContext] = useState<TaskTargetContext | null>(null);
  const [isTaskActionsVisible, setIsTaskActionsVisible] = useState(false);
  const [isListDragging, setIsListDragging] = useState(false);

  const triggerHaptic = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const notificationState: NotificationIconState = isNotificationCenterOpen
    ? 'pressed'
    : hasNewNotification
      ? 'new'
      : 'default';
  const selectedTask =
    taskActionsContext
      ? tasksByTab[taskActionsContext.tab].find((task) => task.id === taskActionsContext.taskId) ?? null
      : null;

  useEffect(() => {
    const activeIndex = TABS.indexOf(activeTab);
    if (activeIndex < 0) {
      return;
    }

    Animated.timing(swipeX, {
      toValue: activeIndex * screenWidth,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [activeTab, screenWidth, swipeX]);

  const handleFooterTabPress = (tab: ScreenTab) => {
    if (isListDragging) {
      return;
    }

    if (tab === activeTab) {
      return;
    }

    if (isTaskActionsVisible) {
      handleTaskActionsClose();
    }

    triggerHaptic();
    setActiveTab(tab);
  };

  const handleToggleTask = (tab: ScreenTab, taskId: string) => {
    let didStartRemoving = false;

    setRemovingTaskReasonsByTab((prev) => {
      if (prev[tab][taskId]) {
        return prev;
      }

      didStartRemoving = true;
      return {
        ...prev,
        [tab]: {
          ...prev[tab],
          [taskId]: 'complete',
        },
      };
    });

    if (!didStartRemoving) {
      return;
    }

    setTasksByTab((prev) => ({
      ...prev,
      [tab]: prev[tab].map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: true,
            }
          : task,
      ),
    }));
  };

  const handleTaskHidden = (tab: ScreenTab, taskId: string) => {
    const removingReason = removingTaskReasonsByTab[tab][taskId];

    setTasksByTab((prev) => {
      const taskToComplete = prev[tab].find((task) => task.id === taskId);
      if (taskToComplete && removingReason === 'complete') {
        addTaskToCompleted(taskToComplete, tab);
      }

      return {
        ...prev,
        [tab]: withSortOrder(prev[tab].filter((task) => task.id !== taskId)),
      };
    });

    setRemovingTaskReasonsByTab((prev) => {
      const nextTabRemoving = { ...prev[tab] };
      delete nextTabRemoving[taskId];
      return {
        ...prev,
        [tab]: nextTabRemoving,
      };
    });

    if (taskActionsContext?.tab === tab && taskActionsContext.taskId === taskId) {
      setTaskActionsContext(null);
      setIsTaskActionsVisible(false);
    }
  };

  const handleTaskActionsClose = () => {
    setIsTaskActionsVisible(false);
    setTaskActionsContext(null);
  };

  const handleTaskActionsOpen = (tab: ScreenTab, taskId: string) => {
    if (isListDragging || removingTaskReasonsByTab[tab][taskId]) {
      return;
    }

    triggerHaptic();
    setTaskActionsContext({ tab, taskId });
    setIsTaskActionsVisible(true);
  };

  const handleTaskDragStart = (tab: ScreenTab, taskId: string) => {
    if (removingTaskReasonsByTab[tab][taskId]) {
      return;
    }

    if (isTaskActionsVisible) {
      handleTaskActionsClose();
    }

    triggerHaptic();
    setIsListDragging(true);
  };

  const handleTaskDragEnd = () => {
    setIsListDragging(false);
  };

  const handleReorderTasks = (tab: ScreenTab, nextTasks: Task[]) => {
    setTasksByTab((prev) => ({
      ...prev,
      [tab]: withSortOrder(nextTasks),
    }));
  };

  const handleDeleteTask = () => {
    if (!taskActionsContext) {
      return;
    }

    const { tab, taskId } = taskActionsContext;
    triggerHaptic();

    setRemovingTaskReasonsByTab((prev) => {
      if (prev[tab][taskId]) {
        return prev;
      }
      return {
        ...prev,
        [tab]: {
          ...prev[tab],
          [taskId]: 'delete',
        },
      };
    });
  };

  const handleAddDueDate = () => {
    if (!taskActionsContext) {
      return;
    }

    const { tab, taskId } = taskActionsContext;
    const dueDateLabel = formatDueDateLabel(new Date());
    triggerHaptic();

    setTasksByTab((prev) => ({
      ...prev,
      [tab]: prev[tab].map((task) =>
        task.id === taskId
          ? {
              ...task,
              dueDate: dueDateLabel,
            }
          : task,
      ),
    }));
  };

  const moveTaskToTab = (fromTab: ScreenTab, toTab: ScreenTab, taskId: string) => {
    setTasksByTab((prev) => {
      const movingTask = prev[fromTab].find((task) => task.id === taskId);
      if (!movingTask) {
        return prev;
      }

      return {
        ...prev,
        [fromTab]: withSortOrder(prev[fromTab].filter((task) => task.id !== taskId)),
        [toTab]: withSortOrder([...prev[toTab], { ...movingTask }]),
      };
    });

    setRemovingTaskReasonsByTab((prev) => {
      if (!prev[fromTab][taskId]) {
        return prev;
      }

      const nextFromTab = { ...prev[fromTab] };
      delete nextFromTab[taskId];
      return {
        ...prev,
        [fromTab]: nextFromTab,
      };
    });
  };

  const handleMoveTo = () => {
    if (!taskActionsContext) {
      return;
    }

    const { tab, taskId } = taskActionsContext;
    const destinationTabs = TABS.filter((tabItem) => tabItem !== tab);

    Alert.alert('Move task', 'Select destination list', [
      ...destinationTabs.map((destinationTab) => ({
        text: destinationTab,
        onPress: () => {
          triggerHaptic();
          moveTaskToTab(tab, destinationTab, taskId);
        },
      })),
      {
        text: 'Cancel',
        style: 'cancel' as const,
      },
    ]);
  };

  const handleCopyLink = async () => {
    if (!taskActionsContext) {
      return;
    }

    const link = buildTaskLink(taskActionsContext.taskId);
    await Clipboard.setStringAsync(link);
    triggerHaptic();
  };

  const handleNotificationPress = () => {
    triggerHaptic();
    setHasNewNotification(false);
    setIsNotificationCenterOpen((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <View style={styles.fixedTop}>
          <TodayHeader
            userName={todayScreenData.greetingName}
            todayTasksCount={tasksByTab.Today.length}
            notificationState={notificationState}
            onNotificationPress={handleNotificationPress}
          />

          <View style={styles.segmentedControl}>
            <AnimatedSegmentedHeader swipeX={swipeX} pageWidth={screenWidth} tasksByTab={tasksByTab} />
          </View>
        </View>

        <View style={styles.pager}>
          <View style={[styles.page, { width: screenWidth }]}>
            <TabPage
              key={activeTab}
              tab={activeTab}
              tasks={tasksByTab[activeTab]}
              removingTaskReasons={removingTaskReasonsByTab[activeTab]}
              selectedTaskId={
                isTaskActionsVisible && taskActionsContext?.tab === activeTab
                  ? taskActionsContext.taskId
                  : null
              }
              isActiveTab
              onToggleTask={(taskId) => handleToggleTask(activeTab, taskId)}
              onTaskHidden={(taskId) => handleTaskHidden(activeTab, taskId)}
              onOpenTaskActions={(taskId) => handleTaskActionsOpen(activeTab, taskId)}
              onReorderTasks={(nextTasks) => handleReorderTasks(activeTab, nextTasks)}
              onTaskDragStart={(taskId) => handleTaskDragStart(activeTab, taskId)}
              onTaskDragEnd={handleTaskDragEnd}
            />
          </View>
        </View>

        <FooterBar
          activeTab={activeTab}
          swipeX={swipeX}
          pageWidth={screenWidth}
          onTabPress={handleFooterTabPress}
          onAdd={() => console.log('Add task')}
          onVoice={() => console.log('Voice input')}
        />

        <TaskActionsBottomSheet
          visible={isTaskActionsVisible}
          task={selectedTask}
          onClose={handleTaskActionsClose}
          onAddDueDate={handleAddDueDate}
          onMoveTo={handleMoveTo}
          onCopyLink={() => {
            void handleCopyLink();
          }}
          onDelete={handleDeleteTask}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  fixedTop: {
    paddingHorizontal: Spacing.screenPadding,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  segmentedControl: {
    paddingVertical: Spacing.segmentedPaddingVertical,
  },
  segmentedAnimatedViewport: {
    position: 'relative',
    height: 63,
  },
  segmentedLayer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  segmentedTab: {
    alignSelf: 'flex-start',
    gap: Spacing.segmentTodayGap,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Spacing.summaryWidth,
    gap: Spacing.summaryGap,
  },
});
