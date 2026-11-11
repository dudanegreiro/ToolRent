import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Categoria } from '@/services/api';

type CategorySelectionProps = {
    categories: Categoria[];
    selectedCategoryId: number | null;
    loading: boolean;
    error: string | null;
    onSelect: (categoryId: number) => void;
    onRetry: () => void;
};

export default function CategorySelection({
    categories,
    selectedCategoryId,
    loading,
    error,
    onSelect,
    onRetry,
}: CategorySelectionProps) {
    if (loading) {
        return (
            <View style={styles.feedbackState}>
                <ActivityIndicator size="large" color="#E85D04" />
                <Text style={styles.feedbackText}>Carregando categorias...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.feedbackState}>
                <MaterialCommunityIcons name="cloud-alert-outline" size={44} color="#E85D04" />
                <Text style={styles.feedbackTitle}>Não foi possível carregar as categorias</Text>
                <Text style={styles.feedbackText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
                    <Text style={styles.retryButtonText}>TENTAR NOVAMENTE</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (categories.length === 0) {
        return (
            <View style={styles.feedbackState}>
                <MaterialCommunityIcons name="shape-outline" size={44} color="#E85D04" />
                <Text style={styles.feedbackTitle}>Nenhuma categoria disponível</Text>
                <Text style={styles.feedbackText}>
                    Aguarde o cadastro de categorias para anunciar uma ferramenta.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.list}>
            {categories.map((category) => {
                const isSelected = selectedCategoryId === category.id;

                return (
                    <TouchableOpacity
                        key={category.id}
                        style={[styles.category, isSelected && styles.selectedCategory]}
                        onPress={() => onSelect(category.id)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.categoryIcon, isSelected && styles.selectedCategoryIcon]}>
                            <MaterialCommunityIcons
                                name="tools"
                                size={24}
                                color={isSelected ? '#FFFFFF' : '#E85D04'}
                            />
                        </View>
                        <View style={styles.categoryContent}>
                            <Text style={styles.categoryName}>{category.nome}</Text>
                            <Text style={styles.categoryDescription} numberOfLines={2}>
                                {category.descricao}
                            </Text>
                        </View>
                        <MaterialCommunityIcons
                            name={isSelected ? 'check-circle' : 'chevron-right'}
                            size={24}
                            color={isSelected ? '#E85D04' : '#8A8A8A'}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        gap: 12,
    },
    category: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#D5DCE3',
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        minHeight: 82,
        padding: 14,
    },
    selectedCategory: {
        borderColor: '#E85D04',
        borderWidth: 2,
    },
    categoryIcon: {
        alignItems: 'center',
        backgroundColor: '#FFF1E8',
        borderRadius: 12,
        height: 48,
        justifyContent: 'center',
        width: 48,
    },
    selectedCategoryIcon: {
        backgroundColor: '#E85D04',
    },
    categoryContent: {
        flex: 1,
        marginHorizontal: 12,
    },
    categoryName: {
        color: '#1F3D4A',
        fontSize: 16,
        fontWeight: '700',
    },
    categoryDescription: {
        color: '#6B7280',
        fontSize: 13,
        lineHeight: 18,
        marginTop: 4,
    },
    feedbackState: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 260,
        paddingHorizontal: 24,
    },
    feedbackTitle: {
        color: '#1F3D4A',
        fontSize: 17,
        fontWeight: '700',
        marginTop: 16,
        textAlign: 'center',
    },
    feedbackText: {
        color: '#6B7280',
        fontSize: 14,
        lineHeight: 21,
        marginTop: 8,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#E85D04',
        borderRadius: 10,
        marginTop: 18,
        paddingHorizontal: 18,
        paddingVertical: 13,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
});
