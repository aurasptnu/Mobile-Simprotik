import {StyleSheet} from 'react-native';
import {colors, font, radius, shadow} from '../../theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
  },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    ...shadow.card,
  },

  title: {
    fontSize: font.size.xxl,
    fontWeight: font.weight.extrabold,
    color: colors.text,
    marginBottom: 12,
  },

  desc: {
    marginTop: 8,
    color: colors.textSoft,
    marginBottom: 24,
    lineHeight: 22,
  },

  inputWrapper: {
    position: 'relative',
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    fontSize: font.size.md,
  },

  passwordInput: {
    paddingRight: 56,
  },

  passwordToggle: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
  },

  passwordIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },

  manualButton: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 16,
    borderRadius: radius.lg,
    marginTop: 4,
    marginBottom: 4,
  },

  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: font.weight.bold,
    fontSize: font.size.lg,
  },

  backLink: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrow: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.primaryBlue,
    marginRight: 6,
    transform: [{scaleX: -1}],
  },

  backLinkText: {
    color: colors.primaryBlue,
    fontWeight: font.weight.semibold,
    fontSize: font.size.sm,
    lineHeight: font.size.sm + 4,
  },

  footer: {
    textAlign: 'center',
    marginTop: 30,
    color: colors.textMuted,
    fontSize: font.size.sm,
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