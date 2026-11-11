// Funcoes de formatacao usadas em varias telas.
// Este arquivo nao importa nada, entao pode ser testado direto com o node.

// Formata um numero como dinheiro brasileiro. Ex.: 12.5 -> "R$ 12,50"
export function formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}
