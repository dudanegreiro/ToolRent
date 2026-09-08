import { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CadastroForm() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');

    const handleCadastro = () => {
        if (!nome || !email || !telefone) {
            Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
            return;
        }

        Alert.alert('Cadastro realizado!', 'Sua conta foi criada com sucesso.');
    };

    return (
        <View style={styles.form}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                value={nome}
                onChangeText={setNome}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#8A8A8A"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
                style={styles.input}
                placeholder="(11)99999-9999"
                placeholderTextColor="#8A8A8A"
                value={telefone}
                onChangeText={setTelefone}
                keyboardType='phone-pad'
            />

            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput
                style={styles.input}
                placeholder='000.000.000-00'
                
            />

            <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                <Text style={styles.buttonText}>CRIAR CONTA</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        opacity: 0.5,
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#D5DCE3',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 15,
        opacity: 0.5,   
        backgroundColor: '#FAFBFC',
        marginBottom: 18,
    },

   
   
    button: {
        height: 52,
        backgroundColor: '#E85D04',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});