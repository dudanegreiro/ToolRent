import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Categoria } from '@/services/api';
import { tokens } from '@/shared/theme/tokens';

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
                <ActivityIndicator size="large" color={tokens.colors.action} />
                <Text style={styles.feedbackText}>Carregando categorias...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.feedbackState}>
                <MaterialCommunityIcons name="cloud-alert-outline" size={44} color={tokens.colors.action} />
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
                <MaterialCommunityIcons name="shape-outline" size={44} color={tokens.colors.action} />
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
                                color={isSelected ? tokens.colors.surface : tokens.colors.action}
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
                            color={isSelected ? tokens.colors.action : tokens.colors.secondaryText}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        gap: tokens.spacing.md,
    },
    category: {
        alignItems: 'center',
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        flexDirection: 'row',
        minHeight: 82,
        padding: tokens.spacing.md,
    },
    selectedCategory: {
        borderColor: tokens.colors.action,
        borderWidth: 2,
    },
    categoryIcon: {
        alignItems: 'center',
        backgroundColor: tokens.colors.subtleSurface,
        borderRadius: tokens.radii.lg,
        height: 48,
        justifyContent: 'center',
        width: 48,
    },
    selectedCategoryIcon: {
        backgroundColor: tokens.colors.action,
    },
    categoryContent: {
        flex: 1,
        marginHorizontal: tokens.spacing.md,
    },
    categoryName: {
        color: tokens.colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    categoryDescription: {
        color: tokens.colors.supportingText,
        fontSize: 13,
        lineHeight: 18,
        marginTop: tokens.spacing.xs,
    },
    feedbackState: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 260,
        paddingHorizontal: tokens.spacing.lg,
    },
    feedbackTitle: {
        color: tokens.colors.text,
        fontSize: 17,
        fontWeight: '700',
        marginTop: tokens.spacing.md,
        textAlign: 'center',
    },
    feedbackText: {
        color: tokens.colors.supportingText,
        fontSize: 14,
        lineHeight: 21,
        marginTop: tokens.spacing.sm,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: tokens.colors.action,
        borderRadius: tokens.radii.lg,
        marginTop: tokens.spacing.md,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.md,
    },
    retryButtonText: {
        color: tokens.colors.onAction,
        fontSize: 13,
        fontWeight: '700',
    },
});
