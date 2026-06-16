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
  });