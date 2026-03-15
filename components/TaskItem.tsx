import { MenuView, type MenuAction } from "@react-native-menu/menu";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Spacing, TextStyles } from "../constants/theme";
import { Task } from "../data/tasks";
import TaskMeta from "./TaskMeta";

type TaskItemProps = {
  task: Task;
  showDueDate?: boolean;
  onToggle?: (id: string) => void;
  isRemoving?: boolean;
  onRemoveAnimationEnd?: (id: string) => void;
  isSelected?: boolean;
  isDragging?: boolean;
  onOpenActions?: (id: string) => void;
  onNativeMenuAction?: (actionId: string, taskId: string) => void;
  nativeMenuActions?: MenuAction[];
  onStartDrag?: () => void;
};

const LONG_PRESS_DRAG_DELAY_MS = 280;
const seenTaskIds = new Set<string>();
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

function animatePressScale(value: Animated.Value, toValue: number) {
  Animated.spring(value, {
    toValue,
    damping: 18,
    stiffness: 320,
    mass: 0.35,
    useNativeDriver: true,
  }).start();
}

function MoreIcon() {
  return (
    <View style={styles.moreIcon}>
      <View style={styles.moreDot} />
      <View style={styles.moreDot} />
      <View style={styles.moreDot} />
    </View>
  );
}

export default function TaskItem({
  task,
  showDueDate = true,
  onToggle,
  isRemoving = false,
  onRemoveAnimationEnd,
  isSelected = false,
  isDragging = false,
  onOpenActions,
  onNativeMenuAction,
  nativeMenuActions = [],
  onStartDrag,
}: TaskItemProps) {
  const shouldAnimateEnter = !seenTaskIds.has(task.id);
  const fade = useRef(new Animated.Value(shouldAnimateEnter ? 0 : 1)).current;
  const scale = useRef(
    new Animated.Value(shouldAnimateEnter ? 0.985 : 1)
  ).current;
  const translateY = useRef(
    new Animated.Value(shouldAnimateEnter ? 8 : 0)
  ).current;
  const dragHighlight = useRef(new Animated.Value(0)).current;
  const checkboxPressScale = useRef(new Animated.Value(1)).current;
  const morePressScale = useRef(new Animated.Value(1)).current;
  const hasStartedExit = useRef(false);

  useEffect(() => {
    if (!shouldAnimateEnter) {
      return;
    }

    seenTaskIds.add(task.id);
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, scale, shouldAnimateEnter, task.id, translateY]);

  useEffect(() => {
    if (!isRemoving || hasStartedExit.current) {
      return;
    }

    hasStartedExit.current = true;
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -10,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.97,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onRemoveAnimationEnd?.(task.id);
      }
    });
  }, [fade, isRemoving, onRemoveAnimationEnd, scale, task.id, translateY]);

  useEffect(() => {
    Animated.timing(dragHighlight, {
      toValue: isDragging ? 1 : 0,
      duration: isDragging ? 160 : 200,
      easing: isDragging ? Easing.out(Easing.cubic) : Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [dragHighlight, isDragging]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fade,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.highlightBackground, { opacity: dragHighlight }]}
      />

      <AnimatedTouchableOpacity
        style={[
          styles.checkbox,
          task.completed && styles.checkboxChecked,
          { transform: [{ scale: checkboxPressScale }] },
        ]}
        onPress={() => onToggle?.(task.id)}
        onPressIn={() => animatePressScale(checkboxPressScale, 0.92)}
        onPressOut={() => animatePressScale(checkboxPressScale, 1)}
        disabled={task.completed || isRemoving}
        activeOpacity={0.7}
      >
        {task.completed && <View style={styles.checkmark} />}
      </AnimatedTouchableOpacity>

      <Pressable
        style={styles.contentPressable}
        onLongPress={() => {
          onStartDrag?.();
        }}
        delayLongPress={LONG_PRESS_DRAG_DELAY_MS}
        disabled={isRemoving}
      >
        <View style={styles.content}>
          <Text
            style={[
              task.completed
                ? TextStyles.taskTitleCompleted
                : TextStyles.taskTitle,
              styles.titleText,
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <TaskMeta
            project={task.project}
            dueDate={task.dueDate}
            showDueDate={showDueDate}
          />
        </View>
      </Pressable>

      {Platform.OS === "ios" &&
      !isRemoving &&
      onNativeMenuAction &&
      nativeMenuActions.length > 0 ? (
        <MenuView
          title={task.title}
          actions={nativeMenuActions}
          shouldOpenOnLongPress={false}
          hitSlop={{ top: 12, bottom: 12, left: 13, right: 13 }}
          onPressAction={({ nativeEvent }) => {
            onNativeMenuAction(nativeEvent.event, task.id);
          }}
        >
          <Animated.View
            style={[
              styles.moreButton,
              { transform: [{ scale: morePressScale }] },
            ]}
          >
            <MoreIcon />
          </Animated.View>
        </MenuView>
      ) : (
        <AnimatedTouchableOpacity
          style={[
            styles.moreButton,
            { transform: [{ scale: morePressScale }] },
          ]}
          onPress={() => onOpenActions?.(task.id)}
          onPressIn={() => animatePressScale(morePressScale, 0.9)}
          onPressOut={() => animatePressScale(morePressScale, 1)}
          disabled={isRemoving}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 13, right: 13 }}
        >
          <MoreIcon />
        </AnimatedTouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    width: "100%",
    gap: Spacing.taskRowGap,
    minHeight: 36,
    overflow: "visible",
  },
  highlightBackground: {
    position: "absolute",
    left: -14,
    right: -14,
    top: -12,
    bottom: -16,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
  },
  checkbox: {
    width: Spacing.checkboxSize,
    height: Spacing.checkboxSize,
    borderRadius: Spacing.checkboxRadius,
    borderWidth: Spacing.checkboxStrokeWidth,
    borderColor: Colors.checkboxBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.textPrimary,
    borderColor: Colors.textPrimary,
  },
  checkmark: {
    width: 8,
    height: 5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: Colors.background,
    transform: [{ rotate: "-45deg" }],
    marginTop: -2,
  },
  content: {
    flexDirection: "column",
    gap: Spacing.taskContentGap - 4,
    flex: 1,
  },
  contentPressable: {
    flex: 1,
  },
  moreButton: {
    alignItems: "center",
    borderRadius: Spacing.checkboxRadius,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  moreIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 16.67,
    opacity: 0.7,
  },
  moreDot: {
    width: 3.33,
    height: 3.33,
    borderRadius: 1.67,
    backgroundColor: Colors.summaryLabel,
  },
  titleText: {
    // Avoid clipping from global vertical trim on single-line task titles.
    marginTop: 0,
    marginBottom: 0,
    fontSize: 17,
    lineHeight: 21,
  },
});
