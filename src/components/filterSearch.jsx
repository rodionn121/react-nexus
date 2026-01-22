export function FiltrosBusca({
    filtros,
    handleChange,
    fetchDados,
    isRG,
    setIsRG,
    setFiltros,
    opcoesOlhos,
    opcoesCrimes,
    opcoesCidades,
    opcoesTatuagem,
    faccoes,
    siglasFaccao,
    handleAddCrime,
    handleRemoveCrime,
    handleAddCidade,
    handleRemoveCidade,
    handleAddTatuagem,
    handleRemoveTatuagem,
    limparFiltros
}) {
    return (
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
                        className="w-full bg-[#0a0f1a] border border-gray-700 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-700 text-white"
                    />
                </div>

                <div className="flex items-center justify-center gap-2 bg-[#0d1117] px-4 py-4 rounded-lg border border-gray-800">
                    <input
                        id="checkRG"
                        type="checkbox"
                        checked={isRG}
                        onChange={(e) => {
                            setIsRG(e.target.checked);
                            setFiltros(p => ({ ...p, busca: '' }))
                        }}
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
                    <option value="Branca">Branca</option>
                    <option value="Preta">Preta</option>
                    <option value="Parda">Parda</option>
                    <option value="Vermelha">Vermelha</option>
                    <option value="Amarela">Amarela</option>
                </select>

                <select name="cor_olho" value={filtros.cor_olho} onChange={handleChange}
                    className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300 outline-none focus:border-blue-500">
                    <option value="">Olhos: Todos</option>
                    {opcoesOlhos.map(o => <option key={o} value={o}>{o}</option>)}
                </select>

                <select onChange={handleAddCrime} className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300">
                    <option value="">+ Crimes</option>
                    {opcoesCrimes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select name="integrante_faccao" value={filtros.integrante_faccao} onChange={handleChange}
                    className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300">
                    <option value="">Facção: Todas</option>
                    {faccoes.map(nome => (
                        <option key={nome} value={nome === 'Nenhuma' ? 'Nenhuma' : siglasFaccao[nome]}>
                            {nome} - {nome === 'Nenhuma' ? 'N/A' : siglasFaccao[nome]}
                        </option>
                    ))}
                </select>

                <select onChange={handleAddCidade} className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300">
                    <option value="">+ Cidade</option>
                    {opcoesCidades.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <input
                    type="text" name="info_adicional" placeholder="Informação adicional" value={filtros.info_adicional} onChange={handleChange}
                    className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300"
                />

                <select onChange={handleAddTatuagem} className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300">
                    <option value="">+ Tatuagem</option>
                    {opcoesTatuagem.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <input
                    type="date" name="data_nascimento" value={filtros.data_nascimento} onChange={handleChange}
                    className="bg-[#161b22] border border-gray-700 rounded-md p-2 text-sm text-gray-300"
                />

                <button type="button" onClick={limparFiltros}
                    className="text-red-500 text-xs font-black uppercase hover:text-red-400 transition-colors">
                    Limpar Tudo
                </button>
            </div>

            {/* TAGS SELECIONADAS (Cidades, Tatuagens, Crimes) */}
            <div className="space-y-2">
                {filtros.cidade_atuacao.length > 0 && (
                    <fieldset className="flex flex-wrap gap-2 p-2 bg-blue-900/10 border border-blue-900/30 rounded-lg">
                        <legend className='text-sm text-zinc-500 px-2 font-bold'>Cidades</legend>
                        {filtros.cidade_atuacao.map(t => (
                            <span key={t} className="flex items-center gap-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                                {t.toUpperCase()}
                                <button type="button" onClick={() => handleRemoveCidade(t)} className="hover:text-black">✕</button>
                            </span>
                        ))}
                    </fieldset>
                )}

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
                {/* Repetir a mesma lógica para Tatuagem e Crime abaixo se desejar... */}
            </div>
        </form>
    );
}