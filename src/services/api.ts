import { Platform } from 'react-native';

type Usuario = {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    data_cadastro: string;
};

type CadastroPayload = {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    senha: string;
};

type LoginPayload = {
    email: string;
    senha: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? (
    Platform.OS === 'android'
        ? 'http://10.0.2.2:8001/api'
        : 'http://localhost:8001/api'
);

async function request<T>(path: string, options: RequestInit): Promise<T> {
    let response: Response;

    try {
        response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
    } catch {
        throw new Error('Não foi possível conectar ao servidor.');
    }

    const body = await response.json().catch(() => null);

    if (!response.ok) {
        const message = typeof body?.detail === 'string'
            ? body.detail
            : 'Não foi possível concluir a operação.';
        throw new Error(message);
    }

    return body as T;
}

export function cadastrarUsuario(payload: CadastroPayload) {
    return request<Usuario>('/usuarios', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export function fazerLogin(payload: LoginPayload) {
    return request<Usuario>('/login', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}
