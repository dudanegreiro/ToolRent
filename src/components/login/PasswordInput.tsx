import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { tokens } from '@/shared/theme/tokens';

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
        accessibilityLabel="Senha"
        accessibilityRole="text"
        placeholder="Digite sua senha"
        placeholderTextColor={tokens.colors.placeholderMuted}
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
        accessibilityRole="button"
        accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        accessibilityState={{ expanded: showPassword }}
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
    borderColor: tokens.colors.border,
    borderRadius: tokens.radii.lg,
    backgroundColor: tokens.colors.alternateSurface,
    marginBottom: tokens.spacing.sm,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: tokens.spacing.md,
    fontSize: 15,
    color: tokens.colors.inputText,
    opacity: 0.5
  },

  showPasswordButton: {
    paddingHorizontal: tokens.spacing.md,
  },

  showPasswordText: {
    fontSize: 13,
    fontWeight: '700',
    color: tokens.colors.bodyText,
  },
});
