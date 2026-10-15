<div align="center">

# 🔄 API Troca Tudo

### Projeto de estudo • Backend e integração com banco de dados

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

Backend educacional de interação com produtos, autenticação e comentários.

</div>

---

## Objetivo

Demonstrar conceitos de rotas HTTP, integração com MySQL e organização de uma API desenvolvida para fins educacionais.

**Tecnologias identificadas:** Node.js, Express, MySQL e bcryptjs.

## Endpoints presentes no código

| Método e caminho | Descrição geral |
|---|---|
| `POST /login` | Enviar ou criar dados |
| `GET /produtos` | Consultar recursos |
| `POST /produtos/:produtoId/interagir` | Enviar ou criar dados |
| `POST /produtos/:produtoId/comentar` | Enviar ou criar dados |
| `PUT /comentarios/:comentarioId` | Atualizar dados |
| `DELETE /comentarios/:comentarioId` | Excluir recurso |
| `GET /produtos/:produtoId/ultimoComentario` | Consultar recursos |

> Esta relação descreve as rotas implementadas no código-fonte. Não representa testes de integração concluídos nem documentação completa dos parâmetros de entrada.

## Como executar localmente

1. Instale **Node.js**, **npm** e **MySQL**.
2. Clone o repositório:

```bash
git clone https://github.com/tomaszeswisc/api-troca-tudo.git
cd api-troca-tudo
npm install
```

3. Copie `.env.example` para um arquivo privado chamado `.env` e configure as credenciais locais. As variáveis previstas são: `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`.
4. Prepare o banco de dados MySQL de estudo com o esquema compatível com os comandos SQL do projeto.
5. Execute `npm start`.

O projeto usa a porta 3000 por padrão.

## Segurança e situação de validação

- **Não publique arquivos `.env`**, senhas, tokens ou chaves privadas.
- As credenciais que apareceram no Git anteriormente devem ser consideradas comprometidas e substituídas.
- A rota de login agora exige que a coluna usuarios.senha contenha hashes bcrypt. Dados antigos com senhas em texto simples precisam ser migrados ou recriados. O package-lock.json necessita atualização por npm install.
- Há uma verificação de sintaxe configurada no [GitHub Actions](https://github.com/tomaszeswisc/api-troca-tudo/actions), mas sua execução bem-sucedida e os testes funcionais ainda precisam ser confirmados.

## Histórico e recuperação

- [Registro de alterações e arquivos afetados](SECURITY_CHANGELOG.md)
- [Plano para saneamento do histórico Git](SECURITY_REMEDIATION_PLAN.md)
- [Modelo de ambiente sem credenciais](.env.example)

## Autor

**Hilton Elias** • [@tomaszeswisc](https://github.com/tomaszeswisc)

---

<div align="center"><sub>Projeto educacional — documentação alinhada ao código consultado em outubro de 2026.</sub></div>
