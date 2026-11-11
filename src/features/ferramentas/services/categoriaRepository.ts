import type { Categoria } from '@/features/ferramentas/types';

// O app usa a versao HTTP (ferramentas/api/categoriaHttp.ts)
export type CategoriaRepository = {
    listar(): Promise<Categoria[]>;
};
