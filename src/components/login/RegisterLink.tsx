import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '@/theme';

export default function RegisterLink() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ainda não possui uma conta?</Text>

      <Link href="/cadastro" asChild>
        <TouchableOpacity>
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
    marginTop: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily,
  },

  text: {
    fontSize: theme.typography.label,
    color: theme.colors.textSubtle,
  },

  link: {
    fontSize: theme.typography.label,
    color: theme.colors.primary,
    fontWeight: theme.typography.weight.bold,
    marginLeft: theme.spacing.xxs,
  },
});
