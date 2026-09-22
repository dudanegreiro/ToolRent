from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models



class Usuario(models.Model):
    nome = models.TextField(max_length=100)
    email = models.EmailField(unique=True)
    cpf = models.CharField(max_length=14, unique=True, null=True, blank=True)
    senha = models.CharField(max_length=120)
    telefone = models.CharField(max_length=120)
    data_cadastro = models.DateField()

class Categoria(models.Model):
    nome = models.TextField(max_length=100)
    descricao = models.CharField(max_length=200)

class Ferramenta(models.Model):
    nome = models.TextField(max_length=100)
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    estado_conservacao = models.CharField(max_length=20)
    descricao = models.CharField(max_length=500)
    itens_inclusos = models.CharField(max_length=500, blank=True)
    preco_diaria = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    preco_semanal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
    periodo_minimo = models.PositiveSmallIntegerField(default=1)
    exige_caucao = models.BooleanField(default=False)
    politica_cancelamento = models.CharField(max_length=20, default='Flexível')
    entrega = models.BooleanField(default=False)
    status_aprovacao = models.CharField(max_length=20, default='PUBLICADO')

    disponibilidade = models.BooleanField()
    data_cadastro = models.DateField()

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="ferramentas"
    )

    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.CASCADE,
        related_name="ferramentas"
    )

class Aluguel(models.Model):
    data_inicio = models.DateField()
    data_fim = models.DateField()
    valor_total = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    ferramenta = models.ForeignKey(
        Ferramenta,
        on_delete=models.CASCADE,
        related_name="ferramentas"
    )

    locatario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="alugueis"
    )

class Foto(models.Model):
    url = models.CharField(max_length=500, blank=True)
    arquivo = models.FileField(upload_to='fotos/', blank=True)

    ferramenta = models.ForeignKey(
        Ferramenta,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="fotos"
    )

class Negociacao(models.Model):
    data = models.DateTimeField(auto_now_add=True)
    mensagem = models.TextField(max_length=500)

    aluguel = models.ForeignKey(
        Aluguel,
        on_delete=models.CASCADE,
        related_name="negociacoes"
    )

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="mensagens_enviadas"
    )

    destinatario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="mensagens_recebidas"
    )


class Avaliacao(models.Model):
    nota = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    comentario = models.TextField(max_length=500, blank=True)
    data = models.DateTimeField(auto_now_add=True)

    aluguel = models.OneToOneField(
        Aluguel,
        on_delete=models.CASCADE,
        related_name="avaliacao"
    )

    avaliador = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="avaliacoes"
    )


class Localizacao(models.Model):
    endereco = models.CharField(max_length=200, blank=True)
    cidade = models.CharField(max_length=100)
    bairro = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    entrega = models.BooleanField(default=False)

    ferramenta = models.ForeignKey(
        Ferramenta,
        on_delete=models.CASCADE,
        related_name="localizacoes"
    )

