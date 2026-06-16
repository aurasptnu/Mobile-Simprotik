import {
  StyleSheet,
} from 'react-native';

export const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#F6F7FB',
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
      color: '#9CA3AF',
    },

    name: {
      fontSize: 30,
      fontWeight:
        '700',
      color: '#111827',
      marginTop: 4,
    },

    notifButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor:
        '#fff',
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
        '#fff',

      borderRadius: 22,
      padding: 10,

      shadowColor:
        '#000',

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity:
        0.06,

      shadowRadius: 10,

      elevation: 2,
    },

    statTitle: {
      fontSize: 9,
      color: '#9CA3AF',
      fontWeight:
        '600',
      marginBottom: 6,
    },

    statNumber: {
      fontSize: 20,
      fontWeight:
        '700',
      color: '#111827',
    },

    sectionTitle: {
      fontSize: 12,
      fontWeight:
        '700',
      color: '#9CA3AF',
      marginBottom: 12,
      letterSpacing: 1,
    },

    progressCard: {
      backgroundColor:
        '#fff',

      borderRadius: 24,
      padding: 20,

      marginBottom: 25,

      shadowColor:
        '#000',

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity:
        0.06,

      shadowRadius: 10,

      elevation: 2,
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
        '600',
      color: '#111827',
    },

    progressPercent: {
      fontSize: 20,
      fontWeight:
        '700',
      color: '#2563EB',
    },

    progressBg: {
      width: '100%',
      height: 8,
      backgroundColor:
        '#E5E7EB',
      borderRadius: 999,
      marginTop: 18,
    },

    progressFill: {
      height: 8,
      backgroundColor:
        '#2563EB',
      borderRadius: 999,
    },

    progressText: {
      marginTop: 14,
      color: '#9CA3AF',
      fontSize: 13,
    },

    progressText2: {
      fontSize: 16,
      fontWeight:
        '600',
      color: '#111827',
    },

    link: {
      color: '#2563EB',
      fontWeight:
        '600',
      fontSize: 13,
    },

    notificationCard: {
      borderRadius: 22,
      padding: 18,
      marginBottom: 12,
    },

    notificationTitle: {
      fontSize: 16,
      fontWeight:
        '700',
      color: '#111827',
      marginBottom: 5,
    },

    notificationDesc: {
      fontSize: 13,
      color: '#6B7280',
      lineHeight: 18,
    },

    taskCard: {
      backgroundColor:
        '#fff',

      borderRadius: 20,
      padding: 18,
      marginBottom: 12,

      shadowColor:
        '#000',

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity:
        0.05,

      shadowRadius: 10,

      elevation: 2,
    },

    taskTitle: {
      fontSize: 15,
      fontWeight:
        '700',
      color: '#111827',
      marginBottom: 6,
    },

    taskDesc: {
      color: '#9CA3AF',
      fontSize: 13,
    },

    taskInfoRow: {
      marginBottom: 10,
    },

    taskInfo: {
      color: '#6B7280',
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
      color: '#2563EB',
      fontSize: 12,
      fontWeight:
        '600',
    },

    taskDeadline: {
      color: '#9CA3AF',
      fontSize: 12,
    },
  });