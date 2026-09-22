import { cadastrarUsuario } from '@/services/api';
import { Href, useRouter } from 'expo-router';
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
    const router = useRouter();
    const [etapa, setEtapa] = useState(1);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [cadastroRealizado, setCadastroRealizado] = useState(false);

    const handleCadastro = async () => {
        setMensagem('');
        setCadastroRealizado(false);

        if (etapa === 1) {
            if (!nome || !email || !telefone || !cpf) {
                setMensagem('Preencha todos os campos para continuar.');
                Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
                return;
            }

            setEtapa(2);
            return;
        }

        if (etapa === 2) {
            if (!senha) {
                setMensagem('Digite uma senha para continuar.');
                Alert.alert('Campo obrigatório', 'Digite Sua Senha');
                return;
            }

            if (senha !== confirmSenha) {
                setMensagem('As senhas precisam ser iguais.');
                Alert.alert('Senhas diferentes', 'Confirme sua Senha!');
                return;
            }

            setCarregando(true);

            try {
                await cadastrarUsuario({
                    nome,
                    email,
                    cpf,
                    telefone,
                    senha,
                });
                setCadastroRealizado(true);
                setMensagem('Cadastro realizado corretamente!');
                Alert.alert('Cadastro realizado', 'Sua conta foi criada!');
                router.replace('/home' as Href);
            } catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : 'Não foi possível realizar o cadastro.';
                setMensagem(message);
                Alert.alert('Erro no cadastro', message);
            } finally {
                setCarregando(false);
            }
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
                        disabled={carregando}
                    >
                        <Text style={styles.backButtonText}>VOLTAR</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleCadastro}
                    disabled={carregando}
                >
                    <Text style={styles.buttonText}>
                        {carregando
                            ? 'AGUARDE...'
                            : etapa === 1
                                ? 'CONTINUAR'
                                : 'CRIAR CONTA'}
                    </Text>
                </TouchableOpacity>
            </View>

            {!!mensagem && (
                <Text
                    style={[
                        styles.message,
                        cadastroRealizado && styles.successMessage,
                    ]}
                >
                    {mensagem}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)',
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
    message: {
        color: '#374151',
        fontSize: 14,
        marginTop: 12,
        textAlign: 'center',
    },
    successMessage: {
        color: '#16803C',
        fontWeight: '600',
    },
});