from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('toolrent', '0005_categorias_padrao'),
    ]

    operations = [
        migrations.AddField(
            model_name='ferramenta',
            name='marca',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='ferramenta',
            name='modelo',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='ferramenta',
            name='estado_conservacao',
            field=models.CharField(default='', max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='ferramenta',
            name='itens_inclusos',
            field=models.CharField(blank=True, max_length=500),
        ),
    ]