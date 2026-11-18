import LocationForm from '@/components/anuncio/LocationForm';
import { goBackOrHome } from '@/utils/navigation';
import { tokens } from '@/shared/theme/tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AnuncioLocalizacao() {
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
        diaria?: string;
        periodoMinimo?: string;
        caucao?: string;
        cancelamento?: string;
    }>();
    const [address, setAddress] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [deliveryEnabled, setDeliveryEnabled] = useState(false);
    const pinScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pinScale, { toValue: 1.12, duration: 900, useNativeDriver: true }),
                Animated.timing(pinScale, { toValue: 1, duration: 900, useNativeDriver: true }),
            ]),
        );

        animation.start();
        return () => animation.stop();
    }, [pinScale]);

    const handleContinue = () => {
        if (!address.trim() || !neighborhood.trim() || !city.trim()) {
            Alert.alert('Campos obrigatórios', 'Preencha endereço, bairro e cidade para continuar.');
            return;
        }

        router.push({
            pathname: '/anuncio-revisao',
            params: {
                ...params,
                endereco: address.trim(),
                bairro: neighborhood.trim(),
                cidade: city.trim(),
                entrega: String(deliveryEnabled),
            },
        } as Href);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => goBackOrHome(router, { usuarioId: params.usuarioId })}
                        activeOpacity={0.75}
                        accessibilityLabel="Voltar"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color={tokens.colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerCopy}>
                        <Text style={styles.eyebrow}>NOVO ANÚNCIO</Text>
                        <Text style={styles.title}>Onde está sua ferramenta?</Text>
                    </View>
                    <View style={styles.stepBadge}>
                        <Text style={styles.stepText}>5/6</Text>
                    </View>
                </View>

                <View style={styles.progressRow}>
                    <View style={styles.completedProgress} />
                    <View style={styles.completedProgress} />
                    <View style={styles.completedProgress} />
                    <View style={styles.completedProgress} />
                    <View style={styles.activeProgress} />
                    <View style={styles.progress} />
                </View>

                <Text style={styles.instruction}>Informe o local para facilitar a retirada e a entrega.</Text>

                <LocationForm
                    address={address}
                    neighborhood={neighborhood}
                    city={city}
                    deliveryEnabled={deliveryEnabled}
                    onAddressChange={setAddress}
                    onNeighborhoodChange={setNeighborhood}
                    onCityChange={setCity}
                    onDeliveryChange={setDeliveryEnabled}
                    pinScale={pinScale}
                />

                <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                    <Text style={styles.continueButtonText}>REVISAR ANÚNCIO</Text>
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
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: tokens.spacing.lg,
    },
    backButton: {
        alignItems: 'center',
        height: 44,
        justifyContent: 'center',
        marginRight: tokens.spacing.md,
        width: 44,
    },
    headerCopy: {
        flex: 1,
    },
    eyebrow: {
        color: tokens.colors.action,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: tokens.spacing.xs,
    },
    title: {
        color: tokens.colors.text,
        fontSize: 23,
        fontWeight: 'bold',
    },
    stepBadge: {
        alignItems: 'center',
        backgroundColor: tokens.colors.subtleSurface,
        borderRadius: tokens.radii.xl,
        height: 40,
        justifyContent: 'center',
        width: 40,
    },
    stepText: {
        color: tokens.colors.action,
        fontSize: 12,
        fontWeight: '700',
    },
    progressRow: {
        flexDirection: 'row',
        gap: tokens.spacing.xs,
        marginBottom: tokens.spacing.lg,
    },
    completedProgress: {
        backgroundColor: tokens.colors.action,
        borderRadius: tokens.radii.sm,
        flex: 1,
        height: 5,
    },
    activeProgress: {
        backgroundColor: tokens.colors.action,
        borderRadius: tokens.radii.sm,
        flex: 1,
        height: 5,
    },
    progress: {
        backgroundColor: tokens.colors.border,
        borderRadius: tokens.radii.sm,
        flex: 1,
        height: 5,
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