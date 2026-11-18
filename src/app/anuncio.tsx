import CategorySelection from '@/components/anuncio/CategorySelection';
import { listarCategorias, type Categoria } from '@/services/api';
import CabecalhoDoPasso from '@/shared/components/CabecalhoDoPasso';
import { goBackOrHome } from '@/utils/navigation';
import { tokens } from '@/shared/theme/tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Anuncio() {
    const router = useRouter();
    const { usuarioId } = useLocalSearchParams<{ usuarioId?: string }>();
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCategories = async () => {
        setLoading(true);
        setError(null);

        try {
            setCategories(await listarCategorias());
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : 'Tente novamente em alguns instantes.',
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadCategories();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <CabecalhoDoPasso
                    title="O que você vai anunciar?"
                    currentStep={1}
                    totalSteps={6}
                    onBack={() => goBackOrHome(router, { usuarioId })}
                />

                <Text style={styles.instruction}>Selecione uma categoria para começar.</Text>

                <CategorySelection
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    loading={loading}
                    error={error}
                    onSelect={setSelectedCategoryId}
                    onRetry={() => void loadCategories()}
                />

                {!loading && !error && categories.length > 0 && (
                    <TouchableOpacity
                        style={[styles.continueButton, selectedCategoryId === null && styles.disabledButton]}
                        disabled={selectedCategoryId === null}
                        onPress={() => router.push({
                            pathname: '/anuncio-detalhes',
                            params: {
                                categoriaId: String(selectedCategoryId),
                                categoriaNome: categories.find((category) => category.id === selectedCategoryId)?.nome,
                                usuarioId,
                            },
                        } as Href)}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={selectedCategoryId === null
                            ? 'Selecione uma categoria para continuar'
                            : 'Continuar para os detalhes'}
                        accessibilityState={{ disabled: selectedCategoryId === null }}
                    >
                        {selectedCategoryId === null ? (
                            <Text style={styles.disabledButtonText}>SELECIONE UMA CATEGORIA</Text>
                        ) : (
                            <>
                                <Text style={styles.continueButtonText}>CONTINUAR</Text>
                                <MaterialCommunityIcons name="arrow-right" size={20} color={tokens.colors.onAction} />
                            </>
                        )}
                    </TouchableOpacity>
                )}
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
        paddingHorizontal: tokens.spacing.md,
    },
    disabledButton: {
        backgroundColor: tokens.colors.border,
    },
    continueButtonText: {
        color: tokens.colors.onAction,
        fontSize: 13,
        fontWeight: '700',
        marginRight: tokens.spacing.sm,
    },
    disabledButtonText: {
        color: tokens.colors.supportingText,
        fontSize: 13,
        fontWeight: '700',
    },
});