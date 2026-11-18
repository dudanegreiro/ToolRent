import { criarFerramenta, enviarFoto } from '@/services/api';
import { goBackOrHome } from '@/utils/navigation';
import { tokens } from '@/shared/theme/tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type ReviewParams = {
    categoriaId?: string;
    usuarioId?: string;
    categoriaNome?: string;
    titulo?: string;
    marca?: string;
    modelo?: string;
    conservacao?: string;
    descricao?: string;
    itensInclusos?: string;
    capaUri?: string;
    fotos?: string;
    diaria?: string;
    periodoMinimo?: string;
    caucao?: string;
    cancelamento?: string;
    endereco?: string;
    bairro?: string;
    cidade?: string;
    entrega?: string;
};

type PublicationFeedback = {
    type: 'success' | 'error';
    message: string;
};

export default function AnuncioRevisao() {
    const router = useRouter();
    const params = useLocalSearchParams<ReviewParams>();
    const [publishing, setPublishing] = useState(false);
    const [feedback, setFeedback] = useState<PublicationFeedback | null>(null);
    const dailyPrice = Number(params.diaria ?? 0);
    const weeklyPrice = dailyPrice * 7 * 0.9;
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    const delivery = params.entrega === 'true' ? 'Sim' : 'Não';
    const deposit = params.caucao === 'true' ? 'Sim' : 'Não';
    const minimumPeriod = params.periodoMinimo === '1' ? '1 dia' : `${params.periodoMinimo ?? '-'} dias`;

    const cancellationMeaning: Record<string, string> = {
        Flexível: 'Reembolso total até 24h antes da reserva.',
        Moderada: 'Reembolso até 3 dias antes; após isso, só parcial ou crédito.',
        Rigorosa: 'Sem reembolso após a confirmação da reserva.',
    };

    const rows = [
        ['Categoria', params.categoriaNome],
        ['Marca', params.marca],
        ['Modelo', params.modelo],
        ['Conservação', params.conservacao],
        ['Diária', dailyPrice > 0 ? formatCurrency(dailyPrice) : undefined],
        ['Semanal', weeklyPrice > 0 ? formatCurrency(weeklyPrice) : undefined],
        ['Período mínimo', minimumPeriod],
        ['Caução', deposit],
        ['Cancelamento', params.cancelamento ? `${params.cancelamento} — ${cancellationMeaning[params.cancelamento]}` : undefined],
        ['Endereço', params.endereco],
        ['Bairro', params.bairro],
        ['Cidade', params.cidade],
        ['Oferece entrega', delivery],
        ['Itens inclusos', params.itensInclusos || 'Não informado'],
    ];

    const publishAd = async () => {
        if (!params.usuarioId || !params.categoriaId || !params.titulo || !params.marca || !params.modelo || !params.descricao || !params.endereco || !params.bairro || !params.cidade) {
            const message = 'Volte e preencha todos os campos obrigatórios antes de publicar.';
            setFeedback({ type: 'error', message });
            Alert.alert('Dados incompletos', message);
            return;
        }

        setPublishing(true);
        setFeedback(null);

        try {
            const fotoUris = params.fotos ? params.fotos.split('|').filter(Boolean) : [];
            const fotos = await Promise.all(fotoUris.map((uri, index) => enviarFoto(uri, index)));

            await criarFerramenta({
                nome: params.titulo,
                marca: params.marca,
                modelo: params.modelo,
                estado_conservacao: params.conservacao ?? 'Usado',
                descricao: params.descricao,
                itens_inclusos: params.itensInclusos ?? '',
                preco_diaria: dailyPrice,
                preco_semanal: weeklyPrice,
                periodo_minimo: Number(params.periodoMinimo ?? 1),
                exige_caucao: params.caucao === 'true',
                politica_cancelamento: params.cancelamento ?? 'Flexível',
                endereco: params.endereco,
                bairro: params.bairro,
                cidade: params.cidade,
                entrega: params.entrega === 'true',
                fotos: fotos.map((foto) => foto.url),
                usuario_id: Number(params.usuarioId),
                categoria_id: Number(params.categoriaId),
            });

            const message = 'Seu anúncio foi publicado com sucesso e já está disponível.';
            setFeedback({ type: 'success', message });

            router.replace({
                pathname: '/home',
                params: { usuarioId: params.usuarioId },
            } as Href);
        } catch (requestError) {
            const message = requestError instanceof Error
                ? requestError.message
                : 'Não foi possível publicar o anúncio. Tente novamente.';
            setFeedback({ type: 'error', message });
            Alert.alert(
                'Não foi possível publicar',
                message,
            );
        } finally {
            setPublishing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => goBackOrHome(router, { usuarioId: params.usuarioId })}
                        activeOpacity={0.75}
                        accessibilityLabel="Voltar"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color={tokens.colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerCopy}>
                        <Text style={styles.eyebrow}>NOVO ANÚNCIO</Text>
                        <Text style={styles.title}>Revise seu anúncio</Text>
                    </View>
                    <View style={styles.stepBadge}>
                        <Text style={styles.stepText}>6/6</Text>
                    </View>
                </View>

                <View style={styles.progressRow}>
                    <View style={styles.completedProgress} />
                    <View style={styles.completedProgress} />
                    <View style={styles.completedProgress} />
                    <View style={styles.completedProgress} />
                    <View style={styles.completedProgress} />
                    <View style={styles.activeProgress} />
                </View>

                <Text style={styles.instruction}>Confira como seu anúncio aparecerá para os locatários.</Text>

                <View style={styles.previewCard}>
                    {params.capaUri ? (
                        <Image source={{ uri: params.capaUri }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.previewPlaceholder}>
                            <MaterialCommunityIcons name="image-outline" size={42} color={tokens.colors.action} />
                            <Text style={styles.placeholderText}>Foto de capa</Text>
                        </View>
                    )}
                    <View style={styles.previewBody}>
                        <View style={styles.previewTopRow}>
                            <Text style={styles.previewCategory}>FERRAMENTA PARA ALUGAR</Text>
                            <MaterialCommunityIcons name="heart-outline" size={22} color={tokens.colors.secondaryText} />
                        </View>
                        <Text style={styles.previewTitle}>{params.titulo || 'Título do anúncio'}</Text>
                        <Text style={styles.previewMeta}>{params.marca || 'Marca'} • {params.modelo || 'Modelo'}</Text>
                        <View style={styles.previewBottomRow}>
                            <View style={styles.locationInline}>
                                <MaterialCommunityIcons name="map-marker-outline" size={16} color={tokens.colors.action} />
                                <Text style={styles.locationText}>{params.cidade || 'Cidade'}</Text>
                            </View>
                            <Text style={styles.previewPrice}>{formatCurrency(dailyPrice)}<Text style={styles.perDay}> / dia</Text></Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Todos os dados</Text>
                <View style={styles.table}>
                    {rows.map(([label, value], index) => (
                        <View key={label} style={[styles.tableRow, index % 2 === 1 && styles.alternateRow]}>
                            <Text style={styles.tableLabel}>{label}</Text>
                            <Text style={styles.tableValue}>{value || 'Não informado'}</Text>
                        </View>
                    ))}
                    <View style={styles.descriptionRow}>
                        <Text style={styles.tableLabel}>Descrição</Text>
                        <Text style={styles.descriptionValue}>{params.descricao || 'Não informado'}</Text>
                    </View>
                </View>

                <View style={styles.approvalBox}>
                    <View style={styles.approvalIcon}>
                        <MaterialCommunityIcons name="shield-check-outline" size={24} color={tokens.colors.success} />
                    </View>
                    <View style={styles.approvalCopy}>
                        <Text style={styles.approvalTitle}>Anúncio publicado com sucesso</Text>
                        <Text style={styles.approvalText}>
                            Sua ferramenta já está disponível para os locatários encontrarem e alugarem.
                        </Text>
                    </View>
                </View>

                {feedback && (
                    <View style={[styles.feedbackBox, feedback.type === 'success' ? styles.successBox : styles.errorBox]}>
                        <MaterialCommunityIcons
                            name={feedback.type === 'success' ? 'check-circle-outline' : 'alert-circle-outline'}
                            size={22}
                            color={feedback.type === 'success' ? tokens.colors.success : tokens.colors.alert}
                        />
                        <Text style={[styles.feedbackText, feedback.type === 'success' ? styles.successText : styles.errorText]}>
                            {feedback.message}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.submitButton, publishing && styles.disabledButton]}
                    onPress={() => void publishAd()}
                    disabled={publishing}
                    activeOpacity={0.8}
                >
                    <Text style={styles.submitButtonText}>{publishing ? 'PUBLICANDO...' : 'PUBLICAR ANÚNCIO'}</Text>
                    {!publishing && <MaterialCommunityIcons name="check" size={20} color={tokens.colors.onAction} />}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: tokens.colors.background, flex: 1 },
    content: { paddingBottom: tokens.spacing.lg + tokens.spacing.sm, paddingHorizontal: tokens.spacing.lg, paddingTop: tokens.spacing.md },
    header: { alignItems: 'center', flexDirection: 'row', marginBottom: tokens.spacing.lg },
    backButton: { alignItems: 'center', height: 44, justifyContent: 'center', marginRight: tokens.spacing.md, width: 44 },
    headerCopy: { flex: 1 },
    eyebrow: { color: tokens.colors.action, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: tokens.spacing.xs },
    title: { color: tokens.colors.text, fontSize: 23, fontWeight: 'bold' },
    stepBadge: { alignItems: 'center', backgroundColor: tokens.colors.subtleSurface, borderRadius: tokens.radii.xl, height: 40, justifyContent: 'center', width: 40 },
    stepText: { color: tokens.colors.action, fontSize: 12, fontWeight: '700' },
    progressRow: { flexDirection: 'row', gap: tokens.spacing.xs, marginBottom: tokens.spacing.lg },
    completedProgress: { backgroundColor: tokens.colors.action, borderRadius: tokens.radii.sm, flex: 1, height: 5 },
    activeProgress: { backgroundColor: tokens.colors.action, borderRadius: tokens.radii.sm, flex: 1, height: 5 },
    instruction: { color: tokens.colors.supportingText, fontSize: 15, marginBottom: tokens.spacing.md },
    previewCard: { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border, borderRadius: tokens.radii.lg, borderWidth: 1, overflow: 'hidden' },
    previewImage: { height: 180, width: '100%' },
    previewPlaceholder: { alignItems: 'center', backgroundColor: tokens.colors.subtleSurface, height: 180, justifyContent: 'center' },
    placeholderText: { color: tokens.colors.action, fontSize: 13, fontWeight: '700', marginTop: tokens.spacing.sm },
    previewBody: { padding: tokens.spacing.md },
    previewTopRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    previewCategory: { color: tokens.colors.action, fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
    previewTitle: { color: tokens.colors.text, fontSize: 19, fontWeight: '700', marginTop: tokens.spacing.sm },
    previewMeta: { color: tokens.colors.supportingText, fontSize: 13, marginTop: tokens.spacing.xs },
    previewBottomRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: tokens.spacing.md },
    locationInline: { alignItems: 'center', flexDirection: 'row' },
    locationText: { color: tokens.colors.supportingText, fontSize: 12, marginLeft: tokens.spacing.xs },
    previewPrice: { color: tokens.colors.action, fontSize: 16, fontWeight: '700' },
    perDay: { color: tokens.colors.supportingText, fontSize: 11, fontWeight: '400' },
    sectionTitle: { color: tokens.colors.text, fontSize: 17, fontWeight: '700', marginBottom: tokens.spacing.sm, marginTop: tokens.spacing.lg },
    table: { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border, borderRadius: tokens.radii.lg, borderWidth: 1, overflow: 'hidden' },
    tableRow: { flexDirection: 'row', paddingHorizontal: tokens.spacing.md, paddingVertical: tokens.spacing.md },
    alternateRow: { backgroundColor: tokens.colors.alternateSurface },
    tableLabel: { color: tokens.colors.supportingText, fontSize: 12, width: '38%' },
    tableValue: { color: tokens.colors.text, flex: 1, fontSize: 13, fontWeight: '600' },
    descriptionRow: { borderTopColor: tokens.colors.subtleBorder, borderTopWidth: 1, padding: tokens.spacing.md },
    descriptionValue: { color: tokens.colors.text, fontSize: 13, lineHeight: 19, marginTop: tokens.spacing.sm },
    approvalBox: { alignItems: 'center', backgroundColor: tokens.colors.successSurface, borderColor: tokens.colors.successBorder, borderRadius: tokens.radii.lg, borderWidth: 1, flexDirection: 'row', marginTop: tokens.spacing.md, padding: tokens.spacing.md },
    approvalIcon: { alignItems: 'center', backgroundColor: tokens.colors.successIconSurface, borderRadius: tokens.radii.pill, height: 44, justifyContent: 'center', width: 44 },
    approvalCopy: { flex: 1, marginLeft: tokens.spacing.sm },
    approvalTitle: { color: tokens.colors.successText, fontSize: 14, fontWeight: '700' },
    approvalText: { color: tokens.colors.successSupportingText, fontSize: 12, lineHeight: 18, marginTop: tokens.spacing.xs },
    submitButton: { alignItems: 'center', backgroundColor: tokens.colors.action, borderRadius: tokens.radii.lg, flexDirection: 'row', justifyContent: 'center', marginTop: tokens.spacing.lg, minHeight: 52 },
    submitButtonText: { color: tokens.colors.onAction, fontSize: 13, fontWeight: '700', marginRight: tokens.spacing.sm },
    disabledButton: { backgroundColor: tokens.colors.disabledText },
    feedbackBox: { alignItems: 'center', borderRadius: tokens.radii.lg, flexDirection: 'row', marginTop: tokens.spacing.md, padding: tokens.spacing.md },
    successBox: { backgroundColor: tokens.colors.successSurface, borderColor: tokens.colors.successBorder, borderWidth: 1 },
    errorBox: { backgroundColor: tokens.colors.alertSurface, borderColor: tokens.colors.alertBorder, borderWidth: 1 },
    feedbackText: { flex: 1, fontSize: 13, lineHeight: 19, marginLeft: tokens.spacing.sm },
    successText: { color: tokens.colors.successText },
    errorText: { color: tokens.colors.alert },
});