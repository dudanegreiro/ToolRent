import { goBackOrHome } from '@/utils/navigation';
import { tokens } from '@/shared/theme/tokens';
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
                        onPress={() => goBackOrHome(router, { usuarioId: params.usuarioId })}
                        activeOpacity={0.75}
                        accessibilityLabel="Voltar"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color={tokens.colors.text} />
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
                                    <MaterialCommunityIcons name="camera-plus-outline" size={30} color={tokens.colors.action} />
                                    <Text style={styles.addPhotoText}>Adicionar</Text>
                                </>
                            )}
                            {photo.id === 0 && <Text style={styles.coverBadge}>Capa</Text>}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.tipsBox}>
                    <MaterialCommunityIcons name="lightbulb-outline" size={23} color={tokens.colors.action} />
                    <View style={styles.tipsCopy}>
                        <Text style={styles.tipsTitle}>Boas práticas</Text>
                        <Text style={styles.tip}>• Fotografe em um local bem iluminado.</Text>
                        <Text style={styles.tip}>• Mostre a ferramenta por diferentes ângulos.</Text>
                        <Text style={styles.tip}>• Evite fotos tremidas ou com muitos objetos ao fundo.</Text>
                    </View>
                </View>

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
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    photoCard: {
        alignItems: 'center',
        aspectRatio: 1,
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        width: '31%',
        marginBottom: tokens.spacing.md,
    },
    photo: {
        height: '100%',
        width: '100%',
    },
    addPhotoText: {
        color: tokens.colors.action,
        fontSize: 12,
        fontWeight: '700',
        marginTop: tokens.spacing.xs,
    },
    coverBadge: {
        backgroundColor: tokens.colors.action,
        borderBottomRightRadius: 8,
        color: tokens.colors.onAction,
        fontSize: 11,
        fontWeight: '700',
        left: 0,
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.xs,
        position: 'absolute',
        top: 0,
    },
    tipsBox: {
        backgroundColor: tokens.colors.subtleSurface,
        borderRadius: tokens.radii.lg,
        flexDirection: 'row',
        marginTop: tokens.spacing.lg,
        padding: tokens.spacing.md,
    },
    tipsCopy: {
        flex: 1,
        marginLeft: tokens.spacing.sm,
    },
    tipsTitle: {
        color: tokens.colors.text,
        fontSize: 14,
        fontWeight: '700',
        marginBottom: tokens.spacing.xs,
    },
    tip: {
        color: tokens.colors.supportingText,
        fontSize: 12,
        lineHeight: 19,
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