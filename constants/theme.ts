import type { TextStyle } from 'react-native';

const palette = {
  backgroundPrimary: '#FFFFFF',
  backgroundSecondary: '#F5F4ED',
  footerActiveBackground: '#F5F4ED',

  textPrimary: '#141413',
  textSecondary: '#3D3D3A',
  textTertiary: 'rgba(107, 106, 134, 0.7)',
  textOnActive: '#3D3D3A',

  borderTertiary: 'rgba(31, 30, 29, 0.15)',
  borderGhost: 'rgba(31, 30, 29, 0.1)',

  iconStroke: '#1C274C',
  iconBlack: '#000000',
} as const;

export const Colors = {
  ...palette,

  // Semantic aliases
  background: palette.backgroundPrimary,
  addButtonBackground: palette.backgroundSecondary,
  footerBackground: palette.backgroundPrimary,
  greetingLabel: palette.textSecondary,
  greetingName: palette.textPrimary,
  summaryLabel: palette.textTertiary,
  summaryCount: palette.textSecondary,
  summaryText: palette.textSecondary,
  footerLabel: palette.textTertiary,
  footerCount: palette.textSecondary,
  footerActiveLabel: palette.textOnActive,
  taskTitle: palette.textSecondary,
  taskTitleDone: 'rgba(107, 106, 134, 0.45)',
  taskMeta: palette.textTertiary,
  tabActive: palette.textPrimary,
  tabInactive: palette.textTertiary,
  checkboxBorder: palette.borderTertiary,
  avatarBorder: palette.borderTertiary,
  footerBorder: palette.borderGhost,
  footerPlusIcon: palette.iconStroke,
  footerMicIcon: palette.iconBlack,
  black: palette.iconBlack,

  light: {
    text: palette.textSecondary,
    background: palette.backgroundPrimary,
    tint: palette.textPrimary,
    icon: palette.iconStroke,
    tabIconDefault: palette.textTertiary,
    tabIconSelected: palette.textPrimary,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#FFFFFF',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
  },
} as const;

export const FontFamily = {
  regular: 'PTRootUI-Regular',
  medium: 'PTRootUI-Medium',
  semibold: 'PTRootUI-Bold',
  bold: 'PTRootUI-Bold',
  fallback: 'System',
} as const;

export const FontSize = {
  bodyMedium: 16,
  h1: 40,
} as const;

export const LineHeight = {
  bodySmall: 20,
  h1: 48,
} as const;

export const LetterSpacing = {
  bodyXSmall: -0.3,
  bodySemibold: -0.1,
  h1: -1.5,
} as const;

const VerticalTrim = {
  bodyMedium: {
    marginTop: -4.5,
    marginBottom: -4.5,
  },
  titleH1: {
    marginTop: -10,
    marginBottom: -10,
  },
} as const;

const withVerticalTrim = (style: TextStyle, trim: TextStyle): TextStyle => ({
  ...style,
  ...trim,
  includeFontPadding: false,
});

const bodyMediumBase: TextStyle = {
  fontSize: FontSize.bodyMedium,
  lineHeight: LineHeight.bodySmall,
};

export const Spacing = {
  // Global layout
  screenPadding: 24,
  contentPaddingTop: 16,
  contentPaddingVertical: 16,
  headerVerticalPadding: 12,
  segmentedPaddingVertical: 32,
  segmentTodayGap: 24,

  // Summary
  summaryGap: 4,
  summaryWidth: 158,

  // Tasks
  sectionGap: 32,
  taskGap: 24,
  taskRowGap: 16,
  taskContentGap: 14,
  taskMetaGap: 12,
  taskListBottomPadding: 40,

  // Footer
  footerPaddingVertical: 16,
  footerPaddingHorizontal: 24,
  footerLeftActionsGap: 6,
  footerRightActionsGap: 8,
  footerActionRadius: 30,
  footerInactivePillPaddingHorizontal: 10,
  footerActivePillPaddingHorizontal: 20,
  footerActionPaddingVertical: 12,
  footerPrimaryActionPaddingHorizontal: 16,
  // Legacy aliases for existing components.
  footerActionGap: 8,
  footerActionPaddingHorizontal: 16,

  // Header/atoms
  checkboxSize: 20,
  checkboxRadius: 5,
  checkboxStrokeWidth: 1.25,
  avatarSize: 44,
  avatarInner: 34,
  actionGap: 12,

  // Legacy tab values (kept for compatibility with existing component)
  tabGap: 24,
  tabVerticalPadding: 48,
  tabTodayWidth: 100,
  tabUpcomingWidth: 192,
  tabProjectsWidth: 137,
} as const;

export const TextStyles: Record<string, TextStyle> = {
  heroTabActive: withVerticalTrim(
    {
      fontFamily: FontFamily.bold,
      fontWeight: '700',
      fontSize: FontSize.h1,
      lineHeight: LineHeight.h1,
      letterSpacing: LetterSpacing.h1,
      color: Colors.tabActive,
    },
    VerticalTrim.titleH1,
  ),
  heroTabInactive: withVerticalTrim(
    {
      fontFamily: FontFamily.medium,
      fontWeight: '500',
      fontSize: FontSize.h1,
      lineHeight: LineHeight.h1,
      letterSpacing: LetterSpacing.h1,
      color: Colors.tabInactive,
    },
    VerticalTrim.titleH1,
  ),

  headerSecondary: withVerticalTrim(
    {
      ...bodyMediumBase,
      fontFamily: FontFamily.regular,
      fontWeight: '400',
      letterSpacing: LetterSpacing.bodyXSmall,
      color: Colors.greetingLabel,
    },
    VerticalTrim.bodyMedium,
  ),
  headerPrimary: withVerticalTrim(
    {
      ...bodyMediumBase,
      fontFamily: FontFamily.semibold,
      fontWeight: '700',
      letterSpacing: LetterSpacing.bodySemibold,
      color: Colors.greetingName,
    },
    VerticalTrim.bodyMedium,
  ),

  screenTitle: withVerticalTrim(
    {
      fontFamily: FontFamily.bold,
      fontWeight: '700',
      fontSize: FontSize.h1,
      lineHeight: LineHeight.h1,
      letterSpacing: LetterSpacing.h1,
      color: Colors.textPrimary,
    },
    VerticalTrim.titleH1,
  ),

  summaryMuted: withVerticalTrim(
    {
      ...bodyMediumBase,
      fontFamily: FontFamily.medium,
      fontWeight: '500',
      letterSpacing: LetterSpacing.bodyXSmall,
      color: Colors.summaryLabel,
    },
    VerticalTrim.bodyMedium,
  ),
  summaryStrong: withVerticalTrim(
    {
      ...bodyMediumBase,
      fontFamily: FontFamily.medium,
      fontWeight: '500',
      letterSpacing: LetterSpacing.bodyXSmall,
      color: Colors.summaryCount,
    },
    VerticalTrim.bodyMedium,
  ),

  taskTitle: withVerticalTrim(
    {
      ...bodyMediumBase,
      fontFamily: FontFamily.medium,
      fontWeight: '500',
      letterSpacing: LetterSpacing.bodyXSmall,
      color: Colors.taskTitle,
    },
    VerticalTrim.bodyMedium,
  ),
  taskTitleCompleted: withVerticalTrim(
    {
      ...bodyMediumBase,
      fontFamily: FontFamily.medium,
      fontWeight: '500',
      letterSpacing: LetterSpacing.bodyXSmall,
      color: Colors.taskTitleDone,
      textDecorationLine: 'line-through',
    },
    VerticalTrim.bodyMedium,
  ),
  taskMeta: withVerticalTrim(
    {
      ...bodyMediumBase,
      fontFamily: FontFamily.medium,
      fontWeight: '500',
      letterSpacing: LetterSpacing.bodyXSmall,
      color: Colors.taskMeta,
    },
    VerticalTrim.bodyMedium,
  ),

  footerLabel: withVerticalTrim(
    {
      ...bodyMediumBase,
      fontFamily: FontFamily.medium,
      fontWeight: '500',
      letterSpacing: LetterSpacing.bodyXSmall,
      color: Colors.footerActiveLabel,
    },
    VerticalTrim.bodyMedium,
  ),
  footerCount: withVerticalTrim(
    {
      ...bodyMediumBase,
      fontFamily: FontFamily.medium,
      fontWeight: '500',
      letterSpacing: LetterSpacing.bodyXSmall,
      color: Colors.footerCount,
    },
    VerticalTrim.bodyMedium,
  ),
};
