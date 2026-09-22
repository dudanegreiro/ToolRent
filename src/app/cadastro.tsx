import CadastroForm from '@/components/cadastro/cadastroForm';
import { LogoSection } from '@/components/login';
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
    backgroundColor: '#F5F7FA',
  },

  scrollContainer: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 40,
    paddingTop: 120,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1F3D4A',
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.5,
    marginBottom: 30,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },

  loginLink: {
    color: '#E85D04',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
});