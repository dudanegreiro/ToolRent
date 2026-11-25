import { BottomNavBar, NavigationItem } from '@/components/home';
import { atualizarUsuario, buscarUsuarioPorId, listarCategorias, listarFerramentas, type Categoria, type Ferramenta } from '@/services/api';
import { clearSession, getSession, saveSession } from '@/services/session';
import { theme } from '@/theme';
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

const sampleToolPresentations = [
    { nome: 'Furadeira de impacto Bosch', descricao: 'Ideal para furos em concreto e madeira. Acompanha maleta e brocas.' },
    { nome: 'Serra circular Makita', descricao: 'Cortes precisos em madeira para obras, reformas e projetos de marcenaria.' },
    { nome: 'Lixadeira orbital', descricao: 'Acabamento uniforme em madeira e superfícies pintadas, com baixa vibração.' },
    { nome: 'Betoneira 400L', descricao: 'Perfeita para preparar concreto e argamassa em pequenas e médias obras.' },
    { nome: 'Escada de alumínio 6 degraus', descricao: 'Leve, estável e prática para pinturas, instalações e reparos domésticos.' },
    { nome: 'Compressor de ar 50L', descricao: 'Indicado para pintura, limpeza e uso com ferramentas pneumáticas.' },
    { nome: 'Parafusadeira a bateria', descricao: 'Compacta e versátil para montagem de móveis e fixações do dia a dia.' },
    { nome: 'Nível a laser', descricao: 'Projeta linhas niveladas para instalações, revestimentos e acabamentos.' },
    { nome: 'Martelete perfurador', descricao: 'Alta potência para perfuração e remoção em concreto, pedra e alvenaria.' },
    { nome: 'Plaina elétrica', descricao: 'Remove imperfeições e nivela superfícies de madeira com rapidez e precisão.' },
    { nome: 'Esmerilhadeira angular', descricao: 'Ideal para cortes, desbastes e acabamentos em metal e alvenaria.' },
];

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
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [favoriteTools, setFavoriteTools] = useState<number[]>([]);
    const [priceRangeError, setPriceRangeError] = useState<string | null>(null);
    const [profileName, setProfileName] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [profilePhone, setProfilePhone] = useState('');
    const [profilePassword, setProfilePassword] = useState('');
    const [profileLoadStatus, setProfileLoadStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
    const [profileLoadError, setProfileLoadError] = useState('');
    const [profileLoadAttempt, setProfileLoadAttempt] = useState(0);
    const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [profileSaving, setProfileSaving] = useState(false);
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

            if ((session.nome ?? '').includes('@')) {
                try {
                    const usuario = await buscarUsuarioPorId(Number(session.usuarioId));
                    setUserName((usuario.nome ?? session.nome ?? 'USUÁRIO').trim());
                } catch {
                    // Mantém o nome da sessão quando o perfil não estiver disponível.
                }
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
        if (activeItem !== 'Perfil') {
            return;
        }

        let isActive = true;
        const parsedUserId = Number(usuarioId);
        setProfileLoadStatus('loading');
        setProfileLoadError('');
        setProfileFeedback(null);

        if (!usuarioId || !Number.isSafeInteger(parsedUserId) || parsedUserId <= 0) {
            setProfileLoadStatus('error');
            setProfileLoadError('Não foi possível identificar o usuário logado.');
            return () => {
                isActive = false;
            };
        }

        const loadProfile = async () => {
            try {
                const usuario = await buscarUsuarioPorId(parsedUserId);
                if (!isActive) return;

                setProfileName(usuario.nome ?? '');
                setProfileEmail(usuario.email ?? '');
                setProfilePhone(usuario.telefone ?? '');
                setProfilePassword('');
                setProfileLoadStatus('ready');
            } catch (error) {
                if (!isActive) return;

                setProfileLoadError(error instanceof Error ? error.message : 'Não foi possível carregar o perfil.');
                setProfileLoadStatus('error');
            }
        };

        void loadProfile();

        return () => {
            isActive = false;
        };
    }, [activeItem, usuarioId, profileLoadAttempt]);

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
        setProfileFeedback(null);
        const parsedUserId = Number(usuarioId);

        if (!usuarioId || !Number.isSafeInteger(parsedUserId) || parsedUserId <= 0) {
            setProfileFeedback({
                type: 'error',
                message: 'Não foi possível identificar o usuário logado.',
            });
            return;
        }

        const nome = profileName.trim();
        const telefone = profilePhone.replace(/\D/g, '');

        if (!nome || !profileEmail.trim() || !telefone) {
            setProfileFeedback({
                type: 'error',
                message: 'Preencha nome, e-mail e telefone para continuar.',
            });
            return;
        }

        if (telefone.length < 10) {
            setProfileFeedback({
                type: 'error',
                message: 'Informe um telefone com DDD e número válidos.',
            });
            return;
        }

        setProfileSaving(true);

        try {
            const usuarioAtualizado = await atualizarUsuario(parsedUserId, {
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
            setProfileFeedback({
                type: 'success',
                message: 'Perfil atualizado. Suas informações foram salvas com sucesso.',
            });
        } catch (error) {
            setProfileFeedback({
                type: 'error',
                message: error instanceof Error ? error.message : 'Não foi possível atualizar o perfil.',
            });
        } finally {
            setProfileSaving(false);
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

    const toggleFavorite = (toolId: number) => {
        setFavoriteTools((current) => current.includes(toolId)
            ? current.filter((id) => id !== toolId)
            : [...current, toolId]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerLocation} accessibilityLabel="Alterar localização">
                        <MaterialCommunityIcons name="map-marker-outline" size={16} color={theme.colors.primary} />
                        <Text style={styles.locationText}>Buscando em Palmas</Text>
                        <MaterialCommunityIcons name="chevron-down" size={16} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                    <View style={styles.headerCopy}>
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
                            <MaterialCommunityIcons name="wrench-outline" size={20} color={theme.colors.surface} />
                        </TouchableOpacity>

                        {menuVisible && (
                            <View style={styles.menuCard}>
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={handleOpenSettings}
                                    activeOpacity={0.8}
                                >
                                    <MaterialCommunityIcons name="cog-outline" size={18} color={theme.colors.text} />
                                    <Text style={styles.menuItemText}>Configurações</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.menuItem, styles.menuItemDanger, loggingOut && styles.menuItemDisabled]}
                                    onPress={handleLogout}
                                    activeOpacity={0.8}
                                    disabled={loggingOut}
                                >
                                    {loggingOut ? (
                                        <ActivityIndicator size="small" color={theme.states.error.foreground} />
                                    ) : (
                                        <MaterialCommunityIcons name="logout" size={18} color={theme.states.error.foreground} />
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
                    profileLoadStatus === 'loading' || profileLoadStatus === 'idle' ? (
                        <View style={styles.profileLoadState}>
                            <ActivityIndicator
                                size="large"
                                color={theme.colors.primary}
                                accessibilityLabel="Carregando perfil"
                            />
                            <Text style={styles.profileStateText} accessibilityLiveRegion="polite">
                                Carregando seu perfil...
                            </Text>
                        </View>
                    ) : profileLoadStatus === 'error' ? (
                        <View style={styles.profileErrorCard}>
                            <MaterialCommunityIcons
                                name="alert-circle-outline"
                                size={32}
                                color={theme.states.error.foreground}
                                accessibilityLabel="Erro"
                            />
                            <Text style={styles.profileStateText} accessibilityRole="alert">
                                {profileLoadError}
                            </Text>
                            <TouchableOpacity
                                style={styles.profileRetryButton}
                                onPress={() => setProfileLoadAttempt((attempt) => attempt + 1)}
                                accessibilityRole="button"
                                accessibilityLabel="Tentar carregar o perfil novamente"
                            >
                                <Text style={styles.profileRetryButtonText}>TENTAR NOVAMENTE</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
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
                                onChangeText={(value) => {
                                    setProfileName(value);
                                    setProfileFeedback(null);
                                }}
                                placeholder="Seu nome completo"
                                placeholderTextColor={theme.colors.textMuted}
                                style={styles.input}
                                autoCapitalize="words"
                                accessibilityLabel="Nome"
                            />

                            <Text style={styles.fieldLabel}>E-mail</Text>
                            <View style={[styles.input, styles.disabledInput]}>
                                <Text
                                    style={styles.disabledInputText}
                                    accessibilityLabel={`E-mail: ${profileEmail}. Campo somente leitura.`}
                                >
                                    {profileEmail}
                                </Text>
                            </View>

                            <Text style={styles.fieldLabel}>Telefone</Text>
                            <TextInput
                                value={profilePhone}
                                onChangeText={(value) => {
                                    setProfilePhone(formatPhone(value));
                                    setProfileFeedback(null);
                                }}
                                placeholder="(11) 99999-9999"
                                placeholderTextColor={theme.colors.textMuted}
                                keyboardType="phone-pad"
                                style={styles.input}
                                accessibilityLabel="Telefone"
                            />

                            <Text style={styles.fieldLabel}>Nova senha (opcional)</Text>
                            <TextInput
                                value={profilePassword}
                                onChangeText={(value) => {
                                    setProfilePassword(value);
                                    setProfileFeedback(null);
                                }}
                                placeholder="Digite uma nova senha"
                                placeholderTextColor={theme.colors.textMuted}
                                secureTextEntry
                                style={styles.input}
                                accessibilityLabel="Nova senha, opcional"
                            />

                            {profileFeedback && (
                                <View
                                    style={[
                                        styles.profileFeedback,
                                        profileFeedback.type === 'success'
                                            ? styles.profileSuccessFeedback
                                            : styles.profileErrorFeedback,
                                    ]}
                                >
                                    <MaterialCommunityIcons
                                        name={profileFeedback.type === 'success' ? 'check-circle-outline' : 'alert-circle-outline'}
                                        size={20}
                                        color={profileFeedback.type === 'success'
                                            ? theme.states.success.foreground
                                            : theme.states.error.foreground}
                                    />
                                    <Text
                                        style={[
                                            styles.profileFeedbackText,
                                            profileFeedback.type === 'success'
                                                ? styles.profileSuccessFeedbackText
                                                : styles.profileErrorFeedbackText,
                                        ]}
                                        accessibilityLiveRegion="polite"
                                    >
                                        {profileFeedback.message}
                                    </Text>
                                </View>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.saveProfileButton,
                                    profileSaving && styles.saveProfileButtonDisabled,
                                ]}
                                onPress={handleSaveProfile}
                                disabled={profileSaving}
                                activeOpacity={0.9}
                                accessibilityRole="button"
                                accessibilityState={{ disabled: profileSaving, busy: profileSaving }}
                            >
                                {profileSaving && (
                                    <ActivityIndicator
                                        size="small"
                                        color={theme.states.disabled.foreground}
                                        style={styles.profileSavingIndicator}
                                        accessibilityLabel="Salvando alterações"
                                    />
                                )}
                                <Text
                                    style={[
                                        styles.saveProfileButtonText,
                                        profileSaving && styles.saveProfileButtonTextDisabled,
                                    ]}
                                >
                                    {profileSaving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    )
                ) : activeItem === 'Explorar' ? (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.exploreScrollContent}
                    >
                        <View style={styles.filterBox}>
                            <View style={styles.searchPlaceholder}>
                                <MaterialCommunityIcons name="magnify" size={22} color={theme.colors.textSubtle} />
                                <TextInput
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                    placeholder="Buscar furadeira, escada, serra..."
                                    placeholderTextColor={theme.colors.textMuted}
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

                            <View style={styles.dropdownRow}>
                                <TouchableOpacity
                                    style={styles.dropdownFilter}
                                    onPress={() => setShowOnlyAvailable((value) => !value)}
                                    accessibilityRole="button"
                                    accessibilityLabel="Filtrar por tipo de anúncio"
                                >
                                    <Text style={styles.dropdownLabel}>Tipo de anúncio</Text>
                                    <Text style={styles.dropdownValue}>{showOnlyAvailable ? 'Disponíveis hoje' : 'Todas as ferramentas'}</Text>
                                    <MaterialCommunityIcons name="chevron-down" size={17} color={theme.colors.textMuted} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.dropdownFilter}
                                    onPress={() => setSortOrder(sortOrder === 'menor' ? 'padrao' : 'menor')}
                                    accessibilityRole="button"
                                    accessibilityLabel="Ordenar resultados"
                                >
                                    <Text style={styles.dropdownLabel}>Ordenar por</Text>
                                    <Text style={styles.dropdownValue}>{sortOrder === 'menor' ? 'Menor diária' : 'Mais relevantes'}</Text>
                                    <MaterialCommunityIcons name="chevron-down" size={17} color={theme.colors.textMuted} />
                                </TouchableOpacity>
                            </View>

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
                                        color={showOnlyAvailable ? theme.colors.surface : theme.colors.primary}
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
                                <MaterialCommunityIcons name="alert-circle-outline" size={18} color={theme.states.error.foreground} />
                                <Text style={styles.inlineWarningText}>{priceRangeError}</Text>
                            </View>
                        ) : null}

                        {exploreLoading ? (
                            <View style={styles.centeredBox}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                                <Text style={styles.centeredText}>Carregando anúncios...</Text>
                            </View>
                        ) : exploreError ? (
                            <View style={styles.centeredBox}>
                                <MaterialCommunityIcons name="alert-circle-outline" size={38} color={theme.colors.primary} />
                                <Text style={styles.emptyTitle}>Não foi possível carregar</Text>
                                <Text style={styles.emptySubtitle}>{exploreError}</Text>
                            </View>
                        ) : exploreTools.length === 0 ? (
                            <View style={styles.emptyState}>
                                <MaterialCommunityIcons name="tools" size={54} color={theme.colors.primary} />
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
                                <View style={styles.resultsHeader}>
                                    <View>
                                        <Text style={styles.resultsTitle}>Ferramentas disponiveis em Palmas</Text>
                                        <Text style={styles.resultsSummary}>{exploreTools.length} anuncios encontrados</Text>
                                    </View>
                                    <View style={styles.viewToggle}>
                                        <TouchableOpacity style={[styles.viewToggleButton, viewMode === 'list' && styles.viewToggleActive]} onPress={() => setViewMode('list')} accessibilityLabel="Visualizacao em lista">
                                            <MaterialCommunityIcons name="format-list-bulleted" size={20} color={viewMode === 'list' ? theme.colors.primary : theme.colors.textMuted} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.viewToggleButton, viewMode === 'grid' && styles.viewToggleActive]} onPress={() => setViewMode('grid')} accessibilityLabel="Visualizacao em grade">
                                            <MaterialCommunityIcons name="view-grid-outline" size={20} color={viewMode === 'grid' ? theme.colors.primary : theme.colors.textMuted} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={styles.resultsSummary}>{exploreTools.length} anúncio{exploreTools.length === 1 ? '' : 's'} encontrado{exploreTools.length === 1 ? '' : 's'}</Text>
                                <View style={viewMode === 'grid' ? styles.gridList : styles.listList}>
                                {exploreTools.map((tool, index) => {
                                    const cover = (tool.fotos ?? [])
                                        .map((foto) => getSafeImageUrl(foto.url))
                                        .find((url): url is string => Boolean(url));
                                    const categoryName = categories.find((category) => category.id === tool.categoria_id)?.nome ?? 'Categoria';
                                    const isExampleData = /^(a+|b+|furadeira)$/i.test(tool.nome.trim());
                                    const presentation = isExampleData
                                        ? sampleToolPresentations[index % sampleToolPresentations.length]
                                        : { nome: tool.nome, descricao: tool.descricao };
                                    const displayedTool = isExampleData
                                        ? { ...tool, nome: presentation.nome, descricao: presentation.descricao }
                                        : tool;

                                    return (
                                        <TouchableOpacity
                                            key={tool.id}
                                            style={[styles.toolCard, viewMode === 'grid' && styles.toolCardGrid]}
                                            activeOpacity={0.9}
                                            onPress={() => openToolDetails(displayedTool)}
                                        >
                                            {cover ? (
                                                <Image source={{ uri: cover }} style={[styles.toolImage, viewMode === 'grid' && styles.toolImageGrid]} resizeMode="cover" />
                                            ) : (
                                                <View style={[styles.toolImage, viewMode === 'grid' && styles.toolImageGrid, styles.placeholderImage]}>
                                                    <MaterialCommunityIcons name="wrench-outline" size={30} color={theme.colors.primary} />
                                                </View>
                                            )}

                                            <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(tool.id)} accessibilityLabel={favoriteTools.includes(tool.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
                                                <MaterialCommunityIcons name={favoriteTools.includes(tool.id) ? 'heart' : 'heart-outline'} size={20} color={favoriteTools.includes(tool.id) ? theme.colors.danger : theme.colors.text} />
                                            </TouchableOpacity>
                                            <View style={styles.toolBody}>
                                                <Text style={styles.toolTitle}>{presentation.nome}</Text>
                                                <Text style={styles.toolDescription}>{presentation.descricao}</Text>
                                                <Text style={styles.toolMeta}>{tool.marca} • {tool.modelo}</Text>
                                                <Text style={styles.toolPrice}>R$ {Number(tool.preco_diaria).toFixed(2)} / dia</Text>
                                                <Text style={styles.toolCondition}>{tool.exige_caucao ? 'Caucao opcional' : 'Sem caucao'} • Aluguel por diaria ou pacote semanal</Text>
                                                <View style={styles.ownerRow}><View style={styles.onlineDot} /><Text style={styles.ownerText}>Locador ToolRent • 5.0 ★</Text></View>
                                                <Text style={styles.toolFooter}><MaterialCommunityIcons name="map-marker-outline" size={14} color={theme.colors.textMuted} /> Palmas, Plano Diretor • Hoje</Text>
                                                <View style={styles.badgeRow}>
                                                    <Text style={styles.badge}>{tool.disponibilidade ? 'Disponível' : 'Indisponível'}</Text>
                                                    <Text style={styles.badgeSecondary}>{categoryName}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                                </View>
                            </View>
                        )}
                    </ScrollView>
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="tools" size={54} color={theme.colors.primary} />
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
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        position: 'relative',
        zIndex: 1,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xl,
        position: 'relative',
        zIndex: 10,
    },
    headerLocation: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderSubtle,
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        flexDirection: 'row',
        gap: theme.spacing.xxs,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        flexShrink: 1,
    },
    locationText: {
        color: theme.colors.text,
        fontSize: theme.typography.caption,
        fontWeight: theme.typography.weight.semiBold,
    },
    headerCopy: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: theme.spacing.sm,
    },
    greeting: {
        color: theme.colors.primary,
        fontSize: theme.typography.caption,
        fontWeight: theme.typography.weight.bold,
        letterSpacing: 1,
        marginBottom: theme.spacing.xxs,
        textAlign: 'center',
    },
    title: {
        color: theme.colors.text,
        fontSize: theme.typography.title,
        fontWeight: theme.typography.weight.bold,
        textAlign: 'center',
    },
    headerActions: {
        alignItems: 'flex-end',
        position: 'relative',
        zIndex: 30,
    },
    logo: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.medium,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    menuCard: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderSubtle,
        borderRadius: theme.radius.large,
        borderWidth: 1,
        boxShadow: theme.shadows.card,
        elevation: 20,
        paddingVertical: theme.spacing.xs,
        position: 'absolute',
        right: 0,
        top: 54,
        width: 170,
        zIndex: 50,
    },
    menuItem: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
    },
    menuItemDanger: {
        borderTopColor: theme.colors.borderSubtle,
        borderTopWidth: 1,
    },
    menuItemDisabled: {
        backgroundColor: theme.states.disabled.background,
    },
    menuItemText: {
        color: theme.colors.text,
        fontSize: theme.typography.label,
        fontWeight: theme.typography.weight.semiBold,
    },
    menuItemTextDanger: {
        color: theme.states.error.foreground,
    },
    searchPlaceholder: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        flexDirection: 'row',
        height: 56,
        paddingHorizontal: theme.spacing.md,
        zIndex: 1,
    },
    searchInput: {
        color: theme.colors.text,
        flex: 1,
        fontSize: theme.typography.body,
        marginLeft: theme.spacing.xs,
    },
    filterBox: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.card,
        marginBottom: theme.spacing.sm,
        padding: theme.spacing.md,
    },
    filterRow: {
        gap: theme.spacing.xs,
        marginTop: theme.spacing.sm,
        paddingRight: theme.spacing.xs,
    },
    filterChip: {
        backgroundColor: theme.states.disabled.background,
        borderRadius: theme.radius.pill,
        marginRight: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        minHeight: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xxs,
    },
    filterChipActive: {
        backgroundColor: theme.colors.primary,
    },
    filterChipText: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.caption,
        fontWeight: theme.typography.weight.bold,
    },
    filterChipTextActive: {
        color: theme.colors.surface,
    },
    priceFiltersRow: {
        flexDirection: 'row',
        gap: theme.spacing.xs,
        marginTop: theme.spacing.sm,
    },
    dropdownRow: {
        flexDirection: 'row',
        gap: theme.spacing.xs,
        marginTop: theme.spacing.md,
    },
    dropdownFilter: {
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceSubtle,
        borderColor: theme.colors.borderSubtle,
        borderRadius: theme.radius.large,
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row',
        minHeight: 56,
        paddingHorizontal: theme.spacing.sm,
    },
    dropdownLabel: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.tiny,
        left: theme.spacing.sm,
        position: 'absolute',
        top: theme.spacing.xs,
    },
    dropdownValue: {
        color: theme.colors.text,
        flex: 1,
        fontSize: theme.typography.caption,
        fontWeight: theme.typography.weight.semiBold,
        marginTop: theme.spacing.sm,
    },
    priceInputWrap: {
        flex: 1,
    },
    fieldLabel: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.caption,
        fontWeight: theme.typography.weight.semiBold,
        marginBottom: theme.spacing.xxs,
    },
    priceInput: {
        backgroundColor: theme.colors.surfaceSubtle,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.large,
        borderWidth: 1,
        color: theme.colors.text,
        fontSize: theme.typography.label,
        paddingHorizontal: theme.spacing.sm,
        minHeight: 48,
        paddingVertical: theme.spacing.sm,
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing.md,
    },
    toggleButton: {
        alignItems: 'center',
        backgroundColor: theme.colors.primarySoft,
        borderColor: theme.colors.primaryBorder,
        borderRadius: theme.radius.medium,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
    },
    toggleButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    toggleButtonText: {
        color: theme.colors.primary,
        fontSize: theme.typography.small,
        fontWeight: theme.typography.weight.bold,
        marginLeft: theme.spacing.xs,
    },
    toggleButtonTextActive: {
        color: theme.colors.surface,
    },
    clearButton: {
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: theme.spacing.xs,
    },
    clearButtonText: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.caption,
        fontWeight: theme.typography.weight.bold,
    },
    profileScrollContent: {
        paddingBottom: theme.spacing.md,
    },
    profileLoadState: {
        alignItems: 'center',
        flex: 1,
        gap: theme.spacing.sm,
        justifyContent: 'center',
        minHeight: 220,
        padding: theme.spacing.lg,
    },
    profileStateText: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.body,
        textAlign: 'center',
    },
    profileErrorCard: {
        alignItems: 'center',
        backgroundColor: theme.states.error.background,
        borderColor: theme.states.error.border,
        borderRadius: theme.radius.card,
        borderWidth: 1,
        gap: theme.spacing.sm,
        marginTop: theme.spacing.md,
        padding: theme.spacing.lg,
    },
    profileRetryButton: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.medium,
        justifyContent: 'center',
        marginTop: theme.spacing.xs,
        minHeight: 44,
        paddingHorizontal: theme.spacing.md,
    },
    profileRetryButtonText: {
        color: theme.colors.surface,
        fontSize: theme.typography.caption,
        fontWeight: theme.typography.weight.bold,
    },
    profileCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.card,
        padding: theme.spacing.md,
    },
    profileTitle: {
        color: theme.colors.text,
        fontSize: theme.typography.title,
        fontWeight: theme.typography.weight.bold,
    },
    profileSubtitle: {
        color: theme.colors.textSubtle,
        fontSize: theme.typography.label,
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.xxs,
    },
    profileFeedback: {
        alignItems: 'center',
        borderRadius: theme.radius.medium,
        borderWidth: 1,
        flexDirection: 'row',
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.sm,
        padding: theme.spacing.sm,
    },
    profileSuccessFeedback: {
        backgroundColor: theme.states.success.background,
        borderColor: theme.states.success.border,
    },
    profileErrorFeedback: {
        backgroundColor: theme.states.error.background,
        borderColor: theme.states.error.border,
    },
    profileFeedbackText: {
        flex: 1,
        fontSize: theme.typography.small,
        lineHeight: 19,
    },
    profileSuccessFeedbackText: {
        color: theme.states.success.foreground,
    },
    profileErrorFeedbackText: {
        color: theme.states.error.foreground,
    },
    input: {
        backgroundColor: theme.colors.surfaceSubtle,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.large,
        borderWidth: 1,
        color: theme.colors.text,
        fontSize: theme.typography.body,
        marginBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
    },
    disabledInput: {
        justifyContent: 'center',
    },
    disabledInputText: {
        color: theme.colors.textSubtle,
        fontSize: theme.typography.body,
    },
    saveProfileButton: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.large,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xs,
        minHeight: 48,
        paddingHorizontal: theme.spacing.md,
    },
    saveProfileButtonText: {
        color: theme.colors.surface,
        fontSize: theme.typography.label,
        fontWeight: theme.typography.weight.bold,
    },
    saveProfileButtonDisabled: {
        backgroundColor: theme.states.disabled.background,
    },
    saveProfileButtonTextDisabled: {
        color: theme.states.disabled.foreground,
    },
    profileSavingIndicator: {
        marginRight: theme.spacing.xs,
    },
    sortRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
        marginTop: theme.spacing.sm,
        display: 'none',
    },
    sortChip: {
        backgroundColor: theme.states.disabled.background,
        borderRadius: theme.radius.pill,
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: theme.spacing.xs,
    },
    sortChipActive: {
        backgroundColor: theme.colors.primary,
    },
    sortChipText: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.caption,
        fontWeight: theme.typography.weight.bold,
    },
    sortChipTextActive: {
        color: theme.colors.surface,
    },
    exploreSection: {
        flex: 1,
    },
    exploreScrollContent: {
        paddingBottom: theme.spacing.md,
    },
    exploreList: {
        paddingBottom: theme.spacing.md,
    },
    resultsHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    listList: {
        width: '100%',
    },
    gridList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        justifyContent: 'space-between',
    },
    resultsTitle: {
        color: theme.colors.text,
        fontSize: theme.typography.subtitle,
        fontWeight: theme.typography.weight.bold,
    },
    viewToggle: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderSubtle,
        borderRadius: theme.radius.medium,
        borderWidth: 1,
        flexDirection: 'row',
        padding: theme.spacing.xxs,
    },
    viewToggleButton: {
        alignItems: 'center',
        borderRadius: theme.radius.small,
        height: 40,
        justifyContent: 'center',
        width: 40,
    },
    viewToggleActive: {
        backgroundColor: theme.colors.primarySoft,
    },
    toolCard: {
        borderColor: theme.colors.borderSubtle,
        borderWidth: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.card,
        flexDirection: 'row',
        marginBottom: theme.spacing.sm,
        overflow: 'hidden',
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    toolCardGrid: {
        flexDirection: 'column',
        marginBottom: 0,
        width: '48%',
    },
    toolCardGridImage: {
        width: '100%',
    },
    favoriteButton: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.pill,
        height: 40,
        justifyContent: 'center',
        position: 'absolute',
        right: theme.spacing.sm,
        top: theme.spacing.sm,
        width: 40,
        zIndex: 2,
    },
    toolImage: {
        height: 150,
        width: '38%',
    },
    toolImageGrid: {
        width: '100%',
    },
    placeholderImage: {
        alignItems: 'center',
        backgroundColor: theme.colors.imagePlaceholder,
        justifyContent: 'center',
    },
    toolBody: {
        flex: 1,
        padding: theme.spacing.sm,
    },
    toolTitle: {
        color: theme.colors.text,
        fontSize: theme.typography.subtitle,
        fontWeight: theme.typography.weight.bold,
    },
    toolMeta: {
        color: theme.colors.textSubtle,
        fontSize: theme.typography.small,
        marginTop: theme.spacing.xxs,
    },
    toolDescription: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.caption,
        lineHeight: 17,
        marginTop: theme.spacing.xxs,
    },
    toolPrice: {
        color: theme.colors.primary,
        fontSize: theme.typography.bodyLarge,
        fontWeight: theme.typography.weight.bold,
        marginTop: theme.spacing.xs,
    },
    toolCondition: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.caption,
        marginTop: theme.spacing.xs,
    },
    ownerRow: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: theme.spacing.sm,
    },
    onlineDot: {
        backgroundColor: theme.colors.success,
        borderRadius: theme.radius.pill,
        height: 8,
        marginRight: theme.spacing.xs,
        width: 8,
    },
    ownerText: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.caption,
        fontWeight: theme.typography.weight.semiBold,
    },
    toolFooter: {
        alignItems: 'center',
        color: theme.colors.textMuted,
        fontSize: theme.typography.tiny,
        marginTop: theme.spacing.sm,
    },
    badgeRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xs,
        marginTop: theme.spacing.sm,
    },
    badge: {
        backgroundColor: theme.states.success.background,
        borderRadius: theme.radius.pill,
        color: theme.states.success.foreground,
        fontSize: theme.typography.tiny,
        fontWeight: theme.typography.weight.bold,
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: theme.spacing.xxs,
    },
    badgeSecondary: {
        backgroundColor: theme.colors.infoBackground,
        borderRadius: theme.radius.pill,
        color: theme.colors.info,
        fontSize: theme.typography.tiny,
        fontWeight: theme.typography.weight.bold,
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: theme.spacing.xxs,
    },
    centeredBox: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: theme.spacing.md,
    },
    centeredText: {
        color: theme.colors.text,
        fontSize: theme.typography.label,
        fontWeight: theme.typography.weight.semiBold,
        marginTop: theme.spacing.sm,
    },
    inlineWarning: {
        alignItems: 'center',
        backgroundColor: theme.states.error.background,
        borderColor: theme.states.error.border,
        borderRadius: theme.radius.large,
        borderWidth: 1,
        flexDirection: 'row',
        marginBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
    },
    inlineWarningText: {
        color: theme.states.error.foreground,
        fontSize: theme.typography.caption,
        fontWeight: theme.typography.weight.semiBold,
        marginLeft: theme.spacing.xs,
    },
    resultsSummary: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.caption,
        fontWeight: theme.typography.weight.bold,
        marginBottom: theme.spacing.sm,
    },
    emptyState: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: theme.spacing.xxl,
    },
    emptyTitle: {
        color: theme.colors.text,
        fontSize: theme.typography.heading,
        fontWeight: theme.typography.weight.bold,
        marginTop: theme.spacing.md,
        textAlign: 'center',
    },
    emptySubtitle: {
        color: theme.colors.textSubtle,
        fontSize: theme.typography.bodyLarge,
        lineHeight: 23,
        marginTop: theme.spacing.xs,
        maxWidth: 290,
        textAlign: 'center',
    },
});
