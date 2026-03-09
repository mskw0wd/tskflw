import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TextStyles, Spacing } from '../constants/theme';

export const TABS = ['Today', 'Upcoming', 'Projects'] as const;
export type TabName = typeof TABS[number];

type TabSwitcherProps = {
  activeTab: TabName;
  onTabChange?: (tab: TabName, index: number) => void;
};

export default function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  const handlePress = (tab: TabName, index: number) => onTabChange?.(tab, index);

  return (
    <View style={styles.viewport}>
      <View style={styles.container}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handlePress(tab, i)}
            style={[styles.tab, tab === 'Today' && styles.todayTab, tab === 'Upcoming' && styles.upcomingTab, tab === 'Projects' && styles.projectsTab]}
            activeOpacity={0.7}
          >
            <Text style={activeTab === tab ? TextStyles.heroTabActive : TextStyles.heroTabInactive}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    alignSelf: 'stretch',
    paddingVertical: Spacing.tabVerticalPadding,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    gap: Spacing.tabGap,
  },
  tab: {
    justifyContent: 'center',
  },
  todayTab: {
    width: Spacing.tabTodayWidth,
  },
  upcomingTab: {
    width: Spacing.tabUpcomingWidth,
  },
  projectsTab: {
    width: Spacing.tabProjectsWidth,
  },
});
