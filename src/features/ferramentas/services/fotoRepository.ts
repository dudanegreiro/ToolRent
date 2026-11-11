import type { Foto } from '@/features/ferramentas/types';

// O app usa a versao HTTP (ferramentas/api/fotoHttp.ts)
export type FotoRepository = {
    // uri = caminho da foto no celular ou no navegador
    // indice = posicao da foto, usado no nome do arquivo
    enviar(uri: string, indice: number): Promise<Foto>;
};
