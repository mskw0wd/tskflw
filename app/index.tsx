import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FooterComposer from '../components/FooterComposer';
import TabSwitcher, { TABS, TabName } from '../components/TabSwitcher';
import TaskItem from '../components/TaskItem';
import TodayHeader from '../components/TodayHeader';
import { Colors, Spacing, TextStyles } from '../constants/theme';
import { tasks, todayScreenMeta } from '../data/tasks';

function UpcomingPage() {
  return (
    <View style={styles.emptyPage}>
      <Text style={TextStyles.footerLabel}>Nothing upcoming yet.</Text>
    </View>
  );
}

function ProjectsPage() {
  return (
    <View style={styles.emptyPage}>
      <Text style={TextStyles.footerLabel}>No projects yet.</Text>
    </View>
  );
}

export default function TodayScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const pageWidth = screenWidth - Spacing.screenPadding * 2;

  const pagerRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState<TabName>('Today');

  const triggerHaptic = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleTabChange = (tab: TabName, index: number) => {
    triggerHaptic();
    setActiveTab(tab);
    pagerRef.current?.scrollTo({ x: index * pageWidth, animated: true });
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / pageWidth);
    const nextTab = TABS[index];

    if (!nextTab || nextTab === activeTab) {
      return;
    }

    triggerHaptic();
    setActiveTab(nextTab);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <View style={styles.content}>
          <TodayHeader userName={todayScreenMeta.greetingName} />
          <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />

          <ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            style={styles.pager}
          >
            <ScrollView
              style={[styles.page, { width: pageWidth }]}
              contentContainerStyle={styles.pageContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.summaryRow}>
                <Text style={TextStyles.summaryMuted}>{todayScreenMeta.summaryPrefix}</Text>
                <Text style={TextStyles.summaryStrong}>{todayScreenMeta.summaryValue}</Text>
              </View>

              <View style={styles.taskList}>
                {tasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </View>
            </ScrollView>

            <View style={[styles.page, { width: pageWidth }]}>
              <UpcomingPage />
            </View>

            <View style={[styles.page, { width: pageWidth }]}>
              <ProjectsPage />
            </View>
          </ScrollView>
        </View>

        <FooterComposer
          tasksRemaining={todayScreenMeta.tasksRemaining}
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 0,
    gap: Spacing.sectionGap,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  pageContent: {
    paddingBottom: Spacing.sectionGap,
    gap: Spacing.sectionGap,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.summaryGap,
  },
  taskList: {
    gap: Spacing.taskGap,
  },
  emptyPage: {
    flex: 1,
    paddingTop: Spacing.contentPaddingVertical,
  },
});
