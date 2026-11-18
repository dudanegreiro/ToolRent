import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { tokens } from '@/shared/theme/tokens';

type LocationFormProps = {
    address: string;
    neighborhood: string;
    city: string;
    deliveryEnabled: boolean;
    onAddressChange: (value: string) => void;
    onNeighborhoodChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onDeliveryChange: (value: boolean) => void;
    pinScale: Animated.Value;
};

export default function LocationForm({
    address,
    neighborhood,
    city,
    deliveryEnabled,
    onAddressChange,
    onNeighborhoodChange,
    onCityChange,
    onDeliveryChange,
    pinScale,
}: LocationFormProps) {
    return (
        <View style={styles.form}>
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Endereço</Text>
                <View style={styles.inputWithIcon}>
                    <MaterialCommunityIcons name="map-marker-outline" size={20} color={tokens.colors.secondaryText} />
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={onAddressChange}
                        placeholder="Rua, número e complemento"
                        placeholderTextColor={tokens.colors.placeholderText}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.halfField}>
                    <Text style={styles.label}>Bairro</Text>
                    <TextInput
                        style={styles.standaloneInput}
                        value={neighborhood}
                        onChangeText={onNeighborhoodChange}
                        placeholder="Ex.: Centro"
                        placeholderTextColor={tokens.colors.placeholderText}
                    />
                </View>
                <View style={styles.halfField}>
                    <Text style={styles.label}>Cidade</Text>
                    <TextInput
                        style={styles.standaloneInput}
                        value={city}
                        onChangeText={onCityChange}
                        placeholder="Ex.: São Paulo"
                        placeholderTextColor={tokens.colors.placeholderText}
                    />
                </View>
            </View>

            <View style={styles.mapCard}>
                <View style={styles.mapPattern}>
                    <View style={styles.mapRoadOne} />
                    <View style={styles.mapRoadTwo} />
                    <View style={styles.mapRoadThree} />
                    <View style={styles.pinShadow} />
                    <Animated.View style={[styles.pin, { transform: [{ scale: pinScale }] }]}>
                        <MaterialCommunityIcons name="map-marker" size={30} color={tokens.colors.onAction} />
                    </Animated.View>
                </View>
                <View style={styles.mapCaption}>
                    <MaterialCommunityIcons name="information-outline" size={18} color={tokens.colors.action} />
                    <Text style={styles.mapCaptionText}>O mapa ajuda locatários a encontrarem sua ferramenta.</Text>
                </View>
            </View>

            <View style={[styles.deliveryCard, deliveryEnabled && styles.deliveryEnabled]}>
                <View style={[styles.deliveryIcon, deliveryEnabled && styles.deliveryIconEnabled]}>
                    <MaterialCommunityIcons
                        name={deliveryEnabled ? 'truck-check-outline' : 'truck-outline'}
                        size={23}
                        color={deliveryEnabled ? tokens.colors.surface : tokens.colors.action}
                    />
                </View>
                <View style={styles.deliveryCopy}>
                    <Text style={styles.deliveryTitle}>Ofereço entrega</Text>
                    <Text style={styles.deliveryHint}>
                        {deliveryEnabled
                            ? 'Ótimo! A entrega pode aumentar suas chances de aluguel.'
                            : 'Ative para oferecer entrega aos locatários.'}
                    </Text>
                </View>
                <Switch
                    value={deliveryEnabled}
                    onValueChange={onDeliveryChange}
                    trackColor={{ false: tokens.colors.border, true: tokens.colors.actionTrack }}
                    thumbColor={deliveryEnabled ? tokens.colors.action : tokens.colors.surface}
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
    label: {
        color: tokens.colors.text,
        fontSize: 14,
        fontWeight: '700',
    },
    inputWithIcon: {
        alignItems: 'center',
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        flexDirection: 'row',
        minHeight: 52,
        paddingHorizontal: tokens.spacing.md,
    },
    input: {
        color: tokens.colors.text,
        flex: 1,
        fontSize: 15,
        marginLeft: tokens.spacing.sm,
    },
    standaloneInput: {
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        color: tokens.colors.text,
        fontSize: 15,
        minHeight: 52,
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
    mapCard: {
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    mapPattern: {
        backgroundColor: tokens.colors.mapSurface,
        height: 180,
        overflow: 'hidden',
        position: 'relative',
    },
    mapRoadOne: {
        backgroundColor: tokens.colors.surface,
        height: 18,
        left: -20,
        position: 'absolute',
        top: 64,
        transform: [{ rotate: '19deg' }],
        width: '120%',
    },
    mapRoadTwo: {
        backgroundColor: tokens.colors.surface,
        height: 13,
        left: -25,
        position: 'absolute',
        top: 120,
        transform: [{ rotate: '-28deg' }],
        width: '120%',
    },
    mapRoadThree: {
        backgroundColor: tokens.colors.mapRoad,
        height: 7,
        left: -15,
        position: 'absolute',
        top: 30,
        transform: [{ rotate: '-45deg' }],
        width: '115%',
    },
    pinShadow: {
        backgroundColor: tokens.colors.actionShadow,
        borderRadius: tokens.radii.pill,
        height: 64,
        left: '50%',
        marginLeft: -32,
        marginTop: -32,
        position: 'absolute',
        top: '50%',
        width: 64,
    },
    pin: {
        alignItems: 'center',
        backgroundColor: tokens.colors.action,
        borderRadius: tokens.radii.pill,
        height: 50,
        justifyContent: 'center',
        left: '50%',
        marginLeft: -25,
        marginTop: -25,
        position: 'absolute',
        top: '50%',
        width: 50,
    },
    mapCaption: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: tokens.spacing.md,
    },
    mapCaptionText: {
        color: tokens.colors.supportingText,
        flex: 1,
        fontSize: 12,
        marginLeft: tokens.spacing.sm,
    },
    deliveryCard: {
        alignItems: 'center',
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        flexDirection: 'row',
        padding: tokens.spacing.md,
    },
    deliveryEnabled: {
        backgroundColor: tokens.colors.successSurface,
        borderColor: tokens.colors.deliveryBorder,
    },
    deliveryIcon: {
        alignItems: 'center',
        backgroundColor: tokens.colors.subtleSurface,
        borderRadius: tokens.radii.lg,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    deliveryIconEnabled: {
        backgroundColor: tokens.colors.successAction,
    },
    deliveryCopy: {
        flex: 1,
        marginHorizontal: tokens.spacing.md,
    },
    deliveryTitle: {
        color: tokens.colors.text,
        fontSize: 14,
        fontWeight: '700',
    },
    deliveryHint: {
        color: tokens.colors.supportingText,
        fontSize: 12,
        lineHeight: 18,
        marginTop: tokens.spacing.xs,
    },
});