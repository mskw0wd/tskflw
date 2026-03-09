import type { TextStyle } from 'react-native';

const palette = {
  // Backgrounds
  background: '#FFFFFF',
  addButtonBackground: '#F5F4ED',
  footerBackground: '#FFFFFF',

  // Text hierarchy
  textPrimary: '#141413',
  textSecondary: '#3D3D3A',
  textTertiary: 'rgba(107, 106, 134, 0.7)',
  textMuted: 'rgba(107, 106, 134, 0.7)',

  // Semantic aliases
  greetingLabel: '#3D3D3A',
  greetingName: '#141413',
  summaryLabel: 'rgba(107, 106, 134, 0.7)',
  summaryCount: '#3D3D3A',
  summaryText: '#3D3D3A',
  footerCount: '#3D3D3A',
  footerLabel: 'rgba(107, 106, 134, 0.7)',
  taskTitle: '#3D3D3A',
  taskTitleDone: 'rgba(107, 106, 134, 0.45)',
  taskMeta: 'rgba(107, 106, 134, 0.7)',

  // Tabs
  tabActive: '#141413',
  tabInactive: 'rgba(107, 106, 134, 0.7)',

  // Borders / strokes
  checkboxBorder: 'rgba(31, 30, 29, 0.15)',
  avatarBorder: 'rgba(31, 30, 29, 0.15)',
  footerBorder: 'rgba(31, 30, 29, 0.1)',

  // Icons
  black: '#000000',
  iconStroke: '#1C274C',
  footerPlusIcon: '#1C274C',
  footerMicIcon: '#000000',
} as const;

export const Colors = {
  ...palette,
  // Expo template compatibility for useThemeColor and UI primitives.
  light: {
    text: palette.textSecondary,
    background: palette.background,
    tint: palette.textPrimary,
    icon: palette.iconStroke,
    tabIconDefault: palette.textMuted,
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
  bold: 'PTRootUI-Bold',
  fallback: 'System',
};

export const FontSize = {
  small: 14,
  medium: 16,
  h1: 40,
};

export const LineHeight = {
  small: 18,
  medium: 20,
  h1: 48,
};

export const LetterSpacing = {
  small: -0.3,
  medium: -0.3,
  h1: -1.5,
  accent: -0.1,
};

const VerticalTrim = {
  bodySmall: {
    marginTop: -3.5,
    marginBottom: -3.5,
  },
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

export const Spacing = {
  screenPadding: 24,
  contentPaddingVertical: 16,
  headerVerticalPadding: 12,
  tabGap: 24,
  tabVerticalPadding: 48,
  sectionGap: 32,
  taskGap: 28,
  taskRowGap: 16,
  taskContentGap: 14,
  taskMetaGap: 12,
  footerPaddingVertical: 18,
  footerPaddingHorizontal: 24,
  footerActionGap: 12,
  footerActionPaddingHorizontal: 24,
  footerActionPaddingVertical: 10,
  checkboxSize: 20,
  checkboxRadius: 5,
  avatarSize: 44,
  avatarInner: 34,
  actionGap: 12,
  summaryGap: 4,
  summaryWidth: 158,
  tabTodayWidth: 100,
  tabUpcomingWidth: 192,
  tabProjectsWidth: 137,
};

export const TextStyles: Record<string, TextStyle> = {
  heroTabActive: withVerticalTrim({
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    fontSize: FontSize.h1,
    lineHeight: LineHeight.h1,
    letterSpacing: LetterSpacing.h1,
    color: Colors.tabActive,
  }, VerticalTrim.titleH1),
  heroTabInactive: withVerticalTrim({
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    fontSize: FontSize.h1,
    lineHeight: LineHeight.h1,
    letterSpacing: LetterSpacing.h1,
    color: Colors.tabInactive,
  }, VerticalTrim.titleH1),

  headerSecondary: withVerticalTrim({
    fontFamily: FontFamily.regular,
    fontWeight: '400',
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.greetingLabel,
  }, VerticalTrim.bodyMedium),
  headerPrimary: withVerticalTrim({
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.accent,
    color: Colors.greetingName,
  }, VerticalTrim.bodyMedium),

  summaryMuted: withVerticalTrim({
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.summaryLabel,
  }, VerticalTrim.bodyMedium),
  summaryStrong: withVerticalTrim({
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.summaryCount,
  }, VerticalTrim.bodyMedium),

  taskTitle: withVerticalTrim({
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.taskTitle,
  }, VerticalTrim.bodyMedium),
  taskTitleCompleted: withVerticalTrim({
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.taskTitleDone,
    textDecorationLine: 'line-through',
  }, VerticalTrim.bodyMedium),
  taskMeta: withVerticalTrim({
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.taskMeta,
  }, VerticalTrim.bodyMedium),

  footerCount: withVerticalTrim({
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.footerCount,
  }, VerticalTrim.bodyMedium),
  footerLabel: withVerticalTrim({
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.footerLabel,
  }, VerticalTrim.bodyMedium),
};
