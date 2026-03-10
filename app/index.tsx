import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FooterBar from '../components/FooterBar';
import TaskItem from '../components/TaskItem';
import TodayHeader from '../components/TodayHeader';
import { Colors, Spacing, TextStyles } from '../constants/theme';
import { addTaskToCompleted } from '../data/completedTasksStore';
import { ScreenTab, Task, todayScreenData } from '../data/tasks';

const TABS: ScreenTab[] = ['Today', 'Upcoming', 'Project'];

type TabPageProps = {
  tab: ScreenTab;
  tasks: Task[];
  removingTaskIds: string[];
  onToggleTask: (id: string) => void;
  onTaskHidden: (id: string) => void;
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

function TabPage({ tab, tasks, removingTaskIds, onToggleTask, onTaskHidden }: TabPageProps) {

  return (
    <ScrollView
      style={styles.pageScroll}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.taskList}>
        {tasks.map((task) => (
          <TaskItem
            key={`${tab}-${task.id}`}
            task={task}
            showDueDate={tab !== 'Today'}
            onToggle={onToggleTask}
            isRemoving={removingTaskIds.includes(task.id)}
            onRemoveAnimationEnd={onTaskHidden}
          />
        ))}
      </View>
    </ScrollView>
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
  const pagerRef = useRef<ScrollView>(null);
  const pressedTabRef = useRef<ScreenTab | null>(null);
  const [activeTab, setActiveTab] = useState<ScreenTab>('Today');
  const [tasksByTab, setTasksByTab] = useState<Record<ScreenTab, Task[]>>({
    Today: todayScreenData.tabs.Today.tasks.map((task) => ({ ...task })),
    Upcoming: todayScreenData.tabs.Upcoming.tasks.map((task) => ({ ...task })),
    Project: todayScreenData.tabs.Project.tasks.map((task) => ({ ...task })),
  });
  const [removingTaskIdsByTab, setRemovingTaskIdsByTab] = useState<Record<ScreenTab, string[]>>({
    Today: [],
    Upcoming: [],
    Project: [],
  });

  const triggerHaptic = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  useEffect(() => {
    const activeIndex = TABS.indexOf(activeTab);
    if (activeIndex < 0) {
      return;
    }

    pagerRef.current?.scrollTo({ x: activeIndex * screenWidth, animated: false });
  }, [activeTab, screenWidth]);

  const handleFooterTabPress = (tab: ScreenTab) => {
    const nextIndex = TABS.indexOf(tab);
    if (nextIndex < 0 || tab === activeTab) {
      return;
    }

    triggerHaptic();
    pressedTabRef.current = tab;
    pagerRef.current?.scrollTo({ x: nextIndex * screenWidth, animated: true });
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    const nextTab = TABS[index];
    const didComeFromPress = pressedTabRef.current === nextTab;
    pressedTabRef.current = null;

    if (!nextTab || nextTab === activeTab) {
      return;
    }

    if (!didComeFromPress) {
      triggerHaptic();
    }
    setActiveTab(nextTab);
  };

  const handleToggleTask = (tab: ScreenTab, taskId: string) => {
    let didStartRemoving = false;

    setRemovingTaskIdsByTab((prev) => {
      if (prev[tab].includes(taskId)) {
        return prev;
      }

      didStartRemoving = true;
      return {
        ...prev,
        [tab]: [...prev[tab], taskId],
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
    setTasksByTab((prev) => {
      const taskToComplete = prev[tab].find((task) => task.id === taskId);
      if (taskToComplete) {
        addTaskToCompleted(taskToComplete, tab);
      }

      return {
        ...prev,
        [tab]: prev[tab].filter((task) => task.id !== taskId),
      };
    });

    setRemovingTaskIdsByTab((prev) => ({
      ...prev,
      [tab]: prev[tab].filter((id) => id !== taskId),
    }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <View style={styles.fixedTop}>
          <TodayHeader userName={todayScreenData.greetingName} />

          <View style={styles.segmentedControl}>
            <AnimatedSegmentedHeader swipeX={swipeX} pageWidth={screenWidth} tasksByTab={tasksByTab} />
          </View>
        </View>

        <Animated.ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: swipeX } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          style={styles.pager}
        >
          {TABS.map((tab) => (
            <View key={tab} style={[styles.page, { width: screenWidth }]}>
              <TabPage
                tab={tab}
                tasks={tasksByTab[tab]}
                removingTaskIds={removingTaskIdsByTab[tab]}
                onToggleTask={(taskId) => handleToggleTask(tab, taskId)}
                onTaskHidden={(taskId) => handleTaskHidden(tab, taskId)}
              />
            </View>
          ))}
        </Animated.ScrollView>

        <FooterBar
          activeTab={activeTab}
          swipeX={swipeX}
          pageWidth={screenWidth}
          onTabPress={handleFooterTabPress}
          onAdd={() => console.log('Add task')}
          onVoice={() => console.log('Voice input')}
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
  pageScroll: {
    flex: 1,
  },
  pageContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.taskListBottomPadding,
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
  taskList: {
    gap: Spacing.taskGap,
  },
});
