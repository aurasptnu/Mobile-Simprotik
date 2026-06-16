import {
  StyleSheet,
} from 'react-native';

export const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#F6F7FB',
      padding: 20,
      paddingBottom: 120,
    },

    header: {
      fontSize: 28,
      fontWeight:
        '700',
      color:
        '#111827',
      marginBottom: 20,
    },

    searchFilterRow: {
      flexDirection:
        'row',
      alignItems:
        'center',
      marginBottom: 16,
      gap: 10,
    },

    searchBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        '#fff',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingHorizontal: 12,
      paddingVertical: 8,
      shadowColor:
        '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },

    searchInput: {
      fontSize: 14,
      color: '#111827',
      flex: 1,
      minHeight: 44,
    },

    filterToggle: {
      backgroundColor:
        '#2563EB',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 16,
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    filterToggleText: {
      color: '#fff',
      fontWeight: '700',
    },

    filterMenu: {
      backgroundColor:
        '#fff',
      borderRadius: 18,
      paddingVertical: 8,
      marginBottom: 20,
      shadowColor:
        '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },

    filterOption: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },

    activeOption: {
      backgroundColor:
        '#EFF6FF',
    },

    filterOptionText: {
      color: '#111827',
      fontSize: 14,
    },

    activeOptionText: {
      color: '#2563EB',
      fontWeight: '700',
    },

    filterButton: {
      backgroundColor:
        '#fff',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 14,
      marginRight: 10,
    },

    activeButton: {
      backgroundColor:
        '#2563EB',
    },

    filterText: {
      color: '#6B7280',
      fontWeight:
        '600',
    },

    activeText: {
      color: '#fff',
    },

    taskCard: {
      backgroundColor:
        '#fff',
      borderRadius: 22,
      padding: 18,
      marginBottom: 15,

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

    rowBetween: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
      marginBottom: 12,
    },

    badge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },

    orangeBadge: {
      backgroundColor:
        '#FDE68A',
    },

    yellowBadge: {
      backgroundColor:
        '#FEE2E2',
    },

    greenBadge: {
      backgroundColor:
        '#BBF7D0',
    },

    grayBadge: {
      backgroundColor:
        '#E5E7EB',
    },

    badgeText: {
      fontSize: 11,
      fontWeight:
        '700',
      color:
        '#111827',
    },

    taskTitle: {
      fontSize: 16,
      fontWeight:
        '700',
      color:
        '#111827',
      marginBottom: 10,
    },

    taskInfo: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 6,
    },

    deadline: {
      color: '#9CA3AF',
      fontSize: 13,
    },

    assignedByContainer: {
      flexDirection:
        'row',
      alignItems:
        'center',
      marginVertical: 10,
    },

    profileImage: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 8,
      resizeMode: 'contain',
    },

    assignedByText: {
      fontSize: 13,
      color: '#6B7280',
      fontWeight: '500',
    },
  });