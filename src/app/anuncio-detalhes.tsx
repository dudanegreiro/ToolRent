import AdDetailsForm, { type ConservationState } from '@/components/anuncio/AdDetailsForm';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AnuncioDetalhes() {
    const router = useRouter();
    const { categoriaId, categoriaNome, usuarioId } = useLocalSearchParams<{
        categoriaId?: string;
        categoriaNome?: string;
        usuarioId?: string;
    }>();
    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [conservation, setConservation] = useState<ConservationState | null>(null);
    const [description, setDescription] = useState('');
    const [includedItems, setIncludedItems] = useState('');

    const handleContinue = () => {
        if (!title.trim() || !brand.trim() || !model.trim() || !conservation || !description.trim()) {
            Alert.alert('Campos obrigatórios', 'Preencha título, marca, modelo, conservação e descrição.');
            return;
        }

        if (!categoriaId || !usuarioId) {
            Alert.alert('Dados incompletos', 'Selecione uma categoria e faça login novamente.');
            return;
        }

        router.push({
            pathname: '/anuncio-fotos',
            params: {
                categoriaId,
                categoriaNome,
                usuarioId,
                titulo: title.trim(),
                marca: brand.trim(),
                modelo: model.trim(),
                conservacao: conservation,
                descricao: description.trim(),
                itensInclusos: includedItems.trim(),
            },
        } as Href);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
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
                        <Text style={styles.title}>Detalhes da ferramenta</Text>
                    </View>
                    <View style={styles.stepBadge}>
                        <Text style={styles.stepText}>2/4</Text>
                    </View>
                </View>

                <View style={styles.progressRow}>
                    <View style={styles.completedProgress} />
                    <View style={styles.activeProgress} />
                    <View style={styles.progress} />
                    <View style={styles.progress} />
                </View>

                <Text style={styles.instruction}>Apresente sua ferramenta para quem vai alugar.</Text>

                <AdDetailsForm
                    title={title}
                    brand={brand}
                    model={model}
                    conservation={conservation}
                    description={description}
                    includedItems={includedItems}
                    onTitleChange={setTitle}
                    onBrandChange={setBrand}
                    onModelChange={setModel}
                    onConservationChange={setConservation}
                    onDescriptionChange={setDescription}
                    onIncludedItemsChange={setIncludedItems}
                />

                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                >
                    <Text style={styles.continueButtonText}>CONTINUAR</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F7FA',
        flex: 1,
    },
    content: {
        paddingBottom: 32,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 24,
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
        marginBottom: 6,
    },
    title: {
        color: '#1F3D4A',
        fontSize: 23,
        fontWeight: 'bold',
    },
    stepBadge: {
        alignItems: 'center',
        backgroundColor: '#FFF1E8',
        borderRadius: 16,
        height: 40,
        justifyContent: 'center',
        width: 40,
    },
    stepText: {
        color: '#E85D04',
        fontSize: 12,
        fontWeight: '700',
    },
    progressRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 28,
    },
    completedProgress: {
        backgroundColor: '#E85D04',
        borderRadius: 4,
        flex: 1,
        height: 5,
    },
    activeProgress: {
        backgroundColor: '#E85D04',
        borderRadius: 4,
        flex: 1,
        height: 5,
    },
    progress: {
        backgroundColor: '#D5DCE3',
        borderRadius: 4,
        flex: 1,
        height: 5,
    },
    instruction: {
        color: '#6B7280',
        fontSize: 15,
        marginBottom: 20,
    },
    continueButton: {
        alignItems: 'center',
        backgroundColor: '#E85D04',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 28,
        minHeight: 52,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
        marginRight: 10,
    },
});