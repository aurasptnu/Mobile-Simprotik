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
      backgroundColor: colors.white,
      borderRadius: radius.lg,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.borderSoft,
      ...shadow.card,
    },

    filterSectionTitle: {
      fontSize: font.size.sm,
      fontWeight: font.weight.bold,
      color: colors.textSoft,
      marginTop: 6,
      marginBottom: 8,
      textTransform: 'uppercase',
    },

    chipRow: {
      flexDirection: 'row',
      marginBottom: 10,
    },

    wrapChipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 14,
    },

    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 8,
    },

    activeFilterChip: {
      backgroundColor: colors.primaryBlue,
      borderColor: colors.primaryBlue,
    },

    filterChipText: {
      fontSize: font.size.sm,
      color: colors.text,
    },

    activeFilterChipText: {
      color: colors.white,
      fontWeight: font.weight.bold,
    },

    dateFilterRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 14,
    },

    dateInput: {
      flex: 1,
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: font.size.sm,
      color: colors.text,
      textAlign: 'center',
    },

    dropdownRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 14,
    },

    dropdownButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingVertical: 10,
      paddingHorizontal: 6,
    },

    activeDropdownButton: {
      backgroundColor: colors.navy50,
      borderColor: colors.primaryBlue,
    },

    dropdownLabel: {
      fontSize: font.size.xs,
      color: colors.textSoft,
      fontWeight: font.weight.semibold,
    },

    dropdownValue: {
      fontSize: font.size.xs,
      color: colors.text,
      fontWeight: font.weight.bold,
    },

    dropdownArrow: {
      fontSize: font.size.xs,
      color: colors.primaryBlue,
    },

    pickerOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },

    pickerContent: {
      width: '90%',
      maxWidth: 360,
      backgroundColor: colors.white,
      borderRadius: radius.lg,
      padding: 16,
      ...shadow.card,
    },

    pickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 12,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderSoft,
    },

    pickerTitle: {
      fontSize: font.size.base,
      fontWeight: font.weight.bold,
      color: colors.text,
    },

    pickerCloseText: {
      fontSize: font.size.lg,
      color: colors.textMuted,
      paddingHorizontal: 6,
    },

    pickerItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: radius.md,
      marginBottom: 4,
    },

    activePickerItem: {
      backgroundColor: colors.primaryBlue,
    },

    pickerItemText: {
      fontSize: font.size.base,
      color: colors.text,
    },

    activePickerItemText: {
      color: colors.white,
      fontWeight: font.weight.bold,
    },

    dayGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      paddingVertical: 8,
    },

    dayGridItem: {
      width: '22%',
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: colors.surfaceAlt,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },

    dayGridItemText: {
      fontSize: font.size.sm,
      color: colors.text,
    },

    filterActionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.borderSoft,
    },

    resetButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },

    resetButtonText: {
      color: colors.textMuted,
      fontSize: font.size.sm,
      fontWeight: font.weight.semibold,
    },

    applyButton: {
      backgroundColor: colors.primaryBlue,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: radius.md,
    },

    applyButtonText: {
      color: colors.white,
      fontWeight: font.weight.bold,
      fontSize: font.size.sm,
    },

    activeFilterToggle: {
      backgroundColor: colors.navy50,
      borderWidth: 1,
      borderColor: colors.primaryBlue,
    },

    activeFilterToggleText: {
      color: colors.primaryBlue,
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
