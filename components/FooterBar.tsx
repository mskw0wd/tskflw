import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { G, Path, Svg } from 'react-native-svg';

import { Colors, Spacing, TextStyles } from '../constants/theme';
import { ScreenTab } from '../data/tasks';

type FooterBarProps = {
  activeTab: ScreenTab;
  swipeX: Animated.Value;
  pageWidth: number;
  onTabPress?: (tab: ScreenTab, index: number) => void;
  onAdd?: () => void;
  onVoice?: () => void;
};

const LEFT_RAIL_MAX_WIDTH = 232;
const TAB_HEIGHT = 44;

type IconType = 'home' | 'folder' | 'layers';

function HomeAddIcon() {
  return (
    <View style={styles.iconFrame}>
      <Svg width={20} height={20} viewBox="0 0 17.9167 17.9167" fill="none">
        <Path
          d="M0.928396 9.75655C0.612192 7.55901 0.45409 6.46024 0.904474 5.52079C1.35486 4.58133 2.31349 4.01028 4.23076 2.86818L5.38479 2.18073C7.12587 1.14358 7.99641 0.625 8.95834 0.625C9.92026 0.625 10.7908 1.14357 12.5319 2.18072L13.6859 2.86817C15.6032 4.01028 16.5618 4.58133 17.0122 5.52079C17.4626 6.46024 17.3045 7.55901 16.9883 9.75656L16.756 11.371C16.3498 14.1939 16.1467 15.6053 15.1675 16.4485C14.1883 17.2917 12.7522 17.2917 9.88006 17.2917H8.03661C5.16448 17.2917 3.72841 17.2917 2.74919 16.4485C1.76997 15.6053 1.56688 14.1939 1.1607 11.371L0.928396 9.75655Z"
          stroke={Colors.iconStroke}
          strokeWidth={1.25}
        />
      </Svg>

      <Svg style={styles.homeAddPlus} width={5} height={5} viewBox="0 0 6.25 6.25" fill="none">
        <Path
          d="M5.625 3.12502L3.125 3.12502M3.125 3.12502L0.625 3.12502M3.125 3.12502L3.125 0.625M3.125 3.12502L3.125 5.625"
          stroke={Colors.iconStroke}
          strokeWidth={1.25}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

function FolderIcon() {
  return (
    <View style={styles.iconFrame}>
      <Svg width={20} height={20} viewBox="0 0 17.9167 17.9167" fill="none">
        <Path
          d="M0.625014 8.95835V4.7498C0.625014 4.01436 0.625014 3.64664 0.682806 3.34034C0.937214 1.99194 1.99194 0.937214 3.34034 0.682806C3.64664 0.625014 4.01436 0.625014 4.7498 0.625014C5.07203 0.625014 5.23315 0.625014 5.38799 0.639493C6.05556 0.701919 6.68878 0.96421 7.20497 1.39211C7.32469 1.49136 7.43862 1.60528 7.66647 1.83314L8.12501 2.29168C8.80483 2.9715 9.14474 3.3114 9.55178 3.53787C9.77538 3.66227 10.0126 3.76052 10.2586 3.83066C10.7066 3.95835 11.1873 3.95835 12.1487 3.95835H12.4601C14.6537 3.95835 15.7506 3.95835 16.4635 4.59957C16.5291 4.65855 16.5915 4.72096 16.6505 4.78654C17.2917 5.49947 17.2917 6.59629 17.2917 8.78993V10.625C17.2917 13.7677 17.2917 15.3391 16.3154 16.3154C15.3391 17.2917 13.7677 17.2917 10.625 17.2917H7.29168C4.14898 17.2917 2.57764 17.2917 1.60132 16.3154C1.05701 15.7711 0.81616 15.0418 0.709591 13.9583"
          stroke={Colors.iconStroke}
          strokeWidth={1.25}
          strokeLinecap="round"
        />
      </Svg>

      <Svg style={styles.folderArrow} width={9.167} height={5} viewBox="0 0 10.4167 6.25009" fill="none">
        <Path
          d="M0.625 3.12504C5.99471 3.12504 4.42196 3.12504 9.79167 3.12504M9.79167 3.12504L6.35417 0.625044M9.79167 3.12504L6.35417 5.62504"
          stroke={Colors.iconStroke}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

function LayersIcon() {
  return (
    <View style={styles.iconFrame}>
      <Svg style={styles.layersTop} width={16.667} height={6.667} viewBox="0 0 17.9167 7.91667" fill="none">
        <Path
          d="M3.10736 5.36257C1.45245 4.7006 0.625 4.36962 0.625 3.95833C0.625 3.54704 1.45245 3.21606 3.10736 2.5541L5.44775 1.61794C7.10265 0.955981 7.93011 0.625 8.95833 0.625C9.98656 0.625 10.814 0.955981 12.4689 1.61794L14.8093 2.5541C16.4642 3.21606 17.2917 3.54704 17.2917 3.95833C17.2917 4.36962 16.4642 4.7006 14.8093 5.36257L12.4689 6.29872C10.814 6.96069 9.98656 7.29167 8.95833 7.29167C7.93011 7.29167 7.10265 6.96069 5.44775 6.29872L3.10736 5.36257Z"
          stroke={Colors.iconStroke}
          strokeWidth={1.25}
        />
      </Svg>

      <Svg style={styles.layersMid} width={16.667} height={5} viewBox="0 0 17.9167 6.2053" fill="none">
        <Path
          d="M3.76344 0.580298L3.10736 0.84273C1.45245 1.50469 0.625 1.83567 0.625 2.24696C0.625 2.65826 1.45245 2.98924 3.10736 3.6512L5.44775 4.58735C7.10265 5.24932 7.93011 5.5803 8.95833 5.5803C9.98656 5.5803 10.814 5.24932 12.4689 4.58735L14.8093 3.6512C16.4642 2.98924 17.2917 2.65826 17.2917 2.24696C17.2917 1.83567 16.4642 1.50469 14.8093 0.84273L14.1532 0.580298"
          stroke={Colors.iconStroke}
          strokeWidth={1.25}
        />
      </Svg>

      <Svg style={styles.layersBottom} width={16.667} height={5} viewBox="0 0 17.9167 6.2053" fill="none">
        <Path
          d="M3.76344 0.580298L3.10736 0.84273C1.45245 1.50469 0.625 1.83567 0.625 2.24696C0.625 2.65826 1.45245 2.98924 3.10736 3.6512L5.44775 4.58735C7.10265 5.24932 7.93011 5.5803 8.95833 5.5803C9.98656 5.5803 10.814 5.24932 12.4689 4.58735L14.8093 3.6512C16.4642 2.98924 17.2917 2.65826 17.2917 2.24696C17.2917 1.83567 16.4642 1.50469 14.8093 0.84273L14.1532 0.580298"
          stroke={Colors.iconStroke}
          strokeWidth={1.25}
        />
      </Svg>
    </View>
  );
}

function PlusIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <G transform="translate(2.58335 2.58335)">
        <Path
          d="M14.0833 7.41672L7.41667 7.41672M7.41667 7.41672L0.75 7.41672M7.41667 7.41672L7.41667 0.75M7.41667 7.41672L7.41667 14.0833"
          stroke={Colors.footerPlusIcon}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

function MicIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 13.75C10.9942 13.749 11.9475 13.3535 12.6505 12.6505C13.3535 11.9475 13.749 10.9942 13.75 10V5C13.75 4.00544 13.3549 3.05161 12.6517 2.34835C11.9484 1.64509 10.9946 1.25 10 1.25C9.00544 1.25 8.05161 1.64509 7.34835 2.34835C6.64509 3.05161 6.25 4.00544 6.25 5V10C6.25103 10.9942 6.64645 11.9475 7.34949 12.6505C8.05253 13.3535 9.00576 13.749 10 13.75ZM7.5 5C7.5 4.33696 7.76339 3.70107 8.23223 3.23223C8.70107 2.76339 9.33696 2.5 10 2.5C10.663 2.5 11.2989 2.76339 11.7678 3.23223C12.2366 3.70107 12.5 4.33696 12.5 5V10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5C9.33696 12.5 8.70107 12.2366 8.23223 11.7678C7.76339 11.2989 7.5 10.663 7.5 10V5ZM10.625 16.2188V18.75C10.625 18.9158 10.5592 19.0747 10.4419 19.1919C10.3247 19.3092 10.1658 19.375 10 19.375C9.83424 19.375 9.67527 19.3092 9.55806 19.1919C9.44085 19.0747 9.375 18.9158 9.375 18.75V16.2188C7.83409 16.062 6.40607 15.3393 5.36707 14.1907C4.32806 13.042 3.7519 11.5489 3.75 10C3.75 9.83424 3.81585 9.67527 3.93306 9.55806C4.05027 9.44085 4.20924 9.375 4.375 9.375C4.54076 9.375 4.69973 9.44085 4.81694 9.55806C4.93415 9.67527 5 9.83424 5 10C5 11.3261 5.52678 12.5979 6.46447 13.5355C7.40215 14.4732 8.67392 15 10 15C11.3261 15 12.5979 14.4732 13.5355 13.5355C14.4732 12.5979 15 11.3261 15 10C15 9.83424 15.0658 9.67527 15.1831 9.55806C15.3003 9.44085 15.4592 9.375 15.625 9.375C15.7908 9.375 15.9497 9.44085 16.0669 9.55806C16.1842 9.67527 16.25 9.83424 16.25 10C16.2481 11.5489 15.6719 13.042 14.6329 14.1907C13.5939 15.3393 12.1659 16.062 10.625 16.2188Z"
        fill={Colors.footerMicIcon}
      />
    </Svg>
  );
}

function TabIcon({ type }: { type: IconType }) {
  if (type === 'home') {
    return <HomeAddIcon />;
  }

  if (type === 'folder') {
    return <FolderIcon />;
  }

  return <LayersIcon />;
}

export default function FooterBar({
  activeTab,
  swipeX,
  pageWidth,
  onTabPress,
  onAdd,
  onVoice,
}: FooterBarProps) {
  const interpolate = (outputRange: number[]) =>
    swipeX.interpolate({
      inputRange: [0, pageWidth, pageWidth * 2],
      outputRange,
      extrapolate: 'clamp',
    });

  const todayLeft = interpolate([0, 0, 0]);
  const todayWidth = interpolate([109, 40, 40]);
  const todayIconLeft = interpolate([20, 10, 10]);
  const todayActiveOpacity = interpolate([1, 0, 0]);
  const todayLabelOpacity = interpolate([1, 0, 0]);

  const upcomingLeft = interpolate([115, 46, 46]);
  const upcomingWidth = interpolate([40, 140, 40]);
  const upcomingIconLeft = interpolate([10, 20, 10]);
  const upcomingActiveOpacity = interpolate([0, 1, 0]);
  const upcomingLabelOpacity = interpolate([0, 1, 0]);
  const upcomingFolderOpacity = interpolate([1, 1, 0]);
  const upcomingLayersOpacity = interpolate([0, 0, 1]);

  const projectLeft = interpolate([161, 192, 92]);
  const projectWidth = interpolate([40, 40, 118]);
  const projectIconLeft = interpolate([10, 10, 20]);
  const projectActiveOpacity = interpolate([0, 0, 1]);
  const projectLabelOpacity = interpolate([0, 0, 1]);
  const projectLayersOpacity = interpolate([1, 1, 0]);
  const projectFolderOpacity = interpolate([0, 0, 1]);

  return (
    <View style={styles.container}>
      <View style={styles.leftActionsArea}>
        <View style={styles.leftActionsRail}>
          <Animated.View style={[styles.tabNode, { left: todayLeft, width: todayWidth }]}>
            <TouchableOpacity
              style={styles.tabTouch}
              activeOpacity={0.8}
              onPress={() => onTabPress?.('Today', 0)}
              disabled={activeTab === 'Today'}
            >
              <Animated.View style={[styles.activePill, { opacity: todayActiveOpacity }]} />

              <Animated.View style={[styles.iconSlot, { left: todayIconLeft }]}>
                <TabIcon type="home" />
              </Animated.View>

              <Animated.Text style={[TextStyles.footerLabel, styles.tabLabel, { opacity: todayLabelOpacity }]}>
                Today
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.tabNode, { left: upcomingLeft, width: upcomingWidth }]}>
            <TouchableOpacity
              style={styles.tabTouch}
              activeOpacity={0.8}
              onPress={() => onTabPress?.('Upcoming', 1)}
              disabled={activeTab === 'Upcoming'}
            >
              <Animated.View style={[styles.activePill, { opacity: upcomingActiveOpacity }]} />

              <Animated.View style={[styles.iconSlot, { left: upcomingIconLeft }]}>
                <Animated.View style={[styles.iconLayer, { opacity: upcomingFolderOpacity }]}>
                  <TabIcon type="folder" />
                </Animated.View>
                <Animated.View style={[styles.iconLayer, { opacity: upcomingLayersOpacity }]}>
                  <TabIcon type="layers" />
                </Animated.View>
              </Animated.View>

              <Animated.Text style={[TextStyles.footerLabel, styles.tabLabel, { opacity: upcomingLabelOpacity }]}>
                Upcoming
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.tabNode, { left: projectLeft, width: projectWidth }]}>
            <TouchableOpacity
              style={styles.tabTouch}
              activeOpacity={0.8}
              onPress={() => onTabPress?.('Project', 2)}
              disabled={activeTab === 'Project'}
            >
              <Animated.View style={[styles.activePill, { opacity: projectActiveOpacity }]} />

              <Animated.View style={[styles.iconSlot, { left: projectIconLeft }]}>
                <Animated.View style={[styles.iconLayer, { opacity: projectLayersOpacity }]}>
                  <TabIcon type="layers" />
                </Animated.View>
                <Animated.View style={[styles.iconLayer, { opacity: projectFolderOpacity }]}>
                  <TabIcon type="folder" />
                </Animated.View>
              </Animated.View>

              <Animated.Text style={[TextStyles.footerLabel, styles.tabLabel, { opacity: projectLabelOpacity }]}>
                Project
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.rightActionButton} activeOpacity={0.8} onPress={onAdd}>
          <PlusIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightActionButton} activeOpacity={0.8} onPress={onVoice}>
          <MicIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingVertical: Spacing.footerPaddingVertical,
    paddingHorizontal: Spacing.footerPaddingHorizontal,
    borderTopWidth: 1,
    borderTopColor: Colors.footerBorder,
    backgroundColor: Colors.footerBackground,
  },
  leftActionsArea: {
    flex: 1,
    justifyContent: 'center',
    minHeight: TAB_HEIGHT,
  },
  leftActionsRail: {
    width: LEFT_RAIL_MAX_WIDTH,
    height: TAB_HEIGHT,
    position: 'relative',
  },
  tabNode: {
    position: 'absolute',
    top: 0,
    height: TAB_HEIGHT,
  },
  tabTouch: {
    width: '100%',
    height: TAB_HEIGHT,
    borderRadius: Spacing.footerActionRadius,
    overflow: 'hidden',
  },
  activePill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Spacing.footerActionRadius,
    backgroundColor: Colors.backgroundSecondary,
  },
  iconSlot: {
    position: 'absolute',
    top: 12,
    width: 20,
    height: 20,
  },
  iconLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  tabLabel: {
    position: 'absolute',
    top: 16.5,
    left: 48,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.footerRightActionsGap,
  },
  rightActionButton: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Spacing.footerActionRadius,
    paddingHorizontal: Spacing.footerPrimaryActionPaddingHorizontal,
    paddingVertical: Spacing.footerActionPaddingVertical,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFrame: {
    width: 20,
    height: 20,
  },
  homeAddPlus: {
    position: 'absolute',
    left: 7.5,
    top: 8.333,
  },
  folderArrow: {
    position: 'absolute',
    left: 1.666,
    top: 10,
  },
  layersTop: {
    position: 'absolute',
    left: 1.666,
    top: 3.333,
  },
  layersMid: {
    position: 'absolute',
    left: 1.666,
    top: 8.333,
  },
  layersBottom: {
    position: 'absolute',
    left: 1.666,
    top: 11.666,
  },
});
