// Testes dos servicos usando repositorios falsos (sem chamar o backend de verdade)
// Rodar com: npm test

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { listarMeusAnuncios, publicarAnuncio } from '../src/features/anuncios/services/anuncioService.ts';

// Repositorio falso de ferramentas: guarda o que foi criado numa lista
function criarFerramentasFalsas() {
    return {
        criadas: [],

        async listar() {
            return [
                { id: 1, nome: 'Furadeira', usuario_id: 1 },
                { id: 2, nome: 'Serra', usuario_id: 2 },
                { id: 3, nome: 'Martelo', usuario_id: 1 },
            ];
        },

        async criar(dados) {
            this.criadas.push(dados);
            return { id: 99, ...dados };
        },

        async atualizar() {
            throw new Error('nao usado neste teste');
        },

        async excluir() {
            throw new Error('nao usado neste teste');
        },
    };
}

// Repositorio falso de fotos que sempre funciona
const fotosQueFuncionam = {
    async enviar(uri, indice) {
        return { id: indice, url: `http://localhost:8001/media/fotos/foto-${indice}.jpg` };
    },
};

// Repositorio falso de fotos que sempre da erro
const fotosComErro = {
    async enviar() {
        throw new Error('Não foi possível enviar a foto.');
    },
};

// Anuncio de exemplo, igual ao que a tela de revisao monta
function anuncioDeExemplo() {
    return {
        nome: 'Furadeira de impacto',
        marca: 'Bosch',
        modelo: 'GSB 550',
        estado_conservacao: 'Bom',
        descricao: 'Furadeira em bom estado',
        itens_inclusos: 'Maleta',
        preco_diaria: 20,
        periodo_minimo: 1,
        exige_caucao: false,
        politica_cancelamento: 'Flexível',
        endereco: 'Rua 1',
        bairro: 'Centro',
        cidade: 'Palmas',
        entrega: true,
        fotosLocais: ['file:///foto-a.jpg', 'file:///foto-b.jpg'],
        usuario_id: 1,
        categoria_id: 2,
    };
}

test('publicarAnuncio envia as fotos e cria a ferramenta', async () => {
    const ferramentas = criarFerramentasFalsas();

    const criada = await publicarAnuncio(ferramentas, fotosQueFuncionam, anuncioDeExemplo());

    assert.equal(criada.id, 99);
    assert.equal(ferramentas.criadas.length, 1);
    assert.deepEqual(ferramentas.criadas[0].fotos, [
        'http://localhost:8001/media/fotos/foto-0.jpg',
        'http://localhost:8001/media/fotos/foto-1.jpg',
    ]);
});

test('publicarAnuncio calcula o preco semanal', async () => {
    const ferramentas = criarFerramentasFalsas();

    await publicarAnuncio(ferramentas, fotosQueFuncionam, anuncioDeExemplo());

    // 20 x 7 = 140, com 10% de desconto = 126
    assert.equal(ferramentas.criadas[0].preco_semanal.toFixed(2), '126.00');
});

test('publicarAnuncio nao manda os caminhos locais das fotos para o backend', async () => {
    const ferramentas = criarFerramentasFalsas();

    await publicarAnuncio(ferramentas, fotosQueFuncionam, anuncioDeExemplo());

    assert.equal(ferramentas.criadas[0].fotosLocais, undefined);
});

test('publicarAnuncio nao cria a ferramenta se uma foto falhar', async () => {
    const ferramentas = criarFerramentasFalsas();

    await assert.rejects(
        publicarAnuncio(ferramentas, fotosComErro, anuncioDeExemplo()),
        { message: 'Não foi possível enviar a foto.' },
    );

    assert.equal(ferramentas.criadas.length, 0);
});

test('listarMeusAnuncios devolve so as ferramentas do usuario', async () => {
    const ferramentas = criarFerramentasFalsas();

    const minhas = await listarMeusAnuncios(ferramentas, '1');

    assert.deepEqual(minhas.map((ferramenta) => ferramenta.nome), ['Furadeira', 'Martelo']);
});

test('listarMeusAnuncios devolve lista vazia se o usuario nao tem anuncios', async () => {
    const ferramentas = criarFerramentasFalsas();

    const minhas = await listarMeusAnuncios(ferramentas, '50');

    assert.deepEqual(minhas, []);
});
