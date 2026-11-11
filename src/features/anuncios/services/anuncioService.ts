import type { FerramentaRepository } from '@/features/ferramentas/services/ferramentaRepository';
import type { FotoRepository } from '@/features/ferramentas/services/fotoRepository';
import type { Ferramenta, FerramentaPayload } from '@/features/ferramentas/types';
// Import relativo com .ts para o node conseguir rodar os testes sem o Expo
import { calcularPrecoSemanal } from '../domain/preco.ts';

// Dados que a tela de revisao junta para publicar.
// As fotos ainda sao caminhos locais e o preco semanal e calculado aqui.
export type NovoAnuncio = Omit<FerramentaPayload, 'fotos' | 'preco_semanal'> & {
    fotosLocais: string[];
};

// Envia as fotos e depois cria a ferramenta no backend.
// Se alguma foto der erro, a ferramenta nao e criada.
export async function publicarAnuncio(
    ferramentas: FerramentaRepository,
    fotos: FotoRepository,
    anuncio: NovoAnuncio,
): Promise<Ferramenta> {
    const { fotosLocais, ...dados } = anuncio;

    const fotosEnviadas = await Promise.all(
        fotosLocais.map((uri, indice) => fotos.enviar(uri, indice)),
    );

    return ferramentas.criar({
        ...dados,
        preco_semanal: calcularPrecoSemanal(dados.preco_diaria),
        fotos: fotosEnviadas.map((foto) => foto.url),
    });
}

// Busca todas as ferramentas e deixa so as do usuario logado
export async function listarMeusAnuncios(
    ferramentas: FerramentaRepository,
    usuarioId: string,
): Promise<Ferramenta[]> {
    const todas = await ferramentas.listar();
    return todas.filter((ferramenta) => String(ferramenta.usuario_id) === String(usuarioId));
}
