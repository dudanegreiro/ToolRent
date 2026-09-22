import { Platform } from 'react-native';

type Usuario = {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    data_cadastro: string;
};

export type Categoria = {
    id: number;
    nome: string;
    descricao: string;
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

export type FerramentaPayload = {
    nome: string;
    marca: string;
    modelo: string;
    estado_conservacao: string;
    descricao: string;
    itens_inclusos: string;
    preco_diaria: number;
    preco_semanal: number;
    periodo_minimo: number;
    exige_caucao: boolean;
    politica_cancelamento: string;
    endereco: string;
    bairro: string;
    cidade: string;
    entrega: boolean;
    fotos: string[];
    disponibilidade?: boolean;
    usuario_id: number;
    categoria_id: number;
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
            : Array.isArray(body?.detail)
                ? body.detail
                    .map((error: { msg?: string }) => error.msg ?? 'Campo inválido.')
                    .join(' ')
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

export function listarCategorias() {
    return request<Categoria[]>('/categorias', {
        method: 'GET',
    });
}

export function criarFerramenta(payload: FerramentaPayload) {
    return request('/ferramentas', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function enviarFoto(uri: string, index: number) {
    const formData = new FormData();

    if (Platform.OS === 'web') {
        const fileResponse = await fetch(uri);
        const blob = await fileResponse.blob();
        formData.append('arquivo', blob, `foto-${index}.jpg`);
    } else {
        formData.append('arquivo', {
            uri,
            name: `foto-${index}.jpg`,
            type: 'image/jpeg',
        } as unknown as Blob);
    }

    let response: Response;

    try {
        response = await fetch(`${API_URL}/fotos`, {
            method: 'POST',
            body: formData,
        });
    } catch {
        throw new Error('Não foi possível enviar a foto.');
    }

    const body = await response.json().catch(() => null);

    if (!response.ok) {
        const message = typeof body?.detail === 'string'
            ? body.detail
            : 'Não foi possível salvar a foto.';
        throw new Error(message);
    }

    return body as { id: number; url: string };
}
