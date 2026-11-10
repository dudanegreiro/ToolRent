import { BottomNavBar, NavigationItem } from '@/components/home';
import { atualizarUsuario, buscarUsuarioPorId, listarCategorias, listarFerramentas, type Categoria, type Ferramenta } from '@/services/api';
import { clearSession, getSession, saveSession } from '@/services/session';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Home() {
    const router = useRouter();
    const { usuarioId } = useLocalSearchParams<{ usuarioId?: string }>();
    const [activeItem, setActiveItem] = useState<NavigationItem>('Explorar');
    const [menuVisible, setMenuVisible] = useState(false);
    const [userName, setUserName] = useState('USUÁRIO');
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOrder, setSortOrder] = useState<'padrao' | 'menor' | 'maior'>('padrao');
    const [priceRangeError, setPriceRangeError] = useState<string | null>(null);
    const [profileName, setProfileName] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [profilePhone, setProfilePhone] = useState('');
    const [profilePassword, setProfilePassword] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [exploreTools, setExploreTools] = useState<Ferramenta[]>([]);
    const [exploreLoading, setExploreLoading] = useState(false);
    const [exploreError, setExploreError] = useState<string | null>(null);

    useEffect(() => {
        const verificarSessao = async () => {
            const session = await getSession();

            if (!session?.usuarioId) {
                await clearSession();
                router.replace('/login');
                return;
            }

            setUserName((session.nome ?? 'USUÁRIO').trim() || 'USUÁRIO');

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

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await listarCategorias();
                setCategories(data);
            } catch {
                setCategories([]);
            }
        };

        void loadCategories();
    }, []);

    useEffect(() => {
        if (activeItem !== 'Perfil' || !usuarioId) {
            return;
        }

        const loadProfile = async () => {
            try {
                const usuario = await buscarUsuarioPorId(Number(usuarioId));
                setProfileName(usuario.nome ?? '');
                setProfileEmail(usuario.email ?? '');
                setProfilePhone(usuario.telefone ?? '');
                setProfilePassword('');
            } catch {
                const session = await getSession();
                setProfileName(session?.nome ?? '');
                setProfileEmail(session?.email ?? '');
                setProfilePhone('');
            }
        };

        void loadProfile();
    }, [activeItem, usuarioId]);

    useEffect(() => {
        if (activeItem !== 'Explorar') {
            return;
        }

        const loadExploreTools = async () => {
            setExploreLoading(true);
            setExploreError(null);

            try {
                const allTools = await listarFerramentas();
                const normalizedSearch = searchTerm.trim().toLowerCase();
                const parsedMin = minPrice.trim() === '' ? null : Number(minPrice);
                const parsedMax = maxPrice.trim() === '' ? null : Number(maxPrice);

                if (
                    (parsedMin !== null && Number.isNaN(parsedMin)) ||
                    (parsedMax !== null && Number.isNaN(parsedMax)) ||
                    (parsedMin !== null && parsedMax !== null && parsedMin > parsedMax)
                ) {
                    setPriceRangeError('A faixa máxima deve ser maior ou igual à mínima.');
                    setExploreTools([]);
                    setExploreLoading(false);
                    return;
                }

                setPriceRangeError(null);

                const othersTools = allTools.filter((tool) => {
                    const isOtherUser = String(tool.usuario_id) !== String(usuarioId ?? '');
                    const matchesCategory = selectedCategoryId === null || tool.categoria_id === selectedCategoryId;
                    const matchesAvailability = !showOnlyAvailable || tool.disponibilidade;
                    const haystack = `${tool.nome} ${tool.marca} ${tool.modelo}`.toLowerCase();
                    const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);
                    const priceValue = Number(tool.preco_diaria);
                    const matchesMinPrice = parsedMin === null || priceValue >= parsedMin;
                    const matchesMaxPrice = parsedMax === null || priceValue <= parsedMax;

                    return isOtherUser && matchesCategory && matchesAvailability && matchesSearch && matchesMinPrice && matchesMaxPrice;
                });

                const sortedTools = [...othersTools].sort((a, b) => {
                    if (sortOrder === 'menor') {
                        return Number(a.preco_diaria) - Number(b.preco_diaria);
                    }

                    if (sortOrder === 'maior') {
                        return Number(b.preco_diaria) - Number(a.preco_diaria);
                    }

                    return 0;
                });

                setExploreTools(sortedTools);
            } catch (error) {
                setExploreError(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível carregar os anúncios.',
                );
            } finally {
                setExploreLoading(false);
            }
        };

        void loadExploreTools();
    }, [activeItem, usuarioId, selectedCategoryId, showOnlyAvailable, searchTerm, minPrice, maxPrice, sortOrder]);

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

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 11);

        if (digits.length <= 2) {
            return digits;
        }

        if (digits.length <= 7) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        }

        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    };

    const handleSaveProfile = async () => {
        if (!usuarioId) {
            Alert.alert('Perfil', 'Não foi possível identificar o usuário logado.');
            return;
        }

        const nome = profileName.trim();
        const telefone = profilePhone.replace(/\D/g, '');

        if (!nome || !profileEmail.trim() || !telefone) {
            Alert.alert('Dados incompletos', 'Preencha nome e telefone para continuar.');
            return;
        }

        if (telefone.length < 10) {
            Alert.alert('Telefone inválido', 'Informe um telefone com DDD e número válidos.');
            return;
        }

        setProfileLoading(true);

        try {
            const usuarioAtualizado = await atualizarUsuario(Number(usuarioId), {
                nome,
                telefone: telefone,
                ...(profilePassword.trim() ? { senha: profilePassword.trim() } : {}),
            });

            await saveSession({
                usuarioId: String(usuarioAtualizado.id),
                email: usuarioAtualizado.email,
                nome: usuarioAtualizado.nome,
            });

            setUserName(usuarioAtualizado.nome);
            setProfileName(usuarioAtualizado.nome);
            setProfileEmail(usuarioAtualizado.email);
            setProfilePhone(formatPhone(usuarioAtualizado.telefone));
            setProfilePassword('');
            Alert.alert('Perfil atualizado', 'Suas informações foram salvas com sucesso.');
        } catch (error) {
            Alert.alert('Erro ao salvar', error instanceof Error ? error.message : 'Não foi possível atualizar o perfil.');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleOpenSettings = () => {
        setMenuVisible(false);
        Alert.alert('Configurações', 'Ajustes do perfil e preferências serão implementados em breve.');
    };

    const clearFilters = () => {
        setSelectedCategoryId(null);
        setShowOnlyAvailable(false);
        setSearchTerm('');
        setMinPrice('');
        setMaxPrice('');
        setSortOrder('padrao');
        setPriceRangeError(null);
    };

    const handleLogout = async () => {
        setMenuVisible(false);
        setLoggingOut(true);

        try {
            await clearSession();
            if (typeof router.dismissAll === 'function') {
                router.dismissAll();
            }
            router.replace('/login');
        } catch {
            router.replace('/login');
        } finally {
            setLoggingOut(false);
        }
    };

    const getSafeImageUrl = (url?: string) => {
        if (!url || url.startsWith('blob:') || !url.startsWith('http')) {
            return null;
        }

        return url;
    };

    const openToolDetails = (tool: Ferramenta) => {
        const validFotos = (tool.fotos ?? [])
            .map((foto) => getSafeImageUrl(foto.url))
            .filter((url): url is string => Boolean(url));

        router.push({
            pathname: '/ferramenta-detalhes',
            params: {
                id: String(tool.id),
                nome: tool.nome,
                marca: tool.marca,
                modelo: tool.modelo,
                estado_conservacao: tool.estado_conservacao,
                descricao: tool.descricao,
                itens_inclusos: tool.itens_inclusos ?? '',
                preco_diaria: String(tool.preco_diaria),
                preco_semanal: String(tool.preco_semanal),
                periodo_minimo: String(tool.periodo_minimo),
                exige_caucao: String(tool.exige_caucao),
                politica_cancelamento: tool.politica_cancelamento,
                entrega: String(tool.entrega),
                disponibilidade: String(tool.disponibilidade),
                status_aprovacao: tool.status_aprovacao,
                categoria_id: String(tool.categoria_id),
                usuario_id: String(tool.usuario_id),
                fotos: JSON.stringify(validFotos),
            },
        } as Href);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>OLÁ, {userName.toUpperCase()}</Text>
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
                                    style={[styles.menuItem, styles.menuItemDanger, loggingOut && styles.menuItemDisabled]}
                                    onPress={handleLogout}
                                    activeOpacity={0.8}
                                    disabled={loggingOut}
                                >
                                    {loggingOut ? (
                                        <ActivityIndicator size="small" color="#B42318" />
                                    ) : (
                                        <MaterialCommunityIcons name="logout" size={18} color="#B42318" />
                                    )}
                                    <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                                        {loggingOut ? 'Saindo...' : 'Sair'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                {activeItem === 'Perfil' ? (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.profileScrollContent}
                    >
                        <View style={styles.profileCard}>
                            <Text style={styles.profileTitle}>Meu perfil</Text>
                            <Text style={styles.profileSubtitle}>Atualize suas informações pessoais.</Text>

                            <Text style={styles.fieldLabel}>Nome</Text>
                            <TextInput
                                value={profileName}
                                onChangeText={setProfileName}
                                placeholder="Seu nome completo"
                                style={styles.input}
                                autoCapitalize="words"
                            />

                            <Text style={styles.fieldLabel}>E-mail</Text>
                            <View style={[styles.input, styles.disabledInput]}>
                                <Text style={styles.disabledInputText}>{profileEmail}</Text>
                            </View>

                            <Text style={styles.fieldLabel}>Telefone</Text>
                            <TextInput
                                value={profilePhone}
                                onChangeText={(value) => setProfilePhone(formatPhone(value))}
                                placeholder="(11) 99999-9999"
                                keyboardType="phone-pad"
                                style={styles.input}
                            />

                            <Text style={styles.fieldLabel}>Nova senha (opcional)</Text>
                            <TextInput
                                value={profilePassword}
                                onChangeText={setProfilePassword}
                                placeholder="Digite uma nova senha"
                                secureTextEntry
                                style={styles.input}
                            />

                            <TouchableOpacity
                                style={styles.saveProfileButton}
                                onPress={handleSaveProfile}
                                disabled={profileLoading}
                                activeOpacity={0.9}
                            >
                                <Text style={styles.saveProfileButtonText}>
                                    {profileLoading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                ) : activeItem === 'Explorar' ? (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.exploreScrollContent}
                    >
                        <View style={styles.filterBox}>
                            <View style={styles.searchPlaceholder}>
                                <MaterialCommunityIcons name="magnify" size={22} color="#6B7280" />
                                <TextInput
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                    placeholder="Buscar ferramentas"
                                    placeholderTextColor="#8A8A8A"
                                    style={styles.searchInput}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.filterRow}
                            >
                                <TouchableOpacity
                                    style={[styles.filterChip, selectedCategoryId === null && styles.filterChipActive]}
                                    onPress={() => setSelectedCategoryId(null)}
                                >
                                    <Text style={[styles.filterChipText, selectedCategoryId === null && styles.filterChipTextActive]}>Todas</Text>
                                </TouchableOpacity>

                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={[styles.filterChip, selectedCategoryId === category.id && styles.filterChipActive]}
                                        onPress={() => setSelectedCategoryId(category.id)}
                                    >
                                        <Text style={[styles.filterChipText, selectedCategoryId === category.id && styles.filterChipTextActive]}>{category.nome}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <View style={styles.priceFiltersRow}>
                                <View style={styles.priceInputWrap}>
                                    <Text style={styles.fieldLabel}>Min.</Text>
                                    <TextInput
                                        value={minPrice}
                                        onChangeText={setMinPrice}
                                        placeholder="0"
                                        keyboardType="numeric"
                                        style={styles.priceInput}
                                    />
                                </View>

                                <View style={styles.priceInputWrap}>
                                    <Text style={styles.fieldLabel}>Máx.</Text>
                                    <TextInput
                                        value={maxPrice}
                                        onChangeText={setMaxPrice}
                                        placeholder="500"
                                        keyboardType="numeric"
                                        style={styles.priceInput}
                                    />
                                </View>
                            </View>

                            <View style={styles.optionsRow}>
                                <TouchableOpacity
                                    style={[styles.toggleButton, showOnlyAvailable && styles.toggleButtonActive]}
                                    onPress={() => setShowOnlyAvailable((value) => !value)}
                                >
                                    <MaterialCommunityIcons
                                        name={showOnlyAvailable ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                        size={18}
                                        color={showOnlyAvailable ? '#FFFFFF' : '#E85D04'}
                                    />
                                    <Text style={[styles.toggleButtonText, showOnlyAvailable && styles.toggleButtonTextActive]}>
                                        Apenas disponíveis
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.clearButton}
                                    onPress={clearFilters}
                                >
                                    <Text style={styles.clearButtonText}>Limpar filtros</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.sortRow}>
                                {[
                                    { key: 'padrao', label: 'Padrão' },
                                    { key: 'menor', label: 'Menor preço' },
                                    { key: 'maior', label: 'Maior preço' },
                                ].map((option) => (
                                    <TouchableOpacity
                                        key={option.key}
                                        style={[styles.sortChip, sortOrder === option.key && styles.sortChipActive]}
                                        onPress={() => setSortOrder(option.key as 'padrao' | 'menor' | 'maior')}
                                    >
                                        <Text style={[styles.sortChipText, sortOrder === option.key && styles.sortChipTextActive]}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {priceRangeError ? (
                            <View style={styles.inlineWarning}>
                                <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#B42318" />
                                <Text style={styles.inlineWarningText}>{priceRangeError}</Text>
                            </View>
                        ) : null}

                        {exploreLoading ? (
                            <View style={styles.centeredBox}>
                                <ActivityIndicator size="large" color="#E85D04" />
                                <Text style={styles.centeredText}>Carregando anúncios...</Text>
                            </View>
                        ) : exploreError ? (
                            <View style={styles.centeredBox}>
                                <MaterialCommunityIcons name="alert-circle-outline" size={38} color="#E85D04" />
                                <Text style={styles.emptyTitle}>Não foi possível carregar</Text>
                                <Text style={styles.emptySubtitle}>{exploreError}</Text>
                            </View>
                        ) : exploreTools.length === 0 ? (
                            <View style={styles.emptyState}>
                                <MaterialCommunityIcons name="tools" size={54} color="#E85D04" />
                                <Text style={styles.emptyTitle}>
                                    {searchTerm || selectedCategoryId !== null || showOnlyAvailable || minPrice || maxPrice
                                        ? 'Nenhum anúncio encontrado com os filtros atuais.'
                                        : 'Ainda não há anúncios de outros usuários'}
                                </Text>
                                <Text style={styles.emptySubtitle}>
                                    {searchTerm || selectedCategoryId !== null || showOnlyAvailable || minPrice || maxPrice
                                        ? 'Tente limpar filtros ou ajustar a faixa de preço.'
                                        : 'Quando alguém publicar uma ferramenta, ela aparecerá aqui.'}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.exploreList}>
                                <Text style={styles.resultsSummary}>{exploreTools.length} anúncio{exploreTools.length === 1 ? '' : 's'} encontrado{exploreTools.length === 1 ? '' : 's'}</Text>
                                {exploreTools.map((tool) => {
                                    const cover = (tool.fotos ?? [])
                                        .map((foto) => getSafeImageUrl(foto.url))
                                        .find((url): url is string => Boolean(url));
                                    const categoryName = categories.find((category) => category.id === tool.categoria_id)?.nome ?? 'Categoria';

                                    return (
                                        <TouchableOpacity
                                            key={tool.id}
                                            style={styles.toolCard}
                                            activeOpacity={0.9}
                                            onPress={() => openToolDetails(tool)}
                                        >
                                            {cover ? (
                                                <Image source={{ uri: cover }} style={styles.toolImage} resizeMode="cover" />
                                            ) : (
                                                <View style={[styles.toolImage, styles.placeholderImage]}>
                                                    <MaterialCommunityIcons name="wrench-outline" size={30} color="#E85D04" />
                                                </View>
                                            )}

                                            <View style={styles.toolBody}>
                                                <Text style={styles.toolTitle}>{tool.nome}</Text>
                                                <Text style={styles.toolMeta}>{tool.marca} • {tool.modelo}</Text>
                                                <Text style={styles.toolPrice}>R$ {Number(tool.preco_diaria).toFixed(2)}/dia</Text>
                                                <View style={styles.badgeRow}>
                                                    <Text style={styles.badge}>{tool.disponibilidade ? 'Disponível' : 'Indisponível'}</Text>
                                                    <Text style={styles.badgeSecondary}>{categoryName}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </ScrollView>
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="tools" size={54} color="#E85D04" />
                        <Text style={styles.emptyTitle}>Encontre a ferramenta ideal</Text>
                        <Text style={styles.emptySubtitle}>
                            Explore ferramentas disponíveis para alugar perto de você.
                        </Text>
                    </View>
                )}
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
        boxShadow: '0px 4px 10px rgba(17, 24, 39, 0.12)',
        elevation: 20,
        paddingVertical: 8,
        position: 'absolute',
        right: 0,
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
    menuItemDisabled: {
        opacity: 0.7,
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
    searchInput: {
        color: '#1F3D4A',
        flex: 1,
        fontSize: 15,
        marginLeft: 10,
    },
    filterBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 14,
        padding: 12,
    },
    filterRow: {
        gap: 8,
        marginTop: 12,
        paddingRight: 8,
    },
    filterChip: {
        backgroundColor: '#F3F4F6',
        borderRadius: 999,
        marginRight: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    filterChipActive: {
        backgroundColor: '#E85D04',
    },
    filterChipText: {
        color: '#374151',
        fontSize: 12,
        fontWeight: '700',
    },
    filterChipTextActive: {
        color: '#FFFFFF',
    },
    priceFiltersRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 12,
    },
    priceInputWrap: {
        flex: 1,
    },
    fieldLabel: {
        color: '#475467',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
    },
    priceInput: {
        backgroundColor: '#F9FAFB',
        borderColor: '#D5DCE3',
        borderRadius: 10,
        borderWidth: 1,
        color: '#1F3D4A',
        fontSize: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    toggleButton: {
        alignItems: 'center',
        backgroundColor: '#FFF4EC',
        borderColor: '#F7C7A4',
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    toggleButtonActive: {
        backgroundColor: '#E85D04',
        borderColor: '#E85D04',
    },
    toggleButtonText: {
        color: '#E85D04',
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 8,
    },
    toggleButtonTextActive: {
        color: '#FFFFFF',
    },
    clearButton: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    clearButtonText: {
        color: '#475467',
        fontSize: 12,
        fontWeight: '700',
    },
    profileScrollContent: {
        paddingBottom: 20,
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
    },
    profileTitle: {
        color: '#1F3D4A',
        fontSize: 24,
        fontWeight: '700',
    },
    profileSubtitle: {
        color: '#6B7280',
        fontSize: 14,
        marginBottom: 18,
        marginTop: 6,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderColor: '#D5DCE3',
        borderRadius: 12,
        borderWidth: 1,
        color: '#1F3D4A',
        fontSize: 15,
        marginBottom: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    disabledInput: {
        justifyContent: 'center',
    },
    disabledInputText: {
        color: '#6B7280',
        fontSize: 15,
    },
    saveProfileButton: {
        alignItems: 'center',
        backgroundColor: '#E85D04',
        borderRadius: 12,
        marginTop: 8,
        paddingVertical: 14,
    },
    saveProfileButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    sortRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    sortChip: {
        backgroundColor: '#F3F4F6',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    sortChipActive: {
        backgroundColor: '#E85D04',
    },
    sortChipText: {
        color: '#475467',
        fontSize: 12,
        fontWeight: '700',
    },
    sortChipTextActive: {
        color: '#FFFFFF',
    },
    exploreSection: {
        flex: 1,
    },
    exploreScrollContent: {
        paddingBottom: 20,
    },
    exploreList: {
        paddingBottom: 20,
    },
    toolCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 14,
        overflow: 'hidden',
        shadowColor: '#111827',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    toolImage: {
        height: 150,
        width: '100%',
    },
    placeholderImage: {
        alignItems: 'center',
        backgroundColor: '#F8E9DF',
        justifyContent: 'center',
    },
    toolBody: {
        padding: 14,
    },
    toolTitle: {
        color: '#1F3D4A',
        fontSize: 18,
        fontWeight: '700',
    },
    toolMeta: {
        color: '#6B7280',
        fontSize: 13,
        marginTop: 4,
    },
    toolPrice: {
        color: '#E85D04',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 10,
    },
    badgeRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    badge: {
        backgroundColor: '#E7F7EE',
        borderRadius: 999,
        color: '#0F8A4C',
        fontSize: 11,
        fontWeight: '700',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    badgeSecondary: {
        backgroundColor: '#EEF2FF',
        borderRadius: 999,
        color: '#4F46E5',
        fontSize: 11,
        fontWeight: '700',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    centeredBox: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 20,
    },
    centeredText: {
        color: '#1F3D4A',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 12,
    },
    inlineWarning: {
        alignItems: 'center',
        backgroundColor: '#FDECEC',
        borderColor: '#F1B2B2',
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        marginBottom: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    inlineWarningText: {
        color: '#B42318',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 8,
    },
    resultsSummary: {
        color: '#475467',
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 12,
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
