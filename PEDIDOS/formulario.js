// Variable global para el carrito
let carrito = [];

// Función para obtener los datos del CARRITO
function obtenerDatosCarrito() {
    const carritoGuardado = sessionStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

// FUNCIÓN VACIAR CARRITO
function vaciarCarrito() {
    sessionStorage.removeItem('carrito');
    carrito = [];
    mostrarResumenCarrito([]);
    actualizarMontoTransferencia('0 Gs');
    
    const tituloElement = document.getElementById('nombreJuego');
    if (tituloElement) {
        tituloElement.textContent = 'Carrito vacío';
    }
    
    alert('✅ Carrito vaciado correctamente');
}

// FUNCIÓN para formatear números
function formatearNumeroConCeros(numero) {
    if (numero === 0) return '0';
    if (Number.isInteger(numero) && numero < 1000) {
        return numero + '.000';
    }
    let numeroString = numero.toString();
    if (!numeroString.includes('.') && numero < 1000000) {
        const partes = numeroString.split('.');
        const parteEntera = partes[0];
        if (parseInt(parteEntera) < 1000) {
            return numero + '.000';
        }
    }
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// FUNCIÓN para calcular precios
function calcularPrecios(item) {
    let precioString = item.precio ? item.precio.toString() : '0';
    precioString = precioString
        .replace(/\s?Gs\s?/g, '')
        .replace(/\$/g, '')
        .replace(/\./g, '')
        .trim();
    
    const precioNumerico = parseFloat(precioString) || 0;
    const subtotalNumerico = precioNumerico * item.cantidad;
    
    const precioMostrar = formatearNumeroConCeros(precioNumerico) + ' Gs';
    const subtotalMostrar = formatearNumeroConCeros(subtotalNumerico) + ' Gs';
    
    return {
        precioMostrar: precioMostrar,
        subtotalMostrar: subtotalMostrar
    };
}

// Función para mostrar el resumen del carrito
function mostrarResumenCarrito(carrito) {
    const tituloElement = document.getElementById('nombreJuego');
    const contenedorResumen = document.getElementById('resumen-carrito');
    
    if (!carrito || carrito.length === 0) {
        if (tituloElement) {
            tituloElement.textContent = 'Carrito vacío';
        }
        if (contenedorResumen) {
            contenedorResumen.innerHTML = `
                <div class="resumen-pedido">
                    <p class="carrito-vacio">No hay juegos en el carrito</p>
                    <button type="button" class="btn-vaciar-carrito" onclick="vaciarCarrito()" style="opacity: 0.6; cursor: not-allowed;" disabled>
                        🗑️ Vaciar Carrito (carrito vacío)
                    </button>
                </div>
            `;
        }
        return;
    }
    
    const totalJuegos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if (tituloElement) {
        tituloElement.textContent = `Pedido de ${totalJuegos} juego(s)`;
    }
    
    let htmlResumen = '<div class="resumen-pedido">';
    htmlResumen += '<h4>📋 Detalles de tu pedido:</h4>';
    htmlResumen += '<div class="lista-juegos">';
    
    carrito.forEach((item, index) => {
        const precios = calcularPrecios(item);
        htmlResumen += `
            <div class="item-resumen">
                <div class="info-juego-item">
                    <span class="nombre-juego">${item.nombre || 'Juego sin nombre'}</span>
                    <span class="precio-juego">${precios.precioMostrar} x ${item.cantidad}</span>
                </div>
                <div class="subtotal-juego">Subtotal: ${precios.subtotalMostrar}</div>
            </div>
        `;
    });
    
    const total = calcularTotalCarrito(carrito);
    const totalMostrar = formatearNumeroConCeros(total) + ' Gs';
    
    htmlResumen += `
        </div>
        <hr>
        <div class="total-pedido">
            <strong>💰 Total a pagar: ${totalMostrar}</strong>
        </div>
        <button type="button" class="btn-vaciar-carrito" onclick="vaciarCarrito()" id="btnVaciarCarrito">
            🗑️ Vaciar Carrito
        </button>
    </div>`;
    
    if (contenedorResumen) {
        contenedorResumen.innerHTML = htmlResumen;
    }
}

// FUNCIÓN para calcular total del carrito
function calcularTotalCarrito(carrito) {
    let total = 0;
    carrito.forEach(item => {
        let precioString = item.precio ? item.precio.toString() : '0';
        precioString = precioString
            .replace(/\s?Gs\s?/g, '')
            .replace(/\$/g, '')
            .replace(/\./g, '')
            .trim();
        const precioNumerico = parseFloat(precioString) || 0;
        const subtotal = precioNumerico * item.cantidad;
        total += subtotal;
    });
    return total;
}

// FUNCIÓN MEJORADA PARA ENVIAR A GMAIL CON CAPTURA DE PANTALLA
function enviarAGmail(event) {
    event.preventDefault();
    
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Obtener carrito
    const carrito = obtenerDatosCarrito();
    const total = calcularTotalCarrito(carrito);
    const totalFormateado = formatearNumeroConCeros(total) + ' Gs';
    
    // Crear mensaje para Gmail
    let cuerpoMensaje = `NUEVO PEDIDO - BETALAB GAMES PY\n\n`;
    cuerpoMensaje += `INFORMACIÓN DEL CLIENTE:\n`;
    cuerpoMensaje += `Nombre: ${nombre} ${apellido}\n`;
    cuerpoMensaje += `Email: ${email}\n`;
    cuerpoMensaje += `Teléfono: ${telefono}\n`;
    cuerpoMensaje += `Mensaje: ${mensaje || 'No especificado'}\n\n`;
    
    cuerpoMensaje += `DETALLES DEL PEDIDO:\n`;
    carrito.forEach((item, index) => {
        const precios = calcularPrecios(item);
        cuerpoMensaje += `${index + 1}. ${item.nombre}\n`;
        cuerpoMensaje += `   Cantidad: ${item.cantidad} x ${precios.precioMostrar}\n`;
        cuerpoMensaje += `   Subtotal: ${precios.subtotalMostrar}\n\n`;
    });
    
    cuerpoMensaje += `TOTAL: ${totalFormateado}\n\n`;
    cuerpoMensaje += `Fecha: ${new Date().toLocaleString('es-PY')}\n\n`;
    cuerpoMensaje += `📎 IMPORTANTE: Por favor, adjunte la foto del comprobante de transferencia en este correo.`;

    // Enviar por Gmail
    const emailDestino = 'betalabgamespy@gmail.com'; // CAMBIA POR TU GMAIL
    const asunto = `🎮 PEDIDO - ${nombre} ${apellido}`;
    
    // Crear enlace mailto mejorado
    const mailtoLink = `mailto:${emailDestino}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpoMensaje)}`;
    
    // Mostrar instrucciones para adjuntar imagen
    alert(`📧 Se abrirá tu cliente de correo.\n\n📎 POR FAVOR:\n1. Adjunta la foto del comprobante de transferencia\n2. Revisa que todos los datos estén correctos\n3. Envía el correo`);
    
    // Abrir cliente de correo
    window.open(mailtoLink, '_blank');
    
    // Mostrar mensaje adicional en la página
    const mensajeExito = document.createElement('div');
    mensajeExito.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1a1a2e;
        color: white;
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #667eea;
        z-index: 10000;
        text-align: center;
        max-width: 400px;
    `;
    mensajeExito.innerHTML = `
        <h3>📧 Correo Listo</h3>
        <p>Se abrió tu cliente de correo.</p>
        <p><strong>No olvides adjuntar la foto del comprobante de transferencia</strong></p>
        <button onclick="this.parentElement.remove()" style="
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
        ">Entendido</button>
    `;
    document.body.appendChild(mensajeExito);
}

// Función alternativa para capturar pantalla (opcional)
function capturarComprobante() {
    // Esta función podría integrarse con una API de captura de pantalla
    // Por ahora, solo muestra instrucciones
    alert(`📸 Para capturar el comprobante:\n\n1. Toma una screenshot de tu comprobante\n2. Guárdala como imagen\n3. Adjúntala en el correo que se abrirá`);
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Obtener carrito
    carrito = obtenerDatosCarrito();
    
    // Mostrar resumen
    mostrarResumenCarrito(carrito);
    
    // Actualizar monto
    const total = calcularTotalCarrito(carrito);
    actualizarMontoTransferencia(formatearNumeroConCeros(total) + ' Gs');
    
    // Agregar event listener al formulario
    const formulario = document.getElementById('formPedidos');
    if (formulario) {
        formulario.addEventListener('submit', enviarAGmail);
    }
    
    // Agregar botón para instrucciones de comprobante
    const instruccionesBtn = document.createElement('button');
    instruccionesBtn.textContent = '📸 ¿Cómo adjuntar comprobante?';
    instruccionesBtn.type = 'button';
    instruccionesBtn.style.cssText = `
        background: #00b894;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        margin: 10px 0;
        font-size: 14px;
    `;
    instruccionesBtn.onclick = capturarComprobante;
    
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.appendChild(instruccionesBtn);
    }
});

function actualizarMontoTransferencia(precio) {
    const montoValor = document.getElementById('monto-valor');
    if (montoValor) {
        montoValor.textContent = precio;
    }
}

// Hacer funciones globales
window.vaciarCarrito = vaciarCarrito;
window.enviarAGmail = enviarAGmail;
window.capturarComprobante = capturarComprobante;

