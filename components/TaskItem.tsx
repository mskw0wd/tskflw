import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Spacing, TextStyles } from "../constants/theme";
import { Task } from "../data/tasks";
import TaskMeta from "./TaskMeta";

type TaskItemProps = {
  task: Task;
  onToggle?: (id: string) => void;
};

export default function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        onPress={() => onToggle?.(task.id)}
        activeOpacity={0.7}
      >
        {task.completed && <View style={styles.checkmark} />}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={
            task.completed
              ? TextStyles.taskTitleCompleted
              : TextStyles.taskTitle
          }
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <TaskMeta project={task.project} dueDate={task.dueDate} />
      </View>
    </View>
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
    borderWidth: 1.5,
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
});
