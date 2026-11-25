import { theme } from '@/theme';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  onSubmitEditing?: () => void;
}

export default function PasswordInput({
  value,
  onChangeText,
  showPassword,
  onToggleShowPassword,
  onSubmitEditing,
}: PasswordInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        textContentType="password"
        onSubmitEditing={onSubmitEditing}
      />

      <TouchableOpacity
        onPress={onToggleShowPassword}
        style={styles.showPasswordButton}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Text style={styles.showPasswordText}>
          {showPassword ? 'Ocultar' : 'Mostrar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.surfaceSubtle,
    marginBottom: theme.spacing.xs,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },

  showPasswordButton: {
    paddingHorizontal: theme.spacing.sm,
  },

  showPasswordText: {
    fontSize: theme.typography.small,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textSecondary,
  },
});
