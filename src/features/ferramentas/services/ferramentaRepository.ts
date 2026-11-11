import type { Ferramenta, FerramentaPayload } from '@/features/ferramentas/types';

// Lista do que o app precisa fazer com ferramentas.
// O app usa a versao HTTP (ferramentas/api/ferramentaHttp.ts) e os testes usam uma versao falsa.
export type FerramentaRepository = {
    listar(): Promise<Ferramenta[]>;
    criar(dados: FerramentaPayload): Promise<Ferramenta>;
    atualizar(id: number, dados: Partial<FerramentaPayload>): Promise<Ferramenta>;
    excluir(id: number): Promise<{ sucesso: boolean }>;
};
