// Tipos das ferramentas, categorias e fotos

export type Categoria = {
    id: number;
    nome: string;
    descricao: string;
};

export type Foto = {
    id: number;
    url: string;
};

export type Ferramenta = {
    id: number;
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
    entrega: boolean;
    status_aprovacao: string;
    disponibilidade: boolean;
    data_cadastro: string;
    usuario_id: number;
    categoria_id: number;
    fotos: Foto[];
};

// Dados enviados para criar ou editar uma ferramenta
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
