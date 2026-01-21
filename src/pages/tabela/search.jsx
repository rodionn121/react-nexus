import { useState, useEffect } from 'react'
import "./search.css"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Header } from '../../components/header/header'

function Search() {
    /* =======================
        ESTADO INICIAL
    ======================= */
    const [filtros, setFiltros] = useState({
        busca: '',
        vulgo: '',
        cor_pele: '',
        altura_aproximada: '',
        data_nascimento: '',
        cor_olho: '',
        cidade_atuacao: '',
        tatuagem: [], // Alterado para array para suportar múltiplas tags
        crime: [],
        integrante_faccao: '',
        info_adicional: ''
    });

    const [imagemExpandida, setImagemExpandida] = useState(null);

    const [isRG, setIsRG] = useState(false);
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notificacao, setNotificacao] = useState("");

    const opcoesOlhos = ["Preto", "Castanho claro", "Castanho escuro", "Verde", "Azul", "Não sei"];
    const opcoesFaccao = ["PCC", "CV", "Bonde do Magrelo", "BDM", "TCP", "FDN", "Outra"];
    const opcoesTatuagem = ["Rosto", "Pescoço", "Tórax", "Ombro direito", "Ombro esquerdo", "Braço direito", "Braço esquerdo", "Antebraço direito", "Antebraço esquerdo", "Mão direita", "Mão esquerda", "Costas", "Abdômen", "Coxa direita", "Coxa esquerda", "Panturrilha direita", "Panturrilha esquerda", "Pé direito", "Pé esquerdo"];
    const opcoesCrimes = ["Roubo", "Furto", "Tráfico de drogas", "Tráfico de armas", "Homicídio doloso", "Porte Ilegal", "Estelionato", "Estupro", "Latrocínio"];


    const abrirZoom = (url) => {
        setImagemSelecionada(url);
        setModalImagemAberto(true);
    };

    /* =======================
        HANDLERS DE TATUAGEM (Igual ao Cadastro)
    ======================= */
    const handleAddTatuagem = (e) => {
        const valor = e.target.value;
        if (valor && !filtros.tatuagem.includes(valor)) {
            setFiltros(prev => ({
                ...prev,
                tatuagem: [...prev.tatuagem, valor]
            }));
        }
        e.target.value = ""; // Reseta o select
    };

    const handleRemoveTatuagem = (regiao) => {
        setFiltros(prev => ({
            ...prev,
            tatuagem: prev.tatuagem.filter(t => t !== regiao)
        }));
    };

    const handleAddCrime = (e) => {
        const valor = e.target.value;
        if (valor && !filtros.crime.includes(valor)) {
            setFiltros(prev => ({
                ...prev,
                crime: [...prev.crime, valor]
            }));
        }
        e.target.value = ""; // Reseta o select
    };

    const handleRemoveCrime = (nome_crime) => {
        setFiltros(prev => ({
            ...prev,
            crime: prev.crime.filter(t => t !== nome_crime)
        }));
    };

    /* =======================
        MÁSCARAS E HANDLERS GERAIS
    ======================= */
    const aplicarMascaraRG = (value) => {
        return value
            .replace(/\D/g, '') // Remove tudo o que não é dígito
            .replace(/(\d{2})(\d)/, '$1.$2') // Primeiro ponto: 00.0
            .replace(/(\d{3})(\d)/, '$1.$2') // Segundo ponto: 00.000.0
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Traço: 00.000.000-0 ou 00.000.000-00
            .substring(0, 13); // Aumentado para 13 para permitir XX.XXX.XXX-XX
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'busca' && isRG) {
            setFiltros(prev => ({ ...prev, [name]: aplicarMascaraRG(value) }));
        } else {
            setFiltros(prev => ({ ...prev, [name]: value }));
        }
    };

    const formatarRG = (rg) => {
        if (!rg) return '---';

        return rg
            .toString()
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            .substring(0, 13);
    };

    const formatarDataBR = (data) => {
        if (!data) return '---';

        // Garante que pega só a parte da data
        const dataLimpa = data.split('T')[0];

        const [ano, mes, dia] = dataLimpa.split('-');

        if (!ano || !mes || !dia) return '---';

        return `${dia}/${mes}/${ano}`;
    };

    const menorDeIdade = (dataNascimento) => {
        if (!dataNascimento) return "Não";

        const dataLimpa = dataNascimento.split('T')[0];
        const [ano, mes, dia] = dataLimpa.split('-').map(Number);

        if (!ano || !mes || !dia) return "Não";

        const hoje = new Date();
        let idade = hoje.getFullYear() - ano;

        const aniversarioEsteAno = new Date(
            hoje.getFullYear(),
            mes - 1,
            dia
        );

        if (hoje < aniversarioEsteAno) {
            idade--;
        }

        return idade < 18 ? "Sim" : "Não";
    };


    const limparFiltros = () => {
        setFiltros({ busca: '', vulgo: '', data_nascimento: '', cor_pele: '', crime: [], cidade_atuacao: '', info_adicional: '', tatuagem: [], cor_olho: '', integrante_faccao: '' });
        setIsRG(false);
        mostrarNotificacao("Filtros limpos!");
    };

    const mostrarNotificacao = (msg) => {
        setNotificacao(msg);
        setTimeout(() => setNotificacao(""), 3000);
    };

    /* =======================
        CHAMADA API
    ======================= */
    async function fetchDados(e) {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const params = new URLSearchParams();

            // Busca por Nome ou RG
            if (filtros.busca) {
                const valorBusca = isRG ? filtros.busca.replace(/\D/g, '') : filtros.busca;
                isRG ? params.append('nr_rg', valorBusca) : params.append('nome', valorBusca);
            }

            // Filtros simples (só adiciona se houver valor)
            if (filtros.vulgo) params.append('vulgo', filtros.vulgo);
            if (filtros.cor_pele) params.append('cor_pele', filtros.cor_pele);
            if (filtros.cidade_atuacao) params.append('cidade_atuacao', filtros.cidade_atuacao);
            if (filtros.cor_olho) params.append('cor_olho', filtros.cor_olho);
            if (filtros.integrante_faccao) params.append('integrante_faccao', filtros.integrante_faccao);
            if (filtros.data_nascimento) params.append('data_nascimento', filtros.data_nascimento);
            if (filtros.info_adicional) params.append('info_adicional', filtros.info_adicional);

            // Filtros de Array (só adiciona se o array não estiver vazio)
            if (filtros.crime && filtros.crime.length > 0) {
                params.append('crime', filtros.crime.join(','));
            }

            if (filtros.tatuagem && filtros.tatuagem.length > 0) {
                params.append('tatuagem', filtros.tatuagem.join(','));
            }

            const token = localStorage.getItem('token_nexus');
            // Se params estiver vazio, a URL será apenas ".../pessoas/"
            const queryString = params.toString();
            const url = `https://backend-nexus-md0p.onrender.com/pessoas/${queryString ? '?' + queryString : ''}`;

            const resposta = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!resposta.ok) {
                setResultados([]);
                return;
            }

            const dados = await resposta.json();
            setResultados(Array.isArray(dados) ? dados : []);

        } catch (err) {
            console.error("Erro na busca:", err);
            mostrarNotificacao("Erro ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchDados(); }, [filtros]);

    return (
        <div className="min-h-screen bg-black text-white antialiased font-sans">
            {notificacao && (
                <div className="fixed top-4 right-4 bg-blue-600 px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce">
                    {notificacao}
                </div>
            )}

            <Header />

            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <form onSubmit={fetchDados} className="space-y-4">
                    {/* BUSCA PRINCIPAL */}
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
                        <div className="flex-1">
                            <input
                                type="text"
                                name="busca"
                                value={filtros.busca}
                                onChange={handleChange}
                                placeholder={isRG ? '00.000.000-0' : 'Pesquisar por nome completo...'}
                                className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-700"
                            />
                        </div>

                        <div className="flex items-center justify-center gap-2 bg-[#0d1117] px-4 py-4 rounded-lg border border-gray-800">
                            <input
                                id="checkRG"
                                type="checkbox"
                                checked={isRG}
                                onChange={(e) => { setIsRG(e.target.checked); setFiltros(p => ({ ...p, busca: '' })) }}
                                className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-blue-600"
                            />
                            <label htmlFor="checkRG" className="text-sm text-gray-400 cursor-pointer select-none">RG</label>
                        </div>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-bold transition-all shadow-lg active:scale-95">
                            BUSCAR
                        </button>
                    </div>

                    {/* GRID DE FILTROS AVANÇADOS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 bg-[#0d1117] border border-gray-800 rounded-xl shadow-2xl">

                        <input
                            type="text" name="vulgo" placeholder="Vulgo" value={filtros.vulgo} onChange={handleChange}
                            className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300 outline-none focus:border-blue-500"
                        />

                        <select name="cor_pele" value={filtros.cor_pele} onChange={handleChange}
                            className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300 outline-none focus:border-blue-500">
                            <option value="">Pele: Todas</option>
                            <option value="Branco">Branco</option>
                            <option value="Preto">Preto</option>
                            <option value="Parda">Parda</option>
                            <option value="Vermelho">Vermelho</option>
                            <option value="Amarelo">Amarelo</option>
                        </select>

                        <select name="cor_olho" value={filtros.cor_olho} onChange={handleChange}
                            className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300 outline-none focus:border-blue-500">
                            <option value="">Olhos: Todos</option>
                            {opcoesOlhos.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>

                        {/* FILTRO DE TATUAGEM COM MÚLTIPLA SELEÇÃO */}
                        <div className="flex flex-col gap-1">
                            <select
                                onChange={handleAddCrime}
                                className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300 outline-none focus:border-blue-500"
                            >
                                <option value="">+ Crimes</option>
                                {opcoesCrimes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <select name="integrante_faccao" value={filtros.integrante_faccao} onChange={handleChange}
                            className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300 outline-none focus:border-blue-500">
                            <option value="">Facção: Todas</option>
                            {opcoesFaccao.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>

                        <input
                            type="text" name="cidade_atuacao" placeholder="Cidade" value={filtros.cidade_atuacao} onChange={handleChange}
                            className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300 outline-none focus:border-blue-500"
                        />

                        <input
                            type="text" name="info_adicional" placeholder="Informação adicional" value={filtros.info_adicional} onChange={handleChange}
                            className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300 outline-none focus:border-blue-500"
                        />

                        {/* FILTRO DE TATUAGEM COM MÚLTIPLA SELEÇÃO */}
                        <div className="flex flex-col gap-1">
                            <select
                                onChange={handleAddTatuagem}
                                className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300 outline-none focus:border-blue-500"
                            >
                                <option value="">+ Tatuagem</option>
                                {opcoesTatuagem.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <input
                            type="date" name="data_nascimento" value={filtros.data_nascimento} onChange={handleChange}
                            className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300 outline-none focus:border-blue-500"
                        />

                        <button type="button" onClick={limparFiltros}
                            className="text-red-500 text-xs font-black uppercase hover:text-red-400 transition-colors">
                            Limpar Tudo
                        </button>
                    </div>

                    {/* ÁREA DE EXIBIÇÃO DAS TAGS DE TATUAGEM SELECIONADAS */}
                    {filtros.tatuagem.length > 0 && (
                        <fieldset className="flex flex-wrap gap-2 p-2 bg-blue-900/10 border border-blue-900/30 rounded-lg">
                            <legend className='text-sm text-zinc-500 px-2 font-bold'>Tatuagens</legend>
                            {filtros.tatuagem.map(t => (
                                <span key={t} className="flex items-center gap-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                                    {t.toUpperCase()}
                                    <button type="button" onClick={() => handleRemoveTatuagem(t)} className="hover:text-black">✕</button>
                                </span>
                            ))}
                        </fieldset>
                    )}

                    {/* ÁREA DE EXIBIÇÃO DAS TAGS DE TATUAGEM SELECIONADAS */}
                    {filtros.crime.length > 0 && (
                        <fieldset className="flex flex-wrap gap-2 p-2 bg-blue-900/10 border border-blue-900/30 rounded-lg">
                            <legend className='text-sm text-zinc-500 px-2 font-bold'>Crimes</legend>
                            {filtros.crime.map(t => (
                                <span key={t} className="flex items-center gap-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                                    {t.toUpperCase()}
                                    <button type="button" onClick={() => handleRemoveCrime(t)} className="hover:text-black">✕</button>
                                </span>
                            ))}
                        </fieldset>
                    )}
                </form>

                {/* LISTAGEM DE RESULTADOS */}
                <div className="mt-8 space-y-4">
                    {loading ? (
                        <div className="text-center py-20 text-gray-500 animate-pulse">Consultando base Nexus...</div>
                    ) : resultados.length > 0 ? (
                        resultados.map((item) => (
                            <div key={item.id} className="bg-[#0d1117] border border-gray-800 rounded-xl p-6 hover:border-blue-900 transition-all shadow-lg group">
                                {console.log(item)}
                                <div className="flex justify-between items-start">
                                    <div>

                                        {/* <img src={item.fotos.find(f => f.is_main)?.secure_url || "Não informado."} className='w-30 rounded-xl md:w-30' /> */}
                                        <h3 className="text-xl font-bold text-gray-100 group-hover:text-blue-400 transition-colors">{item.nome}</h3>
                                        <p className="text-blue-500 text-xs font-bold uppercase tracking-widest">{item.vulgo ? `"${item.vulgo}"` : 'Sem vulgo'}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase ${item.integrante_faccao !== 'Nenhuma' ? 'bg-red-900/30 text-red-500 border border-red-800' : 'bg-gray-800 text-gray-400'}`}>
                                        {item.integrante_faccao || 'Sem Facção'}
                                    </span>
                                </div>

                                <div className="h-[1px] bg-gray-800 my-4"></div>

                                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                                    <p className="text-gray-400"><span className="text-gray-600 uppercase text-[10px] block">Identidade</span> RG: {formatarRG(item.nr_rg)}</p>
                                    <p className="text-gray-400"><span className="text-gray-600 uppercase text-[10px] block">Crime Principal</span> <span className="text-blue-400 font-bold">{Array.isArray(item.crimes) && item.crimes.length > 0
                                        ? item.crimes.map(t => t.nome_crime).join(', ')
                                        : 'Não informado'}</span></p>
                                    <p className="text-gray-400"><span className="text-gray-600 uppercase text-[10px] block">Localização</span> {item.cidade_atuacao || "Não informado."}</p>
                                    <p className='text-gray-400'><span className='text-gray-600 uppercase text-[10px] block'>Cor da pele</span> {item.cor_pele || "Não informado."}</p>
                                    <p className='text-gray-400'><span className='text-gray-600 uppercase text-[10px] block'>Cor do olho</span> {item.cor_olho || "Não informado."}</p>
                                    <p className='text-gray-400'>
                                        <span className='text-gray-600 uppercase text-[10px] block'>Tatuagens</span>
                                        {Array.isArray(item.tatuagens) && item.tatuagens.length > 0
                                            ? item.tatuagens.map(t => t.regiao).join(', ')
                                            : 'Não informado'}
                                    </p>
                                    <p className='text-gray-400'><span className='text-gray-600 uppercase text-[10px] block'>Nascimento</span>{formatarDataBR(item.data_nascimento)}</p>

                                    <p className='text-gray-400'><span className='text-gray-600 uppercase text-[10px] block'>Informação adicional</span> {item.info_adicional || "Não informado."}</p>
                                    <p className='text-gray-400'><span className='text-gray-600 uppercase text-[10px] block'>Altura aproximada</span> {item.altura_aproximada || "Não informado."}</p>
                                    <p className='text-gray-400'><span className='text-gray-600 uppercase text-[10px] block'>Menor de idade</span> {menorDeIdade(item.data_nascimento)}</p>



                                </div>
                                <div className='flex justify-end'>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 mt-4 rounded-lg font-bold transition-all shadow-lg active:scale-95 text-sm uppercase tracking-wider">
                                                Ver detalhes
                                            </button>
                                        </DialogTrigger>

                                        <DialogContent className="bg-[#0a0f1a] border border-gray-800 text-white max-w-2xl overflow-y-auto max-h-[90vh]">
                                            <DialogHeader className="border-b border-gray-800 pb-4">
                                                <DialogTitle className="text-2xl font-bold text-blue-500 uppercase tracking-tighter">
                                                    Informações
                                                </DialogTitle>
                                                <DialogDescription className="text-gray-500 italic">
                                                    Informações completas do registro: {item.nome}
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-6 py-4">
                                                {/* GRID DE INFORMAÇÕES PESSOAIS */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Nome Completo</span>
                                                        <p className="text-sm font-medium">{item.nome || 'Não informado'}</p>
                                                    </div>
                                                    <div className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Vulgo</span>
                                                        <p className="text-sm font-medium">{item.vulgo || 'Não informado'}</p>
                                                    </div>
                                                    <div className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Documento (RG)</span>
                                                        <p className="text-sm font-medium">{formatarRG(item.nr_rg)}</p>
                                                    </div>
                                                    <div className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Localização de Atuação</span>
                                                        <p className="text-sm font-medium">{item.cidade_atuacao || 'Não informado'}</p>
                                                    </div>
                                                    <div className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Crimes</span>
                                                        <p className="text-sm font-medium">{Array.isArray(item.crimes) ? item.crimes.map(t => t.nome_crime).join(', ') : 'N/I'}</p>
                                                    </div>
                                                    <div className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Data de Nascimento</span>
                                                        <p className="text-sm font-medium">{formatarDataBR(item.data_nascimento)}</p>
                                                    </div>
                                                    <div className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Características Físicas</span>
                                                        <p className="text-sm font-medium">Olhos {item.cor_olho}, Pele {item.cor_pele}</p>
                                                    </div>
                                                    <div className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Altura aproximada</span>
                                                        <p className="text-sm font-medium">{item.altura_aproximada}</p>
                                                    </div>
                                                    <div className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Menor de idade</span>
                                                        <p className="text-sm font-medium">{menorDeIdade(item.data_nascimento)}</p>
                                                    </div>
                                                    <div className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Tatuagens</span>
                                                        <p className="text-sm font-medium"> {Array.isArray(item.tatuagens) ? item.tatuagens.map(t => t.regiao).join(', ') : 'N/I'}</p>
                                                    </div>
                                                    <div className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold block">Facção</span>
                                                        <p className={`text-sm font-bold ${item.integrante_faccao !== 'Nenhuma' ? 'text-red-500' : 'text-green-500'}`}>
                                                            {item.integrante_faccao || 'Nenhuma'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* OBSERVAÇÕES */}
                                                <div className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                                                    <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Informações Adicionais / Observações</span>
                                                    <p className="text-sm text-gray-300 leading-relaxed">
                                                        {item.info_adicional || "Nenhuma observação registrada no sistema."}
                                                    </p>
                                                </div>

                                                {/* GALERIA DE FOTOS (TATUAGENS / CICATRIZES) */}
                                                <div>
                                                    <span className="text-[10px] text-blue-500 uppercase font-bold block mb-3 tracking-widest">
                                                        Galeria de Identificadores (Clique para ampliar)
                                                    </span>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        {item.fotos?.filter(f => !f.is_main).length > 0 ? (
                                                            item.fotos
                                                                .filter(f => !f.is_main)
                                                                .map((foto, index) => (
                                                                    <div
                                                                        key={index}
                                                                        onClick={() => abrirZoom(foto.secure_url)}
                                                                        className="relative group overflow-hidden rounded-xl border border-gray-800 bg-black aspect-square cursor-zoom-in"
                                                                    >
                                                                        <img
                                                                            src={foto.secure_url}
                                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                            alt={`Detalhe ${index}`}
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                            <span className="text-white text-xs font-bold bg-blue-600 px-2 py-1 rounded">AMPLIAR</span>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                        ) : (
                                                            <p className="text-xs text-gray-600 italic">Nenhuma foto secundária anexada.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>


                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-700 border-2 border-dashed border-gray-900 rounded-2xl">
                            Nenhum indivíduo localizado com os parâmetros informados.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Search;