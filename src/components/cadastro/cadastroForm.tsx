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
    const [etapa, setEtapa] = useState(1);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');

    const handleCadastro = () => {
        if (etapa === 1) {
            if (!nome || !email || !telefone || !cpf) {
                Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
                return;
            }

            setEtapa(2);
            return;
        }

        if (etapa === 2) {
            if (!senha) {
                Alert.alert('Campo obrigatório', 'Digite Sua Senha');
                return;
            }

            if (senha !== confirmSenha) {
                Alert.alert('Senhas diferentes', 'Confirme sua Senha!');
                return;
            }

            Alert.alert('Cadastro realizado', 'Sua conta foi criada!');
        }


    };

    return (
        <View style={styles.form}>
            {etapa === 1 ? (
                <>
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
                    <View style={styles.cpfTel}>
                        <View>
                            <Text style={styles.label}>Telefone</Text>
                            <TextInput
                                style={[styles.input, styles.inputTel]}
                                placeholder="(11)99999-9999"
                                placeholderTextColor="#8A8A8A"
                                value={telefone}
                                onChangeText={setTelefone}
                                keyboardType='phone-pad'
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Cpf</Text>
                            <TextInput
                                style={[styles.input, styles.inputTel]}
                                placeholder='000.000.000-00'
                                placeholderTextColor="#8A8A8A"
                                value={cpf}
                                onChangeText={setCpf}
                                keyboardType='numeric'


                            />
                        </View>
                    </View>
                </>

            ) : (
                <>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua senha"
                        placeholderTextColor="#8A8A8A"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                    />

                    <Text style={styles.label}>Confirmar senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirme sua senha"
                        placeholderTextColor="#8A8A8A"
                        value={confirmSenha}
                        onChangeText={setConfirmSenha}
                        secureTextEntry
                    />
                </>
            )}

            <View style={styles.buttonRow}>
                {etapa === 2 && (
                    <TouchableOpacity
                        style={[styles.button, styles.backButton]}
                        onPress={() => setEtapa(1)}
                    >
                        <Text style={styles.backButtonText}>VOLTAR</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                    <Text style={styles.buttonText}>
                        {etapa === 1 ? 'CONTINUAR' : 'CRIAR CONTA'}
                    </Text>
                </TouchableOpacity>
            </View>
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

    cpfTel: {
        flexDirection: 'row',
    },

    inputTel: {
        flex: 1,
        width: '90%',
    },

    button: {
        flex: 1,
        height: 52,
        backgroundColor: '#E85D04',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    buttonRow: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        gap: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    backButton: {
        height: 52,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E85D04',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    backButtonText: {
        color: '#E85D04',
        fontSize: 16,
        fontWeight: '700',
    },
});