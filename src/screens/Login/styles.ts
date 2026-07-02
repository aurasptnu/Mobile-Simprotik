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

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    width: 230,
    height: 108,
    resizeMode: 'contain',
    marginBottom: 16,
  },

  appName: {
    fontSize: font.size.display,
    fontWeight: font.weight.extrabold,
    color: colors.text,
  },

  subtitle: {
    marginTop: 6,
    textAlign: 'center',
    color: colors.textSoft,
    fontSize: font.size.base,
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
  },

  desc: {
    marginTop: 8,
    color: colors.textSoft,
    marginBottom: 24,
    lineHeight: 22,
  },

  ssoButton: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: radius.lg,
    marginBottom: 10,
  },

  ssoButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  ssoButtonLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  ssoLabelText: {
    flex: 1,
    marginLeft: 14,
  },

  buttonIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.white,
  },

  buttonArrow: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginLeft: 12,
    tintColor: colors.white,
  },

  ssoButtonText: {
    color: colors.white,
    fontWeight: font.weight.bold,
    fontSize: font.size.lg,
    textAlign: 'left',
  },

  ssoButtonSubtitle: {
    color: colors.white,
    fontSize: font.size.sm,
    marginTop: 4,
    opacity: 0.9,
    textAlign: 'left',
  },

  ssoHintLink: {
    marginTop: 8,
    alignItems: 'center',
  },

  ssoHintText: {
    color: colors.textSoft,
    fontSize: font.size.sm,
    lineHeight: 22,
    textAlign: 'center',
  },

  ssoHintStrong: {
    fontWeight: font.weight.bold,
  },

  modalError: {
    color: colors.danger,
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 16,
    lineHeight: 18,
  },

  footer: {
    textAlign: 'center',
    marginTop: 30,
    color: colors.textMuted,
    fontSize: font.size.sm,
  },
});

