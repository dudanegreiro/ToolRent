// Testes que conferem se as regras de pastas estao sendo seguidas.
// Eles leem os imports de cada arquivo dentro de src/.
// As regras estao explicadas em docs/arquitetura.md

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const PASTA_SRC = path.join(import.meta.dirname, '..', 'src');

// Lista todos os arquivos .ts e .tsx de uma pasta (e das subpastas)
function listarArquivos(pasta) {
    const arquivos = [];

    for (const item of fs.readdirSync(pasta, { withFileTypes: true })) {
        const caminho = path.join(pasta, item.name);

        if (item.isDirectory()) {
            arquivos.push(...listarArquivos(caminho));
        } else if (item.name.endsWith('.ts') || item.name.endsWith('.tsx')) {
            arquivos.push(caminho);
        }
    }

    return arquivos;
}

// Devolve o caminho a partir de src/ com barras normais. Ex.: "features/auth/types.ts"
function caminhoNoSrc(arquivo) {
    return path.relative(PASTA_SRC, arquivo).split(path.sep).join('/');
}

// Pega o texto depois do "from" de cada import. Ex.: "react-native", "@/shared/http"
function lerImports(arquivo) {
    const texto = fs.readFileSync(arquivo, 'utf8');
    const imports = [];

    for (const resultado of texto.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
        imports.push(resultado[1]);
    }

    return imports;
}

// Diz de qual feature e o arquivo. Ex.: "features/auth/types.ts" -> "auth"
function featureDoArquivo(caminho) {
    const partes = caminho.split('/');
    return partes[0] === 'features' ? partes[1] : null;
}

// Diz de qual feature e o import. Ex.: "@/features/ferramentas/types" -> "ferramentas"
function featureDoImport(textoImport) {
    const resultado = textoImport.match(/^@\/features\/([^/]+)/);
    return resultado ? resultado[1] : null;
}

const arquivos = listarArquivos(PASTA_SRC);

test('a pasta src tem arquivos para testar', () => {
    assert.ok(arquivos.length > 0);
});

test('domain/ e services/ nao importam react, expo nem bibliotecas', () => {
    const erros = [];

    for (const arquivo of arquivos) {
        const caminho = caminhoNoSrc(arquivo);

        if (!caminho.includes('/domain/') && !caminho.includes('/services/')) {
            continue;
        }

        for (const textoImport of lerImports(arquivo)) {
            const ehDoProjeto = textoImport.startsWith('.') || textoImport.startsWith('@/');

            if (!ehDoProjeto) {
                erros.push(`${caminho} importa a biblioteca "${textoImport}"`);
            }
        }
    }

    assert.deepEqual(erros, []);
});

test('domain/ e services/ nao importam telas, componentes, api/ nem o http', () => {
    // Esses arquivos usam react-native por dentro, entao tambem sao proibidos
    const proibidos = ['/screens/', '/components/', '/api/', 'shared/http', 'shared/session', 'shared/navigation'];
    const erros = [];

    for (const arquivo of arquivos) {
        const caminho = caminhoNoSrc(arquivo);

        if (!caminho.includes('/domain/') && !caminho.includes('/services/')) {
            continue;
        }

        for (const textoImport of lerImports(arquivo)) {
            if (proibidos.some((proibido) => textoImport.includes(proibido))) {
                erros.push(`${caminho} importa "${textoImport}"`);
            }
        }
    }

    assert.deepEqual(erros, []);
});

test('shared/ nao importa nada de features/', () => {
    const erros = [];

    for (const arquivo of arquivos) {
        const caminho = caminhoNoSrc(arquivo);

        if (!caminho.startsWith('shared/')) {
            continue;
        }

        for (const textoImport of lerImports(arquivo)) {
            if (textoImport.startsWith('@/features/')) {
                erros.push(`${caminho} importa "${textoImport}"`);
            }
        }
    }

    assert.deepEqual(erros, []);
});

test('nao existe dependencia circular entre features', () => {
    // Monta a lista: cada feature -> features que ela importa
    const dependencias = {};

    for (const arquivo of arquivos) {
        const origem = featureDoArquivo(caminhoNoSrc(arquivo));

        if (!origem) {
            continue;
        }

        if (!dependencias[origem]) {
            dependencias[origem] = [];
        }

        for (const textoImport of lerImports(arquivo)) {
            const destino = featureDoImport(textoImport);

            if (destino && destino !== origem && !dependencias[origem].includes(destino)) {
                dependencias[origem].push(destino);
            }
        }
    }

    // Procura um caminho que sai de uma feature e volta para ela mesma
    function procurarCiclo(inicio, atual, caminhoAteAqui) {
        for (const proxima of dependencias[atual] ?? []) {
            if (proxima === inicio) {
                return [...caminhoAteAqui, proxima];
            }

            if (!caminhoAteAqui.includes(proxima)) {
                const ciclo = procurarCiclo(inicio, proxima, [...caminhoAteAqui, proxima]);

                if (ciclo) {
                    return ciclo;
                }
            }
        }

        return null;
    }

    for (const feature of Object.keys(dependencias)) {
        const ciclo = procurarCiclo(feature, feature, [feature]);
        assert.equal(ciclo, null, `Dependencia circular: ${ciclo?.join(' -> ')}`);
    }
});

test('src/app so tem rotas que reexportam uma tela', () => {
    // _layout e index sao arquivos especiais do Expo Router
    const especiais = ['app/_layout.tsx', 'app/index.tsx'];
    const erros = [];

    for (const arquivo of arquivos) {
        const caminho = caminhoNoSrc(arquivo);

        if (!caminho.startsWith('app/') || especiais.includes(caminho)) {
            continue;
        }

        const texto = fs.readFileSync(arquivo, 'utf8').trim();

        if (!/^export \{ default \} from '@\/features\/[^']+\/screens\/[^']+';$/.test(texto)) {
            erros.push(caminho);
        }
    }

    assert.deepEqual(erros, []);
});
