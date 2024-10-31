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