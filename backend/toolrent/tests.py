from django.test import TestCase

from toolrent.models import Categoria, Ferramenta, Usuario


class FerramentaUpdateAPITest(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create(
            nome='Teste',
            email='teste@email.com',
            cpf='123.456.789-09',
            senha='hashed',
            telefone='11999999999',
            data_cadastro='2024-01-01',
        )
        self.categoria = Categoria.objects.create(
            nome='Furadeiras',
            descricao='Ferramentas elétricas',
        )
        self.ferramenta = Ferramenta.objects.create(
            nome='Furadeira',
            marca='Bosch',
            modelo='GSR',
            estado_conservacao='Usado',
            descricao='Boa',
            itens_inclusos='Carregador',
            preco_diaria=50,
            preco_semanal=250,
            periodo_minimo=1,
            exige_caucao=False,
            politica_cancelamento='Moderada',
            entrega=False,
            disponibilidade=True,
            data_cadastro='2024-01-01',
            usuario=self.usuario,
            categoria=self.categoria,
        )

    def test_patch_ferramenta_updates_entrega_and_disponibilidade(self):
        response = self.client.patch(
            f'/api/ferramentas/{self.ferramenta.id}',
            data={
                'entrega': True,
                'disponibilidade': False,
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)
        self.ferramenta.refresh_from_db()
        self.assertTrue(self.ferramenta.entrega)
        self.assertFalse(self.ferramenta.disponibilidade)
