console.log('🎯 formulariops2.js INICIADO - script cargado');

// Función para obtener los datos del CARRITO - USANDO sessionStorage
function obtenerDatosCarrito() {
    console.log('🔍 Ejecutando obtenerDatosCarrito()');
    const carritoGuardado = sessionStorage.getItem('carrito');
    console.log('📦 sessionStorage carrito:', carritoGuardado);
    
    if (!carritoGuardado || carritoGuardado === 'null' || carritoGuardado === '[]') {
        console.log('📭 Carrito vacío');
        return [];
    }
    
    try {
        return JSON.parse(carritoGuardado);
    } catch (error) {
        console.error('❌ Error parseando carrito:', error);
        return [];
    }
}

// FUNCIÓN VACIAR CARRITO - SIN CONFIRMACIÓN
function vaciarCarrito() {
    console.log('🔄 vaciarCarrito ejecutada');
    
    // Verificar si hay algo que vaciar
    const carritoSession = sessionStorage.getItem('carrito');
    
    if (!carritoSession || carritoSession === 'null' || carritoSession === '[]') {
        alert('❌ El carrito ya está vacío');
        return;
    }
    
    // VACIAR DIRECTAMENTE SIN CONFIRMACIÓN
    localStorage.removeItem('carrito');
    sessionStorage.removeItem('carrito');
    
    console.log('✅ Storages limpiados');
    alert('✅ Carrito vaciado correctamente');
    
    // RECARGAR INMEDIATAMENTE
    location.reload();
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOMContentLoaded - Página lista');
    
    const carrito = obtenerDatosCarrito();
    console.log('📦 Carrito al cargar:', carrito);
    
    if (carrito.length > 0) {
        console.log('✅ Mostrando carrito con', carrito.length, 'items');
        mostrarResumenCarrito(carrito);
    } else {
        console.log('📝 Mostrando formulario individual');
        const { nombreJuego, precioJuego } = obtenerDatosJuego();
        document.getElementById('nombreJuego').textContent = nombreJuego;
    }
});

// Función para calcular el total del carrito
function calcularTotalCarrito(carrito) {
    let total = 0;
    carrito.forEach(item => {
        let precioLimpio = item.precio ? item.precio.replace(/\s?Gs\s?/g, '') : '0';
        precioLimpio = precioLimpio.replace('$', '').replace(/\./g, '');
        const precioNumerico = parseFloat(precioLimpio.replace(/[^\d]/g, '')) || 0;
        total += precioNumerico * item.cantidad;
    });
    return total;
}

// Función para formatear números con puntos
function formatearNumero(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Función para mostrar el resumen del carrito
function mostrarResumenCarrito(carrito) {
    const tituloElement = document.getElementById('nombreJuego');
    
    if (!carrito || carrito.length === 0) {
        tituloElement.textContent = 'Carrito vacío';
        return;
    }
    
    const totalJuegos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    // Actualizar títulos
    const tituloFormulario = document.querySelector('.titulo-formulario');
    if (tituloFormulario) {
        tituloFormulario.textContent = '🛒 Pedir Videojuegos del Carrito';
    }
    
    const h3Element = document.querySelector('#infoJuego h3');
    if (h3Element) {
        h3Element.textContent = '🎮 Juegos en tu Carrito:';
    }
    
    tituloElement.textContent = `Pedido de ${totalJuegos} juego(s)`;
    
    // Crear HTML del resumen
    let htmlResumen = '<div class="resumen-pedido">';
    htmlResumen += '<h4>📋 Detalles de tu pedido:</h4>';
    htmlResumen += '<div class="lista-juegos">';
    
    carrito.forEach((item) => {
        let precioLimpio = item.precio ? item.precio.replace(/\s?Gs\s?/g, '') : '0';
        precioLimpio = precioLimpio.replace('$', '').replace(/\./g, '');
        const precioNumerico = parseFloat(precioLimpio.replace(/[^\d]/g, '')) || 0;
        const subtotal = precioNumerico * item.cantidad;
        
        const precioMostrar = formatearNumero(precioNumerico);
        const subtotalMostrar = formatearNumero(subtotal);
        
        htmlResumen += `
            <div class="item-resumen">
                <div class="info-juego-item">
                    <span class="nombre-juego">${item.nombre || 'Juego sin nombre'}</span>
                    <span class="precio-juego">${precioMostrar} Gs x ${item.cantidad}</span>
                </div>
                <div class="subtotal-juego">Subtotal: ${subtotalMostrar} Gs</div>
            </div>
        `;
    });
    
    const total = calcularTotalCarrito(carrito);
    const totalMostrar = formatearNumero(total);
    
    // BOTÓN VACIAR CARRITO
    htmlResumen += `
    </div>
    <div class="total-pedido">
        <strong>💰 Total a pagar: ${totalMostrar} Gs</strong>
    </div>
    <button type="button" class="btn-vaciar-carrito" onclick="vaciarCarrito()">
        🗑️ Vaciar Carrito
    </button>
</div>`;
    
    // Insertar en el DOM
    const nombreJuegoElement = document.getElementById('nombreJuego');
    if (nombreJuegoElement && nombreJuegoElement.parentNode) {
        const resumenAnterior = document.getElementById('resumen-carrito');
        if (resumenAnterior) {
            resumenAnterior.remove();
        }
        
        const contenedorResumen = document.createElement('div');
        contenedorResumen.id = 'resumen-carrito';
        contenedorResumen.className = 'resumen-carrito';
        contenedorResumen.innerHTML = htmlResumen;
        nombreJuegoElement.parentNode.insertBefore(contenedorResumen, nombreJuegoElement.nextSibling);
    }
    
    // Ocultar sección de juegos PS2
    const seccionJuegosPS2 = document.querySelector('.seccion-formulario:nth-child(3)');
    if (seccionJuegosPS2) {
        seccionJuegosPS2.style.display = 'none';
    }
    
    console.log('✅ Resumen del carrito mostrado');
}

// Función para obtener datos del juego individual
function obtenerDatosJuego() {
    let nombreJuego = 'Juego no especificado';
    let precioJuego = 'Consultar precio';
    
    const juegoSession = sessionStorage.getItem('juegoSeleccionado');
    const precioSession = sessionStorage.getItem('precioJuego');
    
    if (juegoSession) {
        nombreJuego = juegoSession;
    }
    
    if (precioSession) {
        precioJuego = precioSession;
    }
    
    console.log('🎮 Datos del juego:', { nombreJuego, precioJuego });
    return { nombreJuego, precioJuego };
}

// Manejar envío del formulario
document.getElementById('formPedidos').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const carrito = obtenerDatosCarrito();
    
    if (carrito.length > 0) {
        enviarCarrito(carrito);
    } else {
        enviarFormularioIndividual();
    }
});

// Función para enviar carrito múltiple
function enviarCarrito(carrito) {
    if (carrito.length === 0) {
        alert('❌ El carrito está vacío');
        return;
    }
    
    document.getElementById('loading').style.display = 'block';
    document.getElementById('mensajeExito').style.display = 'none';
    
    const total = calcularTotalCarrito(carrito);
    const totalMostrar = formatearNumero(total);
    
    const formData = {
        carrito: carrito,
        total: totalMostrar,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        mensaje: document.getElementById('mensaje').value,
        fecha: new Date().toLocaleString(),
        pagina: window.location.href
    };
    
    enviarSolicitudCarritoAGmail(formData);
}

// Función para enviar formulario individual
function enviarFormularioIndividual() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('mensajeExito').style.display = 'none';
    
    const formData = {
        nombreJuego: document.getElementById('nombreJuego').textContent,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        juegosPS2: document.getElementById('juegosPS2').value,
        mensaje: document.getElementById('mensaje').value,
        fecha: new Date().toLocaleString(),
        pagina: window.location.href
    };
    
    enviarSolicitudIndividualAGmail(formData);
}

function enviarSolicitudCarritoAGmail(datos) {
    const emailEmpresa = "betalabgamespedidos@gmail.com";
    
    let detalleCarrito = '';
    datos.carrito.forEach((item) => {
        let precioLimpio = item.precio ? item.precio.replace(/\s?Gs\s?/g, '') : '0';
        precioLimpio = precioLimpio.replace('$', '').replace(/\./g, '');
        const precioNumerico = parseFloat(precioLimpio.replace(/[^\d]/g, '')) || 0;
        const subtotal = precioNumerico * item.cantidad;
        
        const precioMostrar = formatearNumero(precioNumerico);
        const subtotalMostrar = formatearNumero(subtotal);
        
        detalleCarrito += `🎮 ${item.nombre}\n`;
        detalleCarrito += `   • Precio: ${precioMostrar} Gs\n`;
        detalleCarrito += `   • Cantidad: ${item.cantidad}\n`;
        detalleCarrito += `   • Subtotal: ${subtotalMostrar} Gs\n\n`;
    });
    
    const asunto = `🛒 Pedido de ${datos.carrito.length} juego(s) - Total: ${datos.total} Gs`;
    const cuerpo = `...`; // Mantén tu cuerpo actual
    
    const mailtoLink = `mailto:${emailEmpresa}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        window.location.href = mailtoLink;
        document.getElementById('mensajeExito').style.display = 'block';
        sessionStorage.removeItem('carrito');
    }, 1500);
}

function enviarSolicitudIndividualAGmail(datos) {
    const emailEmpresa = "betalabgamespedidos@gmail.com";
    
    const asunto = `Solicitud de Juego - ${datos.nombreJuego}`;
    const cuerpo = `...`; // Mantén tu cuerpo actual
    
    const mailtoLink = `mailto:${emailEmpresa}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        window.location.href = mailtoLink;
        document.getElementById('mensajeExito').style.display = 'block';
    }, 1500);
}

// Validación en tiempo real
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.required && !this.value) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#2ecc71';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = '#667eea';
    });
});

// Hacer las funciones globales
window.vaciarCarrito = vaciarCarrito;
window.obtenerDatosCarrito = obtenerDatosCarrito;
window.mostrarResumenCarrito = mostrarResumenCarrito;

console.log('✅ formulariops2.js cargado - SIN confirmación');