const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path'); // Para lidar com caminhos de arquivos estáticos

const app = express();
app.use(bodyParser.json());

// Configurando para servir o conteúdo estático da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '142536',
    database: 'troca_tudo'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


// Endpoint para login no Backend
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const query = `
        SELECT id, nome, avatar, curtidas_totais AS curtidas, descurtidas_totais AS descurtidas
        FROM usuarios
        WHERE email = ? AND senha = ?
    `;
    connection.query(query, [email, senha], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor' });
        }

        if (results.length > 0) {
            // Usuário encontrado
            const usuario = results[0];
            res.json({ sucesso: true, usuario });
        } else {
            // Usuário não encontrado ou senha incorreta
            res.json({ sucesso: false, mensagem: 'Credenciais inválidas' });
        }
    });
});



//Endpoint para produtos no Backend
app.get('/produtos', (req, res) => {
    const query = `
        SELECT p.id, p.nome, p.imagem, p.curtidas, p.descurtidas, 
               (SELECT COUNT(*) FROM comentarios WHERE id_produto = p.id) AS total_comentarios,
               (SELECT cidade FROM comentarios WHERE id_produto = p.id ORDER BY id DESC LIMIT 1) AS cidade,
               (SELECT estado FROM comentarios WHERE id_produto = p.id ORDER BY id DESC LIMIT 1) AS estado
        FROM produtos p;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar produtos' });
        }
        res.json(results);
    });
});


//Endpoint para Curtidas e Descurtidas com Limite de Interação

app.post('/produtos/:produtoId/interagir', (req, res) => {
    const { produtoId } = req.params;
    const { usuarioId, tipoInteracao } = req.body;

    // Consulta para verificar se o usuário já interagiu com o produto
    const verificarInteracao = `
        SELECT tipo FROM curtidas_descurtidas
        WHERE id_usuario = ? AND id_produto = ?
    `;
    connection.query(verificarInteracao, [usuarioId, produtoId], (err, results) => {
        if (err) {
            console.error('Erro ao verificar interação:', err);
            return res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor' });
        }

        if (results.length > 0) {
            const interacaoExistente = results[0].tipo;

            if (interacaoExistente === tipoInteracao) {
                // Caso o usuário já tenha curtido/descurtido o produto, informamos que a ação já foi realizada
                res.json({ sucesso: false, mensagem: `Você já ${tipoInteracao === 'curtida' ? 'curtiu' : 'descurtiu'} este produto` });
            } else {
                // Se o usuário já fez uma interação diferente, alteramos para o novo tipo
                const atualizarInteracao = `
                    UPDATE curtidas_descurtidas
                    SET tipo = ?
                    WHERE id_usuario = ? AND id_produto = ?
                `;
                connection.query(atualizarInteracao, [tipoInteracao, usuarioId, produtoId], (err) => {
                    if (err) {
                        console.error('Erro ao atualizar interação:', err);
                        return res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar interação' });
                    }
                    // Atualizamos as contagens: decrementa o tipo anterior, incrementa o novo
                    atualizarContagem(produtoId, interacaoExistente, 'decrementar');
                    atualizarContagem(produtoId, tipoInteracao, 'incrementar');
                    res.json({ sucesso: true, mensagem: `Interação alterada para ${tipoInteracao}` });
                });
            }
        } else {
            // Nova interação (adicionar 1 ao tipo correspondente)
            const novaInteracao = `
                INSERT INTO curtidas_descurtidas (id_usuario, id_produto, tipo)
                VALUES (?, ?, ?)
            `;
            connection.query(novaInteracao, [usuarioId, produtoId, tipoInteracao], (err) => {
                if (err) {
                    console.error('Erro ao registrar interação:', err);
                    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao registrar interação' });
                }
                atualizarContagem(produtoId, tipoInteracao, 'incrementar');
                res.json({ sucesso: true, mensagem: 'Interação registrada com sucesso' });
            });
        }
    });
});


// Função para incrementar ou decrementar curtidas/descurtidas no produto
function atualizarContagem(produtoId, tipoInteracao, operacao) {
    const campo = tipoInteracao === 'curtida' ? 'curtidas' : 'descurtidas';
    const sinal = operacao === 'incrementar' ? '+' : '-';

    const queryAtualizar = `
        UPDATE produtos
        SET ${campo} = ${campo} ${sinal} 1
        WHERE id = ?
    `;
    connection.query(queryAtualizar, [produtoId], (err) => {
        if (err) {
            console.error(`Erro ao ${operacao} ${tipoInteracao}:`, err);
        }
    });
}



// Endpoint para adicionar um comentário
app.post('/produtos/:produtoId/comentar', (req, res) => {
    const { produtoId } = req.params;
    const { usuarioId, comentario, cidade, estado } = req.body;

    const query = `
        INSERT INTO comentarios (id_produto, id_usuario, comentario, cidade, estado)
        VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(query, [produtoId, usuarioId, comentario, cidade, estado], (err) => {
        if (err) {
            console.error('Erro ao adicionar comentário:', err);
            return res.status(500).json({ sucesso: false, mensagem: 'Erro ao adicionar comentário' });
        }
        res.json({ sucesso: true, mensagem: 'Comentário adicionado com sucesso' });
    });
});

// Endpoint para editar um comentário
app.put('/comentarios/:comentarioId', (req, res) => {
    const { comentarioId } = req.params;
    const { comentario } = req.body;

    const query = `
        UPDATE comentarios
        SET comentario = ?
        WHERE id = ?
    `;
    connection.query(query, [comentario, comentarioId], (err) => {
        if (err) {
            console.error('Erro ao editar comentário:', err);
            return res.status(500).json({ sucesso: false, mensagem: 'Erro ao editar comentário' });
        }
        res.json({ sucesso: true, mensagem: 'Comentário editado com sucesso' });
    });
});

// Endpoint para excluir um comentário
app.delete('/comentarios/:comentarioId', (req, res) => {
    const { comentarioId } = req.params;

    const query = `
        DELETE FROM comentarios
        WHERE id = ?
    `;
    connection.query(query, [comentarioId], (err) => {
        if (err) {
            console.error('Erro ao excluir comentário:', err);
            return res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir comentário' });
        }
        res.json({ sucesso: true, mensagem: 'Comentário excluído com sucesso' });
    });
});

// Endpoint para listar o último comentário de um produto
app.get('/produtos/:produtoId/ultimoComentario', (req, res) => {
    const { produtoId } = req.params;

    const query = `
        SELECT comentario, cidade, estado, usuarios.nome AS usuario
        FROM comentarios
        JOIN usuarios ON comentarios.id_usuario = usuarios.id
        WHERE id_produto = ?
        ORDER BY comentarios.id DESC
        LIMIT 1
    `;
    connection.query(query, [produtoId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar último comentário:', err);
            return res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar comentário' });
        }
        res.json(results[0] || {});  // Retorna o comentário ou objeto vazio se não houver
    });
});