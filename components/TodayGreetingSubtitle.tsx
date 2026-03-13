import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { TextStyles } from '../constants/theme';
import { getCurrentTimeBlock, getLocalDateKey, getTodaySubtitleContext } from '../utils/todaySubtitle';

export type TodayGreetingSubtitleProps = {
  todayTasksCount?: number;
  isLoading?: boolean;
};

const FALLBACK_SUBTITLE = 'Let’s keep today clear.';
const REVEAL_DURATION_MS = 920;
const CHECK_CONTEXT_INTERVAL_MS = 60_000;
const CLIP_VERTICAL_BLEED = 6;
const REVEAL_EASING = Easing.bezier(0.22, 1, 0.36, 1);

let lastRenderedContextKey: string | null = null;

export default function TodayGreetingSubtitle({
  todayTasksCount,
  isLoading = false,
}: TodayGreetingSubtitleProps) {
  const [now, setNow] = useState(() => new Date());
  const [textWidth, setTextWidth] = useState(0);
  const [measuredKey, setMeasuredKey] = useState('');

  const revealProgress = useRef(new Animated.Value(0)).current;
  const previousContextKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date());
    }, CHECK_CONTEXT_INTERVAL_MS);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const context = useMemo(() => {
    if (isLoading || typeof todayTasksCount !== 'number') {
      const dateKey = getLocalDateKey(now);
      const timeBlock = getCurrentTimeBlock(now);
      return {
        contextKey: `${dateKey}:fallback:${timeBlock}`,
        subtitle: FALLBACK_SUBTITLE,
      };
    }

    const resolved = getTodaySubtitleContext({
      now,
      todayTasksCount,
    });

    return {
      contextKey: resolved.contextKey,
      subtitle: resolved.subtitle,
    };
  }, [isLoading, now, todayTasksCount]);

  useEffect(() => {
    const isReadyToAnimate = measuredKey === context.contextKey && textWidth > 0;
    if (!isReadyToAnimate) {
      return;
    }

    const contextChanged = previousContextKeyRef.current !== context.contextKey;
    const shouldAnimate = contextChanged && lastRenderedContextKey !== context.contextKey;

    previousContextKeyRef.current = context.contextKey;
    lastRenderedContextKey = context.contextKey;

    if (!shouldAnimate) {
      revealProgress.setValue(1);
      return;
    }

    revealProgress.setValue(0);
    Animated.timing(revealProgress, {
      toValue: 1,
      duration: REVEAL_DURATION_MS,
      easing: REVEAL_EASING,
      useNativeDriver: false,
    }).start();
  }, [context.contextKey, measuredKey, revealProgress, textWidth]);

  const revealWidth = revealProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(textWidth, 1)],
  });

  const revealOpacity = revealProgress.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0.2, 0.82, 1],
  });

  const revealTranslateY = revealProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1.5, 0],
  });

  return (
    <View style={styles.root}>
      <Text
        style={[TextStyles.dayLabel, styles.measureText]}
        onLayout={(event) => {
          const width = Math.ceil(event.nativeEvent.layout.width);
          if (width !== textWidth) {
            setTextWidth(width);
          }
          if (measuredKey !== context.contextKey) {
            setMeasuredKey(context.contextKey);
          }
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {context.subtitle}
      </Text>

      <Animated.View
        style={[
          styles.animatedReveal,
          {
            width: revealWidth,
            opacity: revealOpacity,
            transform: [{ translateY: revealTranslateY }],
          },
        ]}
      >
        <Text style={TextStyles.dayLabel} numberOfLines={1} ellipsizeMode="tail">
          {context.subtitle}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    position: 'relative',
  },
  measureText: {
    maxWidth: '100%',
    opacity: 0,
  },
  animatedReveal: {
    left: 0,
    overflow: 'hidden',
    paddingVertical: CLIP_VERTICAL_BLEED,
    position: 'absolute',
    top: -CLIP_VERTICAL_BLEED,
  },
});
