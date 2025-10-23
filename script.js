// Atualize a função gerarCards no script.js para usar 'col-6 mb-4' em vez de 'col-6 col-md-4 mb-4'
function gerarCards(categoria = 'todos') {
    const listaJogos = document.getElementById(`lista-${categoria}`);
    if (!listaJogos) return;

    listaJogos.innerHTML = '';
    const jogosFiltrados = categoria === 'todos' ? produtos : produtos.filter(jogo => removeAccents(jogo.categoria.toLowerCase()) === removeAccents(categoria));

    jogosFiltrados.forEach(jogo => {
        const card = document.createElement('div');
        card.className = 'col-6 mb-4';  // Alterado para duas colunas em todas as telas
        card.innerHTML = `
            <div class="card h-100">
                <img src="${getImagePath(jogo.id)}" class="card-img-top" alt="Imagem do puzzle ${jogo.nome}" onerror="this.src='https://via.placeholder.com/400x200';">
                <div class="card-body">
                    <h5 class="card-title">${jogo.nome}</h5>
                    <p class="card-text"><small class="text-muted">Categoria: ${jogo.categoria}</small></p>
                    <p class="card-text fw-bold">R$ ${jogo.valor.toFixed(2).replace('.', ',')}</p>
                    ${jogo.categoria === 'Personalizado' ? 
                        `<a href="https://wa.me/${numeroWhatsApp}?text=Olá! Tenho interesse em um puzzle personalizado." class="btn btn-primary" target="_blank">Entrar em Contato</a>` : 
                        `<button class="btn btn-success adicionar-carrinho" data-id="${jogo.id}">Adicionar ao Carrinho</button>`}
                </div>
            </div>
        `;
        listaJogos.appendChild(card);
    });

    // Atualiza botões imediatamente após gerar esta aba (para duplicados)
    atualizarBotoesQuantidade();
}
