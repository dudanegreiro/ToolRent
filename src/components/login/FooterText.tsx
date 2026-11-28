import { StyleSheet, Text } from 'react-native';
import { theme } from '@/theme';

export default function FooterText() {
  return <Text style={styles.footer}>© 2026 ToolRent</Text>;
}

const styles = StyleSheet.create({
  footer: {
    textAlign:  'center',
    color: theme.colors.textMuted,
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.xl,
  },
});
