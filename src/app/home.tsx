import { BottomNavBar, NavigationItem } from '@/components/home';
import { clearSession, getSession } from '@/services/session';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Home() {
    const router = useRouter();
    const { usuarioId } = useLocalSearchParams<{ usuarioId?: string }>();
    const [activeItem, setActiveItem] = useState<NavigationItem>('Explorar');
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        const verificarSessao = async () => {
            const session = await getSession();

            if (!session?.usuarioId) {
                await clearSession();
                router.replace('/login');
                return;
            }

            if (!usuarioId || usuarioId !== session.usuarioId) {
                router.replace({
                    pathname: '/home',
                    params: { usuarioId: session.usuarioId },
                } as Href);
                return;
            }
        };

        verificarSessao();
    }, [router, usuarioId]);

    const handleNavigation = (item: NavigationItem) => {
        if (item === 'Anunciar') {
            router.push({
                pathname: '/anuncio',
                params: { usuarioId },
            } as Href);
            return;
        }

        if (item === 'Meus anúncios') {
            router.push({
                pathname: '/meus-anuncios',
                params: { usuarioId },
            } as Href);
            return;
        }

        setActiveItem(item);
    };

    const handleOpenSettings = () => {
        setMenuVisible(false);
        Alert.alert('Configurações', 'Ajustes do perfil e preferências serão implementados em breve.');
    };

    const handleLogout = () => {
        setMenuVisible(false);
        Alert.alert('Sair', 'Deseja sair da sua conta?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair',
                style: 'destructive',
                onPress: async () => {
                    await clearSession();
                    router.replace('/login');
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>OLÁ, USUÁRIO</Text>
                        <Text style={styles.title}>O que você precisa hoje?</Text>
                    </View>

                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            style={styles.logo}
                            onPress={() => setMenuVisible((value) => !value)}
                            activeOpacity={0.8}
                            accessibilityLabel="Abrir configurações"
                        >
                            <MaterialCommunityIcons name="wrench-outline" size={20} color="#FFFFFF" />
                        </TouchableOpacity>

                        {menuVisible && (
                            <View style={styles.menuCard}>
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={handleOpenSettings}
                                    activeOpacity={0.8}
                                >
                                    <MaterialCommunityIcons name="cog-outline" size={18} color="#1F3D4A" />
                                    <Text style={styles.menuItemText}>Configurações</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.menuItem, styles.menuItemDanger]}
                                    onPress={handleLogout}
                                    activeOpacity={0.8}
                                >
                                    <MaterialCommunityIcons name="logout" size={18} color="#B42318" />
                                    <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Sair</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.searchPlaceholder}>
                    <MaterialCommunityIcons name="magnify" size={22} color="#6B7280" />
                    <Text style={styles.searchText}>Buscar ferramentas</Text>
                </View>

                <TouchableOpacity
                    style={styles.myAdsButton}
                    activeOpacity={0.8}
                    onPress={() => router.push({
                        pathname: '/meus-anuncios',
                        params: { usuarioId },
                    } as Href)}
                >
                    <MaterialCommunityIcons name="clipboard-text-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.myAdsButtonText}>Meus anúncios</Text>
                </TouchableOpacity>

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
        position: 'relative',
        zIndex: 1,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 28,
        position: 'relative',
        zIndex: 10,
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
    headerActions: {
        position: 'relative',
        zIndex: 30,
    },
    logo: {
        alignItems: 'center',
        backgroundColor: '#E85D04',
        borderRadius: 10,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
        borderRadius: 12,
        borderWidth: 1,
        elevation: 20,
        paddingVertical: 8,
        position: 'absolute',
        right: 0,
        shadowColor: '#111827',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        top: 54,
        width: 170,
        zIndex: 50,
    },
    menuItem: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    menuItemDanger: {
        borderTopColor: '#F1F5F9',
        borderTopWidth: 1,
    },
    menuItemText: {
        color: '#1F3D4A',
        fontSize: 14,
        fontWeight: '600',
    },
    menuItemTextDanger: {
        color: '#B42318',
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
        zIndex: 1,
    },
    searchText: {
        color: '#8A8A8A',
        fontSize: 15,
        marginLeft: 10,
    },
    myAdsButton: {
        alignItems: 'center',
        backgroundColor: '#E85D04',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 18,
        minHeight: 48,
        width: '100%',
    },
    myAdsButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
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
