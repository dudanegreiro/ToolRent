import { listarFerramentas, type Ferramenta } from '@/services/api';
import { goBackOrHome } from '@/utils/navigation';
import { tokens } from '@/shared/theme/tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MeusAnuncios() {
    const router = useRouter();
    const { usuarioId } = useLocalSearchParams<{ usuarioId?: string }>();
    const [tools, setTools] = useState<Ferramenta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMyTools = async () => {
            if (!usuarioId) {
                setError('Sessão de usuário inválida. Faça login novamente.');
                setLoading(false);
                return;
            }

            try {
                const allTools = await listarFerramentas();
                const myTools = allTools.filter((tool) => String(tool.usuario_id) === String(usuarioId));
                setTools(myTools);
            } catch (requestError) {
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : 'Não foi possível carregar seus anúncios.',
                );
            } finally {
                setLoading(false);
            }
        };

        void loadMyTools();
    }, [usuarioId]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => goBackOrHome(router, { usuarioId })}
                    activeOpacity={0.75}
                    accessibilityLabel="Voltar"
                    accessibilityRole="button"
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color={tokens.colors.text} />
                </TouchableOpacity>

                <View style={styles.headerCopy}>
                    <Text style={styles.eyebrow}>MEUS ANÚNCIOS</Text>
                    <Text style={styles.title}>Ferramentas cadastradas</Text>
                </View>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push({ pathname: '/anuncio', params: { usuarioId } } as Href)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Criar anúncio"
                >
                    <MaterialCommunityIcons name="plus" size={20} color={tokens.colors.onAction} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centeredBox}>
                    <ActivityIndicator
                        size="large"
                        color={tokens.colors.action}
                        accessibilityLabel="Carregando seus anúncios"
                        accessibilityRole="progressbar"
                    />
                    <Text style={styles.loadingText}>Carregando seus anúncios...</Text>
                </View>
            ) : error ? (
                <View style={styles.centeredBox}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={42} color={tokens.colors.action} />
                    <Text style={styles.emptyTitle}>Não foi possível carregar</Text>
                    <Text style={styles.emptySubtitle}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => router.replace({ pathname: '/meus-anuncios', params: { usuarioId } } as Href)}
                        accessibilityRole="button"
                        accessibilityLabel="Tentar carregar anúncios novamente"
                    >
                        <Text style={styles.retryButtonText}>Tentar novamente</Text>
                    </TouchableOpacity>
                </View>
            ) : tools.length === 0 ? (
                <View style={styles.centeredBox}>
                    <MaterialCommunityIcons name="clipboard-text-outline" size={52} color={tokens.colors.action} />
                    <Text style={styles.emptyTitle}>Você ainda não tem anúncios</Text>
                    <Text style={styles.emptySubtitle}>
                        Publique sua primeira ferramenta e ela aparecerá aqui.
                    </Text>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.push({ pathname: '/anuncio', params: { usuarioId } } as Href)}
                        accessibilityRole="button"
                        accessibilityLabel="Anunciar ferramenta"
                    >
                        <Text style={styles.primaryButtonText}>Anunciar ferramenta</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.listContent}>
                    {tools.map((tool) => {
                        const cover = tool.fotos?.[0]?.url;
                        const toolParams = {
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
                            fotos: JSON.stringify(tool.fotos.map((foto) => foto.url)),
                        };

                        return (
                            <TouchableOpacity
                                key={tool.id}
                                style={styles.card}
                                activeOpacity={0.85}
                                onPress={() => router.push({
                                    pathname: '/ferramenta-detalhes',
                                    params: toolParams,
                                } as Href)}
                                accessibilityRole="button"
                                accessibilityLabel={`${tool.nome}, ${tool.marca} ${tool.modelo}. R$ ${Number(tool.preco_diaria).toFixed(2)} por dia. ${tool.disponibilidade ? 'Disponível' : 'Indisponível'}. Status: ${tool.status_aprovacao}. Abrir detalhes`}
                            >
                                {cover ? (
                                    <Image
                                        source={{ uri: cover }}
                                        style={styles.cardImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                                        <MaterialCommunityIcons name="wrench-outline" size={28} color={tokens.colors.action} />
                                    </View>
                                )}

                                <View style={styles.cardBody}>
                                    <Text style={styles.cardTitle}>{tool.nome}</Text>
                                    <Text style={styles.cardMeta}>{tool.marca} • {tool.modelo}</Text>
                                    <Text style={styles.cardPrice}>R$ {Number(tool.preco_diaria).toFixed(2)}/dia</Text>

                                    <View style={styles.rowInfo}>
                                        <Text style={styles.badge}>{tool.disponibilidade ? 'Disponível' : 'Indisponível'}</Text>
                                        <Text style={styles.status}>{tool.status_aprovacao}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tokens.colors.background,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: tokens.spacing.md,
        paddingTop: tokens.spacing.md,
        paddingBottom: tokens.spacing.md,
    },
    backButton: {
        alignItems: 'center',
        height: 44,
        justifyContent: 'center',
        marginRight: tokens.spacing.md,
        width: 44,
    },
    headerCopy: {
        flex: 1,
    },
    eyebrow: {
        color: tokens.colors.action,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: tokens.spacing.xs,
    },
    title: {
        color: tokens.colors.text,
        fontSize: 22,
        fontWeight: '700',
    },
    addButton: {
        alignItems: 'center',
        backgroundColor: tokens.colors.action,
        borderRadius: tokens.radii.lg,
        height: 40,
        justifyContent: 'center',
        width: 40,
    },
    centeredBox: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: tokens.spacing.lg + tokens.spacing.xs,
    },
    loadingText: {
        color: tokens.colors.supportingText,
        fontSize: 15,
        marginTop: tokens.spacing.md,
    },
    emptyTitle: {
        color: tokens.colors.text,
        fontSize: 20,
        fontWeight: '700',
        marginTop: tokens.spacing.md,
        marginBottom: tokens.spacing.sm,
        textAlign: 'center',
    },
    emptySubtitle: {
        color: tokens.colors.supportingText,
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
    },
    primaryButton: {
        alignItems: 'center',
        backgroundColor: tokens.colors.action,
        borderRadius: tokens.radii.lg,
        marginTop: tokens.spacing.md,
        minHeight: 48,
        justifyContent: 'center',
        paddingHorizontal: tokens.spacing.md,
    },
    primaryButtonText: {
        color: tokens.colors.onAction,
        fontSize: 14,
        fontWeight: '700',
    },
    retryButton: {
        alignItems: 'center',
        backgroundColor: tokens.colors.text,
        borderRadius: tokens.radii.lg,
        marginTop: tokens.spacing.md,
        minHeight: 46,
        justifyContent: 'center',
        paddingHorizontal: tokens.spacing.md,
    },
    retryButtonText: {
        color: tokens.colors.onAction,
        fontSize: 14,
        fontWeight: '700',
    },
    listContent: {
        paddingHorizontal: tokens.spacing.md,
        paddingBottom: tokens.spacing.lg,
    },
    card: {
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.subtleBorder,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        flexDirection: 'row',
        marginBottom: tokens.spacing.md,
        overflow: 'hidden',
    },
    cardImage: {
        backgroundColor: tokens.colors.subtleBorder,
        height: 122,
        width: 120,
    },
    cardImagePlaceholder: {
        alignItems: 'center',
        backgroundColor: tokens.colors.subtleSurface,
        justifyContent: 'center',
    },
    cardBody: {
        flex: 1,
        padding: tokens.spacing.md,
    },
    cardTitle: {
        color: tokens.colors.text,
        fontSize: 17,
        fontWeight: '700',
    },
    cardMeta: {
        color: tokens.colors.supportingText,
        fontSize: 13,
        marginTop: tokens.spacing.xs,
    },
    cardPrice: {
        color: tokens.colors.action,
        fontSize: 16,
        fontWeight: '700',
        marginTop: tokens.spacing.sm,
    },
    rowInfo: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: tokens.spacing.md,
    },
    badge: {
        backgroundColor: tokens.colors.listingStatusSurface,
        borderRadius: tokens.radii.pill,
        color: tokens.colors.listingStatusText,
        fontSize: 11,
        fontWeight: '700',
        overflow: 'hidden',
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.xs,
    },
    status: {
        color: tokens.colors.supportingText,
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
});
