import React from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { Colors, TextStyles, Spacing } from '../constants/theme';

export type TodayHeaderProps = {
  userName: string;
};

function NotificationIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.75 9.25V10.75C20.75 15.464 20.75 17.8211 19.2855 19.2855C17.8211 20.75 15.464 20.75 10.75 20.75C6.03596 20.75 3.67893 20.75 2.21447 19.2855C0.75 17.8211 0.75 15.464 0.75 10.75C0.75 6.03596 0.75 3.67893 2.21447 2.21447C3.67893 0.75 6.03596 0.75 10.75 0.75H12.25"
        stroke={Colors.iconStroke}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx={19} cy={5} r={3} fill="none" stroke={Colors.iconStroke} strokeWidth={1.5} />
      <Path d="M7.5 14H16.5" stroke={Colors.iconStroke} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M7.5 17.5H13.5" stroke={Colors.iconStroke} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function ProfileAvatar() {
  return (
    <View style={styles.avatarOuter}>
      <Image source={require('../assets/images/avatar-max.png')} style={styles.avatarImage} />
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
    paddingVertical: Spacing.headerVerticalPadding,
  },
  greeting: {
    flex: 1,
    justifyContent: 'center',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.summaryGap,
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
    borderRadius: Spacing.avatarSize / 2,
    borderWidth: 1,
    borderColor: Colors.avatarBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: Spacing.avatarInner,
    height: Spacing.avatarInner,
    borderRadius: Spacing.avatarInner / 2,
    transform: [{ translateY: 0.14 }],
  },
});
