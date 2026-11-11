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
    fontFamily: 'sans-serif',
  },

  text: {
    fontSize: 14,
    color: '#6B7280',
    opacity: 0.7
  },

  link: {
    fontSize: 14,
    color: '#E85D04',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
