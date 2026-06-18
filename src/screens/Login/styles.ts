import {
  StyleSheet,
} from 'react-native';

export const styles =
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor:
        '#F4F7FC',
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
      fontSize: 30,
      fontWeight:
        'bold',
      color:
        '#2563EB',
    },

    subtitle: {
      marginTop: 6,
      textAlign: 'center',
      color: '#666',
      fontSize: 14,
    },

    card: {
      backgroundColor:
        '#fff',
      borderRadius: 28,
      padding: 24,
      elevation: 5,
    },

    title: {
      fontSize: 24,
      fontWeight:
        'bold',
      color:
        '#111827',
    },

    desc: {
      marginTop: 5,
      color: '#666',
      marginBottom: 24,
    },

    label: {
      fontSize: 14,
      fontWeight:
        '600',
      marginBottom: 8,
      marginTop: 12,
      color:
        '#111827',
    },

    input: {
      borderWidth: 1,
      borderColor:
        '#E5E7EB',
      borderRadius: 16,
      paddingHorizontal: 18,
      paddingVertical: 14,
      backgroundColor:
        '#F9FAFB',
    },

    error: {
      color: '#EF4444',
      marginTop: 10,
    },

    button: {
      backgroundColor:
        '#2563EB',
      paddingVertical: 18,
      borderRadius: 18,
      marginTop: 25,
    },

    buttonText: {
      color: '#fff',
      textAlign:
        'center',
      fontWeight:
        'bold',
      fontSize: 16,
    },

    footer: {
      textAlign: 'center',
      marginTop: 30,
      color: '#999',
      fontSize: 12,
    },

    modalOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(17, 24, 39, 0.45)',
      justifyContent: 'flex-end',
      zIndex: 20,
      elevation: 20,
    },

    modalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
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
      fontSize: 22,
      fontWeight: 'bold',
      color: '#111827',
    },

    modalSubtitle: {
      color: '#6B7280',
      marginTop: 4,
    },

    modalCloseButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
    },

    modalCloseText: {
      color: '#111827',
      fontWeight: 'bold',
      fontSize: 16,
    },

    staffList: {
      paddingBottom: 8,
    },

    staffItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F9FAFB',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 16,
      padding: 14,
      marginBottom: 10,
    },

    staffAvatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: '#DBEAFE',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    staffAvatarText: {
      color: '#2563EB',
      fontWeight: 'bold',
      fontSize: 18,
    },

    staffInfo: {
      flex: 1,
      minWidth: 0,
    },

    staffName: {
      color: '#111827',
      fontWeight: '700',
      fontSize: 15,
      marginBottom: 4,
    },

    staffMeta: {
      color: '#6B7280',
      fontSize: 12,
      lineHeight: 17,
    },

    staffNip: {
      color: '#9CA3AF',
      fontSize: 12,
      marginTop: 4,
    },

    loadingBox: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 36,
    },

    loadingText: {
      color: '#6B7280',
      marginTop: 12,
    },

    emptyText: {
      color: '#6B7280',
      textAlign: 'center',
      paddingVertical: 32,
    },

    modalError: {
      color: '#DC2626',
      backgroundColor: '#FEF2F2',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
      lineHeight: 18,
    },
  });
