import PriceForm, { type CancellationPolicy, type MinimumPeriod } from '@/components/anuncio/PriceForm';
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

export default function AnuncioPreco() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        categoriaId?: string;
        categoriaNome?: string;
        usuarioId?: string;
        titulo?: string;
        marca?: string;
        modelo?: string;
        conservacao?: string;
        descricao?: string;
        itensInclusos?: string;
        capaUri?: string;
        fotos?: string;
    }>();
    const [dailyPrice, setDailyPrice] = useState('');
    const [minimumPeriod, setMinimumPeriod] = useState<MinimumPeriod>(1);
    const [depositEnabled, setDepositEnabled] = useState(false);
    const [cancellationPolicy, setCancellationPolicy] = useState<CancellationPolicy>('Flexível');

    const dailyValue = Number(dailyPrice.replace(',', '.')) || 0;
    const weeklyPrice = dailyValue * 7 * 0.9;
    const monthlyEstimate = weeklyPrice * 4;

    const handleContinue = () => {
        if (dailyValue <= 0) {
            Alert.alert('Informe um valor', 'Digite uma diária maior que zero para continuar.');
            return;
        }

        router.push({
            pathname: '/anuncio-localizacao',
            params: {
                ...params,
                diaria: dailyValue.toFixed(2),
                periodoMinimo: String(minimumPeriod),
                caucao: String(depositEnabled),
                cancelamento: cancellationPolicy,
            },
        } as Href);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <CabecalhoDoPasso
                    title="Defina seu preço"
                    currentStep={4}
                    totalSteps={6}
                    onBack={() => goBackOrHome(router, { usuarioId: params.usuarioId })}
                />

                <Text style={styles.instruction}>Escolha valores justos para atrair mais locatários.</Text>

                <PriceForm
                    dailyPrice={dailyPrice}
                    weeklyPrice={weeklyPrice}
                    monthlyEstimate={monthlyEstimate}
                    minimumPeriod={minimumPeriod}
                    depositEnabled={depositEnabled}
                    cancellationPolicy={cancellationPolicy}
                    onDailyPriceChange={setDailyPrice}
                    onMinimumPeriodChange={setMinimumPeriod}
                    onDepositChange={setDepositEnabled}
                    onCancellationPolicyChange={setCancellationPolicy}
                />

                <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
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