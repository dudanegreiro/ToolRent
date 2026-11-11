// Politicas de cancelamento que o dono da ferramenta pode escolher.
// O texto de cada uma estava copiado em 3 arquivos, agora fica so aqui.

export type PoliticaCancelamento = 'Flexível' | 'Moderada' | 'Rigorosa';

export const POLITICAS_CANCELAMENTO: { nome: PoliticaCancelamento; descricao: string }[] = [
    { nome: 'Flexível', descricao: 'Reembolso total até 24h antes da reserva.' },
    { nome: 'Moderada', descricao: 'Reembolso até 3 dias antes; após isso, só parcial ou crédito.' },
    { nome: 'Rigorosa', descricao: 'Sem reembolso após a confirmação da reserva.' },
];

// Devolve a explicacao da politica ou undefined se o nome nao existir
export function descreverPolitica(nome: string): string | undefined {
    const politica = POLITICAS_CANCELAMENTO.find((item) => item.nome === nome);
    return politica?.descricao;
}
