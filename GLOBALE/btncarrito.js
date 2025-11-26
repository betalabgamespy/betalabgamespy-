// ===== FUNCIONES PARA EL CARRITO FLOTANTE =====

// Función para actualizar el contador del carrito flotante
function actualizarContadorCarrito() {
    const carrito = JSON.parse(sessionStorage.getItem('carrito') || '[]');
    const totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const contador = document.getElementById('contadorCarritoFlotante');
    const contadorHeader = document.getElementById('contador-carrito');
    
    if (contador) {
        contador.textContent = totalProductos;
        if (totalProductos === 0) {
            contador.style.display = 'none';
        } else {
            contador.style.display = 'flex';
        }
    }
    
    if (contadorHeader) {
        contadorHeader.textContent = totalProductos;
    }
}

// Función para mostrar/ocultar el mini carrito
function toggleCarritoFlotante() {
    const miniCarrito = document.getElementById('miniCarritoFlotante');
    if (miniCarrito) {
        miniCarrito.classList.toggle('mostrar');
        if (miniCarrito.classList.contains('mostrar')) {
            actualizarMiniCarrito();
        }
    }
}

// Función para actualizar el contenido del mini carrito
function actualizarMiniCarrito() {
    const carrito = JSON.parse(sessionStorage.getItem('carrito') || '[]');
    const contenido = document.getElementById('contenidoMiniCarrito');
    const totalElement = document.getElementById('totalMiniCarrito');
    
    if (!contenido) return;
    
    // Calcular total
    let total = 0;
    carrito.forEach(item => {
        let precioLimpio = item.precio ? item.precio.replace(/\s?Gs\s?/g, '') : '0';
        precioLimpio = precioLimpio.replace('$', '').replace(/\./g, '');
        const precioNumerico = parseFloat(precioLimpio.replace(/[^\d]/g, '')) || 0;
        total += precioNumerico * item.cantidad;
    });
    
    const totalMostrar = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    if (totalElement) {
        totalElement.textContent = `${totalMostrar} Gs`;
    }
    
    if (!carrito || carrito.length === 0) {
        contenido.innerHTML = '<div class="mini-carrito-vacio">Carrito vacío</div>';
        return;
    }
    
    let html = '';
    carrito.forEach(item => {
        let precioLimpio = item.precio ? item.precio.replace(/\s?Gs\s?/g, '') : '0';
        precioLimpio = precioLimpio.replace('$', '').replace(/\./g, '');
        const precioNumerico = parseFloat(precioLimpio.replace(/[^\d]/g, '')) || 0;
        const precioMostrar = precioNumerico.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        html += `
            <div class="item-mini-carrito">
                <div class="info-mini-item">
                    <div class="nombre-mini">${item.nombre || 'Juego sin nombre'}</div>
                    <div class="detalle-mini">${precioMostrar} Gs x ${item.cantidad}</div>
                </div>
            </div>
        `;
    });
    
    contenido.innerHTML = html;
}

// Función para ir al carrito completo - DETECCIÓN AUTOMÁTICA
function irAlCarrito() {
    const currentPage = window.location.pathname;
    
    // Si estamos en una página de PS2, ir al formulario de PS2
    if (currentPage.includes('ps2') || currentPage.includes('PS2') || 
        currentPage.includes('playstation') || currentPage.includes('PlayStation')) {
        window.location.href = '/PEDIDOS/pedidosps2.html';
    } 
    // Si estamos en la página principal o otras páginas, ir al formulario general
    else {
        window.location.href = '/PEDIDOS/pedidos.html';
    }
}

// Cerrar el mini carrito al hacer clic fuera de él
document.addEventListener('click', function(event) {
    const carritoFlotante = document.getElementById('carritoFlotante');
    const miniCarrito = document.getElementById('miniCarritoFlotante');
    const btnCarrito = document.querySelector('.btn-carrito-flotante');
    
    if (miniCarrito && miniCarrito.classList.contains('mostrar') && 
        !carritoFlotante.contains(event.target) && 
        event.target !== btnCarrito) {
        miniCarrito.classList.remove('mostrar');
    }
});

// Actualizar contador cuando se añade un producto
function añadirAlCarrito(nombreJuego) {
    console.log('🛒 Añadiendo al carrito:', nombreJuego);
    
    // Buscar automáticamente el precio
    let precioJuego = 'Consultar precio';
    const button = event.target;
    const card = button.closest('.juego, .card, .game');
    
    if (card) {
        const precioElement = card.querySelector('h5.precio-act, .precio, .price');
        if (precioElement) {
            precioJuego = precioElement.textContent.trim();
        }
    }
    
    // Obtener carrito actual
    let carrito = JSON.parse(sessionStorage.getItem('carrito') || '[]');
    
    // Verificar si el juego ya está en el carrito
    const juegoExistente = carrito.find(item => item.nombre === nombreJuego);
    
    if (juegoExistente) {
        juegoExistente.cantidad += 1;
    } else {
        carrito.push({
            nombre: nombreJuego,
            precio: precioJuego,
            cantidad: 1,
            id: Date.now()
        });
    }
    
    // Guardar en sessionStorage
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar contador del carrito flotante
    actualizarContadorCarrito();
    
    // Mostrar confirmación
    mostrarConfirmacionCarrito(nombreJuego);
    
    console.log('✅ Producto añadido. Carrito actual:', carrito);
}

// Inicializar contador al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Página de inicio cargada');
    actualizarContadorCarrito();
});

// Hacer funciones globales
window.añadirAlCarrito = añadirAlCarrito;
window.toggleCarritoFlotante = toggleCarritoFlotante;
window.irAlCarrito = irAlCarrito;
window.actualizarContadorCarrito = actualizarContadorCarrito;