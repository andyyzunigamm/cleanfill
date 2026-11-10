/* ==========================================
   CLEANFILL — Frontend Application Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Catálogo de Productos (Datos provisionales de demostración)
    const products = [
        {
            id: 'prod-1',
            name: 'Champú Nutritivo Botánico',
            category: 'cabello',
            price: 4500,
            unit: 'por 250 ml',
            desc: 'Descripción referencial de un producto de cuidado capilar para el catálogo de demostración.',
            image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'prod-2',
            name: 'Acondicionador Hidratante',
            category: 'cabello',
            price: 4700,
            unit: 'por 250 ml',
            desc: 'Producto de ejemplo para complementar la categoría de cuidado capilar.',
            image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'prod-3',
            name: 'Jabón Líquido Corporal',
            category: 'corporal',
            price: 3800,
            unit: 'por 300 ml',
            desc: 'Producto de ejemplo para la categoría de cuidado corporal.',
            image: 'https://images.unsplash.com/photo-1585751119414-ef2636f9aede?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'prod-4',
            name: 'Crema Corporal Restauradora',
            category: 'corporal',
            price: 5200,
            unit: 'por 250 ml',
            desc: 'Producto de ejemplo para la categoría de cuidado corporal.',
            image: 'https://images.unsplash.com/photo-1608248597359-f37ab3970f33?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'prod-5',
            name: 'Jabón Líquido para Manos',
            category: 'manos',
            price: 3500,
            unit: 'por 300 ml',
            desc: 'Producto de ejemplo para mostrar la categoría de cuidado de manos.',
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'prod-6',
            name: 'Envase Reutilizable de Vidrio Ámbar',
            category: 'envases',
            price: 2800,
            unit: 'Unidad (500 ml)',
            desc: 'Botella reutilizable de diseño sencillo para almacenar tus productos de cuidado personal.',
            image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'prod-7',
            name: 'Gel Limpiador de Uso Diario',
            category: 'higiene',
            price: 3200,
            unit: 'por 250 ml',
            desc: 'Producto de higiene personal presentado como ejemplo para el catálogo demostrativo.',
            image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80'
        }
    ];

    // Carrito de compras (con persistencia en localStorage)
    // Recuperar el carrito sin detener la página si el almacenamiento está dañado.
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cleanfill_cart')) || [];
        if (!Array.isArray(cart)) cart = [];
    } catch (error) {
        cart = [];
    }

    const productsGrid = document.getElementById('productsGrid');
    const catalogFilters = document.getElementById('catalogFilters');
    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    const cartBadge = document.getElementById('cartBadge');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const checkoutWhatsappBtn = document.getElementById('checkoutWhatsappBtn');
    const cartClearBtn = document.getElementById('cartClearBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    const contactForm = document.getElementById('contactForm');
    const formSuccessMsg = document.getElementById('formSuccessMsg');

    // 2. Renderizado del Catálogo
    function renderProducts(filter = 'all') {
        if (!productsGrid) return;
        productsGrid.innerHTML = '';
        const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
        
        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image-wrap">
                    <span class="product-category-tag">${product.category}</span>
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.desc}</p>
                    <div class="product-footer">
                        <div>
                            <span class="product-price">₡${product.price.toLocaleString()}</span>
                            <span class="product-unit">${product.unit}</span>
                        </div>
                        <button class="add-to-cart-btn" data-id="${product.id}">Agregar</button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);
        });

        // Event listeners para botones de agregar
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                addToCart(productId);
            });
        });
    }

    // 3. Filtros de Categoría
    if (catalogFilters) {
        catalogFilters.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                renderProducts(e.target.getAttribute('data-filter'));
            }
        });
    }

    // 4. Funciones del Carrito
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        openCartDrawer();
    }

    function updateCart() {
        localStorage.setItem('cleanfill_cart', JSON.stringify(cart));
        
        // Actualizar Badge
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) cartBadge.textContent = totalItems;

        // Renderizar contenido del drawer
        if (cart.length === 0) {
            if (cartBody) cartBody.innerHTML = '<p class="cart-empty-text">Tu carrito está vacío.</p>';
            if (cartFooter) cartFooter.style.display = 'none';
            return;
        }

        if (cartFooter) cartFooter.style.display = 'block';
        if (!cartBody) return;
        cartBody.innerHTML = '';
        let totalSum = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalSum += itemTotal;

            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <span>₡${item.price.toLocaleString()} x ${item.quantity}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-qty-btn decrease-qty" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-qty-btn increase-qty" data-id="${item.id}">+</button>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">Eliminar</button>
            `;
            cartBody.appendChild(cartItemEl);
        });

        if (cartTotalPrice) cartTotalPrice.textContent = `₡${totalSum.toLocaleString()}`;

        // Eventos de controles de cantidad
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                changeQuantity(e.target.getAttribute('data-id'), -1);
            });
        });

        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                changeQuantity(e.target.getAttribute('data-id'), 1);
            });
        });

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                removeFromCart(e.target.getAttribute('data-id'));
            });
        });
    }

    function changeQuantity(productId, delta) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== productId);
            }
        }
        updateCart();
    }

    function removeFromCart(productId) {
        cart = cart.filter(i => i.id !== productId);
        updateCart();
    }

    function clearCart() {
        cart = [];
        updateCart();
    }

    function openCartDrawer() {
        if (cartDrawer) cartDrawer.classList.add('active');
        if (cartOverlay) cartOverlay.classList.add('active');
    }

    function closeCartDrawer() {
        if (cartDrawer) cartDrawer.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
    }

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);
    if (cartClearBtn) cartClearBtn.addEventListener('click', clearCart);

    // 5. Envío de Pedido por WhatsApp
    if (checkoutWhatsappBtn) {
        checkoutWhatsappBtn.addEventListener('click', () => {
            if (cart.length === 0) return;

            let message = "Hola Cleanfill, me gustaría solicitar el siguiente pedido:\n\n";
            let total = 0;

            cart.forEach(item => {
                const sub = item.price * item.quantity;
                total += sub;
                message += `- ${item.quantity}x ${item.name} (₡${sub.toLocaleString()})\n`;
            });

            message += `\n*Total estimado: ₡${total.toLocaleString()}*\n\n(Pedido de prueba provisional desde tienda web)`;

            const encodedMessage = encodeURIComponent(message);
            // Configurá aquí el número real de WhatsApp antes de publicar el negocio.
            // Se deja vacío para evitar enviar pedidos a un número ajeno por accidente.
            const whatsappNumber = "";

            if (!whatsappNumber) {
                alert("Este es un catálogo de demostración. Para activar los pedidos, primero configurá el número oficial de WhatsApp de Cleanfill en script.js.");
                return;
            }

            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        });
    }

    // 6. Menú Móvil
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });

        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
            });
        });
    }

    // 7. Acordeón de Preguntas Frecuentes (FAQ)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // 8. Formulario de Contacto
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (formSuccessMsg) {
                formSuccessMsg.style.display = 'block';
                formSuccessMsg.textContent = 'Este formulario es una demostración: no envía ni almacena tus datos.';
            }
            contactForm.reset();
        });
    }

    // Inicializar Catálogo
    renderProducts();
    updateCart();
});
