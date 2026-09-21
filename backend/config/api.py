from datetime import date

from django.contrib.auth.hashers import check_password, make_password
from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, Schema
from ninja.errors import HttpError

from toolrent.models import Categoria, Ferramenta, Usuario

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
	descricao: str
	preco_diaria: float
	disponibilidade: bool = True
	usuario_id: int
	categoria_id: int


class FerramentaOutput(Schema):
	id: int
	nome: str
	descricao: str
	preco_diaria: float
	disponibilidade: bool
	data_cadastro: date
	usuario_id: int
	categoria_id: int


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
	return Ferramenta.objects.select_related('usuario', 'categoria').all()


@api.post('/ferramentas', response=FerramentaOutput, tags=['Ferramentas'])
def criar_ferramenta(request, payload: FerramentaInput):
	usuario = get_object_or_404(Usuario, id=payload.usuario_id)
	categoria = get_object_or_404(Categoria, id=payload.categoria_id)

	return Ferramenta.objects.create(
		nome=payload.nome,
		descricao=payload.descricao,
		preco_diaria=payload.preco_diaria,
		disponibilidade=payload.disponibilidade,
		data_cadastro=date.today(),
		usuario=usuario,
		categoria=categoria,
	)