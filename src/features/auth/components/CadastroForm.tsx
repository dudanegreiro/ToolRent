import { authHttp } from '@/features/auth/api/authHttp';
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

const formatarTelefone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 2) {
        return digits;
    }

    if (digits.length <= 7) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatarCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 3) {
        return digits;
    }

    if (digits.length <= 6) {
        return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }

    if (digits.length <= 9) {
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    }

    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

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
            const nomeLimpo = nome.trim();
            const emailLimpo = email.trim();
            const telefoneLimpo = telefone.replace(/\D/g, '');
            const cpfLimpo = cpf.replace(/\D/g, '');

            if (!nomeLimpo || !emailLimpo || !telefoneLimpo || !cpfLimpo) {
                setMensagem('Preencha nome, e-mail, telefone e CPF para continuar.');
                Alert.alert('Campos obrigatórios', 'Preencha todos os campos antes de avançar.');
                return;
            }

            if (nomeLimpo.length < 2) {
                setMensagem('Informe um nome válido com pelo menos 2 caracteres.');
                Alert.alert('Nome inválido', 'Digite um nome completo válido.');
                return;
            }

            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo);
            if (!emailValido) {
                setMensagem('Informe um e-mail válido, por exemplo: nome@email.com');
                Alert.alert('E-mail inválido', 'Digite um endereço de e-mail válido.');
                return;
            }

            if (telefoneLimpo.length < 10) {
                setMensagem('Informe um telefone com DDD e número completos.');
                Alert.alert('Telefone inválido', 'Digite um telefone válido.');
                return;
            }

            if (cpfLimpo.length !== 11) {
                setMensagem('O CPF deve conter 11 dígitos.');
                Alert.alert('CPF inválido', 'Digite um CPF com 11 números.');
                return;
            }

            setEtapa(2);
            return;
        }

        if (etapa === 2) {
            if (!senha) {
                setMensagem('Digite uma senha para continuar.');
                Alert.alert('Campo obrigatório', 'Digite sua senha.');
                return;
            }

            if (senha.length < 6) {
                setMensagem('A senha deve ter no mínimo 6 caracteres.');
                Alert.alert('Senha fraca', 'Use pelo menos 6 caracteres.');
                return;
            }

            if (senha !== confirmSenha) {
                setMensagem('As senhas precisam ser iguais.');
                Alert.alert('Senhas diferentes', 'Confirme sua senha corretamente.');
                return;
            }

            setCarregando(true);

            try {
                await authHttp.cadastrar({
                    nome: nome.trim(),
                    email: email.trim(),
                    cpf: cpf.replace(/\D/g, ''),
                    telefone: telefone.replace(/\D/g, ''),
                    senha,
                });

                setCadastroRealizado(true);
                setMensagem('Cadastro realizado com sucesso! Redirecionando para login...');
                Alert.alert('Cadastro realizado', 'Sua conta foi criada com sucesso!');

                await new Promise((resolve) => setTimeout(resolve, 1500));
                router.replace('/login' as Href);
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
                        autoCapitalize="words"
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
                                placeholder="(11) 99999-9999"
                                placeholderTextColor="#8A8A8A"
                                value={telefone}
                                onChangeText={(text) => setTelefone(formatarTelefone(text))}
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
                                onChangeText={(text) => setCpf(formatarCpf(text))}
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