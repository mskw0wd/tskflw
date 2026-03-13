import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
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
  onStartDrag?: () => void;
};

const LONG_PRESS_DRAG_DELAY_MS = 280;

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
  onStartDrag,
}: TaskItemProps) {
  const fade = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const hasStartedExit = useRef(false);

  useEffect(() => {
    if (!isRemoving || hasStartedExit.current) {
      return;
    }

    hasStartedExit.current = true;
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.96,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onRemoveAnimationEnd?.(task.id);
      }
    });
  }, [fade, isRemoving, onRemoveAnimationEnd, scale, task.id]);

  const showHighlight = isDragging;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fade,
          transform: [{ scaleY: scale }],
        },
      ]}
    >
      {showHighlight ? (
        <View pointerEvents="none" style={styles.highlightBackground} />
      ) : null}

      <TouchableOpacity
        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        onPress={() => onToggle?.(task.id)}
        disabled={task.completed || isRemoving}
        activeOpacity={0.7}
      >
        {task.completed && <View style={styles.checkmark} />}
      </TouchableOpacity>

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

      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => onOpenActions?.(task.id)}
        disabled={isRemoving}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 13, right: 13 }}
      >
        <MoreIcon />
      </TouchableOpacity>
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
    top: -14,
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
    gap: Spacing.taskContentGap,
    flex: 1,
  },
  contentPressable: {
    flex: 1,
  },
  moreButton: {
    alignItems: "center",
    borderRadius: Spacing.checkboxRadius,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  moreIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 20,
  },
  moreDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.summaryLabel,
  },
  titleText: {
    // Avoid clipping from global vertical trim on single-line task titles.
    marginTop: 0,
    marginBottom: 0,
  },
});
