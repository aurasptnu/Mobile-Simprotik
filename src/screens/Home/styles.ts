import {
  StyleSheet,
} from 'react-native';
import {colors, font, radius, shadow} from '../../theme';

export const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        colors.surfaceAlt,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 140,
    },

    header: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
      marginBottom: 25,
    },

    welcome: {
      fontSize: 13,
      color: colors.textMuted,
      fontWeight: font.weight.medium,
    },

    name: {
      fontSize: font.size.display,
      fontWeight:
        font.weight.extrabold,
      color: colors.text,
      marginTop: 4,
    },

    notifButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor:
        colors.white,
      justifyContent:
        'center',
      alignItems:
        'center',

      shadowColor:
        '#000',

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity:
        0.08,

      shadowRadius: 10,

      elevation: 3,
    },

    statRow: {
      flexDirection:
        'row',
      flexWrap: 'wrap',
      marginBottom: 24,
      justifyContent:
        'center',
      gap: 12,
    },

    statCard: {
      width: '48%',
      marginBottom: 12,
      backgroundColor:
        colors.white,

      borderRadius: radius.lg,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.borderSoft,

      ...shadow.card,
    },

    statTitle: {
      fontSize: font.size.xs,
      color: colors.textSoft,
      fontWeight:
        font.weight.bold,
      marginBottom: 6,
    },

    statNumber: {
      fontSize: font.size.xxl,
      fontWeight:
        font.weight.extrabold,
      color: colors.text,
    },

    sectionTitle: {
      fontSize: 12,
      fontWeight:
        font.weight.bold,
      color: colors.textMuted,
      marginBottom: 12,
      letterSpacing: 1,
    },

    progressCard: {
      backgroundColor:
        colors.white,

      borderRadius: radius.xl,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.borderSoft,

      marginBottom: 25,

      ...shadow.card,
    },

    rowBetween: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',
    },

    progressTitle: {
      fontSize: 18,
      fontWeight:
        font.weight.semibold,
      color: colors.text,
    },

    progressPercent: {
      fontSize: 20,
      fontWeight:
        font.weight.bold,
      color: colors.primaryBlue,
    },

    progressBg: {
      width: '100%',
      height: 8,
      backgroundColor:
        colors.surface2,
      borderRadius: 999,
      marginTop: 18,
    },

    progressFill: {
      height: 8,
      backgroundColor:
        colors.primaryBlue,
      borderRadius: 999,
    },

    progressText: {
      marginTop: 14,
      color: colors.textMuted,
      fontSize: 13,
    },

    progressText2: {
      fontSize: 16,
      fontWeight:
        font.weight.semibold,
      color: colors.text,
    },

    link: {
      color: colors.info,
      fontWeight:
        font.weight.semibold,
      fontSize: 13,
    },

    notificationCard: {
      borderRadius: radius.lg,
      padding: 18,
      marginBottom: 12,
    },

    notificationTitle: {
      fontSize: 16,
      fontWeight:
        font.weight.bold,
      color: colors.text,
      marginBottom: 5,
    },

    notificationDesc: {
      fontSize: 13,
      color: colors.textSoft,
      lineHeight: 18,
    },

    taskCard: {
      backgroundColor:
        colors.white,

      borderRadius: radius.lg,
      padding: 18,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.borderSoft,

      ...shadow.card,
    },

    taskTitle: {
      fontSize: 15,
      fontWeight:
        font.weight.bold,
      color: colors.text,
      marginBottom: 6,
    },

    taskDesc: {
      color: colors.textMuted,
      fontSize: 13,
    },

    taskInfoRow: {
      marginBottom: 10,
    },

    taskInfo: {
      color: colors.textSoft,
      fontSize: 13,
      fontWeight:
        '500',
    },

    taskFooter: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
    },

    taskStatus: {
      color: colors.primaryBlue,
      fontSize: 12,
      fontWeight:
        '600',
    },

    taskDeadline: {
      color: colors.textMuted,
      fontSize: 12,
    },
  });
