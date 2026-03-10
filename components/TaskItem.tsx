import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
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
};

export default function TaskItem({
  task,
  showDueDate = true,
  onToggle,
  isRemoving = false,
  onRemoveAnimationEnd,
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
      <TouchableOpacity
        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        onPress={() => onToggle?.(task.id)}
        disabled={task.completed || isRemoving}
        activeOpacity={0.7}
      >
        {task.completed && <View style={styles.checkmark} />}
      </TouchableOpacity>

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
        <TaskMeta project={task.project} dueDate={task.dueDate} showDueDate={showDueDate} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "stretch",
    gap: Spacing.taskRowGap,
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
  titleText: {
    // Avoid clipping from global vertical trim on single-line task titles.
    marginTop: 0,
    marginBottom: 0,
  },
});
