import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { TextStyles, Spacing } from '../constants/theme';

export const TABS = ['Today', 'Upcoming', 'Projects'] as const;
export type TabName = typeof TABS[number];

type TabSwitcherProps = {
  activeTab: TabName;
  onTabChange: (tab: TabName, index: number) => void;
};

export default function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  const handlePress = (tab: TabName, index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabChange(tab, index);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TABS.map((tab, i) => (
        <TouchableOpacity
          key={tab}
          onPress={() => handlePress(tab, i)}
          style={styles.tab}
          activeOpacity={0.7}
        >
          <Text style={activeTab === tab ? TextStyles.heroTabActive : TextStyles.heroTabInactive}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.tabGap,
    paddingRight: Spacing.screenPadding,
  },
  tab: {
    justifyContent: 'center',
  },
});
