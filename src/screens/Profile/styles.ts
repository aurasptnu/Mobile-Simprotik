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
      alignItems:
        'center',
      padding: 24,
    },

    avatar: {
      width: 110,
      height: 110,
      borderRadius: radius.full,
      backgroundColor: colors.gold,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
    },

    avatarText: {
      fontSize: 40,
      fontWeight:
        font.weight.extrabold,
      color: colors.text,
    },

    name: {
      fontSize: 24,
      fontWeight: font.weight.extrabold,
      marginTop: 20,
      color: colors.text,
    },

    email: {
      fontSize: 15,
      color: colors.textSoft,
      marginTop: 8,
      textAlign: 'center',
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: font.weight.bold,
      color: colors.text,
      marginBottom: 18,
    },

    role: {
      color: colors.textSoft,
      marginTop: 5,
      marginBottom: 30,
      textAlign: 'center',
    },

    screenTitle: {
      width: '100%',
      fontSize: 28,
      fontWeight: font.weight.extrabold,
      color: colors.text,
      marginBottom: 16,
    },

    profileCard: {
      width: '100%',
      backgroundColor: colors.white,
      borderRadius: radius.xl,
      padding: 24,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.borderSoft,
      ...shadow.card,
      marginBottom: 20,
    },

    statusPill: {
      marginTop: 14,
      backgroundColor: '#DCFCE7',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: radius.full,
    },

    statusText: {
      color: colors.successDark,
      fontSize: 12,
      fontWeight: font.weight.bold,
    },

    detailCard: {
      width: '100%',
      backgroundColor: colors.white,
      borderRadius: radius.xl,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.borderSoft,
      ...shadow.card,
      marginBottom: 20,
    },

    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderSoft,
    },

    detailLabel: {
      color: colors.textSoft,
      fontSize: 14,
    },

    detailValue: {
      color: colors.text,
      fontWeight: font.weight.semibold,
      fontSize: 14,
      maxWidth: '60%',
      textAlign: 'right',
    },

    item: {
      marginBottom: 20,
    },

    label: {
      color: colors.textSoft,
      marginBottom: 5,
      fontSize: 14,
    },

    value: {
      fontWeight: font.weight.bold,
      fontSize: 16,
      color: colors.text,
    },

    logoutButton: {
      backgroundColor: colors.white,
      width: '100%',
      padding: 18,
      borderRadius: radius.lg,
      marginTop: 30,
      borderWidth: 1,
      borderColor: '#FCA5A5',
    },

    logoutText: {
      color: colors.danger,
      textAlign: 'center',
      fontWeight: font.weight.bold,
      fontSize: 16,
    },
  });
