import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RegisterLink() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ainda não possui uma conta?</Text>

      <Link href="/cadastro" asChild>
        <TouchableOpacity>
          <Text style={styles.link}>Criar conta</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  text: {
    fontSize: 14,
    color: '#6B7280',
  },

  link: {
    fontSize: 14,
    color: '#1F6F78',
    fontWeight: '700',
    marginLeft: 5,
  },
});
