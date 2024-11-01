// Função para exibir o modal de login
function mostrarModal() {
    document.getElementById('login-modal').style.display = 'block';
}

// Função para fechar o modal de login
function fecharModal() {
    document.getElementById('login-modal').style.display = 'none';
}

// Fecha o modal ao clicar fora do conteúdo
window.onclick = function(event) {
    const modal = document.getElementById('login-modal');
    if (event.target === modal) {
        fecharModal();
    }
};

// Função para realizar o login
function fazerLogin() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            sessionStorage.setItem('usuarioLogado', JSON.stringify(data.usuario)); // Armazena o usuário logado
            fecharModal(); // Fecha o modal de login
            atualizarInterfaceUsuarioLogado(); // Atualiza a interface com as informações do usuário logado
        } else {
            alert(data.mensagem || 'Erro ao fazer login');
        }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
    });
}

// Atualizar a interface com os dados do usuário logado
function atualizarInterfaceUsuarioLogado() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (usuarioLogado) {
        document.getElementById('user-name').textContent = usuarioLogado.nome;
        document.getElementById('user-avatar').src = `/assets/avatars/${usuarioLogado.avatar}`;
        document.getElementById('user-likes').textContent = usuarioLogado.curtidas || 0;
        document.getElementById('user-dislikes').textContent = usuarioLogado.descurtidas || 0;
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
    }
}

// Fazer logout
function fazerLogout() {
    sessionStorage.removeItem('usuarioLogado');  // Remove o usuário do sessionStorage

    // Redefinindo as informações do usuário após o logout
    document.getElementById('user-name').innerText = "Usuário não logado";
    document.getElementById('user-avatar').src = "/assets/avatars/default-avatar.jpg";  // Voltando para o avatar padrão

    //inserir os likes padrão
    
    document.getElementById('login-btn').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'none';
}

// Carregar a interface com as informações de login ao carregar a página
window.onload = function () {
    atualizarInterfaceUsuarioLogado();
    carregarProdutos();
};



// Função para carregar os produtos na interface
function carregarProdutos() {
    fetch('/produtos')
        .then(response => response.json())
        .then(produtos => {
            const produtosLista = document.getElementById('produtos-lista');
            produtosLista.innerHTML = ''; // Limpa a lista de produtos
            produtos.forEach(produto => {
                const produtoDiv = document.createElement('div');
                produtoDiv.classList.add('produto');
                produtoDiv.id = `produto-${produto.id}`;

                // HTML estruturado para o produto, incluindo imagem, título e interações
                produtoDiv.innerHTML = `
                    <h3>${produto.nome}</h3>
                    <img src="/assets/images/${produto.imagem}" alt="${produto.nome}" />

                    <!-- Bloco de Curtidas, Descurtidas e Comentários -->
                    <div class="interacoes-produto">
                        <div class="curtidas-descurtidas">
                            <span>
                                <img src="/assets/images/like.jpg" alt="Curtir" class="icon-curtir" onclick="verificarLogin(() => realizarInteracao(${produto.id}, 'curtida'))" />
                                <span class="curtidas">${produto.curtidas}</span>
                                <img src="/assets/images/deslike.jpg" alt="Descurtir" class="icon-descurtir" onclick="verificarLogin(() => realizarInteracao(${produto.id}, 'descurtida'))" />
                                <span class="descurtidas">${produto.descurtidas}</span>
                                <img src="/assets/icons/comentarios.svg" alt="Comentários" class="icon-comentarios" 
                                    onclick="verificarLogin(() => abrirComentarioModal(${produto.id}, ${produto.id_comentario || 'null'}, '${produto.comentario || ''}', '${produto.cidade || ''}', '${produto.estado || ''}'))" />
                                ${produto.total_comentarios}
                            </span>
                        </div>
                        <div class="comentarios">
                            <span class="ultimo-comentario">
                                Último Comentário de: ${produto.cidade || 'N/A'}, ${produto.estado || 'N/A'}
                            </span>
                        </div>
                    </div>
                `;
                produtosLista.appendChild(produtoDiv);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
        });
}



// Verifica o login do usuário e chama o callback se estiver logado
function verificarLogin(callback) {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (usuarioLogado) {
        callback(); // Executa a função passada se o usuário estiver logado
    } else {
        mostrarModal(); // Exibe o modal de login
    }
}


// Variáveis para armazenar o ID do produto e do comentário atual
let comentarioProdutoId = null; // Armazena o ID do produto para o comentário atual
let comentarioId = null;        // Armazena o ID do comentário ao editar


// Função para abrir o modal de comentário e carregar o comentário existente
function abrirComentarioModal(produtoId) {
    comentarioProdutoId = produtoId;

    // Requisição para buscar o último comentário do produto
    fetch(`/produtos/${produtoId}/ultimoComentario`)
        .then(response => response.json())
        .then(data => {
            // Preencher os campos do modal com o comentário, cidade e estado existentes
            document.getElementById('comentario-texto').value = data.comentario || '';
            document.getElementById('cidade').value = data.cidade || '';
            document.getElementById('estado').value = data.estado || '';
            comentarioId = data.id || null; // Armazena o ID do comentário para edição ou exclusão

            // Abrir o modal de comentário
            document.getElementById('comentario-modal').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao carregar comentário:', error);
        });
}

// Função para fechar o modal de comentário
function fecharComentarioModal() {
    comentarioProdutoId = null;
    comentarioId = null;
    document.getElementById('comentario-modal').style.display = 'none';
}

//------------------------Modificar para editar só esta adicionando--------------------------------------------
// Função para adicionar ou editar um comentário
function adicionarOuEditarComentario() {
    const texto = document.getElementById('comentario-texto').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;

    if (!texto || !cidade || !estado) {
        document.getElementById('comentario-mensagem').textContent = 'Todos os campos são obrigatórios.';
        return;
    }

    const url = comentarioId
        ? `/comentarios/${comentarioId}`
        : `/produtos/${comentarioProdutoId}/comentar`;
    const method = comentarioId ? 'PUT' : 'POST';

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: JSON.parse(sessionStorage.getItem('usuarioLogado')).id, comentario: texto, cidade, estado })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensagem); // Notificação sobre a operação
        fecharComentarioModal();
        carregarProdutos(); // Recarrega a lista de produtos para atualizar o comentário
    })
    .catch(error => console.error('Erro ao adicionar/editar comentário:', error));
}

//-------------------------Acrescentar input para excluir comentario-----------------------------------------------


// Função para excluir um comentário
function excluirComentario() {
    if (!comentarioId) return;

    if (confirm('Tem certeza que deseja excluir este comentário?')) {
        fetch(`/comentarios/${comentarioId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.mensagem); // Notificação sobre a exclusão
            fecharComentarioModal();
            carregarProdutos(); // Recarrega os produtos para remover o comentário
        })
        .catch(error => console.error('Erro ao excluir comentário:', error));
    }
}


// Função para realizar a interação (curtir/descurtir) e atualizar o contador localmente
function realizarInteracao(produtoId, tipoInteracao) {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

    fetch(`/produtos/${produtoId}/interagir`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuarioId: usuarioLogado.id, tipoInteracao })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensagem); // Exibe a mensagem do backend

        if (data.sucesso) {
            // Atualiza a contagem de curtidas/descurtidas no produto
            atualizarContadorLocal(produtoId, tipoInteracao, data.mensagem);

            // Atualiza o contador de curtidas/descurtidas no perfil do usuário
            atualizarContadorUsuario(tipoInteracao, data.mensagem);
        }
    })
    .catch(error => {
        console.error('Erro ao realizar interação:', error);
    });
}

// Função para atualizar a contagem de curtidas/descurtidas na interface localmente para o produto
function atualizarContadorLocal(produtoId, tipoInteracao, mensagem) {
    const produtoDiv = document.getElementById(`produto-${produtoId}`);
    if (!produtoDiv) return;

    const curtidasElement = produtoDiv.querySelector('.curtidas');
    const descurtidasElement = produtoDiv.querySelector('.descurtidas');

    if (mensagem.includes('registrada') || mensagem.includes('alterada')) {
        // Incrementa a contagem se a interação foi registrada ou alterada
        if (tipoInteracao === 'curtida') {
            curtidasElement.textContent = parseInt(curtidasElement.textContent) + 1;
            if (mensagem.includes('alterada')) {
                descurtidasElement.textContent = parseInt(descurtidasElement.textContent) - 1;
            }
        } else {
            descurtidasElement.textContent = parseInt(descurtidasElement.textContent) + 1;
            if (mensagem.includes('alterada')) {
                curtidasElement.textContent = parseInt(curtidasElement.textContent) - 1;
            }
        }
    } else if (mensagem.includes('desfeita')) {
        // Decrementa a contagem se a interação foi desfeita
        if (tipoInteracao === 'curtida') {
            curtidasElement.textContent = parseInt(curtidasElement.textContent) - 1;
        } else {
            descurtidasElement.textContent = parseInt(descurtidasElement.textContent) - 1;
        }
    }
}

//-------------------------Revisar a função e evitar o decremento em ambos---------------------------------

// Função para atualizar o contador de curtidas/descurtidas no perfil do usuário
function atualizarContadorUsuario(tipoInteracao, mensagem) {
    const curtidasUsuarioElement = document.getElementById('user-likes');
    const descurtidasUsuarioElement = document.getElementById('user-dislikes');

    // Incrementa apenas se a interação for registrada como nova ou alterada
    if (mensagem.includes('registrada')) {
        if (tipoInteracao === 'curtida') {
            curtidasUsuarioElement.textContent = parseInt(curtidasUsuarioElement.textContent) + 1;
        } else {
            descurtidasUsuarioElement.textContent = parseInt(descurtidasUsuarioElement.textContent) + 1;
        }
    }
}