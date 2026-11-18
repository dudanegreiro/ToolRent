import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tokens } from '@/shared/theme/tokens';

export type NavigationItem = 'Perfil' | 'Anunciar' | 'Meus anúncios' | 'Explorar';

type NavigationOption = {
    label: NavigationItem;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type BottomNavBarProps = {
    activeItem: NavigationItem;
    onItemPress: (item: NavigationItem) => void;
};

const navigationOptions: NavigationOption[] = [
    { label: 'Perfil', icon: 'account-outline' },
    { label: 'Anunciar', icon: 'plus-circle-outline' },
    { label: 'Meus anúncios', icon: 'clipboard-text-outline' },
    { label: 'Explorar', icon: 'compass-outline' },
];

export default function BottomNavBar({ activeItem, onItemPress }: BottomNavBarProps) {
    return (
        <View style={styles.navbar}>
            {navigationOptions.map((item) => {
                const isActive = activeItem === item.label;

                return (
                    <TouchableOpacity
                        key={item.label}
                        style={styles.navItem}
                        onPress={() => onItemPress(item.label)}
                        activeOpacity={0.75}
                    >
                        <MaterialCommunityIcons
                            name={item.icon}
                            size={23}
                            color={isActive ? tokens.colors.action : tokens.colors.secondaryText}
                        />
                        <Text style={[styles.navLabel, isActive && styles.activeNavLabel]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        alignItems: 'center',
        backgroundColor: tokens.colors.surface,
        borderTopColor: tokens.colors.subtleBorder,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        minHeight: 76,
        paddingHorizontal: tokens.spacing.xs,
        paddingTop: tokens.spacing.xs,
    },
    navItem: {
        alignItems: 'center',
        flex: 1,
        minHeight: 58,
        justifyContent: 'center',
    },
    navLabel: {
        color: tokens.colors.secondaryText,
        fontSize: 11,
        fontWeight: '600',
        marginTop: tokens.spacing.xs,
        textAlign: 'center',
    },
    activeNavLabel: {
        color: tokens.colors.action,
    },
});
