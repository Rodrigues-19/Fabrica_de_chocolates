// Recuperando valores das classes do css e do HTML:
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let closeCart = document.querySelector('.close');
let subtotalHTML = document.querySelector('.subtotal');

let body = document.querySelector('body');

let products = [];
let cart = [];

// Ação de abrir e fechar o carrinho de compras
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Adiciona novos produtos se a array products for maior que 0. Para cada item na array products, adiciona o card com toda a estilização do produto. Ou seja, coloca o card, a imagem, o texto e o botão de adicionar ao carrinho.
const addDataToHTML = () => {
    // Remove dados (informações) default do HTML
    listProductHTML.innerHTML = '';
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML =
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">R$${product.price},00</div>
                <button class="addCart">Adicionar ao Carrinho</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}

// Capturando a ação do usuário de clicar no botão de adicionar ao carrinho.
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

// Função que verifica se o item adicionado ao carrinho já não está lá, e se estiver, soma sua quantidade.
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para calcular o subtotal
const calculateSubtotal = () => {
    let subtotal = 0;
    cart.forEach(item => {
        let product = products.find(product => product.id == item.product_id);
        if (product) {
            subtotal += item.quantity * product.price;
        }
    });
    return subtotal;
}

// Adiciona e dispõe os elementos na aba do carrinho de compras.
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                <img src="${info.image}">
            </div>
            <div class="name">
                ${info.name}
            </div>
            <div class="totalPrice">R$${info.price * item.quantity},00</div>
            <div class="quantity">
                <span class="minus"><</span>
                <span>${item.quantity}</span>
                <span class="plus">></span>
            </div>`;
        });

        // Exibir subtotal
        subtotalHTML.innerText = `Total a pagar: R$${calculateSubtotal()},00`;
    } else {
        subtotalHTML.innerText = `Total a pagar: R$0,00`;
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
});

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

// Essa constante de inicialização é a primeira coisa que o código executa quando abre a página. 
//Seleciona as informações do arquivo Json e dispõe as informações na tela.
const initApp = () => {
    // get data product
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();

            // get data cart from memory
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        })
}
initApp();
