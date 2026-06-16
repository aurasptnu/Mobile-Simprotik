import {
  StyleSheet,
} from 'react-native';

export const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#F4F7FC',
      padding: 20,
    },

    header: {
      fontSize: 24,
      fontWeight:
        'bold',
      marginBottom: 20,
      color:
        '#111827',
    },

    card: {
      backgroundColor:
        '#fff',
      borderRadius: 22,
      padding: 20,
      marginBottom: 15,
    },

    question: {
      fontWeight:
        'bold',
      fontSize: 16,
      marginBottom: 15,
    },

    option: {
      borderWidth: 1,
      borderColor:
        '#E5E7EB',
      padding: 15,
      borderRadius: 16,
      marginBottom: 10,
    },

    selectedOption: {
      backgroundColor:
        '#2563EB',
      borderColor:
        '#2563EB',
    },

    optionText: {
      color: '#333',
    },

    selectedText: {
      color: '#fff',
      fontWeight:
        'bold',
    },

    input: {
      borderWidth: 1,
      borderColor:
        '#E5E7EB',
      borderRadius: 16,
      padding: 16,
      textAlignVertical:
        'top',
      minHeight: 120,
    },

    inputSmall: {
      borderWidth: 1,
      borderColor:
        '#E5E7EB',
      borderRadius: 12,
      padding: 12,
      height: 44,
      fontSize: 14,
    },

    button: {
      backgroundColor:
        '#2563EB',
      padding: 18,
      borderRadius: 20,
      marginTop: 10,
      marginBottom: 40,
    },

    buttonText: {
      color: '#fff',
      textAlign:
        'center',
      fontWeight:
        'bold',
      fontSize: 16,
    },
    backButton: {
      marginBottom: 10,
      paddingVertical: 6,
      paddingHorizontal: 8,
      alignSelf: 'flex-start',
    },

    backText: {
      color: '#2563EB',
      fontWeight: 'bold',
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#111827',
    },

    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
      color: '#374151',
      marginTop: 12,
    },

    scaleInfo: {
      fontSize: 14,
      color: '#4B5563',
      marginBottom: 6,
      lineHeight: 20,
    },
  });