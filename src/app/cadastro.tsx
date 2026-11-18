import CadastroForm from '@/components/cadastro/cadastroForm';
import { LogoSection } from '@/components/login';
import { tokens } from '@/shared/theme/tokens';
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
    backgroundColor: tokens.colors.background,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg + tokens.spacing.md,
    paddingTop: tokens.spacing.lg * 5,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: tokens.colors.text,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.5,
    marginBottom: tokens.spacing.lg + tokens.spacing.sm,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: tokens.spacing.lg,
  },

  loginText: {
    color: tokens.colors.supportingText,
    fontSize: 14,
  },

  loginLink: {
    color: tokens.colors.action,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: tokens.spacing.xs,
  },
});