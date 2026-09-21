import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>ToolRent</Text>
            <Text style={styles.subtitle}>
                Encontre ou anuncie ferramentas para aluguel.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#F5F7FA',
    },
    title: {
        color: '#1F3D4A',
        fontSize: 32,
        fontWeight: '700',
    },
    subtitle: {
        color: '#6B7280',
        fontSize: 16,
        marginTop: 12,
        textAlign: 'center',
    },
});
