import CategorySelection from '@/components/anuncio/CategorySelection';
import { listarCategorias, type Categoria } from '@/services/api';
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
                        <Text style={styles.title}>O que você vai anunciar?</Text>
                    </View>
                    <View style={styles.logo}>
                        <MaterialCommunityIcons name="wrench-outline" size={20} color="#FFFFFF" />
                    </View>
                </View>

                <View style={styles.progressRow}>
                    <View style={styles.activeProgress} />
                    <View style={styles.progress} />
                    <View style={styles.progress} />
                    <View style={styles.progress} />
                </View>

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
                    >
                        {selectedCategoryId === null ? (
                            <Text style={styles.disabledButtonText}>SELECIONE UMA CATEGORIA</Text>
                        ) : (
                            <>
                                <Text style={styles.continueButtonText}>CONTINUAR</Text>
                                <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
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
    logo: {
        alignItems: 'center',
        backgroundColor: '#E85D04',
        borderRadius: 10,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    progressRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 28,
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
        marginBottom: 16,
    },
    continueButton: {
        alignItems: 'center',
        backgroundColor: '#E85D04',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        minHeight: 52,
        paddingHorizontal: 20,
    },
    disabledButton: {
        backgroundColor: '#D5DCE3',
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
        marginRight: 10,
    },
    disabledButtonText: {
        color: '#6B7280',
        fontSize: 13,
        fontWeight: '700',
    },
});