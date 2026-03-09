import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { Colors, TextStyles, Spacing } from '../constants/theme';

export type TodayHeaderProps = {
  userName: string;
};

function NotificationIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 8a6 6 0 0 1 12 0c0 3.09 1.36 5.31 2.5 6.5H3.5C4.64 13.31 6 11.09 6 8z"
        stroke={Colors.iconStroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path
        d="M10 19a2 2 0 0 0 4 0"
        stroke={Colors.iconStroke}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx={18} cy={4} r={3} fill={Colors.textPrimary} />
    </Svg>
  );
}

function ProfileAvatar() {
  return (
    <View style={styles.avatarOuter}>
      <View style={styles.avatarInner}>
        <View style={styles.avatarFill}>
          <Text style={styles.avatarInitial}>M</Text>
        </View>
      </View>
    </View>
  );
}

export default function TodayHeader({ userName }: TodayHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.greeting}>
        <View style={styles.greetingRow}>
          <Text style={TextStyles.headerSecondary}>Hey,</Text>
          <Text style={TextStyles.headerPrimary}>{userName}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity activeOpacity={0.7} style={styles.actionButton}>
          <NotificationIcon />
        </TouchableOpacity>
        <ProfileAvatar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  greeting: {
    flex: 1,
    justifyContent: 'center',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.actionGap,
  },
  actionButton: {
    width: Spacing.avatarSize,
    height: Spacing.avatarSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOuter: {
    width: Spacing.avatarSize,
    height: Spacing.avatarSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: Spacing.avatarInner,
    height: Spacing.avatarInner,
    borderRadius: Spacing.avatarInner / 2,
    borderWidth: 1,
    borderColor: Colors.avatarBorder,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EEEEE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    ...TextStyles.headerPrimary,
    fontSize: 14,
  },
});
