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
import { ScreenTab, todayScreenData } from '../data/tasks';

const TABS: ScreenTab[] = ['Today', 'Upcoming', 'Project'];

type TabPageProps = {
  tab: ScreenTab;
};

function TabPage({ tab }: TabPageProps) {
  const { tasks } = todayScreenData.tabs[tab];

  return (
    <ScrollView
      style={styles.pageScroll}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.taskList}>
        {tasks.map((task) => (
          <TaskItem key={`${tab}-${task.id}`} task={task} />
        ))}
      </View>
    </ScrollView>
  );
}

export default function TodayScreen() {
  const { width: screenWidth } = useWindowDimensions();

  const swipeX = useRef(new Animated.Value(0)).current;
  const pagerRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState<ScreenTab>('Today');
  const activeTabContent = todayScreenData.tabs[activeTab];

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
    setActiveTab(tab);
    pagerRef.current?.scrollTo({ x: nextIndex * screenWidth, animated: true });
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
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
        <View style={styles.fixedTop}>
          <TodayHeader userName={todayScreenData.greetingName} />

          <View style={styles.segmentedControl}>
            <View style={styles.segmentedTab}>
              <Text style={TextStyles.screenTitle}>{activeTabContent.title}</Text>

              <View style={styles.summaryRow}>
                <Text style={TextStyles.summaryMuted} numberOfLines={1}>
                  {activeTabContent.summaryPrefix}
                </Text>
                <Text style={TextStyles.summaryStrong} numberOfLines={1}>
                  {activeTabContent.summaryValue}
                </Text>
              </View>
            </View>
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
              <TabPage tab={tab} />
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
    paddingTop: Spacing.contentPaddingTop,
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
