from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models



class Usuario(models.Model):
    nome = models.TextField(max_length=100)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=120)
    telefone = models.CharField(max_length=120)
    data_cadastro = models.DateField()

class Categoria(models.Model):
    nome = models.TextField(max_length=100)
    descricao = models.CharField(max_length=200)

class Ferramenta(models.Model):
    nome = models.TextField(max_length=100)
    descricao = models.CharField(max_length=500)
    preco_diaria = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

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
    url = models.CharField(max_length=500)

    ferramenta = models.ForeignKey(
        Ferramenta,
        on_delete=models.CASCADE,
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
    cidade = models.CharField(max_length=100)
    bairro = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    ferramenta = models.ForeignKey(
        Ferramenta,
        on_delete=models.CASCADE,
        related_name="localizacoes"
    )

