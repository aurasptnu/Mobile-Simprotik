import {
  StyleSheet,
} from 'react-native';

export const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#F4F7FC',
      alignItems:
        'center',
      padding: 24,
    },

    avatar: {
      width: 110,
      height: 110,
      borderRadius: 60,
      backgroundColor: '#2563EB',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
    },

    avatarText: {
      fontSize: 40,
      fontWeight:
        'bold',
      color: '#fff',
    },

    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 20,
      color: '#111827',
    },

    email: {
      fontSize: 15,
      color: '#4B5563',
      marginTop: 8,
      textAlign: 'center',
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 18,
    },

    role: {
      color: '#666',
      marginTop: 5,
      marginBottom: 30,
      textAlign: 'center',
    },

    screenTitle: {
      width: '100%',
      fontSize: 28,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 16,
    },

    profileCard: {
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
      marginBottom: 20,
    },

    statusPill: {
      marginTop: 14,
      backgroundColor: '#DCFCE7',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },

    statusText: {
      color: '#166534',
      fontSize: 12,
      fontWeight: '700',
    },

    detailCard: {
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 24,
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
      marginBottom: 20,
    },

    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#EEF2FF',
    },

    detailLabel: {
      color: '#6B7280',
      fontSize: 14,
    },

    detailValue: {
      color: '#111827',
      fontWeight: '600',
      fontSize: 14,
      maxWidth: '60%',
      textAlign: 'right',
    },

    item: {
      marginBottom: 20,
    },

    label: {
      color: '#666',
      marginBottom: 5,
      fontSize: 14,
    },

    value: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#111827',
    },

    logoutButton: {
      backgroundColor: '#fff',
      width: '100%',
      padding: 18,
      borderRadius: 20,
      marginTop: 30,
      borderWidth: 1,
      borderColor: '#FCA5A5',
    },

    logoutText: {
      color: '#DC2626',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });