import AdDetailsForm, { type ConservationState } from '@/components/anuncio/AdDetailsForm';
import { goBackOrHome } from '@/utils/navigation';
import CabecalhoDoPasso from '@/shared/components/CabecalhoDoPasso';
import { tokens } from '@/shared/theme/tokens';
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
                <CabecalhoDoPasso
                    title="Detalhes da ferramenta"
                    currentStep={2}
                    totalSteps={6}
                    onBack={() => goBackOrHome(router, { usuarioId })}
                />

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
                    accessibilityRole="button"
                    accessibilityLabel="Continuar para adicionar fotos"
                >
                    <Text style={styles.continueButtonText}>CONTINUAR</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color={tokens.colors.onAction} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: tokens.colors.background,
        flex: 1,
    },
    content: {
        paddingBottom: tokens.spacing.lg + tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.lg,
        paddingTop: tokens.spacing.md,
    },
    instruction: {
        color: tokens.colors.supportingText,
        fontSize: 15,
        marginBottom: tokens.spacing.md,
    },
    continueButton: {
        alignItems: 'center',
        backgroundColor: tokens.colors.action,
        borderRadius: tokens.radii.lg,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: tokens.spacing.lg,
        minHeight: 52,
    },
    continueButtonText: {
        color: tokens.colors.onAction,
        fontSize: 13,
        fontWeight: '700',
        marginRight: tokens.spacing.sm,
    },
});