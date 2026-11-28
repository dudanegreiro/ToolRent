import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/theme';

export default function LogoSection() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <MaterialCommunityIcons
          name="wrench-outline"
          size={18}
          color={theme.colors.surface}
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
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs
  },

  title2: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weight.extraBold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.xs
  },
});
