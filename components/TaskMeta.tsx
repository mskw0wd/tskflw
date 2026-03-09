import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextStyles, Spacing } from '../constants/theme';

type TaskMetaProps = {
  project: string;
  dueDate: string;
};

export default function TaskMeta({ project, dueDate }: TaskMetaProps) {
  return (
    <View style={styles.container}>
      <Text style={[TextStyles.taskMeta, styles.project]} numberOfLines={1}>
        {project}
      </Text>
      <Text style={[TextStyles.taskMeta, styles.dueDate]} numberOfLines={1}>
        {dueDate}
      </Text>
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
