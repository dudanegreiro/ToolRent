// Tipos usados no login, cadastro e perfil

export type Usuario = {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    data_cadastro: string;
};

export type CadastroPayload = {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    senha: string;
};

export type LoginPayload = {
    email: string;
    senha: string;
};

export type AtualizarUsuarioPayload = {
    nome?: string;
    telefone?: string;
    senha?: string;
};
