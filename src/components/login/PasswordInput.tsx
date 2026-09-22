import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
}

export default function PasswordInput({
  value,
  onChangeText,
  showPassword,
  onToggleShowPassword,
}: PasswordInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor="#8A8A8A"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
      />

      <TouchableOpacity
        onPress={onToggleShowPassword}
        style={styles.showPasswordButton}
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
    borderColor: '#D5DCE3',
    borderRadius: 10,
    backgroundColor: '#FAFBFC',
    marginBottom: 8,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#1F2937',
    opacity: 0.5
  },

  showPasswordButton: {
    paddingHorizontal: 12,
  },

  showPasswordText: {
    fontSize: 13,
    fontWeight: 'bold',
    opacity:0.5
  },
});
