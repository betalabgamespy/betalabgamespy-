// formulario.js - Código completo para el formulario de pedidos

// Variable global para el carrito
let carrito = [];

// Función para obtener los datos del CARRITO
function obtenerDatosCarrito() {
    const carritoGuardado = sessionStorage.getItem('carrito');
    console.log('📦 Obteniendo carrito de sessionStorage:', carritoGuardado);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

// FUNCIÓN VACIAR CARRITO
function vaciarCarrito() {
    console.log('🔄 ===== VACIAR CARRITO INICIADO =====');
    
    // Vaciar sessionStorage
    sessionStorage.removeItem('carrito');
    carrito = [];
    
    // Actualizar la vista
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
    console.log('🔢 Formateando número:', numero);
    
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
    console.log('💰 Calculando precios para:', item);
    
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
    console.log('🛍️ Mostrando resumen del carrito:', carrito);
    
    const tituloElement = document.getElementById('nombreJuego');
    const contenedorResumen = document.getElementById('resumen-carrito');
    
    if (!carrito || carrito.length === 0) {
        console.log('📭 Carrito vacío, mostrando estado vacío');
        
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
        console.log('✅ HTML del carrito actualizado');
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

// FUNCIÓN PARA CREAR EL CONTENIDO DEL CORREO
function crearContenidoCorreo(datos, carrito, total) {
    let contenido = `
NUEVO PEDIDO - BETALAB GAMES PY
════════════════════════════════

📋 INFORMACIÓN DEL CLIENTE:
────────────────────────────
👤 Nombre: ${datos.nombre} ${datos.apellido}
📧 Email: ${datos.email}
📞 Teléfono: ${datos.telefono}
💬 Mensaje: ${datos.mensaje || 'No dejó mensaje'}
🧾 Comprobante: ${datos.comprobante}

🛒 DETALLES DEL PEDIDO:
────────────────────────────
`;

    if (carrito.length === 0) {
        contenido += '❌ Carrito vacío\n';
    } else {
        carrito.forEach((item, index) => {
            const precios = calcularPrecios(item);
            contenido += `🎮 ${index + 1}. ${item.nombre}\n`;
            contenido += `   Cantidad: ${item.cantidad} x ${precios.precioMostrar}\n`;
            contenido += `   Subtotal: ${precios.subtotalMostrar}\n\n`;
        });
    }

    contenido += `
────────────────────────────
💰 TOTAL DEL PEDIDO: ${total}
────────────────────────────

🏦 DATOS BANCARIOS USADOS:
────────────────────────────
Banco: UENO BANK
Cuenta: 619935527
Titular: Gonzalo Rojas
CI: 6525197

🕒 Fecha: ${new Date().toLocaleString('es-PY')}
📦 BETALAB GAMES PY
    `;

    return contenido;
}

// FUNCIÓN CORREO SIMPLE - Abre el cliente de correo
function enviarCorreoSimple(contenido, datos) {
    const emailDestino = 'betalabgamespedidos@gmail.com'; // CAMBIA POR TU EMAIL REAL
    const subject = `🎮 NUEVO PEDIDO - ${datos.nombre} ${datos.apellido}`;
    
    const mailtoLink = `mailto:${emailDestino}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(contenido)}`;
    
    console.log('📧 Abriendo cliente de correo...');
    console.log('Asunto:', subject);
    console.log('Contenido:', contenido);
    
    // Mostrar loading
    mostrarLoading(true);
    
    // Abrir cliente de correo después de un breve delay
    setTimeout(() => {
        window.location.href = mailtoLink;
        mostrarLoading(false);
        
        // Mostrar mensaje de éxito después de un tiempo
        setTimeout(() => {
            const confirmacion = confirm(
                '✅ Pedido preparado para enviar.\n\n' +
                'Se abrió tu cliente de correo. ¿Ya enviaste el correo?\n\n' +
                'Si no se abrió el correo, por favor envía manualmente a:\n' +
                'betalabgamespy@gmail.com\n\n' +
                '¿Quieres vaciar el carrito?'
            );
            
            if (confirmacion) {
                vaciarCarrito();
                mostrarMensajeExito();
            }
        }, 1000);
    }, 1500);
}

// FUNCIÓN PARA MANEJAR EL ENVÍO DEL FORMULARIO
function manejarEnvioPedido(event) {
    event.preventDefault();
    console.log('📤 Procesando envío de pedido...');
    
    // Verificar que el carrito no esté vacío
    const carrito = obtenerDatosCarrito();
    if (carrito.length === 0) {
        alert('❌ El carrito está vacío. Agrega juegos antes de enviar el pedido.');
        return;
    }
    
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const comprobante = document.getElementById('comprobante').files.length > 0 ? 
        'Sí adjuntó comprobante' : 'No adjuntó comprobante';

    // Validar campos requeridos
    if (!nombre || !apellido || !email || !telefono) {
        alert('❌ Por favor completa todos los campos requeridos (*)');
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('❌ Por favor ingresa un email válido');
        return;
    }

    // Validar teléfono (mínimo 8 dígitos)
    const telefonoLimpio = telefono.replace(/\D/g, '');
    if (telefonoLimpio.length < 8) {
        alert('❌ Por favor ingresa un número de teléfono válido');
        return;
    }

    // Obtener datos del carrito y calcular total
    const total = calcularTotalCarrito(carrito);
    const totalFormateado = formatearNumeroConCeros(total) + ' Gs';

    // Crear contenido del correo
    const contenidoCorreo = crearContenidoCorreo({
        nombre, apellido, email, telefono, mensaje, comprobante
    }, carrito, totalFormateado);

    // Enviar por correo simple
    enviarCorreoSimple(contenidoCorreo, { nombre, apellido });
}

// FUNCIÓN PARA MOSTRAR/OCULTAR LOADING
function mostrarLoading(mostrar) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = mostrar ? 'block' : 'none';
    }
}

// FUNCIÓN PARA MOSTRAR MENSAJE DE ÉXITO
function mostrarMensajeExito() {
    const mensajeExito = document.getElementById('mensajeExito');
    if (mensajeExito) {
        mensajeExito.style.display = 'block';
        setTimeout(() => {
            mensajeExito.style.display = 'none';
        }, 5000);
    }
}

// FUNCIÓN PARA ACTUALIZAR MONTO DE TRANSFERENCIA
function actualizarMontoTransferencia(precio) {
    const montoValor = document.getElementById('monto-valor');
    if (montoValor) {
        montoValor.textContent = precio;
    }
}

// FUNCIÓN PARA MOSTRAR VISTA PREVIA DEL PEDIDO
function mostrarVistaPrevia() {
    const carrito = obtenerDatosCarrito();
    const total = calcularTotalCarrito(carrito);
    const totalFormateado = formatearNumeroConCeros(total) + ' Gs';
    
    let mensaje = '📋 VISTA PREVIA DEL PEDIDO:\n\n';
    
    if (carrito.length === 0) {
        mensaje += '❌ Carrito vacío';
    } else {
        carrito.forEach((item, index) => {
            const precios = calcularPrecios(item);
            mensaje += `🎮 ${item.nombre}\n`;
            mensaje += `   ${item.cantidad} x ${precios.precioMostrar}\n`;
        });
        mensaje += `\n💰 TOTAL: ${totalFormateado}`;
    }
    
    alert(mensaje);
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página de pedidos cargada - Iniciando...');
    
    // Obtener carrito
    carrito = obtenerDatosCarrito();
    console.log('📦 Carrito al cargar:', carrito);
    
    // Mostrar resumen del carrito
    mostrarResumenCarrito(carrito);
    
    // Actualizar monto de transferencia
    const total = calcularTotalCarrito(carrito);
    actualizarMontoTransferencia(formatearNumeroConCeros(total) + ' Gs');
    
    // Agregar event listener al formulario
    const formularioPedido = document.getElementById('formPedidos');
    if (formularioPedido) {
        formularioPedido.addEventListener('submit', manejarEnvioPedido);
        console.log('✅ Event listener agregado al formulario');
    }
    
    // Agregar botón de vista previa
    const btnVistaPrevia = document.createElement('button');
    btnVistaPrevia.type = 'button';
    btnVistaPrevia.className = 'btn-vista-previa';
    btnVistaPrevia.innerHTML = '👁️ Vista Previa del Pedido';
    btnVistaPrevia.onclick = mostrarVistaPrevia;
    btnVistaPrevia.style.margin = '10px 0';
    btnVistaPrevia.style.padding = '10px';
    btnVistaPrevia.style.backgroundColor = '#17a2b8';
    btnVistaPrevia.style.color = 'white';
    btnVistaPrevia.style.border = 'none';
    btnVistaPrevia.style.borderRadius = '5px';
    btnVistaPrevia.style.cursor = 'pointer';
    
    const formulario = document.getElementById('formPedidos');
    const btnEnviar = document.querySelector('.btn-enviar');
    if (formulario && btnEnviar) {
        formulario.insertBefore(btnVistaPrevia, btnEnviar);
    }
});

// Hacer funciones globales
window.vaciarCarrito = vaciarCarrito;
window.manejarEnvioPedido = manejarEnvioPedido;
window.mostrarVistaPrevia = mostrarVistaPrevia;

console.log('✅ formulario.js cargado - Funciones disponibles:');
console.log('- vaciarCarrito()');
console.log('- manejarEnvioPedido()');
console.log('- mostrarVistaPrevia()');

