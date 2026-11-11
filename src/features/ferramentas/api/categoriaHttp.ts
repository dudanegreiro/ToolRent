import type { CategoriaRepository } from '@/features/ferramentas/services/categoriaRepository';
import type { Categoria } from '@/features/ferramentas/types';
import { request } from '@/shared/http';

// Implementacao do CategoriaRepository chamando o backend Django
export const categoriaHttp: CategoriaRepository = {
    listar() {
        return request<Categoria[]>('/categorias', {
            method: 'GET',
        });
    },
};
