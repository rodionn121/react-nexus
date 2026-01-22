import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function CardPessoa({
    item,
    formatarRG,
    formatarDataBR,
    menorDeIdade,
    abrirZoom,
    isAdmin
}) {
    return (
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
                <p className="text-gray-400"><span className="text-gray-600 uppercase text-[10px] block">Localização</span> {Array.isArray(item.cidade_atuacao) && item.cidade_atuacao.length > 0
                    ? item.cidade_atuacao.map(t => t.nome_cidade).join(', ')
                    : 'Não informado'}</p>
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
                                    <p className="text-sm font-medium">{Array.isArray(item.cidade_atuacao) ? item.cidade_atuacao.map(t => t.nome_cidade).join(', ') : 'N/I'}</p>
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
    );
}

// Sub-componente apenas para organizar as caixinhas de texto
function InfoBlock({ label, value, color = "text-white" }) {
    return (
        <div className="bg-[#111827] p-3 rounded-lg border border-gray-800">
            <span className="text-[10px] text-gray-500 uppercase font-bold block">{label}</span>
            <p className={`text-sm font-medium ${color}`}>{value || 'Não informado'}</p>
        </div>
    );
}