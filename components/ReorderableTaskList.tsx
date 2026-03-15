import { type MenuAction } from '@react-native-menu/menu';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import DraggableFlatList, { type RenderItemParams } from 'react-native-draggable-flatlist';

import { Spacing } from '../constants/theme';
import type { Task } from '../data/tasks';
import TaskItem from './TaskItem';

const TASK_LIST_TOP_BUFFER = 16;

type ReorderableTaskListProps = {
  tasks: Task[];
  showDueDate?: boolean;
  removingTaskIds: Record<string, boolean>;
  selectedTaskId: string | null;
  isActiveTab: boolean;
  onToggleTask: (id: string) => void;
  onTaskHidden: (id: string) => void;
  onOpenTaskActions: (id: string) => void;
  onTaskNativeMenuAction?: (actionId: string, taskId: string) => void;
  nativeMenuActions?: MenuAction[];
  onReorderTasks: (tasks: Task[]) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: (didReorder: boolean) => void;
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
  onTaskNativeMenuAction,
  nativeMenuActions,
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
  onTaskNativeMenuAction?: (actionId: string, taskId: string) => void;
  nativeMenuActions?: MenuAction[];
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
        onNativeMenuAction={onTaskNativeMenuAction}
        nativeMenuActions={nativeMenuActions}
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
  onTaskNativeMenuAction,
  nativeMenuActions,
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
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.taskCell,
              index < tasks.length - 1 && styles.taskCellWithGap,
            ]}
          >
            <TaskRow
              task={item}
              showDueDate={showDueDate}
              isRemoving={Boolean(removingTaskIds[item.id])}
              isSelected={selectedTaskId === item.id}
              onToggleTask={onToggleTask}
              onTaskHidden={onTaskHidden}
              onOpenTaskActions={onOpenTaskActions}
              onTaskNativeMenuAction={onTaskNativeMenuAction}
              nativeMenuActions={nativeMenuActions}
            />
          </View>
        )}
      />
    );
  }

  const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<Task>) => {
    const index = getIndex();
    const hasBottomGap = typeof index === 'number' ? index < tasks.length - 1 : false;

    return (
      <View
        style={[
          styles.taskCell,
          hasBottomGap && styles.taskCellWithGap,
        ]}
      >
        <TaskRow
          task={item}
          showDueDate={showDueDate}
          isRemoving={Boolean(removingTaskIds[item.id])}
          isSelected={selectedTaskId === item.id}
          isDragging={isActive}
          onToggleTask={onToggleTask}
          onTaskHidden={onTaskHidden}
          onOpenTaskActions={onOpenTaskActions}
          onTaskNativeMenuAction={onTaskNativeMenuAction}
          nativeMenuActions={nativeMenuActions}
          onStartDrag={() => {
            if (removingTaskIds[item.id]) {
              return;
            }
            drag();
          }}
        />
      </View>
    );
  };

  return (
    <DraggableFlatList
      containerStyle={styles.list}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={false}
      data={tasks}
      keyExtractor={(task) => task.id}
      renderItem={renderItem}
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
      onDragEnd={({ data, from, to }) => {
        onReorderTasks(data);
        onDragEnd(from !== to);
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
    paddingTop: TASK_LIST_TOP_BUFFER,
  },
  taskRow: {
    width: '100%',
    overflow: 'visible',
  },
  taskCell: {
    width: '100%',
    overflow: 'visible',
  },
  taskCellWithGap: {
    paddingBottom: Spacing.taskGap + 2,
  },
});
