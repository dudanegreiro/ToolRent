import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
                    placeholderTextColor="#9AA3AD"
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
                        placeholderTextColor="#9AA3AD"
                    />
                </View>
                <View style={styles.halfField}>
                    <Text style={styles.label}>Modelo</Text>
                    <TextInput
                        style={styles.input}
                        value={model}
                        onChangeText={onModelChange}
                        placeholder="Ex.: GSB 13 RE"
                        placeholderTextColor="#9AA3AD"
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
                                    color={isSelected ? '#E85D04' : '#6B7280'}
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
                    placeholderTextColor="#9AA3AD"
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
                    placeholderTextColor="#9AA3AD"
                    multiline
                    textAlignVertical="top"
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        gap: 20,
    },
    fieldGroup: {
        gap: 8,
    },
    labelRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        color: '#1F3D4A',
        fontSize: 14,
        fontWeight: '700',
    },
    counter: {
        color: '#8A8A8A',
        fontSize: 12,
    },
    optional: {
        color: '#8A8A8A',
        fontSize: 12,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderColor: '#D5DCE3',
        borderRadius: 10,
        borderWidth: 1,
        color: '#1F3D4A',
        fontSize: 15,
        minHeight: 50,
        paddingHorizontal: 14,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfField: {
        flex: 1,
        gap: 8,
    },
    conservationGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    conservationCard: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#D5DCE3',
        borderRadius: 10,
        borderWidth: 1,
        flex: 1,
        gap: 6,
        minWidth: '46%',
        paddingHorizontal: 8,
        paddingVertical: 14,
    },
    selectedCard: {
        backgroundColor: '#FFF1E8',
        borderColor: '#E85D04',
        borderWidth: 2,
    },
    conservationText: {
        color: '#6B7280',
        fontSize: 13,
        fontWeight: '600',
    },
    selectedText: {
        color: '#E85D04',
    },
    textArea: {
        minHeight: 120,
        paddingTop: 14,
    },
    textAreaSmall: {
        minHeight: 82,
        paddingTop: 14,
    },
});