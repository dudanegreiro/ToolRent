import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { tokens } from '@/shared/theme/tokens';

export type ConservationState = 'Novo' | 'Excelente' | 'Bom' | 'Usado';

type AdDetailsFormProps = {
    title: string;
    brand: string;
    model: string;
    conservation: ConservationState | null;
    description: string;
    includedItems: string;
    onTitleChange: (value: string) => void;
    onBrandChange: (value: string) => void;
    onModelChange: (value: string) => void;
    onConservationChange: (value: ConservationState) => void;
    onDescriptionChange: (value: string) => void;
    onIncludedItemsChange: (value: string) => void;
};

const conservationOptions: Array<{ label: ConservationState; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = [
    { label: 'Novo', icon: 'star-outline' },
    { label: 'Excelente', icon: 'thumb-up-outline' },
    { label: 'Bom', icon: 'check-circle-outline' },
    { label: 'Usado', icon: 'history' },
];

export default function AdDetailsForm({
    title,
    brand,
    model,
    conservation,
    description,
    includedItems,
    onTitleChange,
    onBrandChange,
    onModelChange,
    onConservationChange,
    onDescriptionChange,
    onIncludedItemsChange,
}: AdDetailsFormProps) {
    return (
        <View style={styles.form}>
            <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>Título</Text>
                    <Text style={styles.counter}>{title.length}/80</Text>
                </View>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={onTitleChange}
                    maxLength={80}
                    placeholder="Ex.: Furadeira de impacto"
                    placeholderTextColor={tokens.colors.placeholderText}
                />
            </View>

            <View style={styles.row}>
                <View style={styles.halfField}>
                    <Text style={styles.label}>Marca</Text>
                    <TextInput
                        style={styles.input}
                        value={brand}
                        onChangeText={onBrandChange}
                        placeholder="Ex.: Bosch"
                        placeholderTextColor={tokens.colors.placeholderText}
                    />
                </View>
                <View style={styles.halfField}>
                    <Text style={styles.label}>Modelo</Text>
                    <TextInput
                        style={styles.input}
                        value={model}
                        onChangeText={onModelChange}
                        placeholder="Ex.: GSB 13 RE"
                        placeholderTextColor={tokens.colors.placeholderText}
                    />
                </View>
            </View>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Estado de conservação</Text>
                <View style={styles.conservationGrid}>
                    {conservationOptions.map((option) => {
                        const isSelected = conservation === option.label;

                        return (
                            <TouchableOpacity
                                key={option.label}
                                style={[styles.conservationCard, isSelected && styles.selectedCard]}
                                onPress={() => onConservationChange(option.label)}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons
                                    name={option.icon}
                                    size={22}
                                    color={isSelected ? tokens.colors.action : tokens.colors.supportingText}
                                />
                                <Text style={[styles.conservationText, isSelected && styles.selectedText]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>Descrição</Text>
                    <Text style={styles.counter}>{description.length}/500</Text>
                </View>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={onDescriptionChange}
                    maxLength={500}
                    multiline
                    textAlignVertical="top"
                    placeholder="Conte os detalhes importantes da ferramenta"
                    placeholderTextColor={tokens.colors.placeholderText}
                />
            </View>

            <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>Itens inclusos</Text>
                    <Text style={styles.optional}>Opcional</Text>
                </View>
                <TextInput
                    style={[styles.input, styles.textAreaSmall]}
                    value={includedItems}
                    onChangeText={onIncludedItemsChange}
                    placeholder="Ex.: maleta, brocas e manual"
                    placeholderTextColor={tokens.colors.placeholderText}
                    multiline
                    textAlignVertical="top"
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        gap: tokens.spacing.md,
    },
    fieldGroup: {
        gap: tokens.spacing.sm,
    },
    labelRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        color: tokens.colors.text,
        fontSize: 14,
        fontWeight: '700',
    },
    counter: {
        color: tokens.colors.secondaryText,
        fontSize: 12,
    },
    optional: {
        color: tokens.colors.secondaryText,
        fontSize: 12,
    },
    input: {
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        color: tokens.colors.text,
        fontSize: 15,
        minHeight: 50,
        paddingHorizontal: tokens.spacing.md,
    },
    row: {
        flexDirection: 'row',
        gap: tokens.spacing.md,
    },
    halfField: {
        flex: 1,
        gap: tokens.spacing.sm,
    },
    conservationGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: tokens.spacing.sm,
    },
    conservationCard: {
        alignItems: 'center',
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        flex: 1,
        gap: tokens.spacing.xs,
        minWidth: '46%',
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.md,
    },
    selectedCard: {
        backgroundColor: tokens.colors.subtleSurface,
        borderColor: tokens.colors.action,
        borderWidth: 2,
    },
    conservationText: {
        color: tokens.colors.supportingText,
        fontSize: 13,
        fontWeight: '600',
    },
    selectedText: {
        color: tokens.colors.action,
    },
    textArea: {
        minHeight: 120,
        paddingTop: tokens.spacing.md,
    },
    textAreaSmall: {
        minHeight: 82,
        paddingTop: tokens.spacing.md,
    },
});