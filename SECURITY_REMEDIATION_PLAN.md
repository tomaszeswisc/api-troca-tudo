# Plano de saneamento do histórico Git — api-troca-tudo

> Plano não destrutivo. Este arquivo não contém valores de credenciais. Atualizado em 15/10/2026.

## Situação atual verificada

O server.js usa DB_PASS e dotenv; a senha fixa existiu no histórico. O login ainda pesquisa senha em texto simples.

## Próxima ação fora do GitHub

Substitua a senha MySQL antiga. Planeje a migração dos usuários para bcrypt antes de alterar o fluxo de login.

## Preservação do código

1. Faça uma cópia local do repositório e um backup completo via `git bundle create backup-repositorio.bundle --all` em local **privado**; nunca envie esse backup para um repositório público.
2. Documente o estado e os commits atuais antes de modificar o histórico.
3. Remova o segredo de commits antigos usando substituição filtrada no histórico, preservando server.js e as rotas. NÃO remova server.js inteiro.
4. Inspecione o novo histórico e compare todos os arquivos importantes, garantindo que não houve perda de código.
5. Faça testes locais e somente então coordene a publicação do novo histórico, ciente de que hashes de commits e clones antigos mudarão.
6. Revogue os valores antigos; mesmo após limpar Git, segredos previamente expostos não devem ser reutilizados.

## Recuperação futura

- Modelo de configuração: [`.env.example`](.env.example).
- Registro de alterações anteriores: [`SECURITY_CHANGELOG.md`](SECURITY_CHANGELOG.md).
- Recuperar apenas código-fonte e configurações não sigilosas dos backups locais, **nunca** credenciais antigas.
- Auditar tabela de usuários e migração de hash de senhas.

## Controle desta etapa

- **Arquivos originais excluídos nesta etapa:** nenhum.
- **Código-fonte alterado nesta etapa:** nenhum.
- **Histórico reescrito nesta etapa:** não.
- **Novo documento:** `SECURITY_REMEDIATION_PLAN.md`.

## Migração do login para bcrypt — 15/10/2026

A rota `POST /login` agora busca usuário por e-mail e confere `usuarios.senha` com `bcrypt.compare`. Os demais campos de retorno permanecem iguais; o hash de senha não é enviado ao cliente.

**Pré-requisitos locais para voltar a executar o projeto:**

1. Instale as dependências com `npm install` na pasta do projeto. Isso também atualiza o `package-lock.json`, que ainda não foi regenerado nesta alteração.
2. Configure o MySQL de estudo em um arquivo `.env` privado, copiando `.env.example` e substituindo a senha de exemplo.
3. Confirme que `usuarios.senha` é uma coluna de texto capaz de armazenar hashes bcrypt, preferencialmente `VARCHAR(255)`.
4. Crie usuários de teste com **novas senhas** e armazene somente os respectivos hashes bcrypt; não faça commit dos hashes junto com contas reais.
5. Teste login válido, senha incorreta, e-mail inexistente e envio de parâmetros vazios.

**Atenção:** senhas antigas em texto simples não são aceitas pela nova rota. Evite reutilizá-las e não gere hashes a partir de credenciais antigas expostas. A conversão exige redefinição de senhas dos usuários de teste ou recriação controlada dos dados.

**Arquivos modificados:** `server.js`, `package.json`; sem exclusão de rotas. **Arquivos inalterados:** `package-lock.json` e esquema MySQL, pois não houve execução local. Comparar e validar localmente antes de considerar a migração concluída.
