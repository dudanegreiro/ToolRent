import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    { label: 'Flexível', description: 'Reembolso até 24h antes' },
    { label: 'Moderada', description: 'Reembolso até 3 dias antes' },
    { label: 'Rigorosa', description: 'Sem reembolso após reserva' },
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
                            placeholderTextColor="#9AA3AD"
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
                            placeholderTextColor="#9AA3AD"
                        />
                    </View>
                    <Text style={styles.helper}>10% de desconto</Text>
                </View>
            </View>

            <View style={styles.estimateCard}>
                <View style={styles.estimateIcon}>
                    <MaterialCommunityIcons name="chart-line" size={22} color="#FFB067" />
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
                    trackColor={{ false: '#D5DCE3', true: '#F6A36B' }}
                    thumbColor={depositEnabled ? '#E85D04' : '#FFFFFF'}
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
        gap: 22,
    },
    priceRow: {
        flexDirection: 'row',
        gap: 12,
    },
    priceField: {
        flex: 1,
        gap: 8,
    },
    label: {
        color: '#1F3D4A',
        fontSize: 14,
        fontWeight: '700',
    },
    currencyInput: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#D5DCE3',
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        height: 52,
        paddingLeft: 14,
    },
    currency: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '700',
    },
    input: {
        color: '#1F3D4A',
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 8,
    },
    calculatedInput: {
        color: '#6B7280',
    },
    helper: {
        color: '#6B7280',
        fontSize: 11,
    },
    estimateCard: {
        alignItems: 'center',
        backgroundColor: '#1F2933',
        borderRadius: 14,
        flexDirection: 'row',
        padding: 18,
    },
    estimateIcon: {
        alignItems: 'center',
        backgroundColor: '#4A3324',
        borderRadius: 10,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    estimateCopy: {
        flex: 1,
        marginLeft: 12,
    },
    estimateLabel: {
        color: '#D5DCE3',
        fontSize: 13,
    },
    estimateValue: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
        marginTop: 4,
    },
    estimateHint: {
        color: '#AEB7BF',
        fontSize: 11,
        marginTop: 3,
    },
    section: {
        gap: 10,
    },
    optionsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    periodOption: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#D5DCE3',
        borderRadius: 10,
        borderWidth: 1,
        flex: 1,
        paddingVertical: 12,
    },
    selectedOption: {
        backgroundColor: '#FFF1E8',
        borderColor: '#E85D04',
        borderWidth: 2,
    },
    optionValue: {
        color: '#1F3D4A',
        fontSize: 17,
        fontWeight: '700',
    },
    optionLabel: {
        color: '#6B7280',
        fontSize: 12,
        marginTop: 2,
    },
    selectedText: {
        color: '#E85D04',
    },
    switchRow: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#D5DCE3',
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    switchCopy: {
        flex: 1,
    },
    switchHint: {
        color: '#6B7280',
        fontSize: 12,
        marginTop: 4,
    },
    policyList: {
        gap: 8,
    },
    policyCard: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#D5DCE3',
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        padding: 13,
    },
    selectedPolicy: {
        backgroundColor: '#FFF1E8',
        borderColor: '#E85D04',
    },
    radio: {
        alignItems: 'center',
        borderColor: '#9AA3AD',
        borderRadius: 10,
        borderWidth: 1,
        height: 20,
        justifyContent: 'center',
        width: 20,
    },
    selectedRadio: {
        borderColor: '#E85D04',
    },
    radioDot: {
        backgroundColor: '#E85D04',
        borderRadius: 5,
        height: 10,
        width: 10,
    },
    policyCopy: {
        marginLeft: 11,
    },
    policyLabel: {
        color: '#1F3D4A',
        fontSize: 14,
        fontWeight: '700',
    },
    policyDescription: {
        color: '#6B7280',
        fontSize: 12,
        marginTop: 3,
    },
});