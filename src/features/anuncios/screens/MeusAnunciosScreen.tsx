import { listarFerramentas, type Ferramenta } from '@/services/api';
import { goBackOrHome } from '@/shared/navigation';
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
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1F3D4A" />
                </TouchableOpacity>

                <View style={styles.headerCopy}>
                    <Text style={styles.eyebrow}>MEUS ANÚNCIOS</Text>
                    <Text style={styles.title}>Ferramentas cadastradas</Text>
                </View>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push({ pathname: '/anuncio', params: { usuarioId } } as Href)}
                    activeOpacity={0.8}
                >
                    <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centeredBox}>
                    <ActivityIndicator size="large" color="#E85D04" />
                    <Text style={styles.loadingText}>Carregando seus anúncios...</Text>
                </View>
            ) : error ? (
                <View style={styles.centeredBox}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={42} color="#E85D04" />
                    <Text style={styles.emptyTitle}>Não foi possível carregar</Text>
                    <Text style={styles.emptySubtitle}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => router.replace({ pathname: '/meus-anuncios', params: { usuarioId } } as Href)}
                    >
                        <Text style={styles.retryButtonText}>Tentar novamente</Text>
                    </TouchableOpacity>
                </View>
            ) : tools.length === 0 ? (
                <View style={styles.centeredBox}>
                    <MaterialCommunityIcons name="clipboard-text-outline" size={52} color="#E85D04" />
                    <Text style={styles.emptyTitle}>Você ainda não tem anúncios</Text>
                    <Text style={styles.emptySubtitle}>
                        Publique sua primeira ferramenta e ela aparecerá aqui.
                    </Text>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.push({ pathname: '/anuncio', params: { usuarioId } } as Href)}
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
                            >
                                {cover ? (
                                    <Image
                                        source={{ uri: cover }}
                                        style={styles.cardImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                                        <MaterialCommunityIcons name="wrench-outline" size={28} color="#E85D04" />
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
        backgroundColor: '#F5F7FA',
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 12,
    },
    backButton: {
        alignItems: 'center',
        height: 44,
        justifyContent: 'center',
        marginRight: 12,
        width: 44,
    },
    headerCopy: {
        flex: 1,
    },
    eyebrow: {
        color: '#E85D04',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    title: {
        color: '#1F3D4A',
        fontSize: 22,
        fontWeight: '700',
    },
    addButton: {
        alignItems: 'center',
        backgroundColor: '#E85D04',
        borderRadius: 10,
        height: 40,
        justifyContent: 'center',
        width: 40,
    },
    centeredBox: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
    },
    loadingText: {
        color: '#6B7280',
        fontSize: 15,
        marginTop: 12,
    },
    emptyTitle: {
        color: '#1F3D4A',
        fontSize: 20,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        color: '#6B7280',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
    },
    primaryButton: {
        alignItems: 'center',
        backgroundColor: '#E85D04',
        borderRadius: 10,
        marginTop: 20,
        minHeight: 48,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    retryButton: {
        alignItems: 'center',
        backgroundColor: '#1F3D4A',
        borderRadius: 10,
        marginTop: 20,
        minHeight: 46,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    listContent: {
        paddingHorizontal: 18,
        paddingBottom: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        marginBottom: 16,
        overflow: 'hidden',
    },
    cardImage: {
        backgroundColor: '#E5E7EB',
        height: 122,
        width: 120,
    },
    cardImagePlaceholder: {
        alignItems: 'center',
        backgroundColor: '#FFF1E8',
        justifyContent: 'center',
    },
    cardBody: {
        flex: 1,
        padding: 14,
    },
    cardTitle: {
        color: '#1F3D4A',
        fontSize: 17,
        fontWeight: '700',
    },
    cardMeta: {
        color: '#6B7280',
        fontSize: 13,
        marginTop: 4,
    },
    cardPrice: {
        color: '#E85D04',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 10,
    },
    rowInfo: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    badge: {
        backgroundColor: '#E8F7EE',
        borderRadius: 999,
        color: '#1C7C54',
        fontSize: 11,
        fontWeight: '700',
        overflow: 'hidden',
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    status: {
        color: '#6B7280',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
});
