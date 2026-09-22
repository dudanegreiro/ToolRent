from django.db import migrations


CATEGORIAS_PADRAO = [
    ('Furadeiras & Parafusadeiras', 'Ferramentas para perfurar e parafusar.'),
    ('Serras & Plainas', 'Equipamentos para cortar e plainar materiais.'),
    ('Andaimes & Escoras', 'Estruturas e suportes para trabalhos em altura.'),
    ('Geradores & Compressores', 'Equipamentos para energia e ar comprimido.'),
    ('Betoneiras & Misturadores', 'Equipamentos para preparar e misturar materiais.'),
    ('Equipamentos de Pintura', 'Ferramentas e equipamentos para pintura.'),
    ('Ferramentas Manuais', 'Ferramentas manuais para obras e reparos.'),
    ('Medição & Nível', 'Instrumentos para medir, nivelar e marcar.'),
    ('Iluminação de Obra', 'Equipamentos para iluminar áreas de trabalho.'),
    ('Hidráulica & Elétrica', 'Ferramentas para instalações hidráulicas e elétricas.'),
]


def criar_categorias(apps, schema_editor):
    categoria = apps.get_model('toolrent', 'Categoria')

    for nome, descricao in CATEGORIAS_PADRAO:
        categoria.objects.get_or_create(nome=nome, defaults={'descricao': descricao})


class Migration(migrations.Migration):

    dependencies = [
        ('toolrent', '0004_usuario_cpf'),
    ]

    operations = [
        migrations.RunPython(criar_categorias, migrations.RunPython.noop),
    ]