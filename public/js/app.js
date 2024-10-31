// Mostrar o modal de login
function mostrarModal() {
    document.getElementById('login-modal').style.display = 'block';
}

// Fechar o modal de login
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


//Função para fazer o Login
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
    document.getElementById('login-btn').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'none';
}

// Chama a função de atualização ao carregar a página para manter o estado do login
window.onload = atualizarInterfaceUsuarioLogado;


window.onload = function () {
    // Carregar os produtos na página
    fetch('/produtos')
        .then(response => response.json())
        .then(produtos => {
            const produtosLista = document.getElementById('produtos-lista');
            produtosLista.innerHTML = ''; // Limpa a lista de produtos
            produtos.forEach(produto => {
                const produtoDiv = document.createElement('div');
                produtoDiv.classList.add('produto');
                produtoDiv.id = `produto-${produto.id}`;

                // Adicionando o título, a imagem e as interações
                produtoDiv.innerHTML = `
                    <h3>${produto.nome}</h3>
                    <img src="/assets/images/${produto.imagem}" alt="${produto.nome}" />

                    <!-- Bloco de Curtidas, Descurtidas e Comentários -->
                    <div class="interacoes-produto">
                        <div class="curtidas-descurtidas">
                            <span>
                                <img src="/assets/images/like.jpg" alt="Curtir" class="icon-curtir" onclick="interagirProduto(${produto.id}, 'curtida')" />
                                ${produto.curtidas}
                                <img src="/assets/images/deslike.jpg" alt="Descurtir" class="icon-descurtir" onclick="interagirProduto(${produto.id}, 'descurtida')" />
                                ${produto.descurtidas}
                                <img src="/assets/icons/comentarios.svg" alt="Comentários" class="icon-comentarios" onclick="verificarLoginOuComentar(${produto.id})" />
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

    // Atualizar a interface com o usuário logado se já houver um no sessionStorage
    atualizarInterfaceUsuarioLogado();
};