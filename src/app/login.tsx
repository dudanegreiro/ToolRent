import { fazerLogin } from '@/services/api';
import { saveSession } from '@/services/session';
import { theme } from '@/theme';
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
  const [erroLogin, setErroLogin] = useState('');

  const handleEmailChange = (valor: string) => {
    setEmail(valor);
    if (erroLogin) setErroLogin('');
  };

  const handleSenhaChange = (valor: string) => {
    setSenha(valor);
    if (erroLogin) setErroLogin('');
  };

  const handleLogin = async () => {
    const emailNormalizado = email.trim().toLowerCase();
    const senhaNormalizada = senha.trim();

    if (!emailNormalizado && !senhaNormalizada) {
      setErroLogin('Digite seu e-mail e sua senha para continuar.');
      return;
    }

    if (!emailNormalizado) {
      setErroLogin('Digite seu e-mail para continuar.');
      return;
    }

    if (!senhaNormalizada) {
      setErroLogin('Digite sua senha para continuar.');
      return;
    }

    setCarregando(true);
    setErroLogin('');

    try {
      const usuario = await fazerLogin({
        email: emailNormalizado,
        senha: senhaNormalizada,
      });
      await saveSession({
        usuarioId: String(usuario.id),
        email: usuario.email,
        nome: usuario.nome,
      });

      Alert.alert('Login realizado!', `Bem-vindo ao ToolRent, ${usuario.nome}!`);
      router.replace({
        pathname: '/home',
        params: { usuarioId: String(usuario.id) },
      } as Href);
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Não foi possível realizar o login.';
      setErroLogin(message);
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
            onEmailChange={handleEmailChange}
            password={senha}
            onPasswordChange={handleSenhaChange}
            showPassword={mostrarSenha}
            onToggleShowPassword={() => setMostrarSenha((valor) => !valor)}
            onLogin={handleLogin}
            onForgotPassword={handleForgotPassword}
            loading={carregando}
            errorMessage={erroLogin}
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
    backgroundColor: theme.colors.background,
  },

  containerText: {
    marginBottom: theme.spacing.lg,
  },

  textBemVindo: {
    fontSize: theme.typography.display,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },

  text: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textSubtle,
    marginTop: theme.spacing.xs,
    lineHeight: 22,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxl,
    justifyContent: 'center',
  },
});