import { goBackOrHome } from '@/utils/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ToolDetailParams = {
    id?: string;
    nome?: string;
    marca?: string;
    modelo?: string;
    estado_conservacao?: string;
    descricao?: string;
    itens_inclusos?: string;
    preco_diaria?: string;
    preco_semanal?: string;
    periodo_minimo?: string;
    exige_caucao?: string;
    politica_cancelamento?: string;
    entrega?: string;
    disponibilidade?: string;
    status_aprovacao?: string;
    categoria_id?: string;
    usuario_id?: string;
    fotos?: string;
};

export default function FerramentaDetalhes() {
    const router = useRouter();
    const params = useLocalSearchParams<ToolDetailParams>();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const fotoUrls = (() => {
        if (!params.fotos) {
            return [] as string[];
        }

        try {
            const parsed = JSON.parse(params.fotos) as string[] | string;
            if (Array.isArray(parsed)) {
                return parsed.filter(Boolean);
            }

            return String(parsed)
                .split('|')
                .map((value) => value.trim())
                .filter(Boolean);
        } catch {
            return String(params.fotos)
                .split('|')
                .map((value) => value.trim())
                .filter(Boolean);
        }
    })();

    useEffect(() => {
        setSelectedImageIndex(0);
    }, [params.fotos]);

    const cover = fotoUrls[selectedImageIndex] ?? fotoUrls[0];
    const price = Number(params.preco_diaria ?? 0);
    const period = Number(params.periodo_minimo ?? 1);
    const canGoPrevious = fotoUrls.length > 1 && selectedImageIndex > 0;
    const canGoNext = fotoUrls.length > 1 && selectedImageIndex < fotoUrls.length - 1;

    const goToPreviousImage = () => {
        if (canGoPrevious) {
            setSelectedImageIndex((current) => current - 1);
        }
    };

    const goToNextImage = () => {
        if (canGoNext) {
            setSelectedImageIndex((current) => current + 1);
        }
    };

    const cancellationMeaning: Record<string, string> = {
        Flexível: 'Reembolso total até 24h antes da reserva.',
        Moderada: 'Reembolso até 3 dias antes; após isso, só parcial ou crédito.',
        Rigorosa: 'Sem reembolso após a confirmação da reserva.',
    };

    const infoRows = [
        ['Marca', params.marca || 'Não informado'],
        ['Modelo', params.modelo || 'Não informado'],
        ['Conservação', params.estado_conservacao || 'Não informado'],
        ['Diária', `R$ ${price.toFixed(2)}`],
        ['Semanal', `R$ ${Number(params.preco_semanal ?? 0).toFixed(2)}`],
        ['Período mínimo', `${period} ${period === 1 ? 'dia' : 'dias'}`],
        ['Caução', params.exige_caucao === 'true' ? 'Exige caução' : 'Não exige caução'],
        ['Entrega', params.entrega === 'true' ? 'Disponível' : 'Não disponível'],
        ['Status', params.status_aprovacao || 'Não informado'],
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => goBackOrHome(router, { usuarioId: params.usuario_id })}
                        accessibilityLabel="Voltar"
                        activeOpacity={0.75}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#1F3D4A" />
                    </TouchableOpacity>

                    <View style={styles.headerCopy}>
                        <Text style={styles.eyebrow}>DETALHE DO ANÚNCIO</Text>
                        <Text style={styles.title}>{params.nome || 'Ferramenta'}</Text>
                    </View>
                </View>

                <View style={styles.imageStage}>
                    {cover ? (
                        <Image source={{ uri: cover }} style={styles.cover} resizeMode="cover" />
                    ) : (
                        <View style={styles.coverPlaceholder}>
                            <MaterialCommunityIcons name="wrench-outline" size={42} color="#E85D04" />
                            <Text style={styles.placeholderText}>Sem foto disponível</Text>
                        </View>
                    )}

                    {fotoUrls.length > 1 && (
                        <>
                            <TouchableOpacity
                                style={[styles.navButton, styles.navButtonLeft]}
                                onPress={goToPreviousImage}
                                disabled={!canGoPrevious}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons name="chevron-left" size={22} color="#FFFFFF" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.navButton, styles.navButtonRight]}
                                onPress={goToNextImage}
                                disabled={!canGoNext}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons name="chevron-right" size={22} color="#FFFFFF" />
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {fotoUrls.length > 1 && (
                    <View style={styles.galleryRow}>
                        {fotoUrls.map((url, index) => (
                            <TouchableOpacity
                                key={`${url}-${index}`}
                                activeOpacity={0.8}
                                onPress={() => setSelectedImageIndex(index)}
                            >
                                <Image
                                    source={{ uri: url }}
                                    style={[styles.galleryImage, selectedImageIndex === index && styles.galleryImageActive]}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.priceCard}>
                    <Text style={styles.priceLabel}>Valor da diária</Text>
                    <Text style={styles.priceText}>R$ {price.toFixed(2)}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações</Text>
                    {infoRows.map(([label, value]) => (
                        <View key={label} style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{label}</Text>
                            <Text style={styles.infoValue}>{String(value)}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Descrição</Text>
                    <Text style={styles.description}>{params.descricao || 'Nenhuma descrição informada.'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Itens inclusos</Text>
                    <Text style={styles.description}>{params.itens_inclusos || 'Nenhum item informado.'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Política de cancelamento</Text>
                    <Text style={styles.description}>
                        {params.politica_cancelamento
                            ? `${params.politica_cancelamento} — ${cancellationMeaning[params.politica_cancelamento] ?? 'Regra não definida.'}`
                            : 'Não informado.'}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 18,
        marginBottom: 16,
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
    imageStage: {
        position: 'relative',
    },
    cover: {
        borderRadius: 16,
        height: 220,
        width: '100%',
    },
    navButton: {
        alignItems: 'center',
        backgroundColor: 'rgba(17, 24, 39, 0.45)',
        borderRadius: 999,
        height: 36,
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -18 }],
        width: 36,
    },
    navButtonLeft: {
        left: 12,
    },
    navButtonRight: {
        right: 12,
    },
    coverPlaceholder: {
        alignItems: 'center',
        backgroundColor: '#FFF1E8',
        borderRadius: 16,
        height: 220,
        justifyContent: 'center',
        width: '100%',
    },
    placeholderText: {
        color: '#1F3D4A',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 10,
    },
    galleryRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14,
    },
    galleryImage: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        height: 80,
        width: 80,
    },
    galleryImageActive: {
        borderColor: '#E85D04',
    },
    priceCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
        borderRadius: 14,
        borderWidth: 1,
        marginTop: 18,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    priceLabel: {
        color: '#6B7280',
        fontSize: 12,
        fontWeight: '600',
    },
    priceText: {
        color: '#E85D04',
        fontSize: 28,
        fontWeight: '700',
        marginTop: 6,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
        borderRadius: 14,
        borderWidth: 1,
        marginTop: 18,
        padding: 16,
    },
    sectionTitle: {
        color: '#1F3D4A',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '600',
    },
    infoValue: {
        color: '#1F3D4A',
        fontSize: 14,
        fontWeight: '700',
        flex: 1,
        marginLeft: 16,
        textAlign: 'right',
    },
    description: {
        color: '#374151',
        fontSize: 14,
        lineHeight: 22,
    },
});
