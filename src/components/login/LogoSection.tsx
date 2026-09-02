import { StyleSheet, Text, View } from 'react-native';

export default function LogoSection() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoIcon}>🔧</Text>
      </View>

      <Text style={styles.title}>ToolRent</Text>

      <Text style={styles.subtitle}>
        Alugue ferramentas de forma simples e segura.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
