import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Categoria } from '@/services/api';
import EstadoVisual from '@/shared/components/EstadoVisual';
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
        return <EstadoVisual variant="loading" message="Carregando categorias..." />;
    }

    if (error) {
        return (
            <EstadoVisual
                variant="error"
                title="Não foi possível carregar as categorias"
                message={error}
                actionLabel="TENTAR NOVAMENTE"
                onAction={onRetry}
            />
        );
    }

    if (categories.length === 0) {
        return (
            <EstadoVisual
                variant="empty"
                title="Nenhuma categoria disponível"
                message="Aguarde o cadastro de categorias para anunciar uma ferramenta."
            />
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
                        accessibilityRole="radio"
                        accessibilityLabel={`${category.nome}. ${category.descricao}`}
                        accessibilityState={{ selected: isSelected }}
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
});
