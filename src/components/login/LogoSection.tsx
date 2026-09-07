import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function LogoSection() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <MaterialCommunityIcons
          name="wrench-outline"
          size={18}
          color="#FFFF"
        />
      </View>
    
      <Text style={styles.title}>TOOL</Text>
      <Text style={styles.title2}>RENT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    transform: [{translateY: -20}]
  },

  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E85D04',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 15,
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    color: '#1F3D4A',
    marginBottom: 8,
    marginTop: 10,
    marginLeft: 8
  },

  title2: {
    fontSize: 15,
    fontFamily: 'sans-serif',
    fontWeight: '900',
    color: '#E85D04',
    marginBottom: 8,
    marginTop: 10
  },
});
