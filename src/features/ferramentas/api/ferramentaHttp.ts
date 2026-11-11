import type { FerramentaRepository } from '@/features/ferramentas/services/ferramentaRepository';
import type { Ferramenta } from '@/features/ferramentas/types';
import { request } from '@/shared/http';

// Implementacao do FerramentaRepository chamando o backend Django
export const ferramentaHttp: FerramentaRepository = {
    listar() {
        return request<Ferramenta[]>('/ferramentas', {
            method: 'GET',
        });
    },

    criar(dados) {
        return request<Ferramenta>('/ferramentas', {
            method: 'POST',
            body: JSON.stringify(dados),
        });
    },

    atualizar(id, dados) {
        return request<Ferramenta>(`/ferramentas/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(dados),
        });
    },

    excluir(id) {
        return request<{ sucesso: boolean }>(`/ferramentas/${id}`, {
            method: 'DELETE',
        });
    },
};
