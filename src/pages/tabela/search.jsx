import { useState, useEffect, useContext } from 'react'
import "./search.css"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Header } from '../../components/header/header'
import { AuthContext } from '../../context/AuthContext'
import { FiltrosBusca } from '../../components/filterSearch'
import { CardPessoa } from '../../components/cardSearch'


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
        cidade_atuacao: [],
        tatuagem: [], // Alterado para array para suportar múltiplas tags
        crime: [],
        integrante_faccao: '',
        info_adicional: ''
    });


    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState([]);

    const [editandoId, setEditandoId] = useState(null);
    const [dadosEditados, setDadosEditados] = useState({});
    const { isAdmin } = useContext(AuthContext);



    const [imagemExpandida, setImagemExpandida] = useState(null);

    const [isRG, setIsRG] = useState(false);
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notificacao, setNotificacao] = useState("");

    const opcoesOlhos = ["Preto", "Castanho claro", "Castanho escuro", "Verde", "Azul", "Não sei"];
    const opcoesFaccao = ["PCC", "CV", "Bonde do Magrelo", "BDM", "TCP", "FDN", "Outra"];
    const faccoes = ['Nenhuma',
        'Primeiro Comando da Capital', 'Comando Vermelho', 'Família do Norte', 'Guardiões do Estado', 'Bonde dos 40', 'Bonde dos Malucos', 'Cerol Fino', 'Terceiro Comando Puro', 'Primeiro Grupo Catarinense', 'Amigos dos amigos', 'Bonde do Magrelo', 'Comando Revolucionário Brasileiro de Criminalidade', 'Primeiro Comando Puro'
    ]

    const siglasFaccao = {
        'Nenhuma': 'Nenhuma',
        'Primeiro Comando da Capital': 'PCC',
        'Comando Vermelho': 'CV',
        'Família do Norte': 'FDN',
        'Guardiões do Estado': 'GDE',
        'Bonde dos 40': 'Bonde dos 40',
        'Bonde dos Malucos': 'Bonde dos malucos',
        'Cerol Fino': 'Cerol Fino',
        'Terceiro Comando Puro': 'TCP',
        'Primeiro Grupo Catarinense': 'PGC',
        'Amigos dos amigos': 'ADA',
        'Bonde do Magrelo': 'Bonde do magrelo',
        'Comando Revolucionário Brasileiro de Criminalidade': 'CRBC',
        'Primeiro Comando Puro': 'PCP'
    };
    const opcoesTatuagem = ["Rosto", "Pescoço", "Tórax", "Ombro direito", "Ombro esquerdo", "Braço direito", "Braço esquerdo", "Antebraço direito", "Antebraço esquerdo", "Mão direita", "Mão esquerda", "Costas", "Abdômen", "Coxa direita", "Coxa esquerda", "Panturrilha direita", "Panturrilha esquerda", "Pé direito", "Pé esquerdo"];
    const opcoesCrimes = ["Roubo", "Furto", "Tráfico de drogas", "Tráfico de armas", "Homicídio doloso", "Porte Ilegal", "Estelionato", "Estupro", "Latrocínio"];
    const opcoesCidades = ['Mongaguá', 'Itariri', 'Pedro de Toledo', 'Barra do Turvo', 'Cajati', 'Cananéia', 'Eldorado', 'Iporanga', 'Pariquera-Açu, Iguape', 'Ilha Comprida', 'Juquiá', 'Miracatu', 'Sete Barras', 'Cubatão', 'Guarujá', 'Praia Grande', 'Santos', 'São Vicente', 'Bertioga', 'Itanhaém', 'Peruíbe', 'Jacupiranga', 'Registro']


    const abrirZoom = (url) => {
        setImagemSelecionada(url);
        setModalImagemAberto(true);
    };

    const iniciarEdicao = (item) => {
        setEditandoId(item.id);
        setDadosEditados(item);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setDadosEditados(prev => ({ ...prev, [name]: value }));
    };

    const salvarEdicao = async (id) => {
        try {
            const token = localStorage.getItem('token_nexus');
            const res = await fetch(`https://backend-nexus-md0p.onrender.com/pessoa/editar/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosEditados)
            });

            if (res.ok) {
                mostrarNotificacao("Registro atualizado com sucesso!");
                setEditandoId(null);
                fetchDados();
            } else {
                mostrarNotificacao("Erro ao atualizar o registro.");
            }
        } catch (err) {
            console.error("Erro na edição:", err);
            mostrarNotificacao("Erro ao conectar com o servidor.");
        }

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

    const handleAddCidade = (e) => {
        const valor = e.target.value;
        if (valor && !filtros.cidade_atuacao.includes(valor)) {
            setFiltros(prev => ({
                ...prev,
                cidade_atuacao: [...prev.cidade_atuacao, valor]
            }));
        }
        e.target.value = ""; // Reseta o select
    };

    const handleRemoveCidade = (nome_cidade) => {
        setFiltros(prev => ({
            ...prev,
            cidade_atuacao: prev.cidade_atuacao.filter(t => t !== nome_cidade)
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
        setFiltros({ busca: '', vulgo: '', data_nascimento: '', cor_pele: '', crime: [], cidade_atuacao: [], info_adicional: '', tatuagem: [], cor_olho: '', integrante_faccao: '' });
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
            if (filtros.cor_olho) params.append('cor_olho', filtros.cor_olho);
            if (filtros.integrante_faccao) params.append('integrante_faccao', filtros.integrante_faccao);
            if (filtros.data_nascimento) params.append('data_nascimento', filtros.data_nascimento);
            if (filtros.info_adicional) params.append('info_adicional', filtros.info_adicional);
            params.append('page', page);
            params.append('size', size);

            // Filtros de Array (só adiciona se o array não estiver vazio)
            if (filtros.crime && filtros.crime.length > 0) {
                params.append('crime', filtros.crime.join(','));
            }

            if (filtros.cidade_atuacao && filtros.cidade_atuacao.length > 0) {
                params.append('cidade', filtros.cidade_atuacao.join(','));
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
                setTotal(0)
                return;
            }

            const dados = await resposta.json();

            setResultados(dados.data || []);
            setTotal(dados.total || 0);

        } catch (err) {
            console.error("Erro na busca:", err);
            mostrarNotificacao("Erro ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => fetchDados(), 400);
        return () => clearTimeout(timer);
    }, [filtros, page, size]);
    useEffect(() => { setPage(1); }, [filtros]);

    return (
        <div className="min-h-screen bg-black text-white antialiased font-sans">
            {notificacao && (
                <div className="fixed top-4 right-4 bg-blue-600 px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce">
                    {notificacao}
                </div>
            )}

            <Header />

            <div className="max-w-7xl mx-auto p-4 md:p-8">

                {/* Aqui você chama o componente e "injeta" as dependências */}
                <FiltrosBusca
                    filtros={filtros}
                    setFiltros={setFiltros}
                    handleChange={handleChange}
                    fetchDados={fetchDados}
                    isRG={isRG}
                    setIsRG={setIsRG}
                    opcoesOlhos={opcoesOlhos}
                    opcoesCrimes={opcoesCrimes}
                    opcoesCidades={opcoesCidades}
                    opcoesTatuagem={opcoesTatuagem}
                    faccoes={faccoes}
                    siglasFaccao={siglasFaccao}
                    handleAddCrime={handleAddCrime}
                    handleRemoveCrime={handleRemoveCrime}
                    handleAddCidade={handleAddCidade}
                    handleRemoveCidade={handleRemoveCidade}
                    handleAddTatuagem={handleAddTatuagem}
                    handleRemoveTatuagem={handleRemoveTatuagem}
                    limparFiltros={limparFiltros}
                />

                {/* ABAIXO VIRIA A LISTA DE RESULTADOS */}

                <div className='flex justify-end mt-10'>
                    <Select onValueChange={(value) => { setSize(Number(value)); setPage(1); }}>
                        <SelectTrigger>
                            <p>Registro por página</p>
                            <SelectValue placeholder="Qtd." />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="mt-4 space-y-4">
                    {loading ? (
                        <div className="text-center py-20 text-gray-500 animate-pulse">Consultando base Nexus...</div>
                    ) : resultados.length > 0 ? (
                        resultados.map((item) => (
                            <CardPessoa
                                key={item.id}
                                item={item}
                                isAdmin={isAdmin}
                                formatarRG={formatarRG}
                                formatarDataBR={formatarDataBR}
                                menorDeIdade={menorDeIdade}
                                abrirZoom={abrirZoom}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-700 border-2 border-dashed border-gray-900 rounded-2xl">
                            Nenhum indivíduo localizado.
                        </div>
                    )}
                </div>
                
                <div className='flex justify-center gap-4 items-center mt-5'>
                    <button className="bg-[#0d1117] border border-gray-800 hover:border-blue-900 text-sm text-gray-200 px-3 py-2 rounded-xl cursor-pointer" disabled={page == 1} onClick={() => setPage(p => p - 1)}>
                        Anterior
                    </button>

                    <span>
                        {page} de {Math.ceil(total / size)}
                    </span>

                    <button className="bg-[#0d1117] border border-gray-800 hover:border-blue-900 text-sm text-gray-200 px-3 py-2 rounded-xl cursor-pointer" disabled={page >= Math.ceil(total / size)} onClick={() => setPage(p => p + 1)}>
                        Próxima
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Search;