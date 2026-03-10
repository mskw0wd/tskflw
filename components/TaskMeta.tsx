import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextStyles, Spacing } from '../constants/theme';

type TaskMetaProps = {
  project: string;
  dueDate: string;
  showDueDate?: boolean;
};

export default function TaskMeta({ project, dueDate, showDueDate = true }: TaskMetaProps) {
  return (
    <View style={styles.container}>
      <Text style={[TextStyles.taskMeta, styles.project]} numberOfLines={1}>
        {project}
      </Text>
      {showDueDate ? (
        <Text style={[TextStyles.taskMeta, styles.dueDate]} numberOfLines={1}>
          {dueDate}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    gap: Spacing.taskMetaGap,
  },
  // Layout-only — typography comes from TextStyles.taskMeta
  project: {
    flex: 1,
  },
  dueDate: {
    flexShrink: 0,
  },
});
