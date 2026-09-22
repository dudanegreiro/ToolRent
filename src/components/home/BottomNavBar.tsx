import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type NavigationItem = 'Perfil' | 'Anunciar' | 'Meus aluguéis' | 'Explorar';

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
    { label: 'Meus aluguéis', icon: 'clipboard-text-outline' },
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
                            color={isActive ? '#E85D04' : '#8A8A8A'}
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
        backgroundColor: '#FFFFFF',
        borderTopColor: '#E5E7EB',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        minHeight: 76,
        paddingHorizontal: 6,
        paddingTop: 7,
    },
    navItem: {
        alignItems: 'center',
        flex: 1,
        minHeight: 58,
        justifyContent: 'center',
    },
    navLabel: {
        color: '#8A8A8A',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 5,
        textAlign: 'center',
    },
    activeNavLabel: {
        color: '#E85D04',
    },
});
