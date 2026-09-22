import { fazerLogin } from '@/services/api';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
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
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha seu e-mail e sua senha.'
      );
      return;
    }

    setCarregando(true);

    try {
      const usuario = await fazerLogin({ email, senha });
      Alert.alert('Login realizado!', `Bem-vindo ao ToolRent, ${usuario.nome}!`);
      router.replace({
        pathname: '/home',
        params: { usuarioId: String(usuario.id) },
      } as Href);
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Não foi possível realizar o login.';
      Alert.alert('Erro no login', message);
    } finally {
      setCarregando(false);
    }
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

          <View style={styles.containerText}>
            <Text style={styles.textBemVindo}>BEM-VINDO DE VOLTA</Text>
            <Text style={styles.text}>Entre na sua conta para alugar ou anunciar ferramentas.</Text>
          </View>

          <LoginForm
            email={email}
            onEmailChange={setEmail}
            password={senha}
            onPasswordChange={setSenha}
            showPassword={mostrarSenha}
            onToggleShowPassword={() => setMostrarSenha(!mostrarSenha)}
            onLogin={handleLogin}
            onForgotPassword={handleForgotPassword}
            loading={carregando}
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
    backgroundColor: 'white',
  },

  containerText: {
    marginBottom: 20
  },

  textBemVindo: {
    fontSize: 28,
    fontFamily: 'sans-serif',
    fontWeight: 'bold'
  },

  text: {
    fontSize: 15,
    fontFamily: 'sans-serif',
    opacity: 0.5
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