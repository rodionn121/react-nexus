import { useState } from 'react'
import { Header } from '../../components/header/header'

function Teste() {
  /* ======================= ESTADO INICIAL ======================= */
  const [formData, setFormData] = useState({
    nome: '',
    vulgo: '',
    nr_rg: '',
    cor_pele: '',
    altura_aproximada: '',
    data_nascimento: '',
    cor_olho: '',
    cidade_atuacao: '',
    info_adicional: '',
    tatuagem: [],
    crime: [], // Array de objetos [{nome_crime: '...'}]
    integrante_faccao: 'Nenhuma',
  });

  const [fotoPrincipalBase64, setFotoPrincipalBase64] = useState(null);
  const [galeriaBase64, setGaleriaBase64] = useState([]);

  const opcoesOlhos = ["Preto", "Castanho", "Verde", "Azul"];
  const opcoesPele = ["Branco", "Preto", "Parda"];
  const opcoesFaccao = ["PCC", "CV", "TCP", "EIG", "Nenhuma"];
  const opcoesTatuagem = ["Braço", "Pescoço", "Rosto", "Perna", "Costas", "Mão", "Peito", "Abdomên"];
  const opcoesCrimes = ["Roubo", "Furto", "Tráfico", "Homicídio", "Porte Ilegal"];

  /* ======================= MÁSCARAS E AUXILIARES ======================= */
  const aplicarMascaraData = (value) =>
    value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substring(0, 10);

  const aplicarMascaraAltura = (value) => {
    let v = value.replace(/\D/g, '');
    if (v.length > 3) v = v.substring(0, 3);
    return v.length === 3 ? v.replace(/(\d{1})(\d{2})/, '$1.$2') : v;
  };

  const formatarDataParaISO = (data) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) return null;
    const [d, m, y] = data.split('/');
    return `${y}-${m}-${d}`;
  };

  /* ======================= HANDLERS DE INPUTS ======================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let valor = value;

    if (name === 'data_nascimento') valor = aplicarMascaraData(value);
    if (name === 'altura_aproximada') valor = aplicarMascaraAltura(value);

    setFormData(prev => ({ ...prev, [name]: valor }));
  };

  const handleAddTatuagem = (e) => {
    const regiaoSelecionada = e.target.value;
    if (regiaoSelecionada && !formData.tatuagem.find(t => t.regiao === regiaoSelecionada)) {
      setFormData(prev => ({
        ...prev,
        tatuagem: [...prev.tatuagem, { regiao: regiaoSelecionada }]
      }));
    }
    e.target.value = "";
  };

  const handleRemoveTatuagem = (regiao) => {
    setFormData(prev => ({
      ...prev,
      tatuagem: prev.tatuagem.filter(t => t.regiao !== regiao)
    }));
  };

  // CORRIGIDO: Referência correta aos parâmetros e nomes de variáveis
  const handleAddCrime = (e) => {
    const crimeSelecionado = e.target.value;
    if (crimeSelecionado && !formData.crime.find(t => t.nome_crime === crimeSelecionado)) {
      setFormData(prev => ({
        ...prev,
        crime: [...prev.crime, { nome_crime: crimeSelecionado }]
      }));
    }
    e.target.value = "";
  };

  const handleRemoveCrime = (nome_crime) => {
    setFormData(prev => ({
      ...prev,
      crime: prev.crime.filter(t => t.nome_crime !== nome_crime)
    }));
  };

  /* ======================= HANDLERS DE FOTOS ======================= */
  const handleFotoPrincipalChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotoPrincipalBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGaleriaChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGaleriaBase64(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removerFotoGaleria = (index) => {
    setGaleriaBase64(prev => prev.filter((_, i) => i !== index));
  };

  /* ======================= SUBMIT ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token_nexus');
    if (!token) return alert('Usuário não autenticado.');

    const dataISO = formatarDataParaISO(formData.data_nascimento);
    if (!dataISO) return alert('Data de nascimento inválida.');

    const payload = {
      ...formData,
      data_nascimento: dataISO,
      foto_principal: fotoPrincipalBase64,
      foto_galeria: galeriaBase64
    };

    try {
      const response = await fetch('https://backend-nexus-md0p.onrender.com/pessoa/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Registro concluído com sucesso!');
        window.location.reload(); 
      } else {
        const err = await response.json();
        alert(`Erro: ${err.detail || 'Falha no cadastro'}`);
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      <Header />

      <main className="max-w-5xl mx-auto p-4 md:p-10">
        <div className="bg-[#0d1117] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-blue-900/10 to-transparent">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-blue-500">Novo Registro</h1>
            <p className="text-gray-500 text-sm">Preencha todos os campos obrigatórios (*)</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">

            {/* IDENTIFICAÇÃO */}
            <section className="space-y-6">
              <h2 className="text-blue-500 font-bold uppercase text-xs tracking-widest border-b border-gray-800 pb-2">Identificação</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Nome Completo *</label>
                  <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Vulgo</label>
                  <input type="text" name="vulgo" value={formData.vulgo} onChange={handleChange} className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">RG *</label>
                  <input required type="text" name="nr_rg" value={formData.nr_rg} onChange={handleChange} className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Data Nascimento *</label>
                  <input required type="text" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} placeholder="DD/MM/AAAA" className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Altura Aproximada</label>
                  <input type="text" name="altura_aproximada" value={formData.altura_aproximada} onChange={handleChange} placeholder="0.00" className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
              </div>
            </section>

            {/* CARACTERÍSTICAS FÍSICAS & TATUAGENS */}
            <section className="space-y-6">
              <h2 className="text-blue-500 font-bold uppercase text-xs tracking-widest border-b border-gray-800 pb-2">Características Físicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Cor da Pele *</label>
                  <select required name="cor_pele" value={formData.cor_pele} onChange={handleChange} className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="">Selecione</option>
                    {opcoesPele.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Cor do Olho *</label>
                  <select required name="cor_olho" value={formData.cor_olho} onChange={handleChange} className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="">Selecione</option>
                    {opcoesOlhos.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Adicionar Tatuagem</label>
                  <select onChange={handleAddTatuagem} className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="">Selecione a região</option>
                    {opcoesTatuagem.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tatuagem.map((t) => (
                      <span key={t.regiao} className="flex items-center bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                        {t.regiao}
                        <button type="button" onClick={() => handleRemoveTatuagem(t.regiao)} className="ml-2 hover:text-red-500">✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* HISTÓRICO CRIMINAL */}
            <section className="space-y-6">
              <h2 className="text-blue-500 font-bold uppercase text-xs tracking-widest border-b border-gray-800 pb-2">Histórico Criminal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Crimes</label>
                  <select onChange={handleAddCrime} className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="">Selecione o crime</option>
                    {opcoesCrimes.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.crime.map((t) => (
                      <span key={t.nome_crime} className="flex items-center bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                        {t.nome_crime}
                        <button type="button" onClick={() => handleRemoveCrime(t.nome_crime)} className="ml-2 hover:text-red-500">✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Facção</label>
                  <select name="integrante_faccao" value={formData.integrante_faccao} onChange={handleChange} className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-3 outline-none">
                    {opcoesFaccao.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Cidade Atuação *</label>
                  <input required type="text" name="cidade_atuacao" value={formData.cidade_atuacao} onChange={handleChange} className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-3 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Informação adicional</label>
                  <input type="text" name="info_adicional" value={formData.info_adicional} onChange={handleChange} className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-3 outline-none" />
                </div>
              </div>
            </section>

            {/* ANEXOS */}
            <section className="space-y-6">
              <h2 className="text-blue-500 font-bold uppercase text-xs tracking-widest border-b border-gray-800 pb-2">Anexos e Fotos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-gray-400 uppercase">Foto Principal (Perfil) *</label>
                  <div className="relative h-64 w-full bg-[#0a0f1a] border-2 border-dashed border-gray-700 rounded-2xl overflow-hidden flex items-center justify-center group">
                    {fotoPrincipalBase64 ? (
                      <img src={fotoPrincipalBase64} className="w-full h-full object-cover" alt="Perfil" />
                    ) : (
                      <div className="text-center text-gray-600">
                        <span className="text-4xl block mb-2">👤</span>
                        <p className="text-[10px] uppercase font-bold">Clique para upload</p>
                      </div>
                    )}
                    <input type="file" required accept="image/*" onChange={handleFotoPrincipalChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-gray-400 uppercase">Galeria (Outras Fotos)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="h-20 bg-[#0a0f1a] border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-900 transition-all">
                      <span className="text-xl text-blue-500">+</span>
                      <input type="file" multiple accept="image/*" onChange={handleGaleriaChange} className="hidden" />
                    </label>
                    {galeriaBase64.map((img, i) => (
                      <div key={i} className="relative h-20 w-full group">
                        <img src={img} className="w-full h-full object-cover rounded-xl border border-gray-800" alt={`Galeria ${i}`} />
                        <button type="button" onClick={() => removerFotoGaleria(i)} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-2xl transition-all uppercase tracking-widest active:scale-95">
              Finalizar Registro
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Teste;