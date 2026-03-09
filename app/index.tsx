import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TabSwitcher, { TabName, TABS } from "@/components/TabSwitcher";
import TaskItem from "@/components/TaskItem";
import FooterComposer from "../components/FooterComposer";
import TodayHeader from "../components/TodayHeader";
import { Colors, Spacing, TextStyles } from "../constants/theme";
import { tasks as initialTasks } from "../data/tasks";

function UpcomingPage() {
  return (
    <View style={pageStyles.empty}>
      <Text style={TextStyles.footerLabel}>Nothing upcoming yet.</Text>
    </View>
  );
}

function ProjectsPage() {
  return (
    <View style={pageStyles.empty}>
      <Text style={TextStyles.footerLabel}>No projects yet.</Text>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  empty: {
    flex: 1,
    paddingTop: 48,
    alignItems: "flex-start",
    paddingHorizontal: Spacing.screenPadding,
  },
});

export default function TodayScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState<TabName>("Today");
  const pagerRef = useRef<ScrollView>(null);

  const tasksRemaining = tasks.filter((t) => !t.completed).length;

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    const tab = TABS[index];
    if (tab && tab !== activeTab) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setActiveTab(tab);
    }
  };

  const handleTabChange = (tab: TabName, index: number) => {
    setActiveTab(tab);
    pagerRef.current?.scrollTo({ x: index * screenWidth, animated: true });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* Sticky header + tabs */}
        <View style={styles.topArea}>
          <TodayHeader userName="Max" />
          <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />
        </View>

        {/* Horizontal swipe pager */}
        <ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          style={styles.pager}
          contentContainerStyle={styles.pagerContent}
        >
          {/* Page 0 — Today */}
          <ScrollView
            style={[styles.page, { width: screenWidth }]}
            contentContainerStyle={styles.pageContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Summary row: "You have" · "7" · "tasks today" */}
            <View style={styles.summaryRow}>
              <Text style={TextStyles.summaryMuted}>You have</Text>
              <Text style={TextStyles.summaryStrong}>{tasks.length}</Text>
              <Text style={TextStyles.summaryMuted}>tasks today</Text>
            </View>

            <View style={styles.taskList}>
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={handleToggle} />
              ))}
            </View>
          </ScrollView>

          {/* Page 1 — Upcoming */}
          <View style={{ width: screenWidth, flex: 1 }}>
            <UpcomingPage />
          </View>

          {/* Page 2 — Projects */}
          <View style={{ width: screenWidth, flex: 1 }}>
            <ProjectsPage />
          </View>
        </ScrollView>

        {/* Fixed footer */}
        <FooterComposer
          tasksRemaining={tasksRemaining}
          onAdd={() => console.log("Add task")}
          onVoice={() => console.log("Voice input")}
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
  topArea: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 16,
    gap: 20,
    backgroundColor: Colors.background,
  },
  pager: {
    flex: 1,
  },
  pagerContent: {
    alignItems: "flex-start",
  },
  page: {
    flex: 1,
  },
  pageContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 24,
    paddingBottom: Spacing.sectionGap,
    gap: 24,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  taskList: {
    gap: Spacing.taskGap,
  },
});
