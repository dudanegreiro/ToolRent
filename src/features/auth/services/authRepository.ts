import type { AtualizarUsuarioPayload, CadastroPayload, LoginPayload, Usuario } from '@/features/auth/types';

// Lista do que o app precisa fazer com usuarios.
// O app usa a versao HTTP (auth/api/authHttp.ts) e os testes podem usar uma versao falsa.
export type AuthRepository = {
    cadastrar(dados: CadastroPayload): Promise<Usuario>;
    login(dados: LoginPayload): Promise<Usuario>;
    buscarPorId(id: number): Promise<Usuario>;
    atualizar(id: number, dados: AtualizarUsuarioPayload): Promise<Usuario>;
};
