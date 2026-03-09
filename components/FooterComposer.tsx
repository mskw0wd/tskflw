import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, Path, Line, Rect } from 'react-native-svg';
import { Colors, TextStyles, Spacing } from '../constants/theme';

type FooterComposerProps = {
  tasksRemaining: number;
  onAdd?: () => void;
  onVoice?: () => void;
};

function PlusIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 4v12M4 10h12"
        stroke={Colors.textPrimary}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function MicIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Rect x={7} y={1} width={6} height={10} rx={3} stroke={Colors.textPrimary} strokeWidth={1.5} />
      <Path
        d="M4 10a6 6 0 0 0 12 0"
        stroke={Colors.textPrimary}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Line
        x1={10} y1={16} x2={10} y2={19}
        stroke={Colors.textPrimary}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function FooterComposer({ tasksRemaining, onAdd, onVoice }: FooterComposerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={TextStyles.footerCount}>{tasksRemaining}</Text>
        <Text style={TextStyles.footerLabel}>tasks left</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onAdd} activeOpacity={0.8}>
          <PlusIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onVoice} activeOpacity={0.8}>
          <MicIcon />
        </TouchableOpacity>
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
    paddingVertical: Spacing.footerPaddingVertical,
    paddingHorizontal: Spacing.footerPaddingHorizontal,
    borderTopWidth: 1,
    borderTopColor: Colors.footerBorder,
    backgroundColor: Colors.footerBackground,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.footerActionGap,
  },
  actionBtn: {
    width: 44,
    height: 44,
    backgroundColor: Colors.addButtonBackground,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
