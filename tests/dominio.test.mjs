// Testes das regras de dominio (funcoes puras, sem tela e sem internet)
// Rodar com: npm test

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { calcularEstimativaMensal, calcularPrecoSemanal } from '../src/features/anuncios/domain/preco.ts';
import { descreverPolitica, POLITICAS_CANCELAMENTO } from '../src/features/ferramentas/domain/politicaCancelamento.ts';
import { formatarMoeda } from '../src/shared/formatacao.ts';

test('preco semanal e 7 diarias com 10% de desconto', () => {
    // 10 x 7 = 70, com 10% de desconto = 63
    assert.equal(calcularPrecoSemanal(10).toFixed(2), '63.00');
    assert.equal(calcularPrecoSemanal(25.5).toFixed(2), '160.65');
});

test('preco semanal de diaria zero e zero', () => {
    assert.equal(calcularPrecoSemanal(0), 0);
});

test('estimativa mensal considera 4 semanas', () => {
    // 63 por semana x 4 = 252
    assert.equal(calcularEstimativaMensal(10).toFixed(2), '252.00');
});

test('formatarMoeda usa o formato brasileiro', () => {
    // O toLocaleString coloca um espaco especial depois do R$, por isso o replace
    assert.equal(formatarMoeda(12.5).replace(/\s/g, ' '), 'R$ 12,50');
    assert.equal(formatarMoeda(1234.5).replace(/\s/g, ' '), 'R$ 1.234,50');
    assert.equal(formatarMoeda(0).replace(/\s/g, ' '), 'R$ 0,00');
});

test('existem 3 politicas de cancelamento', () => {
    const nomes = POLITICAS_CANCELAMENTO.map((politica) => politica.nome);
    assert.deepEqual(nomes, ['Flexível', 'Moderada', 'Rigorosa']);
});

test('descreverPolitica devolve o texto da politica', () => {
    assert.equal(descreverPolitica('Flexível'), 'Reembolso total até 24h antes da reserva.');
    assert.equal(descreverPolitica('Rigorosa'), 'Sem reembolso após a confirmação da reserva.');
});

test('descreverPolitica devolve undefined para politica que nao existe', () => {
    assert.equal(descreverPolitica('Qualquer'), undefined);
});
