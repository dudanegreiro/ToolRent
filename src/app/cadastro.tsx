import CadastroForm from '@/components/cadastro/cadastroForm';
import { LogoSection } from '@/components/login';
import { theme } from '@/theme';
import { Link } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Cadastro() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.content}>

          <LogoSection />

          <Text style={styles.title}>
            DADOS PESSOAIS
          </Text>

          <Text style={styles.subtitle}>
            Preencha suas informações para continuar..
          </Text>

          <CadastroForm />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Já possui uma conta?
            </Text>

            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>
                  Entrar
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxl,
    paddingTop: 120,
  },

  title: {
    fontSize: theme.typography.display,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },

  subtitle: {
    fontSize: theme.typography.label,
    lineHeight: 20,
    color: theme.colors.textSubtle,
    marginBottom: theme.spacing.xl,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },

  loginText: {
    color: theme.colors.textSubtle,
    fontSize: theme.typography.label,
  },

  loginLink: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.label,
    marginLeft: theme.spacing.xxs,
  },
});