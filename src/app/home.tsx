import { BottomNavBar, NavigationItem } from '@/components/home';
import { atualizarUsuario, buscarUsuarioPorId, listarCategorias, listarFerramentas, type Categoria, type Ferramenta } from '@/services/api';
import { clearSession, getSession, saveSession } from '@/services/session';
import { tokens } from '@/shared/theme/tokens';
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
                            <MaterialCommunityIcons name="wrench-outline" size={20} color={tokens.colors.onAction} />
                        </TouchableOpacity>

                        {menuVisible && (
                            <View style={styles.menuCard}>
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={handleOpenSettings}
                                    activeOpacity={0.8}
                                >
                                    <MaterialCommunityIcons name="cog-outline" size={18} color={tokens.colors.text} />
                                    <Text style={styles.menuItemText}>Configurações</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.menuItem, styles.menuItemDanger, loggingOut && styles.menuItemDisabled]}
                                    onPress={handleLogout}
                                    activeOpacity={0.8}
                                    disabled={loggingOut}
                                >
                                    {loggingOut ? (
                                        <ActivityIndicator size="small" color={tokens.colors.alert} />
                                    ) : (
                                        <MaterialCommunityIcons name="logout" size={18} color={tokens.colors.alert} />
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
                                <MaterialCommunityIcons name="magnify" size={22} color={tokens.colors.supportingText} />
                                <TextInput
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                    placeholder="Buscar ferramentas"
                                    placeholderTextColor={tokens.colors.placeholderMuted}
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
                                        color={showOnlyAvailable ? tokens.colors.surface : tokens.colors.action}
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
                                <MaterialCommunityIcons name="alert-circle-outline" size={18} color={tokens.colors.alert} />
                                <Text style={styles.inlineWarningText}>{priceRangeError}</Text>
                            </View>
                        ) : null}

                        {exploreLoading ? (
                            <View style={styles.centeredBox}>
                                <ActivityIndicator size="large" color={tokens.colors.action} />
                                <Text style={styles.centeredText}>Carregando anúncios...</Text>
                            </View>
                        ) : exploreError ? (
                            <View style={styles.centeredBox}>
                                <MaterialCommunityIcons name="alert-circle-outline" size={38} color={tokens.colors.action} />
                                <Text style={styles.emptyTitle}>Não foi possível carregar</Text>
                                <Text style={styles.emptySubtitle}>{exploreError}</Text>
                            </View>
                        ) : exploreTools.length === 0 ? (
                            <View style={styles.emptyState}>
                                <MaterialCommunityIcons name="tools" size={54} color={tokens.colors.action} />
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
                                                    <MaterialCommunityIcons name="wrench-outline" size={30} color={tokens.colors.action} />
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
                        <MaterialCommunityIcons name="tools" size={54} color={tokens.colors.action} />
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
        backgroundColor: tokens.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: tokens.spacing.lg,
        paddingTop: tokens.spacing.lg,
        position: 'relative',
        zIndex: 1,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: tokens.spacing.lg + tokens.spacing.xs,
        position: 'relative',
        zIndex: 10,
    },
    greeting: {
        color: tokens.colors.action,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: tokens.spacing.xs,
    },
    title: {
        color: tokens.colors.text,
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerActions: {
        position: 'relative',
        zIndex: 30,
    },
    logo: {
        alignItems: 'center',
        backgroundColor: tokens.colors.action,
        borderRadius: tokens.radii.lg,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    menuCard: {
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.subtleBorder,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        boxShadow: tokens.shadows.menu,
        elevation: 20,
        paddingVertical: tokens.spacing.sm,
        position: 'absolute',
        right: 0,
        top: 54,
        width: 170,
        zIndex: 50,
    },
    menuItem: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.md,
    },
    menuItemDanger: {
        borderTopColor: tokens.colors.divider,
        borderTopWidth: 1,
    },
    menuItemDisabled: {
        opacity: 0.7,
    },
    menuItemText: {
        color: tokens.colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    menuItemTextDanger: {
        color: tokens.colors.alert,
    },
    searchPlaceholder: {
        alignItems: 'center',
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        flexDirection: 'row',
        height: 52,
        paddingHorizontal: tokens.spacing.md,
        zIndex: 1,
    },
    searchInput: {
        color: tokens.colors.text,
        flex: 1,
        fontSize: 15,
        marginLeft: tokens.spacing.sm,
    },
    filterBox: {
        backgroundColor: tokens.colors.surface,
        borderRadius: tokens.radii.xl,
        marginBottom: tokens.spacing.md,
        padding: tokens.spacing.md,
    },
    filterRow: {
        gap: tokens.spacing.sm,
        marginTop: tokens.spacing.md,
        paddingRight: tokens.spacing.sm,
    },
    filterChip: {
        backgroundColor: tokens.colors.neutralSurface,
        borderRadius: tokens.radii.pill,
        marginRight: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.sm,
    },
    filterChipActive: {
        backgroundColor: tokens.colors.action,
    },
    filterChipText: {
        color: tokens.colors.bodyText,
        fontSize: 12,
        fontWeight: '700',
    },
    filterChipTextActive: {
        color: tokens.colors.onAction,
    },
    priceFiltersRow: {
        flexDirection: 'row',
        gap: tokens.spacing.sm,
        marginTop: tokens.spacing.md,
    },
    priceInputWrap: {
        flex: 1,
    },
    fieldLabel: {
        color: tokens.colors.mutedText,
        fontSize: 12,
        fontWeight: '600',
        marginBottom: tokens.spacing.xs,
    },
    priceInput: {
        backgroundColor: tokens.colors.inputSurface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        color: tokens.colors.text,
        fontSize: 14,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.sm,
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: tokens.spacing.md,
    },
    toggleButton: {
        alignItems: 'center',
        backgroundColor: tokens.colors.actionSurfaceAlt,
        borderColor: tokens.colors.actionBorder,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.sm,
    },
    toggleButtonActive: {
        backgroundColor: tokens.colors.action,
        borderColor: tokens.colors.action,
    },
    toggleButtonText: {
        color: tokens.colors.action,
        fontSize: 13,
        fontWeight: '700',
        marginLeft: tokens.spacing.sm,
    },
    toggleButtonTextActive: {
        color: tokens.colors.onAction,
    },
    clearButton: {
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.sm,
    },
    clearButtonText: {
        color: tokens.colors.mutedText,
        fontSize: 12,
        fontWeight: '700',
    },
    profileScrollContent: {
        paddingBottom: tokens.spacing.md,
    },
    profileCard: {
        backgroundColor: tokens.colors.surface,
        borderRadius: tokens.radii.xl,
        padding: tokens.spacing.md,
    },
    profileTitle: {
        color: tokens.colors.text,
        fontSize: 24,
        fontWeight: '700',
    },
    profileSubtitle: {
        color: tokens.colors.supportingText,
        fontSize: 14,
        marginBottom: tokens.spacing.md,
        marginTop: tokens.spacing.xs,
    },
    input: {
        backgroundColor: tokens.colors.inputSurface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        color: tokens.colors.text,
        fontSize: 15,
        marginBottom: tokens.spacing.md,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.md,
    },
    disabledInput: {
        justifyContent: 'center',
    },
    disabledInputText: {
        color: tokens.colors.supportingText,
        fontSize: 15,
    },
    saveProfileButton: {
        alignItems: 'center',
        backgroundColor: tokens.colors.action,
        borderRadius: tokens.radii.lg,
        marginTop: tokens.spacing.sm,
        paddingVertical: tokens.spacing.md,
    },
    saveProfileButtonText: {
        color: tokens.colors.onAction,
        fontSize: 14,
        fontWeight: '700',
    },
    sortRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: tokens.spacing.sm,
        marginTop: tokens.spacing.md,
    },
    sortChip: {
        backgroundColor: tokens.colors.neutralSurface,
        borderRadius: tokens.radii.pill,
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.sm,
    },
    sortChipActive: {
        backgroundColor: tokens.colors.action,
    },
    sortChipText: {
        color: tokens.colors.mutedText,
        fontSize: 12,
        fontWeight: '700',
    },
    sortChipTextActive: {
        color: tokens.colors.onAction,
    },
    exploreSection: {
        flex: 1,
    },
    exploreScrollContent: {
        paddingBottom: tokens.spacing.md,
    },
    exploreList: {
        paddingBottom: tokens.spacing.md,
    },
    toolCard: {
        backgroundColor: tokens.colors.surface,
        borderRadius: tokens.radii.xl,
        marginBottom: tokens.spacing.md,
        overflow: 'hidden',
        shadowColor: tokens.colors.shadow,
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
        backgroundColor: tokens.colors.imagePlaceholder,
        justifyContent: 'center',
    },
    toolBody: {
        padding: tokens.spacing.md,
    },
    toolTitle: {
        color: tokens.colors.text,
        fontSize: 18,
        fontWeight: '700',
    },
    toolMeta: {
        color: tokens.colors.supportingText,
        fontSize: 13,
        marginTop: tokens.spacing.xs,
    },
    toolPrice: {
        color: tokens.colors.action,
        fontSize: 16,
        fontWeight: '700',
        marginTop: tokens.spacing.sm,
    },
    badgeRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: tokens.spacing.sm,
        marginTop: tokens.spacing.md,
    },
    badge: {
        backgroundColor: tokens.colors.availableTagSurface,
        borderRadius: tokens.radii.pill,
        color: tokens.colors.availableTagText,
        fontSize: 11,
        fontWeight: '700',
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.xs,
    },
    badgeSecondary: {
        backgroundColor: tokens.colors.categoryTagSurface,
        borderRadius: tokens.radii.pill,
        color: tokens.colors.categoryTagText,
        fontSize: 11,
        fontWeight: '700',
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.xs,
    },
    centeredBox: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: tokens.spacing.md,
    },
    centeredText: {
        color: tokens.colors.text,
        fontSize: 14,
        fontWeight: '600',
        marginTop: tokens.spacing.md,
    },
    inlineWarning: {
        alignItems: 'center',
        backgroundColor: tokens.colors.alertSurfaceStrong,
        borderColor: tokens.colors.alertBorderStrong,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        flexDirection: 'row',
        marginBottom: tokens.spacing.md,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.sm,
    },
    inlineWarningText: {
        color: tokens.colors.alert,
        fontSize: 12,
        fontWeight: '600',
        marginLeft: tokens.spacing.sm,
    },
    resultsSummary: {
        color: tokens.colors.mutedText,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: tokens.spacing.md,
    },
    emptyState: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: tokens.spacing.lg * 2,
    },
    emptyTitle: {
        color: tokens.colors.text,
        fontSize: 20,
        fontWeight: '700',
        marginTop: tokens.spacing.md,
        textAlign: 'center',
    },
    emptySubtitle: {
        color: tokens.colors.supportingText,
        fontSize: 16,
        lineHeight: 23,
        marginTop: tokens.spacing.sm,
        maxWidth: 290,
        textAlign: 'center',
    },
});
