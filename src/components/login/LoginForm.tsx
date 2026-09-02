import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import PasswordInput from './PasswordInput';

interface LoginFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  password: string;
  onPasswordChange: (password: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  onLogin: () => void;
  onForgotPassword: () => void;
}

export default function LoginForm({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
  onLogin,
  onForgotPassword,
}: LoginFormProps) {
  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Entrar</Text>

      <Text style={styles.label}>E-mail</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        placeholderTextColor="#8A8A8A"
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Senha</Text>

      <PasswordInput
        value={password}
        onChangeText={onPasswordChange}
        showPassword={showPassword}
        onToggleShowPassword={onToggleShowPassword}
      />

      <TouchableOpacity
        style={styles.forgotContainer}
        onPress={onForgotPassword}
      >
        <Text style={styles.forgotText}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={onLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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

  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 25,
  },

  forgotText: {
    color: '#1F6F78',
    fontSize: 13,
    fontWeight: '600',
  },

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
});
