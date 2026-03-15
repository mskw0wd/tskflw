import { Feather } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, TextStyles } from '../constants/theme';
import { Task } from '../data/tasks';

type TaskActionsBottomSheetProps = {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onClosed?: () => void;
  onAddDueDate: () => void;
  onMoveTo: () => void;
  onCopyLink: () => void;
  onDelete: () => void;
};

const BACKDROP_OPACITY = 0.24;
const IN_ANIMATION_MS = 240;
const OUT_ANIMATION_MS = 200;
const CLOSE_DRAG_DISTANCE = 72;
const CLOSE_DRAG_VELOCITY = 1.1;

type ActionItem = {
  key: 'add-due-date' | 'move-to' | 'copy-link' | 'delete';
  icon: keyof typeof Feather.glyphMap;
  label: string;
  destructive?: boolean;
  onPress: () => void;
};

export default function TaskActionsBottomSheet({
  visible,
  task,
  onClose,
  onClosed,
  onAddDueDate,
  onMoveTo,
  onCopyLink,
  onDelete,
}: TaskActionsBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const [displayTask, setDisplayTask] = useState<Task | null>(task);

  const progress = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const isClosingRef = useRef(false);
  const afterCloseActionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (task) {
      setDisplayTask(task);
    }
  }, [task]);

  const finishClose = useCallback(
    () => {
      dragY.setValue(0);
      setMounted(false);
      isClosingRef.current = false;

      onClosed?.();
      const afterCloseAction = afterCloseActionRef.current;
      afterCloseActionRef.current = null;
      afterCloseAction?.();
    },
    [dragY, onClosed],
  );

  const animateClose = useCallback(
    () => {
      if (isClosingRef.current) {
        return;
      }

      isClosingRef.current = true;
      progress.stopAnimation();
      dragY.stopAnimation();

      Animated.timing(progress, {
        toValue: 0,
        duration: OUT_ANIMATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          finishClose();
          return;
        }

        isClosingRef.current = false;
      });
    },
    [dragY, finishClose, progress],
  );

  const requestClose = useCallback(
    (afterCloseAction?: () => void) => {
      if (isClosingRef.current) {
        return;
      }

      afterCloseActionRef.current = afterCloseAction ?? null;
      animateClose();
      onClose();
    },
    [animateClose, onClose],
  );

  useEffect(() => {
    if (visible) {
      progress.stopAnimation();
      dragY.stopAnimation();
      isClosingRef.current = false;
      afterCloseActionRef.current = null;
      setMounted(true);
      dragY.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: IN_ANIMATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }

    if (mounted && !isClosingRef.current) {
      animateClose();
    }
  }, [animateClose, dragY, mounted, progress, visible]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          mounted &&
          gestureState.dy > 4 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderMove: (_, gestureState) => {
          dragY.setValue(Math.max(0, gestureState.dy));
        },
        onPanResponderRelease: (_, gestureState) => {
          if (
            gestureState.dy >= CLOSE_DRAG_DISTANCE ||
            gestureState.vy >= CLOSE_DRAG_VELOCITY
          ) {
            requestClose();
            return;
          }

          Animated.spring(dragY, {
            toValue: 0,
            damping: 20,
            stiffness: 260,
            mass: 0.35,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(dragY, {
            toValue: 0,
            damping: 20,
            stiffness: 260,
            mass: 0.35,
            useNativeDriver: true,
          }).start();
        },
      }),
    [dragY, mounted, requestClose],
  );

  const actions = useMemo<ActionItem[]>(
    () => [
      {
        key: 'add-due-date',
        icon: 'calendar',
        label: 'Add due date',
        onPress: onAddDueDate,
      },
      {
        key: 'move-to',
        icon: 'arrow-right',
        label: 'Move to',
        onPress: onMoveTo,
      },
      {
        key: 'copy-link',
        icon: 'link',
        label: 'Copy link',
        onPress: onCopyLink,
      },
      {
        key: 'delete',
        icon: 'trash-2',
        label: 'Delete',
        destructive: true,
        onPress: onDelete,
      },
    ],
    [onAddDueDate, onCopyLink, onDelete, onMoveTo],
  );

  if (!mounted) {
    return null;
  }

  const backdropOpacity = Animated.multiply(
    progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, BACKDROP_OPACITY],
    }),
    dragY.interpolate({
      inputRange: [0, 120],
      outputRange: [1, 0.72],
      extrapolate: 'clamp',
    }),
  );

  const translateY = Animated.add(
    progress.interpolate({
      inputRange: [0, 1],
      outputRange: [42, 0],
    }),
    dragY,
  );

  return (
    <View pointerEvents="box-none" style={styles.root}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      <Pressable style={StyleSheet.absoluteFillObject} onPress={() => requestClose()} />

      <Animated.View
        style={[
          styles.sheet,
          {
            paddingBottom: Math.max(insets.bottom, 0) + 14,
            transform: [{ translateY }],
          },
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.dragZone}>
          <View style={styles.handle} />

          {displayTask ? (
            <View style={styles.header}>
              <Text style={[TextStyles.taskTitle, styles.title]} numberOfLines={1}>
                {displayTask.title}
              </Text>
              <Text style={[TextStyles.taskMeta, styles.subtitle]} numberOfLines={1}>
                {displayTask.project}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          {actions.map((action, index) => (
            <Pressable
              key={action.key}
              style={[styles.actionRow, index > 0 && styles.actionRowWithDivider]}
              onPress={() => {
                requestClose(action.onPress);
              }}
            >
              <Feather
                name={action.icon}
                size={18}
                color={action.destructive ? '#DF4144' : Colors.textSecondary}
              />
              <Text
                style={[
                  TextStyles.taskTitle,
                  styles.actionLabel,
                  action.destructive && styles.actionLabelDestructive,
                ]}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 40,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  dragZone: {
    paddingBottom: 14,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: 'rgba(31, 30, 29, 0.14)',
    borderRadius: 999,
    height: 5,
    width: 44,
  },
  header: {
    gap: 6,
    marginTop: 14,
  },
  title: {
    marginBottom: 0,
    marginTop: 0,
  },
  subtitle: {
    marginBottom: 0,
    marginTop: 0,
    opacity: 0.82,
  },
  actions: {
    borderColor: 'rgba(31, 30, 29, 0.08)',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  actionRow: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    flexDirection: 'row',
    gap: 12,
    minHeight: 54,
    paddingHorizontal: 14,
  },
  actionRowWithDivider: {
    borderTopColor: 'rgba(31, 30, 29, 0.08)',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionLabel: {
    marginBottom: 0,
    marginTop: 0,
  },
  actionLabelDestructive: {
    color: '#DF4144',
  },
});
