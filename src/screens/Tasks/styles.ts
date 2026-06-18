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
      padding: 20,
      paddingBottom: 120,
    },

    header: {
      fontSize: font.size.display,
      fontWeight:
        font.weight.extrabold,
      color:
        colors.text,
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
        colors.white,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      ...shadow.card,
    },

    searchInput: {
      fontSize: font.size.base,
      color: colors.text,
      flex: 1,
      minHeight: 44,
    },

    filterToggle: {
      backgroundColor:
        colors.primaryBlue,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: radius.md,
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    filterToggleText: {
      color: colors.white,
      fontWeight: font.weight.bold,
    },

    filterMenu: {
      backgroundColor:
        colors.white,
      borderRadius: radius.lg,
      paddingVertical: 8,
      marginBottom: 20,
      ...shadow.card,
    },

    filterOption: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },

    activeOption: {
      backgroundColor:
        colors.navy50,
    },

    filterOptionText: {
      color: colors.text,
      fontSize: font.size.base,
    },

    activeOptionText: {
      color: colors.primaryBlue,
      fontWeight: font.weight.bold,
    },

    filterButton: {
      backgroundColor:
        colors.white,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: radius.md,
      marginRight: 10,
    },

    activeButton: {
      backgroundColor:
        colors.primaryBlue,
    },

    filterText: {
      color: colors.textSoft,
      fontWeight:
        font.weight.semibold,
    },

    activeText: {
      color: colors.white,
    },

    taskCard: {
      backgroundColor:
        colors.white,
      borderRadius: radius.lg,
      padding: 18,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: colors.borderSoft,

      ...shadow.card,
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
      borderRadius: radius.full,
    },

    blueBadge: {
      backgroundColor:
        colors.primaryBlue,
    },

    orangeBadge: {
      backgroundColor:
        colors.orange,
    },

    greenBadge: {
      backgroundColor:
        colors.success,
    },

    purpleBadge: {
      backgroundColor:
        colors.purple,
    },

    grayBadge: {
      backgroundColor:
        colors.surface2,
    },

    badgeText: {
      fontSize: font.size.xs,
      fontWeight:
        font.weight.bold,
      color:
        colors.white,
    },

    taskTitle: {
      fontSize: font.size.lg,
      fontWeight:
        font.weight.bold,
      color:
        colors.text,
      marginBottom: 10,
    },

    taskInfo: {
      fontSize: font.size.base,
      color: colors.textSoft,
      marginBottom: 6,
    },

    deadline: {
      color: colors.textMuted,
      fontSize: font.size.sm,
    },

    indicatorRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 10,
    },

    indicatorText: {
      backgroundColor: colors.surface2,
      color: colors.textSoft,
      borderRadius: radius.full,
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontSize: font.size.sm,
      fontWeight: font.weight.semibold,
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
      borderRadius: radius.md,
      marginRight: 8,
      resizeMode: 'contain',
    },

    assignedByText: {
      fontSize: font.size.sm,
      color: colors.textSoft,
      fontWeight: font.weight.medium,
    },
  });
