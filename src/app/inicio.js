import { useState } from 'react'

// lista de mentira, so pra ter alguma coisa na tela
const listaDeFerramentas = [
  { id: 1, nome: 'Furadeira de Impacto Bosch', dono: 'Ricardo M.', preco: 35, categoria: 'Furadeiras' },
  { id: 2, nome: 'Serra Circular Makita', dono: 'Ana C.', preco: 55, categoria: 'Serras' },
  { id: 3, nome: 'Andaime Fachadeiro 1,5m', dono: 'Marcelo T.', preco: 40, categoria: 'Andaimes' },
  { id: 4, nome: 'Gerador a Diesel Toyama', dono: 'Felipe S.', preco: 120, categoria: 'Geradores' },
  { id: 5, nome: 'Betoneira Eletrica Vonder', dono: 'Jorge P.', preco: 80, categoria: 'Betoneiras' },
  { id: 6, nome: 'Compressor de Ar Schulz', dono: 'Beatriz L.', preco: 60, categoria: 'Compressores' },
]

const categorias = ['Todos', 'Furadeiras', 'Serras', 'Andaimes', 'Geradores', 'Betoneiras', 'Compressores']

function Inicio({ usuario, aoSair }) {
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('Todos')

  // filtra pelo texto digitado e pela categoria escolhida
  const filtradas = listaDeFerramentas.filter((f) => {
    const combinaBusca = f.nome.toLowerCase().includes(busca.toLowerCase())
    const combinaCategoria = categoria === 'Todos' || f.categoria === categoria
    return combinaBusca && combinaCategoria
  })

  return (
    <div>

      <div className="menu">
        <h1>ToolRent</h1>
        <p>Logado como: {usuario}</p>
        <button onClick={aoSair}>Sair</button>
      </div>

      {/* FALTA: fazer o botao buscar funcionar, por enquanto filtra enquanto digita */}
      <h2>Buscar ferramenta</h2>
      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <h2>Categorias</h2>
      {categorias.map((nomeCategoria) => (
        <button key={nomeCategoria} onClick={() => setCategoria(nomeCategoria)}>
          {nomeCategoria}
        </button>
      ))}

      <h2>Ferramentas ({filtradas.length})</h2>

      {filtradas.map((ferramenta) => (
        <div className="card" key={ferramenta.id}>
          <b>{ferramenta.nome}</b>
          <p>Dono: {ferramenta.dono}</p>
          <p>R$ {ferramenta.preco} por dia</p>
          <button>Alugar</button>
        </div>
      ))}

      {filtradas.length === 0 && <p>Nenhuma ferramenta encontrada.</p>}

    </div>
  )
}

export default Inicio