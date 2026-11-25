import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { tokens } from '@/shared/theme/tokens';

type CartaoProps = PropsWithChildren<{
    style?: StyleProp<ViewStyle>;
}>;

export default function Cartao({ children, style }: CartaoProps) {
    return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: tokens.colors.surface,
        borderColor: tokens.colors.border,
        borderRadius: tokens.radii.lg,
        borderWidth: 1,
        padding: tokens.spacing.md,
    },
});
