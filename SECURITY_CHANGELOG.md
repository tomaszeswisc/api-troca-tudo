# Registro de segurança e alterações — api-troca-tudo

> Este documento não guarda valores de senhas, tokens ou segredos. Antes de remover um arquivo rastreado, registre o commit de origem e defina como restaurar código e configurações não sigilosas.

## Inventário inicial — 15/10/2026

- Repositório: https://github.com/tomaszeswisc/api-troca-tudo
- Arquivo `server.js`: blob SHA `24770b3ea0b44f080496b94443ac3d95d947603b220`
- Arquivo `.env`: não encontrado
- Elementos a revisar: configurações de MySQL inseridas diretamente no servidor
- **Código removido nesta etapa:** nenhum.
- **Credenciais substituídas nesta etapa:** nenhuma.
- **Histórico Git reescrito nesta etapa:** não.

## Problemas e ações futuras

- Substituir configuração de conexão com MySQL inserida diretamente no código por variáveis de ambiente; manter todas as rotas existentes.
- Substituir/rotacionar credenciais que tenham sido publicadas antes de considerar a exposição resolvida.
- Revisar eventuais credenciais também presentes em commits antigos; a limpeza de histórico é uma operação separada e exige backup e coordenação com cópias locais.
- Antes de alterar código, anotar o caminho, SHA/commit anterior, resumo do trecho afetado, motivo e procedimento de restauração neste arquivo.
- Nunca registrar valores reais de `DB_PASS`, `JWT_SECRET`, `EMAIL_PASS` ou segredos equivalentes neste documento.

## Diário de modificações

| Data | Arquivo | Operação | Alteração/remoção | Como recuperar |
|---|---|---|---|---|
| 2026-10-15 | `SECURITY_CHANGELOG.md` | Criação | Apenas documentação e inventário; nenhum código original removido | Histórico de commits do próprio arquivo |

## Recuperação

Consulte o histórico de commits em https://github.com/tomaszeswisc/api-troca-tudo/commits e examine a versão anterior de cada arquivo pelo seu commit ou blob SHA. **Não restaure senhas antigas expostas**, pois devem ser revogadas. Para recuperar uma função ou regra segura, compare o diff e restaure somente o código necessário.

## Plano de correção — 15/10/2026

- `server.js`: substituir somente o valor literal da propriedade `password` da conexão MySQL por `process.env.DB_PASS`, deixando o restante do arquivo e todas as rotas intactos.
- Acrescentar `require('dotenv').config()` e dependência `dotenv` em `package.json`.
- Criar `.env.example` fictício e proteger `.env` no `.gitignore`.
- **Trechos a remover:** a atribuição da senha MySQL em texto simples; não registrar seu valor aqui.
- **Recuperação:** código antigo em https://github.com/tomaszeswisc/api-troca-tudo/blob/24770b3ea0b44f080496b94443ac3d95d947603b/server.js ; não reutilizar a senha antiga.
- **Ação local necessária:** configurar uma senha nova no MySQL e criar `.env` privado antes de executar.
- **Até aqui:** plano registrado; execução de código ainda pendente.
