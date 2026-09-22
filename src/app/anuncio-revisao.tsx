import { criarFerramenta, enviarFoto } from '@/services/api';
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

    const rows = [
        ['Categoria', params.categoriaNome],
        ['Marca', params.marca],
        ['Modelo', params.modelo],
        ['Conservação', params.conservacao],
        ['Diária', dailyPrice > 0 ? formatCurrency(dailyPrice) : undefined],
        ['Semanal', weeklyPrice > 0 ? formatCurrency(weeklyPrice) : undefined],
        ['Período mínimo', minimumPeriod],
        ['Caução', deposit],
        ['Cancelamento', params.cancelamento],
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
            Alert.alert('Anúncio publicado', message, [
                {
                    text: 'IR PARA HOME',
                    onPress: () => router.replace({
                        pathname: '/home',
                        params: { usuarioId: params.usuarioId },
                    } as Href),
                },
            ]);
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
                        onPress={() => router.back()}
                        activeOpacity={0.75}
                        accessibilityLabel="Voltar"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#1F3D4A" />
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
                            <MaterialCommunityIcons name="image-outline" size={42} color="#E85D04" />
                            <Text style={styles.placeholderText}>Foto de capa</Text>
                        </View>
                    )}
                    <View style={styles.previewBody}>
                        <View style={styles.previewTopRow}>
                            <Text style={styles.previewCategory}>FERRAMENTA PARA ALUGAR</Text>
                            <MaterialCommunityIcons name="heart-outline" size={22} color="#8A8A8A" />
                        </View>
                        <Text style={styles.previewTitle}>{params.titulo || 'Título do anúncio'}</Text>
                        <Text style={styles.previewMeta}>{params.marca || 'Marca'} • {params.modelo || 'Modelo'}</Text>
                        <View style={styles.previewBottomRow}>
                            <View style={styles.locationInline}>
                                <MaterialCommunityIcons name="map-marker-outline" size={16} color="#E85D04" />
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
                        <MaterialCommunityIcons name="shield-check-outline" size={24} color="#258653" />
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
                            color={feedback.type === 'success' ? '#258653' : '#B42318'}
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
                    {!publishing && <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#F5F7FA', flex: 1 },
    content: { paddingBottom: 32, paddingHorizontal: 24, paddingTop: 20 },
    header: { alignItems: 'center', flexDirection: 'row', marginBottom: 24 },
    backButton: { alignItems: 'center', height: 44, justifyContent: 'center', marginRight: 12, width: 44 },
    headerCopy: { flex: 1 },
    eyebrow: { color: '#E85D04', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
    title: { color: '#1F3D4A', fontSize: 23, fontWeight: 'bold' },
    stepBadge: { alignItems: 'center', backgroundColor: '#FFF1E8', borderRadius: 16, height: 40, justifyContent: 'center', width: 40 },
    stepText: { color: '#E85D04', fontSize: 12, fontWeight: '700' },
    progressRow: { flexDirection: 'row', gap: 6, marginBottom: 28 },
    completedProgress: { backgroundColor: '#E85D04', borderRadius: 4, flex: 1, height: 5 },
    activeProgress: { backgroundColor: '#E85D04', borderRadius: 4, flex: 1, height: 5 },
    instruction: { color: '#6B7280', fontSize: 15, marginBottom: 20 },
    previewCard: { backgroundColor: '#FFFFFF', borderColor: '#D5DCE3', borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
    previewImage: { height: 180, width: '100%' },
    previewPlaceholder: { alignItems: 'center', backgroundColor: '#FFF1E8', height: 180, justifyContent: 'center' },
    placeholderText: { color: '#E85D04', fontSize: 13, fontWeight: '700', marginTop: 8 },
    previewBody: { padding: 16 },
    previewTopRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    previewCategory: { color: '#E85D04', fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
    previewTitle: { color: '#1F3D4A', fontSize: 19, fontWeight: '700', marginTop: 8 },
    previewMeta: { color: '#6B7280', fontSize: 13, marginTop: 5 },
    previewBottomRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
    locationInline: { alignItems: 'center', flexDirection: 'row' },
    locationText: { color: '#6B7280', fontSize: 12, marginLeft: 4 },
    previewPrice: { color: '#E85D04', fontSize: 16, fontWeight: '700' },
    perDay: { color: '#6B7280', fontSize: 11, fontWeight: '400' },
    sectionTitle: { color: '#1F3D4A', fontSize: 17, fontWeight: '700', marginBottom: 10, marginTop: 24 },
    table: { backgroundColor: '#FFFFFF', borderColor: '#D5DCE3', borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
    tableRow: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 12 },
    alternateRow: { backgroundColor: '#FAFBFC' },
    tableLabel: { color: '#6B7280', fontSize: 12, width: '38%' },
    tableValue: { color: '#1F3D4A', flex: 1, fontSize: 13, fontWeight: '600' },
    descriptionRow: { borderTopColor: '#E5E7EB', borderTopWidth: 1, padding: 14 },
    descriptionValue: { color: '#1F3D4A', fontSize: 13, lineHeight: 19, marginTop: 7 },
    approvalBox: { alignItems: 'center', backgroundColor: '#F1FAF5', borderColor: '#9BD3B2', borderRadius: 12, borderWidth: 1, flexDirection: 'row', marginTop: 20, padding: 14 },
    approvalIcon: { alignItems: 'center', backgroundColor: '#D9F2E3', borderRadius: 22, height: 44, justifyContent: 'center', width: 44 },
    approvalCopy: { flex: 1, marginLeft: 11 },
    approvalTitle: { color: '#216B45', fontSize: 14, fontWeight: '700' },
    approvalText: { color: '#4E755F', fontSize: 12, lineHeight: 18, marginTop: 4 },
    submitButton: { alignItems: 'center', backgroundColor: '#E85D04', borderRadius: 10, flexDirection: 'row', justifyContent: 'center', marginTop: 24, minHeight: 52 },
    submitButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginRight: 10 },
    disabledButton: { backgroundColor: '#AEB7BF' },
    feedbackBox: { alignItems: 'center', borderRadius: 10, flexDirection: 'row', marginTop: 16, padding: 13 },
    successBox: { backgroundColor: '#F1FAF5', borderColor: '#9BD3B2', borderWidth: 1 },
    errorBox: { backgroundColor: '#FFF4F2', borderColor: '#F1B5AD', borderWidth: 1 },
    feedbackText: { flex: 1, fontSize: 13, lineHeight: 19, marginLeft: 9 },
    successText: { color: '#216B45' },
    errorText: { color: '#B42318' },
});