import {StyleSheet} from 'react-native';
import {colors, font, radius, shadow} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    padding: 20,
  },

  header: {
    fontSize: font.size.xxl,
    fontWeight: font.weight.extrabold,
    marginBottom: 20,
    color: colors.text,
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

  question: {
    fontWeight: font.weight.bold,
    fontSize: font.size.lg,
    marginBottom: 15,
    color: colors.text,
    lineHeight: font.lineHeight.md,
  },

  option: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    borderRadius: radius.lg,
    marginBottom: 10,
    backgroundColor: colors.white,
  },

  selectedOption: {
    backgroundColor: colors.primaryBlue,
    borderColor: colors.primaryBlue,
  },

  optionText: {
    color: colors.textSoft,
    fontWeight: font.weight.medium,
  },

  selectedText: {
    color: colors.white,
    fontWeight: font.weight.bold,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    textAlignVertical: 'top',
    minHeight: 120,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
  },

  inputSmall: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    height: 44,
    fontSize: font.size.base,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
  },

  button: {
    backgroundColor: colors.primaryBlue,
    padding: 18,
    borderRadius: radius.xl,
    marginTop: 10,
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

  sectionTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    marginBottom: 15,
    color: colors.text,
  },

  label: {
    fontSize: font.size.base,
    fontWeight: font.weight.semibold,
    marginBottom: 8,
    color: colors.textSoft,
    marginTop: 12,
  },

  scaleInfo: {
    fontSize: font.size.base,
    color: colors.textSoft,
    marginBottom: 6,
    lineHeight: font.lineHeight.base,
  },
});
