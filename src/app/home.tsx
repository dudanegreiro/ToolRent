import { BottomNavBar, NavigationItem } from '@/components/home';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function Home() {
    const router = useRouter();
    const { usuarioId } = useLocalSearchParams<{ usuarioId?: string }>();
    const [activeItem, setActiveItem] = useState<NavigationItem>('Explorar');

    const handleNavigation = (item: NavigationItem) => {
        if (item === 'Anunciar') {
            router.push({
                pathname: '/anuncio',
                params: { usuarioId },
            } as Href);
            return;
        }

        setActiveItem(item);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>OLÁ, USUÁRIO</Text>
                        <Text style={styles.title}>O que você precisa hoje?</Text>
                    </View>
                    <View style={styles.logo}>
                        <MaterialCommunityIcons name="wrench-outline" size={20} color="#FFFFFF" />
                    </View>
                </View>

                <View style={styles.searchPlaceholder}>
                    <MaterialCommunityIcons name="magnify" size={22} color="#6B7280" />
                    <Text style={styles.searchText}>Buscar ferramentas</Text>
                </View>

                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="tools" size={54} color="#E85D04" />
                    <Text style={styles.emptyTitle}>Encontre a ferramenta ideal</Text>
                    <Text style={styles.emptySubtitle}>
                        Explore ferramentas disponíveis para alugar perto de você.
                    </Text>
                </View>
            </View>

            <BottomNavBar
                activeItem={activeItem}
                onItemPress={handleNavigation}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 28,
    },
    greeting: {
        color: '#E85D04',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 6,
    },
    title: {
        color: '#1F3D4A',
        fontSize: 24,
        fontWeight: 'bold',
    },
    logo: {
        alignItems: 'center',
        backgroundColor: '#E85D04',
        borderRadius: 10,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    searchPlaceholder: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#D5DCE3',
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        height: 52,
        paddingHorizontal: 16,
    },
    searchText: {
        color: '#8A8A8A',
        fontSize: 15,
        marginLeft: 10,
    },
    emptyState: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 48,
    },
    emptyTitle: {
        color: '#1F3D4A',
        fontSize: 20,
        fontWeight: '700',
        marginTop: 18,
        textAlign: 'center',
    },
    emptySubtitle: {
        color: '#6B7280',
        fontSize: 16,
        lineHeight: 23,
        marginTop: 8,
        maxWidth: 290,
        textAlign: 'center',
    },
});
