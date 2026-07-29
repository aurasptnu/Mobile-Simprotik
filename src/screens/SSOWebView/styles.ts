import {StyleSheet} from 'react-native';
import {colors, font, radius} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },

  headerTitle: {
    fontSize: font.size.base,
    fontWeight: font.weight.bold,
    color: colors.text,
  },

  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
  },

  closeButtonText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.textSoft,
  },

  webviewContainer: {
    flex: 1,
    position: 'relative',
  },

  webview: {
    flex: 1,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  loadingText: {
    marginTop: 12,
    fontSize: font.size.sm,
    color: colors.textSoft,
    fontWeight: font.weight.semibold,
  },

  errorBanner: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.danger,
  },

  errorText: {
    color: colors.danger,
    fontSize: font.size.sm,
    textAlign: 'center',
  },
});
