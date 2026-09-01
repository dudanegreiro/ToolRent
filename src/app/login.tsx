import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha seu e-mail e sua senha.'
      );
      return;
    }

    // Por enquanto, apenas simula o login.
    // Depois podemos conectar com a API/banco de dados.
    Alert.alert('Login realizado!', `Bem-vindo ao ToolRent, ${email}!`);

    // Quando o backend estiver pronto:
    // router.replace('/home');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>

          {/* Logo / Nome do aplicativo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>🔧</Text>
            </View>

            <Text style={styles.title}>ToolRent</Text>

            <Text style={styles.subtitle}>
              Alugue ferramentas de forma simples e segura.
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>

            <Text style={styles.formTitle}>Entrar</Text>

            <Text style={styles.label}>E-mail</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#8A8A8A"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Senha</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite sua senha"
                placeholderTextColor="#8A8A8A"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
              />

              <TouchableOpacity
                onPress={() => setMostrarSenha(!mostrarSenha)}
                style={styles.showPassword}
              >
                <Text style={styles.showPasswordText}>
                  {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Esqueci minha senha */}
            <TouchableOpacity
              style={styles.forgotContainer}
              onPress={() =>
                Alert.alert(
                  'Recuperar senha',
                  'A recuperação de senha será implementada em breve.'
                )
              }
            >
              <Text style={styles.forgotText}>
                Esqueci minha senha
              </Text>
            </TouchableOpacity>

            {/* Botão de login */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                Entrar
              </Text>
            </TouchableOpacity>

          </View>

          {/* Cadastro */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Ainda não possui uma conta?
            </Text>

            <Link href="/cadastro" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>
                  Criar conta
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Rodapé */}
          <Text style={styles.footer}>
            © 2026 ToolRent
          </Text>

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
    paddingHorizontal: 25,
    paddingVertical: 45,
    justifyContent: 'center',
  },

  // LOGO

  logoContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },

  logo: {
    width: 75,
    height: 75,
    borderRadius: 20,
    backgroundColor: '#1F6F78',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  logoIcon: {
    fontSize: 35,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F3D4A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },

  // FORMULÁRIO

  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F3D4A',
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D5DCE3',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#FAFBFC',
    marginBottom: 20,
  },

  // SENHA

  passwordContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D5DCE3',
    borderRadius: 10,
    backgroundColor: '#FAFBFC',
    marginBottom: 8,
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#1F2937',
  },

  showPassword: {
    paddingHorizontal: 12,
  },

  showPasswordText: {
    color: '#1F6F78',
    fontSize: 13,
    fontWeight: '600',
  },

  // ESQUECI SENHA

  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 25,
  },

  forgotText: {
    color: '#1F6F78',
    fontSize: 13,
    fontWeight: '600',
  },

  // BOTÃO

  loginButton: {
    height: 52,
    backgroundColor: '#1F6F78',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // CADASTRO

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  registerText: {
    fontSize: 14,
    color: '#6B7280',
  },

  registerLink: {
    fontSize: 14,
    color: '#1F6F78',
    fontWeight: '700',
    marginLeft: 5,
  },

  // RODAPÉ

  footer: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 35,
  },
});