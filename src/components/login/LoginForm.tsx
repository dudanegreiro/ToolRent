import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { tokens } from '@/shared/theme/tokens';
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
  loading?: boolean;
  errorMessage?: string;
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
  loading = false,
  errorMessage,
}: LoginFormProps) {
  return (
    <View style={styles.form}>
      <Text style={styles.label}>E-mail</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        placeholderTextColor={tokens.colors.placeholderMuted}
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        textContentType="emailAddress"
        blurOnSubmit={false}
      />

      <Text style={styles.label}>Senha</Text>

      <PasswordInput
        value={password}
        onChangeText={onPasswordChange}
        showPassword={showPassword}
        onToggleShowPassword={onToggleShowPassword}
        onSubmitEditing={onLogin}
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.forgotContainer}
        onPress={onForgotPassword}
      >
        <Text style={styles.forgotText}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
        onPress={onLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'AGUARDE...' : 'ENTRAR'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.xl,
    padding: tokens.spacing.lg,
    fontFamily: 'sans-serif',
    boxShadow: tokens.shadows.form,
    elevation: 4,
  },

  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.lg,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.bodyText,
    marginBottom: tokens.spacing.sm,
    opacity: 0.5
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radii.lg,
    paddingHorizontal: tokens.spacing.md,
    fontSize: 15,
    color: tokens.colors.inputText,
    backgroundColor: tokens.colors.alternateSurface,
    marginBottom: tokens.spacing.md,
    opacity: 0.5
  },

  errorText: {
    color: tokens.colors.alert,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: tokens.spacing.md,
    lineHeight: 18,
  },

  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: tokens.spacing.lg,
  },

  forgotText: {
    color: tokens.colors.action,
    fontSize: 13,
    fontWeight: '600',
  },

  loginButton: {
    height: 52,
    backgroundColor: tokens.colors.action,
    borderRadius: tokens.radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: tokens.colors.onAction,
    fontSize: 16,
    fontWeight: '700',
  },
});
