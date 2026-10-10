// app.js

// Estado Global
let cart = JSON.parse(localStorage.getItem('lafredes_cart')) || [];
let currentCategory = 'Todos';
let searchQuery = '';

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // 1. Iniciar Iconos
    lucide.createIcons();
    
    // 2. Cargar Información
    loadRestaurantInfo();
    
    // 3. Renderizar Categorías
    renderCategories();
    
    // 4. Renderizar Productos
    renderProducts();
    
    // 5. Actualizar Carrito UI
    updateCartUI();
    
    // 6. Setup de Eventos
    setupEventListeners();
});

// --- RENDERIZADO DE DATOS ---

function loadRestaurantInfo() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.getElementById('about-text').textContent = config.restaurant.about;
    document.getElementById('info-address').textContent = config.restaurant.address;
    document.getElementById('info-hours').textContent = config.restaurant.hours;
    
    const dirBtn = document.getElementById('btn-directions');
    if(dirBtn) dirBtn.href = config.restaurant.googleMaps;
    
    const waBtn = document.getElementById('social-wa');
    if(waBtn) waBtn.href = `https://wa.me/${config.restaurant.whatsapp}`;
    
    const igBtn = document.getElementById('social-ig');
    if(igBtn) igBtn.href = config.restaurant.socials.instagram;
    
    const fbBtn = document.getElementById('social-fb');
    if(fbBtn) fbBtn.href = config.restaurant.socials.facebook;

    // Poblar métodos de pago
    const paymentSelect = document.getElementById('c-payment');
    config.paymentMethods.forEach(pm => {
        const option = document.createElement('option');
        option.value = pm;
        option.textContent = pm;
        paymentSelect.appendChild(option);
    });
}

function renderCategories() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    
    categorias.forEach(cat => {
        const btn = document.createElement('button');
        const isActive = cat === currentCategory;
        
        btn.className = `whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all duration-300 text-sm border 
            ${isActive 
                ? 'bg-chocolate text-cream border-chocolate shadow-md' 
                : 'bg-white text-chocolate/70 border-chocolate/10 hover:border-gold hover:text-chocolate'}`;
        
        btn.textContent = cat;
        btn.onclick = () => {
            currentCategory = cat;
            renderCategories();
            renderProducts();
        };
        container.appendChild(btn);
    });
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');
    
    grid.innerHTML = '';
    
    let filtered = menuData;
    
    // Filtro por categoría
    if (currentCategory !== 'Todos') {
        filtered = filtered.filter(p => p.categoria === currentCategory);
    }
    
    // Filtro por búsqueda
    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        filtered = filtered.filter(p => p.nombre.toLowerCase().includes(lowerQ));
    }
    
    if (filtered.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    
    filtered.forEach((product, index) => {
        const cartItem = cart.find(c => c.id === product.id);
        const qty = cartItem ? cartItem.cantidad : 0;
        
        const isAgotado = !product.disponible;
        
        const card = document.createElement('div');
        card.className = `product-card bg-white rounded-3xl overflow-hidden border border-chocolate/5 animate-slide-up flex flex-col h-full`;
        card.style.animationDelay = `${index * 50}ms`;
        
        // Imagen wrapper
        const imgWrap = `
            <div class="relative h-56 overflow-hidden">
                <img src="${product.imagen}" alt="${product.nombre}" class="product-img w-full h-full object-cover transition-transform duration-500">
                ${isAgotado ? '<div class="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center"><span class="bg-chocolate text-white px-4 py-2 rounded-full font-bold tracking-wider uppercase text-sm transform -rotate-12 border border-white">Agotado</span></div>' : ''}
                <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-bold text-chocolate px-3 py-1 rounded-full shadow-sm">${product.categoria}</div>
            </div>
        `;
        
        // Content
        let btnHTML = '';
        if (isAgotado) {
            btnHTML = `<button disabled class="w-full bg-chocolate/10 text-chocolate/40 py-3 rounded-xl font-medium mt-4 cursor-not-allowed">Agotado</button>`;
        } else if (qty > 0) {
            btnHTML = `
                <div class="w-full bg-chocolate/5 py-2 rounded-xl flex items-center justify-between px-4 mt-4 border border-chocolate/10 added-anim">
                    <button onclick="updateQty(${product.id}, -1)" class="w-8 h-8 flex items-center justify-center text-terracotta hover:bg-terracotta/10 rounded-full transition-colors"><i data-lucide="minus" class="w-4 h-4"></i></button>
                    <span class="font-bold text-chocolate">${qty}</span>
                    <button onclick="updateQty(${product.id}, 1)" class="w-8 h-8 flex items-center justify-center text-terracotta hover:bg-terracotta/10 rounded-full transition-colors"><i data-lucide="plus" class="w-4 h-4"></i></button>
                </div>
            `;
        } else {
            btnHTML = `<button onclick="addToCart(${product.id})" class="w-full bg-white border border-chocolate/10 text-chocolate hover:bg-gold hover:border-gold py-3 rounded-xl font-medium mt-4 transition-colors flex items-center justify-center gap-2 group"><i data-lucide="plus" class="w-4 h-4 text-terracotta group-hover:text-chocolate transition-colors"></i> Agregar</button>`;
        }
        
        card.innerHTML = `
            ${imgWrap}
            <div class="p-6 flex flex-col flex-1">
                <div class="flex justify-between items-start gap-3 mb-2">
                    <h3 class="font-serif font-bold text-xl text-chocolate leading-tight">${product.nombre}</h3>
                    <span class="font-bold text-terracotta whitespace-nowrap">S/ ${product.precio.toFixed(2)}</span>
                </div>
                <p class="text-brownsec font-light text-sm line-clamp-2 flex-1 mb-2">${product.descripcion}</p>
                ${btnHTML}
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // Re-iniciar iconos en nuevos elementos
    lucide.createIcons();
}

// --- LOGICA DEL CARRITO ---

function addToCart(id) {
    const product = menuData.find(p => p.id === id);
    if (!product || !product.disponible) return;
    
    cart.push({ ...product, cantidad: 1 });
    saveCart();
    renderProducts();
    updateCartUI();
    showToast(`Agregado: ${product.nombre}`);
}

function updateQty(id, delta) {
    const itemIndex = cart.findIndex(c => c.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].cantidad += delta;
        if (cart[itemIndex].cantidad <= 0) {
            cart.splice(itemIndex, 1);
        }
        saveCart();
        renderProducts();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('lafredes_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalQty = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    
    // Badge Header
    const badge = document.getElementById('cart-badge');
    badge.textContent = totalQty;
    if (totalQty > 0) {
        badge.classList.remove('scale-0');
        badge.classList.add('scale-100');
    } else {
        badge.classList.remove('scale-100');
        badge.classList.add('scale-0');
    }
    
    // Floating Mobile
    const floatBtn = document.getElementById('floating-cart');
    const floatBadge = document.getElementById('float-badge');
    const floatTotal = document.getElementById('float-total');
    
    if (totalQty > 0) {
        floatBtn.classList.remove('translate-y-32');
        floatBtn.classList.add('translate-y-0');
        floatBadge.textContent = totalQty;
        floatTotal.textContent = `S/ ${totalPrice.toFixed(2)}`;
    } else {
        floatBtn.classList.remove('translate-y-0');
        floatBtn.classList.add('translate-y-32');
    }
    
    // Sidebar Cart
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    
    if (totalQty === 0) {
        cartItemsContainer.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-brownsec py-12 opacity-70">
                <i data-lucide="shopping-bag" class="w-16 h-16 mb-4 text-chocolate/20"></i>
                <p>Tu carrito está vacío.</p>
                <p class="text-sm mt-2">¡Anímate a probar algo delicioso!</p>
            </div>
        `;
        cartSummary.classList.add('hidden');
        document.getElementById('tab-checkout').disabled = true;
    } else {
        cartSummary.classList.remove('hidden');
        document.getElementById('tab-checkout').disabled = false;
        
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const el = document.createElement('div');
            el.className = 'bg-white p-4 rounded-2xl flex gap-4 border border-chocolate/5 shadow-sm';
            el.innerHTML = `
                <img src="${item.imagen}" class="w-20 h-20 object-cover rounded-xl" alt="${item.nombre}">
                <div class="flex-1 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between gap-2">
                            <h4 class="font-bold text-chocolate text-sm leading-tight">${item.nombre}</h4>
                            <button onclick="updateQty(${item.id}, -${item.cantidad})" class="text-chocolate/30 hover:text-terracotta transition-colors">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                        <p class="text-terracotta font-medium text-sm mt-1">S/ ${item.precio.toFixed(2)}</p>
                    </div>
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center bg-chocolate/5 rounded-lg border border-chocolate/10">
                            <button onclick="updateQty(${item.id}, -1)" class="w-7 h-7 flex items-center justify-center text-chocolate hover:text-terracotta transition-colors"><i data-lucide="minus" class="w-3 h-3"></i></button>
                            <span class="w-6 text-center font-bold text-sm">${item.cantidad}</span>
                            <button onclick="updateQty(${item.id}, 1)" class="w-7 h-7 flex items-center justify-center text-chocolate hover:text-terracotta transition-colors"><i data-lucide="plus" class="w-3 h-3"></i></button>
                        </div>
                        <span class="font-bold text-chocolate text-sm">S/ ${(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(el);
        });
        
        document.getElementById('cart-subtotal').textContent = `S/ ${totalPrice.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `S/ ${totalPrice.toFixed(2)}`;
    }
    
    lucide.createIcons();
}

// --- EVENTOS Y NAVEGACION ---

function setupEventListeners() {
    // Navbar Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('header-scrolled');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.remove('header-scrolled');
            navbar.classList.add('py-4');
        }
    });
    
    // Buscador
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProducts();
    });
    
    // Menú Móvil
    const mobileMenu = document.getElementById('mobile-menu');
    const btnMobileOpen = document.getElementById('mobile-menu-btn');
    const btnMobileClose = document.getElementById('close-menu-btn');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    const toggleMobileMenu = () => {
        mobileMenu.classList.toggle('translate-x-full');
        document.body.classList.toggle('overflow-hidden');
    };
    
    btnMobileOpen.addEventListener('click', toggleMobileMenu);
    btnMobileClose.addEventListener('click', toggleMobileMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMobileMenu));
    
    // Carrito Sidebar
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const btnCartOpen = document.getElementById('cart-btn');
    const btnFloatCart = document.getElementById('floating-cart');
    const btnCartClose = document.getElementById('close-cart-btn');
    
    const openCart = () => {
        cartSidebar.classList.remove('translate-x-full');
        cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
        document.body.classList.add('overflow-hidden');
        showTab('cart');
    };
    
    const closeCart = () => {
        cartSidebar.classList.add('translate-x-full');
        cartOverlay.classList.add('opacity-0', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');
    };
    
    btnCartOpen.addEventListener('click', openCart);
    btnFloatCart.addEventListener('click', openCart);
    btnCartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    // Tabs Carrito
    const btnContinue = document.getElementById('btn-continue');
    const btnBackCart = document.getElementById('btn-back-cart');
    const tabCart = document.getElementById('tab-cart');
    const tabCheckout = document.getElementById('tab-checkout');
    
    btnContinue.addEventListener('click', () => showTab('checkout'));
    btnBackCart.addEventListener('click', () => showTab('cart'));
    tabCart.addEventListener('click', () => showTab('cart'));
    tabCheckout.addEventListener('click', () => {
        if (!tabCheckout.disabled) showTab('checkout');
    });
    
    // Formulario Checkout Toggles
    const orderTypeRadios = document.getElementsByName('orderType');
    const deliveryFields = document.getElementById('delivery-fields');
    const addressInput = document.getElementById('c-address');
    const districtInput = document.getElementById('c-district');
    
    orderTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Delivery') {
                deliveryFields.style.display = 'block';
                addressInput.required = true;
                districtInput.required = true;
            } else {
                deliveryFields.style.display = 'none';
                addressInput.required = false;
                districtInput.required = false;
                addressInput.value = '';
                districtInput.value = '';
            }
        });
    });
    
    const paymentSelect = document.getElementById('c-payment');
    const cashField = document.getElementById('cash-field');
    paymentSelect.addEventListener('change', (e) => {
        if (e.target.value === 'Efectivo') {
            cashField.style.display = 'block';
        } else {
            cashField.style.display = 'none';
            document.getElementById('c-cash-amount').value = '';
        }
    });
    
    // Submit Form
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', handleCheckout);
}

function showTab(tab) {
    const viewCart = document.getElementById('view-cart');
    const viewCheckout = document.getElementById('view-checkout');
    const tabCartBtn = document.getElementById('tab-cart');
    const tabCheckoutBtn = document.getElementById('tab-checkout');
    
    if (tab === 'cart') {
        viewCart.classList.remove('hidden');
        viewCheckout.classList.add('hidden');
        tabCartBtn.classList.add('text-chocolate', 'border-terracotta');
        tabCartBtn.classList.remove('text-chocolate/50', 'border-transparent');
        tabCheckoutBtn.classList.remove('text-chocolate', 'border-terracotta');
        tabCheckoutBtn.classList.add('text-chocolate/50', 'border-transparent');
    } else {
        viewCheckout.classList.remove('hidden');
        viewCart.classList.add('hidden');
        tabCheckoutBtn.classList.add('text-chocolate', 'border-terracotta');
        tabCheckoutBtn.classList.remove('text-chocolate/50', 'border-transparent');
        tabCartBtn.classList.remove('text-chocolate', 'border-terracotta');
        tabCartBtn.classList.add('text-chocolate/50', 'border-transparent');
    }
}

// --- CHECKOUT Y WHATSAPP ---

function handleCheckout(e) {
    e.preventDefault();
    
    // Validación extra
    if (cart.length === 0) return;
    
    const isDelivery = document.querySelector('input[name="orderType"]:checked').value === 'Delivery';
    if (isDelivery) {
        if (!document.getElementById('c-address').value || !document.getElementById('c-district').value) {
            document.getElementById('form-error').classList.remove('hidden');
            return;
        }
    }
    document.getElementById('form-error').classList.add('hidden');
    
    generateWhatsApp();
}

function generateWhatsApp() {
    const name = document.getElementById('c-name').value.trim();
    const phone = document.getElementById('c-phone').value.trim();
    const orderType = document.querySelector('input[name="orderType"]:checked').value;
    const payment = document.getElementById('c-payment').value;
    const cashAmount = document.getElementById('c-cash-amount').value.trim();
    const obs = document.getElementById('c-obs').value.trim();
    
    let total = 0;
    
    const sep = "\u2501".repeat(14); // Línea separadora
    
    let msg = `*NUEVO PEDIDO - LA FREDES*\n\n`;
    msg += `Hola, quisiera realizar el siguiente pedido:\n\n`;
    msg += `${sep}\n`;
    msg += `*MI PEDIDO*\n`;
    msg += `${sep}\n\n`;
    
    cart.forEach(item => {
        const sub = item.precio * item.cantidad;
        total += sub;
        msg += `${item.cantidad}x ${item.nombre}\n`;
        msg += `S/ ${sub.toFixed(2)}\n\n`;
    });
    
    msg += `${sep}\n`;
    msg += `*TOTAL: S/ ${total.toFixed(2)}*\n`;
    msg += `${sep}\n\n`;
    
    msg += `*DATOS DEL CLIENTE*\n\n`;
    msg += `Nombre: ${name}\n`;
    msg += `Teléfono: ${phone}\n\n`;
    
    msg += `Tipo de pedido: ${orderType}\n\n`;
    
    if (orderType === 'Delivery') {
        msg += `Dirección:\n${document.getElementById('c-address').value.trim()}\n\n`;
        msg += `Distrito/Zona:\n${document.getElementById('c-district').value.trim()}\n\n`;
        const ref = document.getElementById('c-ref').value.trim();
        if (ref) {
            msg += `Referencia:\n${ref}\n\n`;
        }
    }
    
    msg += `Forma de pago:\n${payment}\n\n`;
    if (payment === 'Efectivo' && cashAmount) {
        msg += `Pagará con:\n${cashAmount}\n\n`;
    }
    
    if (obs) {
        msg += `Observaciones:\n${obs}\n\n`;
    }
    
    msg += `${sep}\n\n`;
    msg += `Pedido realizado desde la carta digital de LA FREDES.\n\n`;
    msg += `Del Perú a tu mesa`;
    
    const encoded = encodeURIComponent(msg);
    const url = `https://wa.me/${config.restaurant.whatsapp}?text=${encoded}`;
    
    window.open(url, '_blank');
}

// Utilidad para mostrar tostada de agregado (Opcional visual)
function showToast(msg) {
    const div = document.createElement('div');
    div.className = 'fixed top-24 left-1/2 transform -translate-x-1/2 bg-chocolate text-white px-6 py-3 rounded-full shadow-floating z-50 animate-pop font-medium text-sm flex items-center gap-2';
    div.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-gold"></i> ${msg}`;
    document.body.appendChild(div);
    lucide.createIcons();
    
    setTimeout(() => {
        div.style.opacity = '0';
        div.style.transform = 'translate(-50%, -20px)';
        div.style.transition = 'all 0.3s ease';
        setTimeout(() => div.remove(), 300);
    }, 2000);
}
