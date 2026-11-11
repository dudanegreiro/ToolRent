import { StyleSheet, Text } from 'react-native';

export default function FooterText() {
  return <Text style={styles.footer}>© 2026 ToolRent</Text>;
}

const styles = StyleSheet.create({
  footer: {
    textAlign:  'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 35,
  },
});
