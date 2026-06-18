import {
  StyleSheet,
} from 'react-native';
import {colors, font, radius, shadow} from '../../theme';

export const styles =
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor:
        colors.surfaceAlt,
    },

    container: {
      flexGrow: 1,
      justifyContent:
        'center',
      padding: 24,
    },

    header: {
      alignItems: 'center',
      marginBottom: 30,
    },

    logo: {
      width: 230,
      height: 108,
      resizeMode:
        'contain',
      marginBottom: 16,
    },

    appName: {
      fontSize: font.size.display,
      fontWeight:
        font.weight.extrabold,
      color:
        colors.text,
    },

    subtitle: {
      marginTop: 6,
      textAlign: 'center',
      color: colors.textSoft,
      fontSize: font.size.base,
    },

    card: {
      backgroundColor:
        colors.white,
      borderRadius: radius.xxl,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.borderSoft,
      ...shadow.card,
    },

    title: {
      fontSize: font.size.xxl,
      fontWeight:
        font.weight.extrabold,
      color:
        colors.text,
    },

    desc: {
      marginTop: 5,
      color: colors.textSoft,
      marginBottom: 24,
    },

    label: {
      fontSize: font.size.base,
      fontWeight:
        font.weight.semibold,
      marginBottom: 8,
      marginTop: 12,
      color:
        colors.text,
    },

    input: {
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: radius.md,
      paddingHorizontal: 18,
      paddingVertical: 14,
      backgroundColor:
        colors.surfaceAlt,
    },

    error: {
      color: colors.danger,
      marginTop: 10,
    },

    button: {
      backgroundColor:
        colors.primaryBlue,
      paddingVertical: 18,
      borderRadius: radius.lg,
      marginTop: 25,
    },

    buttonText: {
      color: colors.white,
      textAlign:
        'center',
      fontWeight:
        font.weight.bold,
      fontSize: font.size.lg,
    },

    footer: {
      textAlign: 'center',
      marginTop: 30,
      color: colors.textMuted,
      fontSize: font.size.sm,
    },

    modalOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(11, 30, 75, 0.48)',
      justifyContent: 'flex-end',
      zIndex: 20,
      elevation: 20,
    },

    modalContent: {
      backgroundColor: colors.white,
      borderTopLeftRadius: radius.xxl,
      borderTopRightRadius: radius.xxl,
      maxHeight: '82%',
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 24,
    },

    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14,
    },

    modalTitle: {
      fontSize: font.size.modalTitle,
      fontWeight: font.weight.extrabold,
      color: colors.text,
    },

    modalSubtitle: {
      color: colors.textSoft,
      marginTop: 4,
    },

    modalCloseButton: {
      width: 38,
      height: 38,
      borderRadius: radius.full,
      backgroundColor: colors.surface2,
      alignItems: 'center',
      justifyContent: 'center',
    },

    modalCloseText: {
      color: colors.text,
      fontWeight: font.weight.bold,
      fontSize: font.size.lg,
    },

    staffList: {
      paddingBottom: 8,
    },

    staffItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      padding: 14,
      marginBottom: 10,
    },

    staffAvatar: {
      width: 42,
      height: 42,
      borderRadius: radius.full,
      backgroundColor: colors.gold,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    staffAvatarText: {
      color: colors.text,
      fontWeight: font.weight.bold,
      fontSize: font.size.cardTitle,
    },

    staffInfo: {
      flex: 1,
      minWidth: 0,
    },

    staffName: {
      color: colors.text,
      fontWeight: font.weight.bold,
      fontSize: font.size.md,
      marginBottom: 4,
    },

    staffMeta: {
      color: colors.textSoft,
      fontSize: font.size.sm,
      lineHeight: 17,
    },

    staffNip: {
      color: colors.textMuted,
      fontSize: font.size.sm,
      marginTop: 4,
    },

    loadingBox: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 36,
    },

    loadingText: {
      color: colors.textSoft,
      marginTop: 12,
    },

    emptyText: {
      color: colors.textSoft,
      textAlign: 'center',
      paddingVertical: 32,
    },

    modalError: {
      color: colors.danger,
      backgroundColor: colors.dangerLight,
      borderRadius: radius.md,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
      lineHeight: 18,
    },
  });
