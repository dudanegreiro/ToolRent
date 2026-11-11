import type { AuthRepository } from '@/features/auth/services/authRepository';
import type { Usuario } from '@/features/auth/types';
import { request } from '@/shared/http';

// Implementacao do AuthRepository chamando o backend Django
export const authHttp: AuthRepository = {
    cadastrar(dados) {
        return request<Usuario>('/usuarios', {
            method: 'POST',
            body: JSON.stringify(dados),
        });
    },

    login(dados) {
        return request<Usuario>('/login', {
            method: 'POST',
            body: JSON.stringify(dados),
        });
    },

    buscarPorId(id) {
        return request<Usuario>(`/usuarios/${id}`, {
            method: 'GET',
        });
    },

    atualizar(id, dados) {
        return request<Usuario>(`/usuarios/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(dados),
        });
    },
};
