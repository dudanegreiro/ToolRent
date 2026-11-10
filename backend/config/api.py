from datetime import date

from django.contrib.auth.hashers import check_password, make_password
from django.db import IntegrityError, transaction
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


class UsuarioUpdateInput(Schema):
	nome: str = None
	telefone: str = None
	senha: str = None


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


class FerramentaUpdateInput(Schema):
	nome: str = None
	marca: str = None
	modelo: str = None
	estado_conservacao: str = None
	descricao: str = None
	itens_inclusos: str = None
	preco_diaria: float = None
	preco_semanal: float = None
	periodo_minimo: int = None
	exige_caucao: bool = None
	politica_cancelamento: str = None
	entrega: bool = None
	disponibilidade: bool = None
	categoria_id: int = None


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


@api.get('/usuarios/{usuario_id}', response=UsuarioOutput, tags=['Usuários'])
def obter_usuario(request, usuario_id: int):
	return get_object_or_404(Usuario, id=usuario_id)


@api.patch('/usuarios/{usuario_id}', response=UsuarioOutput, tags=['Usuários'])
def atualizar_usuario(request, usuario_id: int, payload: UsuarioUpdateInput):
	usuario = get_object_or_404(Usuario, id=usuario_id)

	if payload.nome is not None:
		if not payload.nome.strip():
			raise HttpError(400, 'O nome não pode ficar vazio.')
		usuario.nome = payload.nome.strip()

	if payload.telefone is not None:
		telefone = ''.join(ch for ch in payload.telefone if ch.isdigit())
		if len(telefone) < 10:
			raise HttpError(400, 'Informe um telefone válido com DDD e número.')
		usuario.telefone = telefone

	if payload.senha is not None and payload.senha.strip():
		usuario.senha = make_password(payload.senha.strip())

	usuario.save()
	return usuario


@api.post('/usuarios', response=UsuarioOutput, tags=['Usuários'])
def criar_usuario(request, payload: UsuarioInput):
	try:
		return Usuario.objects.create(
			nome=payload.nome,
			email=payload.email,
			cpf=payload.cpf,
			senha=make_password(payload.senha),
			telefone=payload.telefone,
			data_cadastro=date.today(),
		)
	except IntegrityError as exc:
		if Usuario.objects.filter(cpf=payload.cpf).exists():
			raise HttpError(400, 'Este CPF já está cadastrado. Faça login ou utilize outro CPF.')
		if Usuario.objects.filter(email=payload.email).exists():
			raise HttpError(400, 'Este e-mail já está cadastrado. Faça login ou utilize outro e-mail.')
		raise HttpError(400, 'Não foi possível concluir o cadastro. Verifique os dados e tente novamente.')


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
	fotos = []
	for foto in ferramenta.fotos.all():
		url = foto.url or (foto.arquivo.url if foto.arquivo else '')
		if not url or url.startswith('blob:'):
			continue
		fotos.append({'id': foto.id, 'url': request.build_absolute_uri(url) if not url.startswith('http') else url})

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
		'fotos': fotos,
	}


@api.post('/fotos', response=FotoOutput, tags=['Fotos'])
def enviar_foto(request, arquivo: UploadedFile = File(...)):
	foto = Foto.objects.create(arquivo=arquivo)
	foto.url = request.build_absolute_uri(foto.arquivo.url)
	foto.save(update_fields=['url'])
	return {'id': foto.id, 'url': foto.url}


@api.post('/ferramentas', response=FerramentaOutput, tags=['Ferramentas'])
def criar_ferramenta(request, payload: FerramentaInput):
	usuario = Usuario.objects.filter(id=payload.usuario_id).first()
	if usuario is None:
		raise HttpError(400, 'Usuário não encontrado. Faça login novamente e tente publicar o anúncio.')

	categoria = Categoria.objects.filter(id=payload.categoria_id).first()
	if categoria is None:
		raise HttpError(400, 'Categoria não encontrada. Selecione uma categoria válida para continuar.')

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
			if not url or url.startswith('blob:'):
				continue
			foto = Foto.objects.filter(url=url, ferramenta__isnull=True).first()
			if foto is not None:
				foto.ferramenta = ferramenta
				foto.save(update_fields=['ferramenta'])
			else:
				Foto.objects.create(url=url, ferramenta=ferramenta)

	return serializar_ferramenta(request, ferramenta)

@api.patch('/ferramentas/{ferramenta_id}', response=FerramentaOutput, tags=['Ferramentas'])
def atualizar_ferramenta(request, ferramenta_id: int, payload: FerramentaUpdateInput):
	ferramenta = get_object_or_404(Ferramenta, id=ferramenta_id)

	if payload.nome is not None:
		if not payload.nome.strip():
			raise HttpError(400, 'O nome do anúncio não pode ficar vazio.')
		ferramenta.nome = payload.nome.strip()

	if payload.marca is not None:
		ferramenta.marca = payload.marca.strip()

	if payload.modelo is not None:
		ferramenta.modelo = payload.modelo.strip()

	if payload.estado_conservacao is not None:
		ferramenta.estado_conservacao = payload.estado_conservacao.strip()

	if payload.descricao is not None:
		if not payload.descricao.strip():
			raise HttpError(400, 'A descrição não pode ficar vazia.')
		ferramenta.descricao = payload.descricao.strip()

	if payload.itens_inclusos is not None:
		ferramenta.itens_inclusos = payload.itens_inclusos.strip()

	if payload.preco_diaria is not None:
		if payload.preco_diaria <= 0:
			raise HttpError(400, 'A diária precisa ser maior que zero.')
		ferramenta.preco_diaria = payload.preco_diaria

	if payload.preco_semanal is not None:
		if payload.preco_semanal < 0:
			raise HttpError(400, 'O valor semanal não pode ser negativo.')
		ferramenta.preco_semanal = payload.preco_semanal

	if payload.periodo_minimo is not None:
		if payload.periodo_minimo < 1:
			raise HttpError(400, 'O período mínimo deve ser maior que zero.')
		ferramenta.periodo_minimo = payload.periodo_minimo

	if payload.exige_caucao is not None:
		ferramenta.exige_caucao = payload.exige_caucao

	if payload.politica_cancelamento is not None:
		ferramenta.politica_cancelamento = payload.politica_cancelamento

	if payload.entrega is not None:
		ferramenta.entrega = payload.entrega
		Localizacao.objects.filter(ferramenta=ferramenta).update(entrega=payload.entrega)

	if payload.disponibilidade is not None:
		ferramenta.disponibilidade = payload.disponibilidade

	if payload.categoria_id is not None:
		categoria = get_object_or_404(Categoria, id=payload.categoria_id)
		ferramenta.categoria = categoria

	ferramenta.save()
	return serializar_ferramenta(request, ferramenta)


@api.delete('/ferramentas/{ferramenta_id}', tags=['Ferramentas'])
def excluir_ferramenta(request, ferramenta_id: int):
	ferramenta = get_object_or_404(Ferramenta, id=ferramenta_id)
	ferramenta.delete()
	return {'sucesso': True}