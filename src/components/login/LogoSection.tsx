import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '@/shared/theme/tokens';

export default function LogoSection() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <MaterialCommunityIcons
          name="wrench-outline"
          size={18}
          color={tokens.colors.onAction}
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
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.action,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 15,
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.sm,
    marginTop: tokens.spacing.sm,
    marginLeft: tokens.spacing.sm
  },

  title2: {
    fontSize: 15,
    fontFamily: 'sans-serif',
    fontWeight: '900',
    color: tokens.colors.action,
    marginBottom: tokens.spacing.sm,
    marginTop: tokens.spacing.sm
  },
});
