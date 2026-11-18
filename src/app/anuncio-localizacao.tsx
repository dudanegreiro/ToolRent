import LocationForm from '@/components/anuncio/LocationForm';
import { goBackOrHome } from '@/utils/navigation';
import CabecalhoDoPasso from '@/shared/components/CabecalhoDoPasso';
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
                <CabecalhoDoPasso
                    title="Onde está sua ferramenta?"
                    currentStep={5}
                    totalSteps={6}
                    onBack={() => goBackOrHome(router, { usuarioId: params.usuarioId })}
                />

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

                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Revisar anúncio"
                >
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