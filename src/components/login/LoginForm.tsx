import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { theme } from '@/theme';
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
        placeholderTextColor={theme.colors.textMuted}
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
        <Text style={[styles.loginButtonText, loading && styles.loginButtonTextDisabled]}>
          {loading ? 'AGUARDE...' : 'ENTRAR'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.panel,
    padding: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily,
    boxShadow: theme.shadows.panel,
    elevation: 4,
  },

  formTitle: {
    fontSize: theme.typography.title,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },

  label: {
    fontSize: theme.typography.label,
    fontWeight: theme.typography.weight.semiBold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.surfaceSubtle,
    marginBottom: theme.spacing.md,
  },

  errorText: {
    color: theme.states.error.foreground,
    fontSize: theme.typography.small,
    fontWeight: theme.typography.weight.semiBold,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },

  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: theme.spacing.lg,
  },

  forgotText: {
    color: theme.colors.primary,
    fontSize: theme.typography.small,
    fontWeight: theme.typography.weight.semiBold,
  },

  loginButton: {
    height: 52,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonDisabled: {
    backgroundColor: theme.states.disabled.background,
  },

  loginButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.bodyLarge,
    fontWeight: theme.typography.weight.bold,
  },
  loginButtonTextDisabled: {
    color: theme.states.disabled.foreground,
  },
});
