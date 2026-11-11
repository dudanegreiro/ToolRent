import type { FotoRepository } from '@/features/ferramentas/services/fotoRepository';
import type { Foto } from '@/features/ferramentas/types';
import { API_URL } from '@/shared/http';
import { Platform } from 'react-native';

// Implementacao do FotoRepository.
// A foto vai como arquivo (FormData), por isso nao usa o request() comum.
export const fotoHttp: FotoRepository = {
    async enviar(uri, indice) {
        const formData = new FormData();

        if (Platform.OS === 'web') {
            const fileResponse = await fetch(uri);
            const blob = await fileResponse.blob();
            formData.append('arquivo', blob, `foto-${indice}.jpg`);
        } else {
            formData.append('arquivo', {
                uri,
                name: `foto-${indice}.jpg`,
                type: 'image/jpeg',
            } as unknown as Blob);
        }

        let response: Response;

        try {
            response = await fetch(`${API_URL}/fotos`, {
                method: 'POST',
                body: formData,
            });
        } catch {
            throw new Error('Não foi possível enviar a foto.');
        }

        const body = await response.json().catch(() => null);

        if (!response.ok) {
            const message = typeof body?.detail === 'string'
                ? body.detail
                : 'Não foi possível salvar a foto.';
            throw new Error(message);
        }

        return body as Foto;
    },
};
