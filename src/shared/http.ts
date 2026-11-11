import { Platform } from 'react-native';

// Endereco da API. No emulador Android, o localhost do computador e o 10.0.2.2
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? (
    Platform.OS === 'android'
        ? 'http://10.0.2.2:8001/api'
        : 'http://localhost:8001/api'
);

// Funcao comum para chamar a API. Todas as features usam ela.
// Se der erro, lanca um Error com a mensagem que veio do backend.
export async function request<T>(path: string, options: RequestInit): Promise<T> {
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
            : Array.isArray(body?.detail)
                ? body.detail
                    .map((error: { msg?: string }) => error.msg ?? 'Campo inválido.')
                    .join(' ')
                : 'Não foi possível concluir a operação.';
        throw new Error(message);
    }

    return body as T;
}
