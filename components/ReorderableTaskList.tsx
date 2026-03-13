import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import DraggableFlatList, {
  type RenderItemParams,
} from 'react-native-draggable-flatlist';

import { Spacing } from '../constants/theme';
import type { Task } from '../data/tasks';
import TaskItem from './TaskItem';

type ReorderableTaskListProps = {
  tasks: Task[];
  showDueDate?: boolean;
  removingTaskIds: Record<string, boolean>;
  selectedTaskId: string | null;
  isActiveTab: boolean;
  onToggleTask: (id: string) => void;
  onTaskHidden: (id: string) => void;
  onOpenTaskActions: (id: string) => void;
  onReorderTasks: (tasks: Task[]) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
};

function TaskRow({
  task,
  showDueDate,
  isRemoving,
  isSelected,
  isDragging,
  onToggleTask,
  onTaskHidden,
  onOpenTaskActions,
  onStartDrag,
}: {
  task: Task;
  showDueDate: boolean;
  isRemoving: boolean;
  isSelected: boolean;
  isDragging?: boolean;
  onToggleTask: (id: string) => void;
  onTaskHidden: (id: string) => void;
  onOpenTaskActions: (id: string) => void;
  onStartDrag?: () => void;
}) {
  return (
    <View style={styles.taskRow}>
      <TaskItem
        task={task}
        showDueDate={showDueDate}
        onToggle={onToggleTask}
        isRemoving={isRemoving}
        onRemoveAnimationEnd={onTaskHidden}
        isSelected={isSelected}
        isDragging={isDragging}
        onOpenActions={onOpenTaskActions}
        onStartDrag={onStartDrag}
      />
    </View>
  );
}

export default function ReorderableTaskList({
  tasks,
  showDueDate = true,
  removingTaskIds,
  selectedTaskId,
  isActiveTab,
  onToggleTask,
  onTaskHidden,
  onOpenTaskActions,
  onReorderTasks,
  onDragStart,
  onDragEnd,
}: ReorderableTaskListProps) {
  if (!isActiveTab) {
    return (
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        data={tasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => (
          <TaskRow
            task={item}
            showDueDate={showDueDate}
            isRemoving={Boolean(removingTaskIds[item.id])}
            isSelected={selectedTaskId === item.id}
            onToggleTask={onToggleTask}
            onTaskHidden={onTaskHidden}
            onOpenTaskActions={onOpenTaskActions}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Task>) => (
    <TaskRow
      task={item}
      showDueDate={showDueDate}
      isRemoving={Boolean(removingTaskIds[item.id])}
      isSelected={selectedTaskId === item.id}
      isDragging={isActive}
      onToggleTask={onToggleTask}
      onTaskHidden={onTaskHidden}
      onOpenTaskActions={onOpenTaskActions}
      onStartDrag={() => {
        if (removingTaskIds[item.id]) {
          return;
        }
        drag();
      }}
    />
  );

  return (
    <DraggableFlatList
      containerStyle={styles.list}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={false}
      data={tasks}
      keyExtractor={(task) => task.id}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      activationDistance={20}
      autoscrollThreshold={72}
      autoscrollSpeed={180}
      dragItemOverflow
      animationConfig={{
        damping: 24,
        mass: 0.25,
        stiffness: 260,
        overshootClamping: true,
        energyThreshold: 0.2,
      }}
      onDragBegin={(index) => {
        const task = tasks[index];
        if (task) {
          onDragStart(task.id);
        }
      }}
      onDragEnd={({ data }) => {
        onReorderTasks(data);
        onDragEnd();
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.taskListBottomPadding,
    paddingTop: 16,
  },
  separator: {
    height: Spacing.taskGap,
  },
  taskRow: {
    width: '100%',
    overflow: 'visible',
  },
});
