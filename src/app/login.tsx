import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  FooterText,
  LoginForm,
  LogoSection,
  RegisterLink,
} from '../components/login';

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

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar senha',
      'A recuperação de senha será implementada em breve.'
    );
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
          <LogoSection />

          <LoginForm
            email={email}
            onEmailChange={setEmail}
            password={senha}
            onPasswordChange={setSenha}
            showPassword={mostrarSenha}
            onToggleShowPassword={() => setMostrarSenha(!mostrarSenha)}
            onLogin={handleLogin}
            onForgotPassword={handleForgotPassword}
          />

          <RegisterLink />

          <FooterText />
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
});