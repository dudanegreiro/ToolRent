import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Photo = {
    id: number;
    uri: string | null;
};

const initialPhotos: Photo[] = Array.from({ length: 6 }, (_, index) => ({
    id: index,
    uri: null,
}));

export default function AnuncioFotos() {
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
    }>();
    const [photos, setPhotos] = useState(initialPhotos);

    const addPhoto = async (photoId: number) => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert('Permissão necessária', 'Permita o acesso às fotos para adicionar imagens.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setPhotos((currentPhotos) => currentPhotos.map((photo) => (
                photo.id === photoId ? { ...photo, uri: result.assets[0].uri } : photo
            )));
        }
    };

    const handleContinue = () => {
        if (!photos.some((photo) => photo.uri)) {
            Alert.alert('Adicione uma foto', 'Inclua pelo menos uma foto para continuar.');
            return;
        }

        router.push({
            pathname: '/anuncio-preco',
            params: {
                ...params,
                capaUri: photos[0].uri ?? undefined,
                fotos: photos
                    .map((photo) => photo.uri)
                    .filter((uri): uri is string => Boolean(uri))
                    .join('|'),
            },
        } as Href);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
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
                        <Text style={styles.title}>Fotos da ferramenta</Text>
                    </View>
                    <View style={styles.stepBadge}>
                        <Text style={styles.stepText}>3/6</Text>
                    </View>
                </View>

                <View style={styles.progressRow}>
                    <View style={styles.completedProgress} />
                    <View style={styles.completedProgress} />
                    <View style={styles.activeProgress} />
                    <View style={styles.progress} />
                    <View style={styles.progress} />
                    <View style={styles.progress} />
                </View>

                <Text style={styles.instruction}>Adicione até 6 fotos claras e bem iluminadas.</Text>

                <View style={styles.photoGrid}>
                    {photos.map((photo) => (
                        <TouchableOpacity
                            key={photo.id}
                            style={styles.photoCard}
                            onPress={() => void addPhoto(photo.id)}
                            activeOpacity={0.8}
                        >
                            {photo.uri ? (
                                <Image source={{ uri: photo.uri }} style={styles.photo} />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="camera-plus-outline" size={30} color="#E85D04" />
                                    <Text style={styles.addPhotoText}>Adicionar</Text>
                                </>
                            )}
                            {photo.id === 0 && <Text style={styles.coverBadge}>Capa</Text>}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.tipsBox}>
                    <MaterialCommunityIcons name="lightbulb-outline" size={23} color="#E85D04" />
                    <View style={styles.tipsCopy}>
                        <Text style={styles.tipsTitle}>Boas práticas</Text>
                        <Text style={styles.tip}>• Fotografe em um local bem iluminado.</Text>
                        <Text style={styles.tip}>• Mostre a ferramenta por diferentes ângulos.</Text>
                        <Text style={styles.tip}>• Evite fotos tremidas ou com muitos objetos ao fundo.</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
                    <Text style={styles.continueButtonText}>CONTINUAR</Text>
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
        marginBottom: 18,
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    photoCard: {
        alignItems: 'center',
        aspectRatio: 1,
        backgroundColor: '#FFFFFF',
        borderColor: '#D5DCE3',
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        width: '31%',
        marginBottom: 12,
    },
    photo: {
        height: '100%',
        width: '100%',
    },
    addPhotoText: {
        color: '#E85D04',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 6,
    },
    coverBadge: {
        backgroundColor: '#E85D04',
        borderBottomRightRadius: 8,
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
        left: 0,
        paddingHorizontal: 8,
        paddingVertical: 5,
        position: 'absolute',
        top: 0,
    },
    tipsBox: {
        backgroundColor: '#FFF1E8',
        borderRadius: 12,
        flexDirection: 'row',
        marginTop: 24,
        padding: 14,
    },
    tipsCopy: {
        flex: 1,
        marginLeft: 10,
    },
    tipsTitle: {
        color: '#1F3D4A',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 6,
    },
    tip: {
        color: '#6B7280',
        fontSize: 12,
        lineHeight: 19,
    },
    continueButton: {
        alignItems: 'center',
        backgroundColor: '#E85D04',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        minHeight: 52,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
        marginRight: 10,
    },
});