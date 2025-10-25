const produtos = [
    { id: 1, nome: "Pássaro", valor: 14.99, categoria: "Fácil" },
    { id: 2, nome: "Corrente", valor: 14.99, categoria: "Médio" },
    { id: 3, nome: "Espiral", valor: 6.99, categoria: "Portáteis" },
    { id: 4, nome: "Coração", valor: 14.99, categoria: "Fácil" },
    { id: 5, nome: "Coração complexo", valor: 14.99, categoria: "Difícil" },
    { id: 6, nome: "Golfinho", valor: 14.99, categoria: "Fácil" },
    { id: 7, nome: "Labirinto", valor: 14.99, categoria: "Médio" },
    { id: 8, nome: "Mola", valor: 14.99, categoria: "Fácil" },
    { id: 9, nome: "Labirinto", valor: 14.99, categoria: "Médio" },
    { id: 10, nome: "Esquenta cabeça", valor: 14.99, categoria: "Médio" },
    { id: 11, nome: "Três argolas", valor: 14.99, categoria: "Médio" },
    { id: 12, nome: "Espiral impossível", valor: 14.99, categoria: "Difícil" },
    { id: 13, nome: "Triângulo", valor: 6.99, categoria: "Portáteis" },
    { id: 14, nome: "Espiral", valor: 14.99, categoria: "Fácil" },
    { id: 15, nome: "Argola impossível", valor: 14.99, categoria: "Difícil" },
    { id: 16, nome: "Àrvore de Natal", valor: 14.99, categoria: "Difícil" },
    { id: 17, nome: "Personalizado", valor: 25.00, categoria: "Personalizado" }
];

const numeroWhatsApp = '5511989894259';
let carrinho = [];

// Objeto para cache de imagens pré-carregadas
const imageCache = {};

// Função para pré-carregar todas as imagens pares em background
function preloadAllPairs() {
    const allIds = [...Array(17).keys()].map(i => i + 1); // IDs 1-17
    allIds.forEach(id => {
        const img1 = new Image();
        const img2 = new Image();
        img1.src = getImagePath(id);
        img2.src = getImagePath(id + 17);
        imageCache[`${id}`] = img1;
        imageCache[`${id + 17}`] = img2;
        img1.onload = () => console.log(`Pré-carregada: ${img1.src}`);
        img2.onload = () => console.log(`Pré-carregada: ${img2.src}`);
        img1.onerror = () => console.warn(`Falha no pré-load: ${img1.src}`);
        img2.onerror = () => console.warn(`Falha no pré-load: ${img2.src}`);
    });
}

// Carregamento do carrinho com try-catch para mobile (file://)
try {
    const savedCarrinho = localStorage.getItem('carrinho');
    if (savedCarrinho) {
        carrinho = JSON.parse(savedCarrinho);
    }
} catch (e) {
    console.error('Falha ao carregar carrinho do localStorage:', e);
    // Não exibe alerta aqui para não irritar no load inicial; só avisa em ações
    carrinho = []; // Fallback para array vazio
}

// Função para salvar carrinho com try-catch
function salvarCarrinho() {
    try {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        return true; // Sucesso
    } catch (e) {
        console.error('Falha ao salvar carrinho no localStorage:', e);
        return false; // Falha
    }
}

// Função para remover acentos
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Função para gerar o caminho da imagem (sem timestamp para cache normal)
function getImagePath(id) {
    return `images/${id}.jpg`;
}

// Criar modal para visualização de imagens em tela cheia
const modal = document.createElement('div');
modal.id = 'imageModal';
modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: none;
    z-index: 9999;
    justify-content: center;
    align-items: center;
`;

const modalImg = document.createElement('img');
modalImg.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain; transition: opacity 0.3s ease; opacity: 1;';
modalImg.onerror = function() {
    console.error('Erro ao carregar imagem:', this.src);
    this.src = 'https://via.placeholder.com/400x200?text=Imagem+Indispon%C3%ADvel'; // Fallback
};

const loadingSpinner = document.createElement('div');
loadingSpinner.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    display: none;
`;
loadingSpinner.style.animation = 'spin 1s linear infinite'; // CSS keyframe inline
modal.appendChild(loadingSpinner);

const closeBtn = document.createElement('span');
closeBtn.innerHTML = '&times;';
closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 35px;
    color: white;
    font-size: 40px;
    font-weight: bold;
    cursor: pointer;
    z-index: 10000;
`;

const arrowBtn = document.createElement('button');
arrowBtn.style.cssText = `
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.3);
    border: none;
    color: white;
    font-size: 30px;
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
    z-index: 10000;
    display: none; /* Escondido se não houver par */
`;

modal.appendChild(modalImg);
modal.appendChild(closeBtn);
modal.appendChild(arrowBtn);
document.body.appendChild(modal);

function openImageModal(id) {
    const imgPath = getImagePath(id);
    console.log('Abrindo modal para ID:', id, 'Path:', imgPath); // Debug: rastreia (remova após teste)

    // Mostrar spinner e fade out imagem atual
    modalImg.style.opacity = '0';
    loadingSpinner.style.display = 'block';

    // Usar cache se disponível, senão carregar
    if (imageCache[id]) {
        modalImg.src = imgPath;
        modalImg.style.opacity = '1';
        loadingSpinner.style.display = 'none';
        console.log('Usando cache para ID:', id);
    } else {
        const img = new Image();
        img.onload = () => {
            modalImg.src = imgPath;
            modalImg.style.opacity = '1';
            loadingSpinner.style.display = 'none';
            imageCache[id] = img; // Cache para futuro
            console.log('Carregada e cacheada:', imgPath);
        };
        img.onerror = () => {
            modalImg.src = 'https://via.placeholder.com/400x200?text=Imagem+Indispon%C3%ADvel';
            modalImg.style.opacity = '1';
            loadingSpinner.style.display = 'none';
            console.error('Falha no load:', imgPath);
        };
        img.src = imgPath;
    }

    modal.style.display = 'flex';
    const isOriginal = id <= 17;

    arrowBtn.style.display = 'block';
    if (isOriginal) {
        arrowBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
        arrowBtn.style.right = '20px';
        arrowBtn.style.left = 'auto';
        arrowBtn.onclick = () => openImageModal(id + 17);
    } else {
        arrowBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
        arrowBtn.style.left = '20px';
        arrowBtn.style.right = 'auto';
        arrowBtn.onclick = () => openImageModal(id - 17);
    }
    closeBtn.onclick = closeModal;
    window.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
    document.onkeydown = (e) => {
        if (e.key === 'Escape') closeModal();
    };
}

function closeModal() {
    modal.style.display = 'none';
    loadingSpinner.style.display = 'none';
    modalImg.style.opacity = '1';
    document.onkeydown = null;
    window.onclick = null;
}

// Funções para gerenciar o carrinho
function atualizarContadorCarrinho() {
    const contador = document.getElementById('contador-carrinho');
    if (contador) {
        const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
        contador.textContent = totalItens;
    }
}

function adicionarAoCarrinho(id, quantidade = 1) {
    const jogo = produtos.find(p => p.id === id);
    if (jogo) {
        const itemExistente = carrinho.find(item => item.produto.id === id);
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            carrinho.push({ produto: jogo, quantidade: quantidade });
        }
        const salvou = salvarCarrinho(); // Usa try-catch e retorna sucesso/falha
        if (!salvou) {
            alert('Erro ao adicionar o produto ao carrinho. Tente novamente em outro dispositivo.');
            // Opcional: remover o item do carrinho se falhou no save
            carrinho = carrinho.filter(item => item.produto.id !== id);
        }
        atualizarContadorCarrinho();
        atualizarBotoesQuantidade();
    }
}

function atualizarQuantidadeCarrinho(id, novaQuantidade) {
    if (novaQuantidade === '') novaQuantidade = '0';
    novaQuantidade = parseInt(novaQuantidade);
    if (isNaN(novaQuantidade) || novaQuantidade < 0) return;
    
    const itemExistente = carrinho.find(item => item.produto.id === id);
    if (itemExistente) {
        if (novaQuantidade === 0) {
            carrinho = carrinho.filter(item => item.produto.id !== id);
        } else {
            itemExistente.quantidade = novaQuantidade;
        }
        const salvou = salvarCarrinho(); // Usa try-catch e retorna sucesso/falha
        if (!salvou && novaQuantidade !== 0) {
            alert('Erro ao atualizar a quantidade no carrinho. Tente novamente em outro dispositivo.');
            // Reverter a mudança se falhou
            if (novaQuantidade !== 0) {
                itemExistente.quantidade = getQuantidadeNoCarrinho(id) || 1; // Reverter para valor anterior aproximado
            }
        }
        atualizarContadorCarrinho();
        atualizarBotoesQuantidade();
        if (document.getElementById('itens-carrinho')) {
            renderizarCarrinho();
        }
    }
}

function getQuantidadeNoCarrinho(id) {
    const item = carrinho.find(item => item.produto.id === id);
    return item ? item.quantidade : 0;
}

function configurarInputQuantidade(input, id) {
    input.addEventListener('change', () => {
        atualizarQuantidadeCarrinho(id, input.value);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();  // Fecha o teclado/foco ao pressionar Enter
        }
    });

    input.addEventListener('blur', () => {
        // Opcional: validar ou focar se necessário
    });
}

// Função para sincronizar a cor do botão com base no texto
function sincronizarCorBotao(botao) {
    if (botao.textContent.trim() === 'Produto Adicionado') {
        botao.classList.remove('btn-success');
        botao.classList.add('btn-primary');
    } else {
        botao.classList.remove('btn-primary');
        botao.classList.add('btn-success');
    }
}

function atualizarBotoesQuantidade() {
    const botoes = document.querySelectorAll('.adicionar-carrinho');
    botoes.forEach(botao => {
        const id = parseInt(botao.dataset.id);
        const quantidade = getQuantidadeNoCarrinho(id);
        const cardBody = botao.closest('.card-body');
        let qtyControl = cardBody ? cardBody.querySelector('.quantity-control') : null;

        if (quantidade > 0) {
            if (!qtyControl) {
                // Criar o controle de quantidade com rótulo "Qtd."
                qtyControl = document.createElement('div');
                qtyControl.className = 'quantity-control mb-2 mt-2';

                const qtyRow = document.createElement('div');
                qtyRow.className = 'd-flex align-items-center mb-1';

                const label = document.createElement('span');
                label.textContent = 'Qtd.: ';
                label.className = 'me-2 fw-bold text-muted';

                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.value = quantidade;
                input.className = 'form-control form-control-sm';
                input.style.width = '60px';
                configurarInputQuantidade(input, id);

                qtyRow.appendChild(label);
                qtyRow.appendChild(input);

                const removerBtn = document.createElement('button');
                removerBtn.textContent = 'Remover';
                removerBtn.className = 'btn btn-danger btn-sm mt-1';
                removerBtn.style.width = 'auto';
                removerBtn.addEventListener('click', () => {
                    atualizarQuantidadeCarrinho(id, 0);
                });

                qtyControl.appendChild(qtyRow);
                qtyControl.appendChild(removerBtn);

                // Inserir abaixo do preço (elemento .card-text.fw-bold no card-body)
                const precoElement = cardBody.querySelector('.card-text.fw-bold');
                if (precoElement) {
                    precoElement.insertAdjacentElement('afterend', qtyControl);
                } else {
                    // Fallback: inserir antes do botão se não encontrar o preço
                    botao.insertAdjacentElement('beforebegin', qtyControl);
                }
            } else {
                // Atualizar o valor no input existente
                const input = qtyControl.querySelector('input');
                input.value = quantidade;
            }

            // Configurar botão como "Produto Adicionado"
            botao.textContent = 'Produto Adicionado';
            sincronizarCorBotao(botao);  // Sincroniza a cor com o texto
        } else {
            if (qtyControl) {
                qtyControl.remove();
            }

            // Configurar botão de volta para "Adicionar ao Carrinho"
            botao.textContent = 'Adicionar ao Carrinho';
            sincronizarCorBotao(botao);  // Sincroniza a cor com o texto
        }
    });
}

// Funções para index.html
if (document.getElementById('lista-todos')) {
    function gerarCards(categoria = 'todos') {
        const listaJogos = document.getElementById(`lista-${categoria}`);
        if (!listaJogos) return;

        listaJogos.innerHTML = '';
        const jogosFiltrados = categoria === 'todos' ? produtos : produtos.filter(jogo => removeAccents(jogo.categoria.toLowerCase()) === removeAccents(categoria));

        jogosFiltrados.forEach(jogo => {
            const card = document.createElement('div');
            card.className = 'col-6 col-md-4 mb-4';
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
    }

    document.addEventListener('DOMContentLoaded', () => {
        gerarCards('todos');
        gerarCards('portateis');
        gerarCards('facil');
        gerarCards('medio');
        gerarCards('dificil');
        gerarCards('personalizado');
        atualizarContadorCarrinho();
        atualizarBotoesQuantidade();

        // Pré-carregar todas as imagens pares em background (apenas na página principal)
        preloadAllPairs();

        // Listener para mudanças de aba para atualizar botões de quantidade
        const triggerTabList = document.querySelectorAll('#myTab button');
        triggerTabList.forEach(triggerEl => {
            triggerEl.addEventListener('shown.bs.tab', function (event) {
                atualizarBotoesQuantidade();
            });
        });
    });

    document.getElementById('myTabContent').addEventListener('click', (e) => {
        if (e.target.classList.contains('adicionar-carrinho')) {
            const id = parseInt(e.target.dataset.id);
            adicionarAoCarrinho(id);
        } else if (e.target.classList.contains('card-img-top')) {
            e.preventDefault();
            e.stopPropagation();
            const imgSrc = e.target.src;
            const match = imgSrc.match(/images\/(\d+)\.jpg/); // Match parcial para timestamp
            if (match) {
                const id = parseInt(match[1]);
                openImageModal(id);
            } else {
                console.error('Falha no parsing do ID do src:', imgSrc);
            }
        }
    });
}

// Funções para carrinho.html
if (document.getElementById('itens-carrinho')) {
    const itensCarrinhoTbody = document.querySelector('#itens-carrinho tbody');
    const totalCarrinhoSpan = document.getElementById('total-carrinho');
    const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
    const carrinhoVazioDiv = document.getElementById('carrinho-vazio');
    const itensCarrinhoTable = document.getElementById('itens-carrinho');

    function renderizarCarrinho() {
        itensCarrinhoTbody.innerHTML = '';
        let total = 0;

        if (carrinho.length === 0) {
            carrinhoVazioDiv.style.display = 'block';
            itensCarrinhoTable.style.display = 'none';
            finalizarPedidoBtn.style.display = 'none';
        } else {
            carrinhoVazioDiv.style.display = 'none';
            itensCarrinhoTable.style.display = 'table';
            finalizarPedidoBtn.style.display = 'block';

            carrinho.forEach((item, index) => {
                const precoUnitario = item.produto.valor.toFixed(2).replace('.', ',');
                const subtotal = item.produto.valor * item.quantidade;
                const subtotalFormatado = subtotal.toFixed(2).replace('.', ',');
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <img src="${getImagePath(item.produto.id)}" alt="${item.produto.nome}" style="width: 50px; height: 50px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/50x50?text=?';"> 
                        ${item.produto.nome}
                    </td>
                    <td>R$ ${precoUnitario}</td>
                    <td>
                        <input type="number" class="form-control form-control-sm quantity-input ms-2" data-index="${index}" value="${item.quantidade}" min="0" style="width: 60px; display: inline-block;">
                    </td>
                    <td>R$ ${subtotalFormatado}</td>
                    <td><button class="btn btn-danger btn-sm remover-item" data-index="${index}">Remover</button></td>
                `;
                itensCarrinhoTbody.appendChild(tr);
                total += subtotal;
            });

            // Adicionar listeners para os inputs de quantidade após renderizar
            document.querySelectorAll('.quantity-input').forEach(input => {
                const index = parseInt(input.dataset.index);
                configurarInputQuantidade(input, carrinho[index].produto.id);
            });
        }
        
        totalCarrinhoSpan.textContent = total.toFixed(2).replace('.', ',');
        atualizarContadorCarrinho();
    }

    function removerDoCarrinho(index) {
        carrinho.splice(index, 1);
        const salvou = salvarCarrinho(); // Usa try-catch e retorna sucesso/falha
        if (!salvou) {
            alert('Erro ao remover o produto do carrinho. Tente novamente em outro dispositivo.');
            // Reverter remoção se falhou
            const jogo = produtos.find(p => p.id === carrinho[index]?.produto?.id);
            if (jogo) {
                carrinho.splice(index, 0, { produto: jogo, quantidade: 1 });
            }
        }
        renderizarCarrinho();
    }

    function finalizarPedido() {
        if (carrinho.length === 0) return;

        const produtosPedido = carrinho.map(item => `- ${item.produto.nome} (x${item.quantidade}) (R$ ${(item.produto.valor * item.quantidade).toFixed(2).replace('.', ',')})`).join('%0A');
        const total = carrinho.reduce((sum, item) => sum + (item.produto.valor * item.quantidade), 0).toFixed(2).replace('.', ',');

        const mensagem = `Olá, gostaria de fazer um pedido da Gênio a Fio!%0A%0A*Itens:*%0A${produtosPedido}%0A%0A*Total:* R$ ${total}%0A%0A`;
        const url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
        
        window.open(url, '_blank');
    }

    document.addEventListener('DOMContentLoaded', renderizarCarrinho);

    // Listener para cliques em imagens no carrinho
    itensCarrinhoTable.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            e.stopPropagation();
            const imgSrc = e.target.src;
            const match = imgSrc.match(/images\/(\d+)\.jpg/); // Match parcial para timestamp
            if (match) {
                const id = parseInt(match[1]);
                openImageModal(id);
            } else {
                console.error('Falha no parsing do ID no carrinho, src:', imgSrc);
            }
        } else if (e.target.classList.contains('remover-item')) {
            const index = parseInt(e.target.dataset.index);
            removerDoCarrinho(index);
        }
    });
    
    finalizarPedidoBtn.addEventListener('click', finalizarPedido);
}
