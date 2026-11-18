import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tokens } from '@/shared/theme/tokens';

type EstadoVisualProps =
    | {
        variant: 'loading';
        message: string;
    }
    | {
        variant: 'empty';
        title: string;
        message: string;
    }
    | {
        variant: 'error';
        title: string;
        message: string;
        actionLabel: string;
        onAction: () => void;
    };

export default function EstadoVisual(props: EstadoVisualProps) {
    return (
        <View style={styles.container}>
            {props.variant === 'loading' ? (
                <ActivityIndicator
                    size="large"
                    color={tokens.colors.action}
                    accessibilityLabel="Carregando"
                    accessibilityRole="progressbar"
                />
            ) : (
                <>
                    <MaterialCommunityIcons
                        name={props.variant === 'empty' ? 'shape-outline' : 'cloud-alert-outline'}
                        size={44}
                        color={tokens.colors.action}
                    />
                    <Text style={styles.title}>{props.title}</Text>
                </>
            )}

            <Text style={styles.message}>{props.message}</Text>

            {props.variant === 'error' && (
                <TouchableOpacity
                    style={styles.action}
                    onPress={props.onAction}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={props.actionLabel}
                >
                    <Text style={styles.actionText}>{props.actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 260,
        paddingHorizontal: tokens.spacing.lg,
    },
    title: {
        color: tokens.colors.text,
        fontSize: 17,
        fontWeight: '700',
        marginTop: tokens.spacing.md,
        textAlign: 'center',
    },
    message: {
        color: tokens.colors.supportingText,
        fontSize: 14,
        lineHeight: 21,
        marginTop: tokens.spacing.sm,
        textAlign: 'center',
    },
    action: {
        backgroundColor: tokens.colors.action,
        borderRadius: tokens.radii.lg,
        marginTop: tokens.spacing.md,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.md,
    },
    actionText: {
        color: tokens.colors.onAction,
        fontSize: 13,
        fontWeight: '700',
    },
});
