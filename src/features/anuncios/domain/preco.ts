// Regras de preco do anuncio.
// Antes essa conta estava repetida em anuncio-preco e anuncio-revisao.

// Desconto dado para quem aluga a semana inteira (10%)
export const DESCONTO_SEMANAL = 0.1;

// Preco da semana = diaria x 7 dias, com 10% de desconto
export function calcularPrecoSemanal(diaria: number): number {
    return diaria * 7 * (1 - DESCONTO_SEMANAL);
}

// Estimativa de ganho no mes, considerando 4 semanas alugadas
export function calcularEstimativaMensal(diaria: number): number {
    return calcularPrecoSemanal(diaria) * 4;
}
