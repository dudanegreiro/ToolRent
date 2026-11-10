import { atualizarFerramenta, excluirFerramenta } from '@/services/api';
import { getSession } from '@/services/session';
import { goBackOrHome } from '@/utils/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

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
    categoria_nome?: string;
    usuario_id?: string;
    fotos?: string;
};

type FormValues = {
    nome: string;
    marca: string;
    modelo: string;
    estado_conservacao: string;
    descricao: string;
    itens_inclusos: string;
    preco_diaria: string;
    preco_semanal: string;
    periodo_minimo: string;
    exige_caucao: boolean;
    entrega: boolean;
    disponibilidade: boolean;
    politica_cancelamento: string;
};

function ToolImageGallery({
    fotoUrls,
    selectedImageIndex,
    onSelect,
    onNext,
    onPrevious,
}: {
    fotoUrls: string[];
    selectedImageIndex: number;
    onSelect: (index: number) => void;
    onNext: () => void;
    onPrevious: () => void;
}) {
    const cover = fotoUrls[selectedImageIndex] ?? fotoUrls[0];
    const canGoPrevious = fotoUrls.length > 1 && selectedImageIndex > 0;
    const canGoNext = fotoUrls.length > 1 && selectedImageIndex < fotoUrls.length - 1;

    return (
        <>
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
                            onPress={onPrevious}
                            disabled={!canGoPrevious}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons name="chevron-left" size={22} color="#FFFFFF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.navButton, styles.navButtonRight]}
                            onPress={onNext}
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
                            onPress={() => onSelect(index)}
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
        </>
    );
}

function OwnerActionButtons({
    isOwner,
    isEditing,
    onEdit,
    onDelete,
}: {
    isOwner: boolean;
    isEditing: boolean;
    onEdit: () => void;
    onDelete: () => void;
}) {
    if (!isOwner || isEditing) {
        return null;
    }

    return (
        <View style={styles.ownerActions}>
            <TouchableOpacity style={styles.editButton} onPress={onEdit} activeOpacity={0.85}>
                <MaterialCommunityIcons name="pencil" size={18} color="#FFFFFF" />
                <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete} activeOpacity={0.85}>
                <MaterialCommunityIcons name="delete-outline" size={18} color="#FFFFFF" />
                <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
        </View>
    );
}

function EditToolForm({
    form,
    params,
    saving,
    onChange,
    onCancel,
    onSave,
}: {
    form: FormValues;
    params: ToolDetailParams;
    saving: boolean;
    onChange: (field: keyof FormValues, value: string | boolean) => void;
    onCancel: () => void;
    onSave: () => void;
}) {
    return (
        <View style={styles.editCard}>
            <View style={styles.editHeader}>
                <View>
                    <Text style={styles.eyebrow}>EDITAR ANÚNCIO</Text>
                    <Text style={styles.sectionTitle}>Detalhes do item</Text>
                </View>
                <View style={styles.pillInfo}>
                    <Text style={styles.pillInfoText}>Sempre melhorando</Text>
                </View>
            </View>

            <View style={styles.formSection}>
                <Text style={styles.sectionSubtitle}>Dados básicos</Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.fieldLabel}>Título do anúncio</Text>
                    <TextInput
                        value={form.nome}
                        onChangeText={(value) => onChange('nome', value)}
                        style={styles.input}
                        placeholder="Ex: Furadeira sem fio"
                    />
                </View>

                <View style={styles.inputRow}>
                    <View style={styles.inputHalf}>
                        <Text style={styles.fieldLabel}>Marca</Text>
                        <TextInput
                            value={form.marca}
                            onChangeText={(value) => onChange('marca', value)}
                            style={styles.input}
                            placeholder="Bosch"
                        />
                    </View>
                    <View style={styles.inputHalf}>
                        <Text style={styles.fieldLabel}>Modelo</Text>
                        <TextInput
                            value={form.modelo}
                            onChangeText={(value) => onChange('modelo', value)}
                            style={styles.input}
                            placeholder="GSR 12V"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.fieldLabel}>Categoria</Text>
                    <TextInput
                        value={params.categoria_nome || 'Categoria'}
                        editable={false}
                        style={[styles.input, styles.inputReadOnly]}
                    />
                </View>
            </View>

            <View style={styles.formSection}>
                <Text style={styles.sectionSubtitle}>Condição e descrição</Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.fieldLabel}>Estado de conservação</Text>
                    <TextInput
                        value={form.estado_conservacao}
                        onChangeText={(value) => onChange('estado_conservacao', value)}
                        style={styles.input}
                        placeholder="Novo, seminovo, usado"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.fieldLabel}>Descrição</Text>
                    <TextInput
                        value={form.descricao}
                        onChangeText={(value) => onChange('descricao', value)}
                        multiline
                        style={[styles.input, styles.textArea]}
                        placeholder="Conte detalhes da ferramenta, acessórios e uso."
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.fieldLabel}>Itens inclusos</Text>
                    <TextInput
                        value={form.itens_inclusos}
                        onChangeText={(value) => onChange('itens_inclusos', value)}
                        style={styles.input}
                        placeholder="Carregador, maleta, empunhadeira"
                    />
                </View>
            </View>

            <View style={styles.formSection}>
                <Text style={styles.sectionSubtitle}>Preço e regras</Text>
                <View style={styles.inputRow}>
                    <View style={styles.inputHalf}>
                        <Text style={styles.fieldLabel}>Diária</Text>
                        <TextInput
                            value={form.preco_diaria}
                            onChangeText={(value) => onChange('preco_diaria', value)}
                            keyboardType="decimal-pad"
                            style={styles.input}
                            placeholder="120"
                        />
                    </View>
                    <View style={styles.inputHalf}>
                        <Text style={styles.fieldLabel}>Semanal</Text>
                        <TextInput
                            value={form.preco_semanal}
                            onChangeText={(value) => onChange('preco_semanal', value)}
                            keyboardType="decimal-pad"
                            style={styles.input}
                            placeholder="650"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.fieldLabel}>Período mínimo (dias)</Text>
                    <TextInput
                        value={form.periodo_minimo}
                        onChangeText={(value) => onChange('periodo_minimo', value)}
                        keyboardType="number-pad"
                        style={styles.input}
                        placeholder="1"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.fieldLabel}>Política de cancelamento</Text>
                    <TextInput
                        value={form.politica_cancelamento}
                        onChangeText={(value) => onChange('politica_cancelamento', value)}
                        style={styles.input}
                        placeholder="Flexível, Moderada ou Rigorosa"
                    />
                </View>
            </View>

            <View style={styles.formSection}>
                <Text style={styles.sectionSubtitle}>Disponibilidade</Text>
                <View style={styles.toggleRow}>
                    <View style={styles.toggleTextWrap}>
                        <Text style={styles.toggleLabel}>Exige caução</Text>
                        <Text style={styles.toggleHint}>Reforça a segurança para o aluguel.</Text>
                    </View>
                    <Switch value={form.exige_caucao} onValueChange={(value) => onChange('exige_caucao', value)} />
                </View>

                <View style={styles.toggleRow}>
                    <View style={styles.toggleTextWrap}>
                        <Text style={styles.toggleLabel}>Entrega disponível</Text>
                        <Text style={styles.toggleHint}>Você pode entregar a ferramenta.</Text>
                    </View>
                    <Switch value={form.entrega} onValueChange={(value) => onChange('entrega', value)} />
                </View>

                <View style={styles.toggleRow}>
                    <View style={styles.toggleTextWrap}>
                        <Text style={styles.toggleLabel}>Disponível para aluguel</Text>
                        <Text style={styles.toggleHint}>Anúncio visível para outros usuários.</Text>
                    </View>
                    <Switch value={form.disponibilidade} onValueChange={(value) => onChange('disponibilidade', value)} />
                </View>
            </View>

            <View style={styles.editActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={onSave} activeOpacity={0.8} disabled={saving}>
                    <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar alterações'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function ToolDetailsView({
    params,
    price,
    period,
    cancellationMeaning,
}: {
    params: ToolDetailParams;
    price: number;
    period: number;
    cancellationMeaning: Record<string, string>;
}) {
    const infoRows = [
        ['Categoria', params.categoria_nome || 'Não informado'],
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
        <>
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
        </>
    );
}

export default function FerramentaDetalhes() {
    const router = useRouter();
    const params = useLocalSearchParams<ToolDetailParams>();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isOwner, setIsOwner] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        nome: params.nome ?? '',
        marca: params.marca ?? '',
        modelo: params.modelo ?? '',
        estado_conservacao: params.estado_conservacao ?? '',
        descricao: params.descricao ?? '',
        itens_inclusos: params.itens_inclusos ?? '',
        preco_diaria: params.preco_diaria ?? '0',
        preco_semanal: params.preco_semanal ?? '0',
        periodo_minimo: params.periodo_minimo ?? '1',
        exige_caucao: params.exige_caucao === 'true',
        entrega: params.entrega === 'true',
        disponibilidade: params.disponibilidade !== 'false',
        politica_cancelamento: params.politica_cancelamento ?? 'Flexível',
    });

    useEffect(() => {
        const checkOwner = async () => {
            const session = await getSession();
            setIsOwner(Boolean(session?.usuarioId) && String(session?.usuarioId) === String(params.usuario_id));
        };

        void checkOwner();
    }, [params.usuario_id]);

    useEffect(() => {
        const nextForm = {
            nome: params.nome ?? '',
            marca: params.marca ?? '',
            modelo: params.modelo ?? '',
            estado_conservacao: params.estado_conservacao ?? '',
            descricao: params.descricao ?? '',
            itens_inclusos: params.itens_inclusos ?? '',
            preco_diaria: params.preco_diaria ?? '0',
            preco_semanal: params.preco_semanal ?? '0',
            periodo_minimo: params.periodo_minimo ?? '1',
            exige_caucao: params.exige_caucao === 'true',
            entrega: params.entrega === 'true',
            disponibilidade: params.disponibilidade !== 'false',
            politica_cancelamento: params.politica_cancelamento ?? 'Flexível',
        };

        setForm((current) => {
            const isSame =
                current.nome === nextForm.nome &&
                current.marca === nextForm.marca &&
                current.modelo === nextForm.modelo &&
                current.estado_conservacao === nextForm.estado_conservacao &&
                current.descricao === nextForm.descricao &&
                current.itens_inclusos === nextForm.itens_inclusos &&
                current.preco_diaria === nextForm.preco_diaria &&
                current.preco_semanal === nextForm.preco_semanal &&
                current.periodo_minimo === nextForm.periodo_minimo &&
                current.exige_caucao === nextForm.exige_caucao &&
                current.entrega === nextForm.entrega &&
                current.disponibilidade === nextForm.disponibilidade &&
                current.politica_cancelamento === nextForm.politica_cancelamento;

            return isSame ? current : nextForm;
        });
    }, [
        params.nome,
        params.marca,
        params.modelo,
        params.estado_conservacao,
        params.descricao,
        params.itens_inclusos,
        params.preco_diaria,
        params.preco_semanal,
        params.periodo_minimo,
        params.exige_caucao,
        params.entrega,
        params.disponibilidade,
        params.politica_cancelamento,
    ]);

    const fotoUrls = (() => {
        if (!params.fotos) {
            return [] as string[];
        }

        try {
            const parsed = JSON.parse(params.fotos) as string[] | string;
            const values = Array.isArray(parsed)
                ? parsed
                : String(parsed)
                    .split('|')
                    .map((value) => value.trim());

            return values.filter((value): value is string => Boolean(value) && !value.startsWith('blob:') && value.startsWith('http'));
        } catch {
            return String(params.fotos)
                .split('|')
                .map((value) => value.trim())
                .filter((value): value is string => Boolean(value) && !value.startsWith('blob:') && value.startsWith('http'));
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

    const handleDelete = () => {
        const ferramentaId = Number(params.id ?? 0);
        if (!ferramentaId) {
            return;
        }

        Alert.alert('Excluir anúncio', 'Tem certeza que deseja excluir este anúncio?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await excluirFerramenta(ferramentaId);
                        Alert.alert('Anúncio excluído', 'O anúncio foi removido com sucesso.');
                        router.replace({ pathname: '/meus-anuncios', params: { usuarioId: params.usuario_id } } as Href);
                    } catch (error) {
                        Alert.alert('Erro ao excluir', error instanceof Error ? error.message : 'Não foi possível excluir o anúncio.');
                    }
                },
            },
        ]);
    };

    const handleSaveEdit = async () => {
        const ferramentaId = Number(params.id ?? 0);
        if (!ferramentaId) {
            return;
        }

        const precoDiaria = Number(form.preco_diaria.replace(',', '.'));
        const precoSemanal = Number(form.preco_semanal.replace(',', '.'));
        const periodoMinimo = Number(form.periodo_minimo);

        if (!form.nome.trim() || !form.descricao.trim()) {
            Alert.alert('Dados incompletos', 'Preencha título e descrição para continuar.');
            return;
        }

        if (precoDiaria <= 0) {
            Alert.alert('Valor inválido', 'A diária precisa ser maior que zero.');
            return;
        }

        setSaving(true);

        try {
            const updated = await atualizarFerramenta(ferramentaId, {
                nome: form.nome.trim(),
                marca: form.marca.trim(),
                modelo: form.modelo.trim(),
                estado_conservacao: form.estado_conservacao.trim(),
                descricao: form.descricao.trim(),
                itens_inclusos: form.itens_inclusos.trim(),
                preco_diaria: precoDiaria,
                preco_semanal: precoSemanal,
                periodo_minimo: periodoMinimo || 1,
                exige_caucao: form.exige_caucao,
                politica_cancelamento: form.politica_cancelamento,
                entrega: form.entrega,
                disponibilidade: form.disponibilidade,
            });

            Alert.alert('Anúncio atualizado', 'As alterações foram salvas com sucesso.');
            setIsEditing(false);
            router.setParams({
                nome: updated.nome,
                marca: updated.marca,
                modelo: updated.modelo,
                estado_conservacao: updated.estado_conservacao,
                descricao: updated.descricao,
                itens_inclusos: updated.itens_inclusos,
                preco_diaria: String(updated.preco_diaria),
                preco_semanal: String(updated.preco_semanal),
                periodo_minimo: String(updated.periodo_minimo),
                exige_caucao: String(updated.exige_caucao),
                politica_cancelamento: updated.politica_cancelamento,
                entrega: String(updated.entrega),
                disponibilidade: String(updated.disponibilidade),
            });
        } catch (error) {
            Alert.alert('Erro ao salvar', error instanceof Error ? error.message : 'Não foi possível atualizar o anúncio.');
        } finally {
            setSaving(false);
        }
    };

    const handleFieldChange = (field: keyof FormValues, value: string | boolean) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

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

                <ToolImageGallery
                    fotoUrls={fotoUrls}
                    selectedImageIndex={selectedImageIndex}
                    onSelect={setSelectedImageIndex}
                    onNext={goToNextImage}
                    onPrevious={goToPreviousImage}
                />

                <OwnerActionButtons
                    isOwner={isOwner}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onDelete={handleDelete}
                />

                {isEditing ? (
                    <EditToolForm
                        form={form}
                        params={params}
                        saving={saving}
                        onChange={handleFieldChange}
                        onCancel={() => setIsEditing(false)}
                        onSave={() => void handleSaveEdit()}
                    />
                ) : (
                    <ToolDetailsView
                        params={params}
                        price={price}
                        period={period}
                        cancellationMeaning={cancellationMeaning}
                    />
                )}
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
    ownerActions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
        marginTop: 18,
    },
    editButton: {
        alignItems: 'center',
        backgroundColor: '#E85D04',
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    editButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    deleteButton: {
        alignItems: 'center',
        backgroundColor: '#B42318',
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    editCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E6EAF0',
        borderRadius: 18,
        borderWidth: 1,
        marginBottom: 18,
        marginTop: 18,
        overflow: 'hidden',
        padding: 0,
    },
    editHeader: {
        alignItems: 'center',
        backgroundColor: '#FFF5EE',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    pillInfo: {
        backgroundColor: '#FDE7D8',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    pillInfoText: {
        color: '#C75A00',
        fontSize: 10,
        fontWeight: '700',
    },
    formSection: {
        borderTopColor: '#EEF2F7',
        borderTopWidth: 1,
        padding: 16,
    },
    sectionSubtitle: {
        color: '#1F3D4A',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 12,
    },
    inputGroup: {
        marginBottom: 12,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    inputHalf: {
        flex: 1,
    },
    fieldLabel: {
        color: '#475467',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderColor: '#D5DCE3',
        borderRadius: 12,
        borderWidth: 1,
        color: '#1F3D4A',
        fontSize: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    inputReadOnly: {
        backgroundColor: '#F3F4F6',
        color: '#52606D',
    },
    textArea: {
        minHeight: 110,
        textAlignVertical: 'top',
    },
    toggleRow: {
        alignItems: 'center',
        borderColor: '#EEF2F7',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        marginTop: 16,
    },
    toggleTextWrap: {
        flex: 1,
        paddingRight: 12,
    },
    toggleLabel: {
        color: '#1F3D4A',
        fontSize: 14,
        fontWeight: '600',
    },
    toggleHint: {
        color: '#6B7280',
        fontSize: 11,
        marginTop: 4,
    },
    editActions: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        paddingTop: 8,
    },
    cancelButton: {
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        flex: 1,
        paddingVertical: 12,
    },
    cancelButtonText: {
        color: '#1F3D4A',
        fontSize: 13,
        fontWeight: '700',
    },
    saveButton: {
        alignItems: 'center',
        backgroundColor: '#E85D04',
        borderRadius: 12,
        flex: 1,
        paddingVertical: 12,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
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
