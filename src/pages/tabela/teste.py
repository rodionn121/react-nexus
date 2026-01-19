def analisarResposta(posse, contra):
    acao_desarmes = ["!desarme", "!desarmar", "!d"]
    acao_bloqueios = ["!bloqueio", "!bloquear", "!b"]
    regras = {
        "!passe": acao_desarmes,
        "!enfiada": acao_desarmes,
        "!chute": acao_bloqueios,        
    }
    
    defesa_desejada = regras.get(posse)
    if defesa_desejada and contra in defesa_desejada:
        return "Ação bem sucedida"
    else:
        return "Erro cometido! Bola adversária"
            


c1 = input("Primeiro comando: ")
c2 = input("Segundo comando: ")
print(analisarResposta(c1, c2))