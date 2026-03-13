import React from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, G, Path } from 'react-native-svg';
import { Colors, TextStyles, Spacing } from '../constants/theme';
import TodayGreetingSubtitle from './TodayGreetingSubtitle';

export type NotificationIconState = 'default' | 'pressed' | 'new';

export type TodayHeaderProps = {
  userName: string;
  todayTasksCount?: number;
  isTodayTasksLoading?: boolean;
  notificationState: NotificationIconState;
  onNotificationPress: () => void;
};

const NOTIFICATION_BODY_PATH =
  'M21.36 7.704C21.336 7.704 21.312 7.716 21.288 7.716C21.168 7.74 21.048 7.752 20.916 7.776C20.412 7.824 19.872 7.8 19.32 7.692C19.176 7.656 19.056 7.632 18.924 7.584C18.528 7.488 18.156 7.332 17.808 7.128C17.664 7.056 17.52 6.96 17.388 6.876C16.812 6.48 16.32 5.988 15.924 5.412C15.84 5.28 15.744 5.136 15.672 4.992C15.468 4.644 15.312 4.272 15.216 3.876C15.168 3.744 15.144 3.624 15.108 3.48C15 2.928 14.976 2.388 15.024 1.884C15.048 1.752 15.06 1.632 15.084 1.512C15.084 1.488 15.096 1.464 15.096 1.44C15.24 0.696 14.688 0 13.92 0H6.624C6.456 0 6.288 0.012 6.132 0.024C5.988 0.036 5.856 0.0479999 5.712 0.0719999C5.568 0.0839999 5.424 0.108 5.292 0.132C2.4 0.552 0.552 2.388 0.132 5.292C0.108 5.424 0.0839999 5.568 0.0719999 5.712C0.0479999 5.856 0.036 5.988 0.024 6.132C0.012 6.288 0 6.456 0 6.624V16.176C0 16.344 0.012 16.512 0.024 16.668C0.036 16.812 0.0479999 16.944 0.0719999 17.088C0.0839999 17.232 0.108 17.376 0.132 17.508C0.552 20.412 2.4 22.248 5.292 22.668C5.424 22.692 5.568 22.716 5.712 22.728C5.856 22.752 5.988 22.764 6.132 22.776C6.288 22.788 6.456 22.8 6.624 22.8H16.176C16.344 22.8 16.512 22.788 16.668 22.776C16.812 22.764 16.944 22.752 17.088 22.728C17.232 22.716 17.376 22.692 17.508 22.668C20.4 22.248 22.248 20.412 22.668 17.508C22.692 17.376 22.716 17.232 22.728 17.088C22.752 16.944 22.764 16.812 22.776 16.668C22.788 16.512 22.8 16.344 22.8 16.176V8.88C22.8 8.112 22.104 7.56 21.36 7.704ZM5.7 11.4H11.7C12.192 11.4 12.6 11.808 12.6 12.3C12.6 12.792 12.192 13.2 11.7 13.2H5.7C5.208 13.2 4.8 12.792 4.8 12.3C4.8 11.808 5.208 11.4 5.7 11.4ZM16.5 18H5.7C5.208 18 4.8 17.592 4.8 17.1C4.8 16.608 5.208 16.2 5.7 16.2H16.5C16.992 16.2 17.4 16.608 17.4 17.1C17.4 17.592 16.992 18 16.5 18Z';
const NOTIFICATION_BADGE_PATH =
  'M3.6 7.2C5.58828 7.2 7.2 5.58822 7.2 3.6C7.2 1.61178 5.58828 0 3.6 0C1.61172 0 0 1.61178 0 3.6C0 5.58822 1.61172 7.2 3.6 7.2Z';

const NOTIFICATION_BODY_COLOR: Record<NotificationIconState, string> = {
  default: '#D9D9D9',
  new: '#D9D9D9',
  pressed: Colors.iconStroke,
};

const NOTIFICATION_BADGE_COLOR: Record<NotificationIconState, string> = {
  default: Colors.iconStroke,
  new: '#DF4144',
  pressed: Colors.iconStroke,
};

function NotificationIcon({ state }: { state: NotificationIconState }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <G transform="translate(0 1.2)">
        <Path d={NOTIFICATION_BODY_PATH} fill={NOTIFICATION_BODY_COLOR[state]} />
      </G>
      <G transform="translate(16.8 0)">
        <Path d={NOTIFICATION_BADGE_PATH} fill={NOTIFICATION_BADGE_COLOR[state]} />
      </G>
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

export default function TodayHeader({
  userName,
  todayTasksCount,
  isTodayTasksLoading = false,
  notificationState,
  onNotificationPress,
}: TodayHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.greeting}>
        <View style={styles.greetingRow}>
          <Text style={TextStyles.headerSecondary}>Hey,</Text>
          <Text style={TextStyles.headerPrimary}>{userName}</Text>
        </View>
        <TodayGreetingSubtitle todayTasksCount={todayTasksCount} isLoading={isTodayTasksLoading} />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity activeOpacity={0.7} style={styles.actionButton} onPress={onNotificationPress}>
          <NotificationIcon state={notificationState} />
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
    minWidth: 0,
    gap: Spacing.headerGreetingGap,
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
