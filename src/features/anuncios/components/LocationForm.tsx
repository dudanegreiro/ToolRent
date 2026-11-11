import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

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
                    <MaterialCommunityIcons name="map-marker-outline" size={20} color="#8A8A8A" />
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={onAddressChange}
                        placeholder="Rua, número e complemento"
                        placeholderTextColor="#9AA3AD"
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
                        placeholderTextColor="#9AA3AD"
                    />
                </View>
                <View style={styles.halfField}>
                    <Text style={styles.label}>Cidade</Text>
                    <TextInput
                        style={styles.standaloneInput}
                        value={city}
                        onChangeText={onCityChange}
                        placeholder="Ex.: São Paulo"
                        placeholderTextColor="#9AA3AD"
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
                        <MaterialCommunityIcons name="map-marker" size={30} color="#FFFFFF" />
                    </Animated.View>
                </View>
                <View style={styles.mapCaption}>
                    <MaterialCommunityIcons name="information-outline" size={18} color="#E85D04" />
                    <Text style={styles.mapCaptionText}>O mapa ajuda locatários a encontrarem sua ferramenta.</Text>
                </View>
            </View>

            <View style={[styles.deliveryCard, deliveryEnabled && styles.deliveryEnabled]}>
                <View style={[styles.deliveryIcon, deliveryEnabled && styles.deliveryIconEnabled]}>
                    <MaterialCommunityIcons
                        name={deliveryEnabled ? 'truck-check-outline' : 'truck-outline'}
                        size={23}
                        color={deliveryEnabled ? '#FFFFFF' : '#E85D04'}
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
                    trackColor={{ false: '#D5DCE3', true: '#F6A36B' }}
                    thumbColor={deliveryEnabled ? '#E85D04' : '#FFFFFF'}
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
    label: {
        color: '#1F3D4A',
        fontSize: 14,
        fontWeight: '700',
    },
    inputWithIcon: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#D5DCE3',
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        minHeight: 52,
        paddingHorizontal: 14,
    },
    input: {
        color: '#1F3D4A',
        flex: 1,
        fontSize: 15,
        marginLeft: 8,
    },
    standaloneInput: {
        backgroundColor: '#FFFFFF',
        borderColor: '#D5DCE3',
        borderRadius: 10,
        borderWidth: 1,
        color: '#1F3D4A',
        fontSize: 15,
        minHeight: 52,
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
    mapCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#D5DCE3',
        borderRadius: 14,
        borderWidth: 1,
        overflow: 'hidden',
    },
    mapPattern: {
        backgroundColor: '#DDE8E3',
        height: 180,
        overflow: 'hidden',
        position: 'relative',
    },
    mapRoadOne: {
        backgroundColor: '#FFFFFF',
        height: 18,
        left: -20,
        position: 'absolute',
        top: 64,
        transform: [{ rotate: '19deg' }],
        width: '120%',
    },
    mapRoadTwo: {
        backgroundColor: '#FFFFFF',
        height: 13,
        left: -25,
        position: 'absolute',
        top: 120,
        transform: [{ rotate: '-28deg' }],
        width: '120%',
    },
    mapRoadThree: {
        backgroundColor: '#C2D6CC',
        height: 7,
        left: -15,
        position: 'absolute',
        top: 30,
        transform: [{ rotate: '-45deg' }],
        width: '115%',
    },
    pinShadow: {
        backgroundColor: 'rgba(232, 93, 4, 0.18)',
        borderRadius: 32,
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
        backgroundColor: '#E85D04',
        borderRadius: 25,
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
        padding: 12,
    },
    mapCaptionText: {
        color: '#6B7280',
        flex: 1,
        fontSize: 12,
        marginLeft: 8,
    },
    deliveryCard: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#D5DCE3',
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        padding: 14,
    },
    deliveryEnabled: {
        backgroundColor: '#F1FAF5',
        borderColor: '#62B985',
    },
    deliveryIcon: {
        alignItems: 'center',
        backgroundColor: '#FFF1E8',
        borderRadius: 10,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    deliveryIconEnabled: {
        backgroundColor: '#38A169',
    },
    deliveryCopy: {
        flex: 1,
        marginHorizontal: 12,
    },
    deliveryTitle: {
        color: '#1F3D4A',
        fontSize: 14,
        fontWeight: '700',
    },
    deliveryHint: {
        color: '#6B7280',
        fontSize: 12,
        lineHeight: 18,
        marginTop: 4,
    },
});