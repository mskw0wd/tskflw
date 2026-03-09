// ─── Raw Tokens ────────────────────────────────────────────────────────────────

export const Colors = {
  // Backgrounds
  background: '#FFFFFF',
  addButtonBackground: '#F5F4ED',
  footerBackground: '#FFFFFF',

  // Text hierarchy — four levels
  textPrimary: '#141413',
  textSecondary: '#3D3D3A',
  textTertiary: '#6B6A82',
  textMuted: 'rgba(107, 106, 134, 0.55)',

  // Semantic color aliases
  greetingLabel: '#6B6A82',
  greetingName: '#141413',

  summaryLabel: '#6B6A82',
  summaryCount: '#141413',
  summaryText: '#3D3D3A',

  footerCount: '#141413',
  footerLabel: '#6B6A82',

  taskTitle: '#3D3D3A',
  taskTitleDone: 'rgba(107, 106, 134, 0.45)',

  taskMeta: '#9998AF',

  // Tabs
  tabActive: '#141413',
  tabInactive: 'rgba(107, 106, 134, 0.45)',

  // Borders / strokes
  checkboxBorder: 'rgba(31, 30, 29, 0.15)',
  avatarBorder: 'rgba(31, 30, 29, 0.15)',
  footerBorder: 'rgba(31, 30, 29, 0.1)',

  // Icons
  black: '#29333F',
  iconStroke: '#1C274C',
};

export const FontFamily = {
  regular: 'PTRootUI-Regular',
  medium: 'PTRootUI-Medium',
  fallback: 'System',
};

export const FontSize = {
  small: 14,
  medium: 16,
  h1: 40,
};

export const LineHeight = {
  small: 14 * 1.2857,
  medium: 16 * 1.25,
  h1: 40 * 1.2,
};

export const LetterSpacing = {
  small: -0.3,
  medium: -0.3,
  h1: -1.5,
};

export const Spacing = {
  screenPadding: 24,
  sectionGap: 40,
  taskGap: 32,
  tabGap: 28,
  taskRowGap: 12,
  taskMetaGap: 12,
  footerPaddingVertical: 18,
  footerPaddingHorizontal: 24,
  checkboxSize: 18,
  checkboxRadius: 4.5,
  avatarSize: 44,
  avatarInner: 34,
  actionGap: 12,
  footerActionGap: 10,
};

// ─── Semantic Text Styles ──────────────────────────────────────────────────────
// Composed from raw tokens. Use these in components instead of rebuilding
// font properties manually. Layout-specific properties (flex, width, etc.)
// remain in component StyleSheets.

export const TextStyles = {
  // Tab labels — large editorial H1
  heroTabActive: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.h1,
    lineHeight: LineHeight.h1,
    letterSpacing: LetterSpacing.h1,
    color: Colors.tabActive,
  },
  heroTabInactive: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.h1,
    lineHeight: LineHeight.h1,
    letterSpacing: LetterSpacing.h1,
    color: Colors.tabInactive,
  },

  // Header greeting
  headerSecondary: {
    // "Hey," — softer, regular weight
    fontFamily: FontFamily.regular,
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.greetingLabel,
  },
  headerPrimary: {
    // "Max" — stronger, medium weight
    fontFamily: FontFamily.medium,
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.greetingName,
  },

  // Summary row above task list
  summaryMuted: {
    // "You have" — tertiary, softest
    fontFamily: FontFamily.regular,
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.summaryLabel,
  },
  summaryStrong: {
    // "7 tasks today" — number primary, rest secondary
    fontFamily: FontFamily.medium,
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.summaryCount,
  },

  // Task list
  taskTitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.taskTitle,
  },
  taskTitleCompleted: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.taskTitleDone,
    textDecorationLine: 'line-through' as const,
  },
  taskMeta: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    lineHeight: LineHeight.small,
    letterSpacing: LetterSpacing.small,
    color: Colors.taskMeta,
  },

  // Footer summary
  footerCount: {
    // Number — strongest
    fontFamily: FontFamily.medium,
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.footerCount,
  },
  footerLabel: {
    // "tasks left" — softer
    fontFamily: FontFamily.regular,
    fontSize: FontSize.medium,
    lineHeight: LineHeight.medium,
    letterSpacing: LetterSpacing.medium,
    color: Colors.footerLabel,
  },
} as const;
