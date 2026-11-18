import { StyleSheet, Text } from 'react-native';
import { tokens } from '@/shared/theme/tokens';

export default function FooterText() {
  return <Text style={styles.footer}>© 2026 ToolRent</Text>;
}

const styles = StyleSheet.create({
  footer: {
    textAlign:  'center',
    color: tokens.colors.footerText,
    fontSize: 12,
    marginTop: tokens.spacing.lg + tokens.spacing.sm + tokens.spacing.xs,
  },
});
