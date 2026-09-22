import LocationForm from '@/components/anuncio/LocationForm';
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
                        onPress={() => router.back()}
                        activeOpacity={0.75}
                        accessibilityLabel="Voltar"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#1F3D4A" />
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
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F7FA',
        flex: 1,
    },
    content: {
        paddingBottom: 32,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 24,
    },
    backButton: {
        alignItems: 'center',
        height: 44,
        justifyContent: 'center',
        marginRight: 12,
        width: 44,
    },
    headerCopy: {
        flex: 1,
    },
    eyebrow: {
        color: '#E85D04',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 6,
    },
    title: {
        color: '#1F3D4A',
        fontSize: 23,
        fontWeight: 'bold',
    },
    stepBadge: {
        alignItems: 'center',
        backgroundColor: '#FFF1E8',
        borderRadius: 16,
        height: 40,
        justifyContent: 'center',
        width: 40,
    },
    stepText: {
        color: '#E85D04',
        fontSize: 12,
        fontWeight: '700',
    },
    progressRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 28,
    },
    completedProgress: {
        backgroundColor: '#E85D04',
        borderRadius: 4,
        flex: 1,
        height: 5,
    },
    activeProgress: {
        backgroundColor: '#E85D04',
        borderRadius: 4,
        flex: 1,
        height: 5,
    },
    progress: {
        backgroundColor: '#D5DCE3',
        borderRadius: 4,
        flex: 1,
        height: 5,
    },
    instruction: {
        color: '#6B7280',
        fontSize: 15,
        marginBottom: 20,
    },
    continueButton: {
        alignItems: 'center',
        backgroundColor: '#E85D04',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 28,
        minHeight: 52,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
        marginRight: 10,
    },
});