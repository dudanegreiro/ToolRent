import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tokens } from '@/shared/theme/tokens';

export default function RegisterLink() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ainda não possui uma conta?</Text>

      <Link href="/cadastro" asChild>
        <TouchableOpacity
          accessibilityRole="link"
          accessibilityLabel="Criar conta"
        >
          <Text style={styles.link}>Criar conta</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: tokens.spacing.lg,
    fontFamily: 'sans-serif',
  },

  text: {
    fontSize: 14,
    color: tokens.colors.supportingText,
    opacity: 0.7
  },

  link: {
    fontSize: 14,
    color: tokens.colors.action,
    fontWeight: 'bold',
    marginLeft: tokens.spacing.xs,
  },
});
