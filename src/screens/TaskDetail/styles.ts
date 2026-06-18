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

    headerRow: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      marginBottom: 20,
    },

    statusBadge: {
      backgroundColor:
        '#DBEAFE',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
    },

    statusText: {
      color:
        '#2563EB',
      fontWeight:
        'bold',
    },

    priorityBadge: {
      backgroundColor:
        '#FEE2E2',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
    },

    priorityText: {
      color:
        '#DC2626',
      fontWeight:
        'bold',
    },

    title: {
      fontSize: 26,
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

    label: {
      fontSize: 14,
      color: '#666',
      marginBottom: 8,
    },

    description: {
      lineHeight: 24,
      color: '#444',
    },

    subText: {
      color: '#6B7280',
      marginBottom: 12,
    },

    image: {
      width: '100%',
      height: 220,
      borderRadius: 20,
      marginTop: 10,
    },

    actionButton: {
      backgroundColor: '#2563EB',
      padding: 16,
      borderRadius: 18,
      alignItems: 'center',
      marginTop: 8,
    },

    actionButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15,
    },

    uploadButton: {
      backgroundColor: '#2563EB',
      padding: 18,
      borderRadius: 20,
      marginTop: 10,
    },

    surveyButton: {
      backgroundColor: '#10B981',
      padding: 18,
      borderRadius: 20,
      marginTop: 15,
      marginBottom: 40,
    },

    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
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

    assignedByRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      width: '100%',
    },

    value: {
      fontWeight: 'bold',
      fontSize: 16,
      flex: 1,
      flexShrink: 1,
      minWidth: 0,
    },

    profileIconSmall: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 10,
      marginTop: 2,
      resizeMode: 'contain',
    },

    modalOverlay: {
      flex: 1,
      backgroundColor:
        'rgba(0, 0, 0, 0.8)',
      justifyContent:
        'center',
      alignItems: 'center',
    },

    modalContent: {
      width: '90%',
      height: '80%',
      backgroundColor:
        '#fff',
      borderRadius: 20,
      padding: 20,
      position: 'relative',
    },

    closeButton: {
      position: 'absolute',
      top: 15,
      right: 15,
      zIndex: 1,
      backgroundColor:
        'rgba(0, 0, 0, 0.3)',
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent:
        'center',
      alignItems: 'center',
    },

    closeButtonText: {
      fontSize: 28,
      color: '#fff',
      fontWeight: 'bold',
    },

    fullImage: {
      width: '100%',
      height: '100%',
      borderRadius: 16,
    },

    surveyModalContent: {
      width: '85%',
      maxHeight: '82%',
      backgroundColor:
        '#fff',
      borderRadius: 24,
      padding: 24,
      position: 'relative',
      alignItems: 'center',
    },

    surveyTitle: {
      fontSize: 20,
      fontWeight:
        'bold',
      marginBottom: 20,
      color: '#111827',
    },

    surveyStatus: {
      fontSize: 16,
      color: '#10B981',
      marginBottom: 32,
      textAlign: 'center',
      lineHeight: 24,
    },

    surveyResultScroll: {
      width: '100%',
      maxHeight: 420,
      marginBottom: 20,
    },

    surveyMetaBox: {
      width: '100%',
      backgroundColor: '#F3F6FB',
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
    },

    surveyMetaLabel: {
      fontSize: 12,
      color: '#6B7280',
      marginBottom: 4,
    },

    surveyMetaValue: {
      fontSize: 15,
      color: '#111827',
      fontWeight: 'bold',
      marginBottom: 10,
    },

    surveyAnswerRow: {
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      paddingVertical: 12,
    },

    surveyQuestionText: {
      fontSize: 14,
      color: '#374151',
      lineHeight: 20,
      marginBottom: 8,
    },

    surveyAnswerValue: {
      alignSelf: 'flex-start',
      minWidth: 38,
      textAlign: 'center',
      backgroundColor: '#DBEAFE',
      color: '#1D4ED8',
      fontWeight: 'bold',
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },

    surveyCommentBox: {
      width: '100%',
      backgroundColor: '#F9FAFB',
      borderRadius: 16,
      padding: 14,
      marginTop: 12,
    },

    surveyCommentText: {
      color: '#374151',
      lineHeight: 21,
    },

    surveyCloseBtn: {
      backgroundColor:
        '#10B981',
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 20,
      minWidth: 120,
    },

    surveyCloseBtnText: {
      color: '#fff',
      fontWeight:
        'bold',
      fontSize: 15,
      textAlign: 'center',
    },
  });
