import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tokens } from '@/shared/theme/tokens';

type CabecalhoDoPassoProps = {
    title: string;
    currentStep: number;
    totalSteps: number;
    onBack: () => void;
};

export default function CabecalhoDoPasso({
    title,
    currentStep,
    totalSteps,
    onBack,
}: CabecalhoDoPassoProps) {
    return (
        <View>
            <View style={styles.header}>
                <TouchableOpacity
                    accessibilityLabel="Voltar"
                    accessibilityRole="button"
                    activeOpacity={0.75}
                    onPress={onBack}
                    style={styles.backButton}
                >
                    <MaterialCommunityIcons
                        color={tokens.colors.text}
                        name="arrow-left"
                        size={24}
                    />
                </TouchableOpacity>
                <View style={styles.headerCopy}>
                    <Text style={styles.eyebrow}>NOVO ANÚNCIO</Text>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.stepBadge}>
                    <Text style={styles.stepText}>{`${currentStep}/${totalSteps}`}</Text>
                </View>
            </View>

            <View style={styles.progressRow}>
                {Array.from({ length: totalSteps }, (_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.progress,
                            index < currentStep && styles.completedProgress,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: tokens.spacing.lg,
    },
    backButton: {
        alignItems: 'center',
        height: tokens.alvoMinimo,
        justifyContent: 'center',
        marginRight: tokens.spacing.sm,
        width: tokens.alvoMinimo,
    },
    headerCopy: {
        flex: 1,
    },
    eyebrow: {
        color: tokens.colors.action,
        fontSize: tokens.typography.fontSize.caption,
        fontWeight: tokens.typography.fontWeight.bold,
        letterSpacing: 1,
        marginBottom: tokens.spacing.xs,
    },
    title: {
        color: tokens.colors.text,
        fontSize: tokens.typography.fontSize.heading,
        fontWeight: tokens.typography.fontWeight.bold,
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
        fontSize: tokens.typography.fontSize.caption,
        fontWeight: tokens.typography.fontWeight.bold,
    },
    progressRow: {
        flexDirection: 'row',
        gap: tokens.spacing.xs,
        marginBottom: tokens.spacing.lg,
    },
    progress: {
        backgroundColor: tokens.colors.border,
        borderRadius: tokens.radii.sm,
        flex: 1,
        height: 5,
    },
    completedProgress: {
        backgroundColor: tokens.colors.action,
    },
});
