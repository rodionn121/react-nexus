import { useState } from 'react'
import './home.css'
import Nexus from '../../assets/nexus.png'
import Header from '../../components/header/header'



function Home() {

  /* =======================
     STATES
  ======================= */

  const [filtros, setFiltros] = useState({
    busca: '',
    data_nascimento: '',
    cor_pele: '',
    natureza: '',
    cidade_atuacao: ''
  })

  const [isNumber, setIsNumber] = useState(false)

  /* =======================
     HANDLERS
  ======================= */

  function handleChange(e) {
    const { name, value } = e.target

    setFiltros(prev => ({
      ...prev,
      [name]: value
    }))
  }

  function handleCheckbox(e) {
    setIsNumber(e.target.checked)

    // limpa o campo de busca ao trocar o tipo
    setFiltros(prev => ({
      ...prev,
      busca: ''
    }))
  }

  function limparFiltros() {
    setFiltros({
      busca: '',
      data_nascimento: '',
      cor_pele: '',
      natureza: '',
      cidade_atuacao: '',
      tatuagem: ''
    })

    setIsNumber(false)
  }

  function handleSubmit(e) {
    e.preventDefault()

    const payload = {
      nome: isNumber ? '' : filtros.busca,
      cpf: isNumber ? filtros.busca : '',
      data_nascimento: filtros.data_nascimento,
      cor_pele: filtros.cor_pele,
      natureza: filtros.natureza,
      cidade_atuacao: filtros.cidade_atuacao,
      tatuagem: filtros.tatuagem
    }

    console.log('Payload enviado para API:', payload)

  }

  /* =======================
     JSX
  ======================= */

  return (
    <>
      <Header />

      <main className="container">

        {/* BARRA DE PESQUISA */}
        <form className="busca" onSubmit={handleSubmit}>
          <input
            type='text'
            name="busca"
            value={filtros.busca}
            onChange={handleChange}
            placeholder={isNumber ? 'Pesquisar por CPF' : 'Pesquisar por nome'}
            className="campo"
          />

          <div className="cpf-filtro">
            <label>
              <input
                type="checkbox"
                checked={isNumber}
                onChange={handleCheckbox}
              />
              Buscar por CPF
            </label>
          </div>

          <button type="submit" className="btn buscar">
            Buscar
          </button>
        </form>

        {/* FILTROS */}
        <section className="filtros">

          <div className="campo-filtro">
            <input
              type="date"
              name="data_nascimento"
              value={filtros.data_nascimento}
              onChange={handleChange}
            />

            <select
              name="cor_pele"
              value={filtros.cor_pele}
              onChange={handleChange}
            >
              <option value="">Cor de pele</option>
              <option value="Pardo">Pardo</option>
              <option value="Preto">Preto</option>
              <option value="Branco">Branco</option>
            </select>


            <select
              name="natureza"
              value={filtros.natureza}
              onChange={handleChange}
            >
              <option value="">Natureza</option>
              <option value="Roubo">Roubo</option>
              <option value="Furto">Furto</option>
              <option value="Tráfico de Drogas">Tráfico de Drogas</option>
            </select>

            <select
              name="cidade_atuacao"
              value={filtros.cidade_atuacao}
              onChange={handleChange}
            >
              <option value="">Cidade de atuação</option>
              <option value="Mongaguá">Mongaguá</option>
              <option value="Santos">Santos</option>
              <option value="Peruíbe">Peruíbe</option>
              <option value="Cubatão">Cubatão</option>
              <option value="Itanhaém">Itanhaém</option>
              <option value="Praia Grande">Praia Grande</option>
              <option value="Bertioga">Bertioga</option>
              <option value="Guarujá">Guarujá</option>
            </select>

            <select
              name="tatuagem"
              value={filtros.tatuagem}
              onChange={handleChange}
            >
              <option value="">Tatuagem</option>
              <option value="Pescoço">Pescoço</option>
              <option value="Nuca">Nuca</option>
              <option value="Couro cabeludo">Couro cabeludo</option>
              <option value="Tórax">Tórax</option>
              <option value="Costas">Costas</option>
              <option value="Abdominal">Abdominal</option>
              <option value="Coxa direita">Coxa direita</option>
              <option value="Coxa esquerda">Coxa esquerda</option>
              <option value="Panturrilha direita">Panturrilha direita</option>
              <option value="Panturrilha esquerda">Panturrilha esquerda</option>
              <option value="Tornozelo direito">Tornozelo direito</option>
              <option value="Tornozelo esquerdo">Tornozelo esquerdo</option>
              <option value="Pé direito">Pé direito</option>
              <option value="Pé esquerdo">Pé esquerdo</option>

              <option value="Mão esquerda">Mão esquerda</option>
              <option value="Mão direita">Mão direita</option>
              <option value="Braço direito">Braço direito</option>
              <option value="Braço esquerdo">Braço esquerdo</option>
              <option value="Antebraço esquerdo">Antebraço esquerdo</option>
              <option value="Antebraço direito">Antebraço direito</option>
              <option value="Ombro direito">Ombro direito</option>
              <option value="Ombro esquerdo">Ombro esquerdo</option>
            </select>


            <button className="btn limpar" onClick={limparFiltros}>
              Limpar filtros
            </button>
          </div>

        </section>

        {/* LISTA DE PESSOAS */}
        <section className="informacoes">
          <div className="card">
            <h3>Nome da Pessoa</h3>
            <hr />
            <p>CPF: 123.412.423-21 | Cor: Pardo</p>
            <p>Natureza: Roubo | Cidade: Santos</p>
          </div>
        </section>

      </main>
    </>
  )
}

export default Home
