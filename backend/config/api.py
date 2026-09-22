from datetime import date

from django.contrib.auth.hashers import check_password, make_password
from django.db import transaction
from django.shortcuts import get_object_or_404
from ninja import File, NinjaAPI, Schema, UploadedFile
from ninja.errors import HttpError

from toolrent.models import Categoria, Ferramenta, Foto, Localizacao, Usuario

api = NinjaAPI()


class UsuarioInput(Schema):
	nome: str
	email: str
	cpf: str
	senha: str
	telefone: str


class UsuarioOutput(Schema):
	id: int
	nome: str
	email: str
	cpf: str
	telefone: str
	data_cadastro: date


class LoginInput(Schema):
	email: str
	senha: str


class CategoriaInput(Schema):
	nome: str
	descricao: str


class CategoriaOutput(Schema):
	id: int
	nome: str
	descricao: str


class FerramentaInput(Schema):
	nome: str
	marca: str
	modelo: str
	estado_conservacao: str
	descricao: str
	itens_inclusos: str = ''
	preco_diaria: float
	preco_semanal: float
	periodo_minimo: int = 1
	exige_caucao: bool = False
	politica_cancelamento: str = 'Flexível'
	endereco: str
	bairro: str
	cidade: str
	entrega: bool = False
	fotos: list[str] = []
	disponibilidade: bool = True
	usuario_id: int
	categoria_id: int


class FerramentaOutput(Schema):
	id: int
	nome: str
	marca: str
	modelo: str
	estado_conservacao: str
	descricao: str
	itens_inclusos: str
	preco_diaria: float
	preco_semanal: float
	periodo_minimo: int
	exige_caucao: bool
	politica_cancelamento: str
	entrega: bool
	status_aprovacao: str
	disponibilidade: bool
	data_cadastro: date
	usuario_id: int
	categoria_id: int
	fotos: list['FotoOutput']


class FotoOutput(Schema):
	id: int
	url: str


@api.get('/usuarios', response=list[UsuarioOutput], tags=['Usuários'])
def listar_usuarios(request):
	return Usuario.objects.all()


@api.post('/usuarios', response=UsuarioOutput, tags=['Usuários'])
def criar_usuario(request, payload: UsuarioInput):
	return Usuario.objects.create(
		nome=payload.nome,
		email=payload.email,
		cpf=payload.cpf,
		senha=make_password(payload.senha),
		telefone=payload.telefone,
		data_cadastro=date.today(),
	)


@api.post('/login', response=UsuarioOutput, tags=['Autenticação'])
def login(request, payload: LoginInput):
	usuario = Usuario.objects.filter(email=payload.email).first()

	if usuario is None or not check_password(payload.senha, usuario.senha):
		raise HttpError(401, 'E-mail ou senha inválidos.')

	return usuario


@api.get('/categorias', response=list[CategoriaOutput], tags=['Categorias'])
def listar_categorias(request):
	return Categoria.objects.all()


@api.post('/categorias', response=CategoriaOutput, tags=['Categorias'])
def criar_categoria(request, payload: CategoriaInput):
	return Categoria.objects.create(**payload.dict())


@api.get('/ferramentas', response=list[FerramentaOutput], tags=['Ferramentas'])
def listar_ferramentas(request):
	return [serializar_ferramenta(request, ferramenta) for ferramenta in Ferramenta.objects.select_related('usuario', 'categoria').prefetch_related('fotos')]


def serializar_ferramenta(request, ferramenta):
	return {
		'id': ferramenta.id,
		'nome': ferramenta.nome,
		'marca': ferramenta.marca,
		'modelo': ferramenta.modelo,
		'estado_conservacao': ferramenta.estado_conservacao,
		'descricao': ferramenta.descricao,
		'itens_inclusos': ferramenta.itens_inclusos,
		'preco_diaria': ferramenta.preco_diaria,
		'preco_semanal': ferramenta.preco_semanal,
		'periodo_minimo': ferramenta.periodo_minimo,
		'exige_caucao': ferramenta.exige_caucao,
		'politica_cancelamento': ferramenta.politica_cancelamento,
		'entrega': ferramenta.entrega,
		'status_aprovacao': ferramenta.status_aprovacao,
		'disponibilidade': ferramenta.disponibilidade,
		'data_cadastro': ferramenta.data_cadastro,
		'usuario_id': ferramenta.usuario_id,
		'categoria_id': ferramenta.categoria_id,
		'fotos': [
			{'id': foto.id, 'url': foto.url or request.build_absolute_uri(foto.arquivo.url)}
			for foto in ferramenta.fotos.all()
		],
	}


@api.post('/fotos', response=FotoOutput, tags=['Fotos'])
def enviar_foto(request, arquivo: UploadedFile = File(...)):
	foto = Foto.objects.create(arquivo=arquivo)
	foto.url = request.build_absolute_uri(foto.arquivo.url)
	foto.save(update_fields=['url'])
	return {'id': foto.id, 'url': foto.url}


@api.post('/ferramentas', response=FerramentaOutput, tags=['Ferramentas'])
def criar_ferramenta(request, payload: FerramentaInput):
	usuario = get_object_or_404(Usuario, id=payload.usuario_id)
	categoria = get_object_or_404(Categoria, id=payload.categoria_id)

	if payload.periodo_minimo < 1:
		raise HttpError(400, 'O período mínimo deve ser maior que zero.')

	with transaction.atomic():
		ferramenta = Ferramenta.objects.create(
			nome=payload.nome,
			marca=payload.marca,
			modelo=payload.modelo,
			estado_conservacao=payload.estado_conservacao,
			descricao=payload.descricao,
			itens_inclusos=payload.itens_inclusos,
			preco_diaria=payload.preco_diaria,
			preco_semanal=payload.preco_semanal,
			periodo_minimo=payload.periodo_minimo,
			exige_caucao=payload.exige_caucao,
			politica_cancelamento=payload.politica_cancelamento,
			entrega=payload.entrega,
			disponibilidade=payload.disponibilidade,
			data_cadastro=date.today(),
			usuario=usuario,
			categoria=categoria,
		)

		Localizacao.objects.create(
			endereco=payload.endereco,
			bairro=payload.bairro,
			cidade=payload.cidade,
			entrega=payload.entrega,
			ferramenta=ferramenta,
		)
		for url in payload.fotos:
			foto = Foto.objects.filter(url=url, ferramenta__isnull=True).first()
			if foto is not None:
				foto.ferramenta = ferramenta
				foto.save(update_fields=['ferramenta'])
			else:
				Foto.objects.create(url=url, ferramenta=ferramenta)

	return serializar_ferramenta(request, ferramenta)