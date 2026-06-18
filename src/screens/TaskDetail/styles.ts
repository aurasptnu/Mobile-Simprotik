import {StyleSheet} from 'react-native';
import {colors, font, radius, shadow} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    padding: 20,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  statusBadge: {
    backgroundColor: colors.navy50,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.navy100,
  },

  statusText: {
    color: colors.primaryBlue,
    fontWeight: font.weight.bold,
  },

  priorityBadge: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
  },

  priorityText: {
    color: colors.danger,
    fontWeight: font.weight.bold,
  },

  title: {
    fontSize: font.size.xxl,
    fontWeight: font.weight.extrabold,
    marginBottom: 20,
    color: colors.text,
    lineHeight: 32,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    ...shadow.card,
  },

  label: {
    fontSize: font.size.base,
    color: colors.textSoft,
    marginBottom: 8,
    fontWeight: font.weight.semibold,
  },

  description: {
    lineHeight: font.lineHeight.md,
    color: colors.textSoft,
  },

  subText: {
    color: colors.textMuted,
    marginBottom: 12,
  },

  image: {
    width: '100%',
    height: 220,
    borderRadius: radius.xl,
    marginTop: 10,
  },

  actionButton: {
    backgroundColor: colors.primaryBlue,
    padding: 16,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginTop: 8,
  },

  actionButtonText: {
    color: colors.white,
    fontWeight: font.weight.bold,
    fontSize: font.size.md,
  },

  uploadButton: {
    backgroundColor: colors.primaryBlue,
    padding: 18,
    borderRadius: radius.xl,
    marginTop: 10,
  },

  surveyButton: {
    backgroundColor: colors.success,
    padding: 18,
    borderRadius: radius.xl,
    marginTop: 15,
    marginBottom: 40,
  },

  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: font.weight.bold,
    fontSize: font.size.lg,
  },

  backButton: {
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },

  backText: {
    color: colors.primaryBlue,
    fontWeight: font.weight.bold,
  },

  assignedByRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    width: '100%',
  },

  value: {
    fontWeight: font.weight.bold,
    fontSize: font.size.lg,
    color: colors.text,
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },

  profileIconSmall: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    marginRight: 10,
    marginTop: 2,
    resizeMode: 'contain',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 30, 75, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 20,
    position: 'relative',
  },

  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    backgroundColor: 'rgba(11, 30, 75, 0.55)',
    width: 40,
    height: 40,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: font.size.xxl,
    color: colors.white,
    fontWeight: font.weight.bold,
  },

  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.lg,
  },

  surveyModalContent: {
    width: '85%',
    maxHeight: '82%',
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: 24,
    position: 'relative',
    alignItems: 'center',
  },

  surveyTitle: {
    fontSize: font.size.xl,
    fontWeight: font.weight.extrabold,
    marginBottom: 20,
    color: colors.text,
  },

  surveyStatus: {
    fontSize: font.size.lg,
    color: colors.success,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: font.lineHeight.md,
  },

  surveyResultScroll: {
    width: '100%',
    maxHeight: 420,
    marginBottom: 20,
  },

  surveyMetaBox: {
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  surveyMetaLabel: {
    fontSize: font.size.sm,
    color: colors.textMuted,
    marginBottom: 4,
  },

  surveyMetaValue: {
    fontSize: font.size.md,
    color: colors.text,
    fontWeight: font.weight.bold,
    marginBottom: 10,
  },

  surveyAnswerRow: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    paddingVertical: 12,
  },

  surveyQuestionText: {
    fontSize: font.size.base,
    color: colors.textSoft,
    lineHeight: font.lineHeight.base,
    marginBottom: 8,
  },

  surveyAnswerValue: {
    alignSelf: 'flex-start',
    minWidth: 38,
    textAlign: 'center',
    backgroundColor: colors.navy50,
    color: colors.primaryBlue,
    fontWeight: font.weight.bold,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  surveyCommentBox: {
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  surveyCommentText: {
    color: colors.textSoft,
    lineHeight: font.lineHeight.base,
  },

  surveyCloseBtn: {
    backgroundColor: colors.success,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: radius.xl,
    minWidth: 120,
  },

  surveyCloseBtnText: {
    color: colors.white,
    fontWeight: font.weight.bold,
    fontSize: font.size.md,
    textAlign: 'center',
  },
});
