import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { tokens } from '@/shared/theme/tokens';

export type MinimumPeriod = 1 | 3 | 7;
export type CancellationPolicy = 'Flexível' | 'Moderada' | 'Rigorosa';

type PriceFormProps = {
    dailyPrice: string;
    minimumPeriod: MinimumPeriod;
    depositEnabled: boolean;
    cancellationPolicy: CancellationPolicy;
    weeklyPrice: number;
    monthlyEstimate: number;
    onDailyPriceChange: (value: string) => void;
    onMinimumPeriodChange: (value: MinimumPeriod) => void;
    onDepositChange: (value: boolean) => void;
    onCancellationPolicyChange: (value: CancellationPolicy) => void;
};

const policies: Array<{ label: CancellationPolicy; description: string }> = [
    { label: 'Flexível', description: 'Reembolso total até 24h antes da reserva.' },
    { label: 'Moderada', description: 'Reembolso até 3 dias antes; após isso, só parcial ou crédito.' },
    { label: 'Rigorosa', description: 'Sem reembolso após a confirmação da reserva.' },
];

export default function PriceForm({
    dailyPrice,
    minimumPeriod,
    depositEnabled,
    cancellationPolicy,
    weeklyPrice,
    monthlyEstimate,
    onDailyPriceChange,
    onMinimumPeriodChange,
    onDepositChange,
    onCancellationPolicyChange,
}: PriceFormProps) {
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <View style={styles.form}>
            <View style={styles.priceRow}>
                <View style={styles.priceField}>
                    <Text style={styles.label}>Diária</Text>
                    <View style={styles.currencyInput}>
                        <Text style={styles.currency}>R$</Text>
                        <TextInput
                            style={styles.input}
                            value={dailyPrice}
                            onChangeText={onDailyPriceChange}
                            keyboardType="decimal-pad"
                            placeholder="0,00"
                            placeholderTextColor={tokens.colors.placeholderText}
                        />
                    </View>
                </View>
                <View style={styles.priceField}>
                    <Text style={styles.label}>Semanal</Text>
                    <View style={styles.currencyInput}>
                        <Text style={styles.currency}>R$</Text>
                        <TextInput
                            style={[styles.input, styles.calculatedInput]}
                            value={weeklyPrice > 0 ? weeklyPrice.toFixed(2).replace('.', ',') : ''}
                            editable={false}
                            placeholder="Calculado"
                            placeholderTextColor={tokens.colors.placeholderText}
                        />
                    </View>
                    <Text style={styles.helper}>10% de desconto</Text>
                </View>
            </View>

            <View style={styles.estimateCard}>
                <View style={styles.estimateIcon}>
                    <MaterialCommunityIcons name="chart-line" size={22} color={tokens.colors.actionHighlight} />
                </View>
                <View style={styles.estimateCopy}>
                    <Text style={styles.estimateLabel}>Estimativa de ganhos mensais</Text>
                    <Text style={styles.estimateValue}>{formatCurrency(monthlyEstimate)}</Text>
                    <Text style={styles.estimateHint}>Considerando 4 semanas de aluguel</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Período mínimo de aluguel</Text>
                <View style={styles.optionsRow}>
                    {[1, 3, 7].map((period) => (
                        <TouchableOpacity
                            key={period}
                            style={[styles.periodOption, minimumPeriod === period && styles.selectedOption]}
                            onPress={() => onMinimumPeriodChange(period as MinimumPeriod)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.optionValue, minimumPeriod === period && styles.selectedText]}>
                                {period}
                            </Text>
                            <Text style={[styles.optionLabel, minimumPeriod === period && styles.selectedText]}>
                                {period === 1 ? 'dia' : 'dias'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.switchRow}>
                <View style={styles.switchCopy}>
                    <Text style={styles.label}>Exigir caução</Text>
                    <Text style={styles.switchHint}>Solicitar um valor de segurança ao locatário</Text>
                </View>
                <Switch
                    value={depositEnabled}
                    onValueChange={onDepositChange}
                    trackColor={{ false: tokens.colors.border, true: tokens.colors.actionTrack }}
                    thumbColor={depositEnabled ? tokens.colors.action : tokens.colors.surface}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Política de cancelamento</Text>
                <View style={styles.policyList}>
                    {policies.map((policy) => {
                        const isSelected = cancellationPolicy === policy.label;

                        return (
                            <TouchableOpacity
                                key={policy.label}
                                style={[styles.policyCard, isSelected && styles.selectedPolicy]}
                                onPress={() => onCancellationPolicyChange(policy.label)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.radio, isSelected && styles.selectedRadio]}>
                                    {isSelected && <View style={styles.radioDot} />}
                                </View>
                                <View style={styles.policyCopy}>
                                    <Text style={[styles.policyLabel, isSelected && styles.selectedText]}>
                                        {policy.label}
                                    </Text>
                                    <Text style={styles.policyDescription}>{policy.description}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        gap: tokens.spacing.lg,
    },
    priceRow: {
        flexDirection: 'row',
        gap: tokens.spacing.md,
    },
    priceField: {
        flex: 1,
        gap: tokens.spacing.sm,
    },
    label: {
        color: tokens.colors.text,
        fontSize: 14,
        fontWeight: '700',
    },
    currencyInput: {
        alignItems: 'center',
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        flexDirection: 'row',
        height: 52,
        paddingLeft: tokens.spacing.md,
    },
    currency: {
        color: tokens.colors.supportingText,
        fontSize: 14,
        fontWeight: '700',
    },
    input: {
        color: tokens.colors.text,
        flex: 1,
        fontSize: 16,
        paddingHorizontal: tokens.spacing.sm,
    },
    calculatedInput: {
        color: tokens.colors.supportingText,
    },
    helper: {
        color: tokens.colors.supportingText,
        fontSize: 11,
    },
    estimateCard: {
        alignItems: 'center',
        backgroundColor: tokens.colors.estimateSurface,
        borderRadius: tokens.radii.lg,
        flexDirection: 'row',
        padding: tokens.spacing.md,
    },
    estimateIcon: {
        alignItems: 'center',
        backgroundColor: tokens.colors.estimateAccent,
        borderRadius: tokens.radii.lg,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    estimateCopy: {
        flex: 1,
        marginLeft: tokens.spacing.md,
    },
    estimateLabel: {
        color: tokens.colors.border,
        fontSize: 13,
    },
    estimateValue: {
        color: tokens.colors.onAction,
        fontSize: 24,
        fontWeight: '700',
        marginTop: tokens.spacing.xs,
    },
    estimateHint: {
        color: tokens.colors.disabledText,
        fontSize: 11,
        marginTop: tokens.spacing.xs,
    },
    section: {
        gap: tokens.spacing.sm,
    },
    optionsRow: {
        flexDirection: 'row',
        gap: tokens.spacing.sm,
    },
    periodOption: {
        alignItems: 'center',
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        flex: 1,
        paddingVertical: tokens.spacing.md,
    },
    selectedOption: {
        backgroundColor: tokens.colors.subtleSurface,
        borderColor: tokens.colors.action,
        borderWidth: 2,
    },
    optionValue: {
        color: tokens.colors.text,
        fontSize: 17,
        fontWeight: '700',
    },
    optionLabel: {
        color: tokens.colors.supportingText,
        fontSize: 12,
        marginTop: tokens.spacing.xs,
    },
    selectedText: {
        color: tokens.colors.action,
    },
    switchRow: {
        alignItems: 'center',
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        flexDirection: 'row',
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.md,
    },
    switchCopy: {
        flex: 1,
    },
    switchHint: {
        color: tokens.colors.supportingText,
        fontSize: 12,
        marginTop: tokens.spacing.xs,
    },
    policyList: {
        gap: tokens.spacing.sm,
    },
    policyCard: {
        alignItems: 'center',
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        flexDirection: 'row',
        padding: tokens.spacing.md,
    },
    selectedPolicy: {
        backgroundColor: tokens.colors.subtleSurface,
        borderColor: tokens.colors.action,
    },
    radio: {
        alignItems: 'center',
        borderColor: tokens.colors.placeholderText,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        height: 20,
        justifyContent: 'center',
        width: 20,
    },
    selectedRadio: {
        borderColor: tokens.colors.action,
    },
    radioDot: {
        backgroundColor: tokens.colors.action,
        borderRadius: tokens.radii.pill,
        height: 10,
        width: 10,
    },
    policyCopy: {
        marginLeft: tokens.spacing.sm,
    },
    policyLabel: {
        color: tokens.colors.text,
        fontSize: 14,
        fontWeight: '700',
    },
    policyDescription: {
        color: tokens.colors.supportingText,
        fontSize: 12,
        marginTop: tokens.spacing.xs,
    },
});