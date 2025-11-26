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

// FUNCIÓN CORREGIDA para formatear números - SOLUCIÓN DEFINITIVA
function formatearNumeroConCeros(numero) {
    console.log('🔢 Formateando número:', numero);
    
    // Si el número es 0, mostrar 0
    if (numero === 0) return '0';
    
    // Para números enteros, agregar .000
    if (Number.isInteger(numero) && numero < 1000) {
        return numero + '.000';
    }
    
    // Para números mayores, formatear con puntos y agregar .000 si es necesario
    let numeroString = numero.toString();
    
    // Si no tiene decimales y es menor a 1.000.000, agregar .000
    if (!numeroString.includes('.') && numero < 1000000) {
        // Dividir en parte entera y verificar
        const partes = numeroString.split('.');
        const parteEntera = partes[0];
        
        // Si la parte entera es menor a 1000, agregar .000
        if (parseInt(parteEntera) < 1000) {
            return numero + '.000';
        }
    }
    
    // Formatear normalmente con separadores de miles
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// FUNCIÓN MEJORADA para calcular precios
function calcularPrecios(item) {
    console.log('💰 Calculando precios para:', item);
    
    let precioString = item.precio ? item.precio.toString() : '0';
    console.log('🔢 Precio string original:', precioString);
    
    // Limpiar el precio - método más robusto
    precioString = precioString
        .replace(/\s?Gs\s?/g, '')
        .replace(/\$/g, '')
        .replace(/\./g, '') // Eliminar puntos para cálculo
        .trim();
    
    console.log('🔢 Precio string limpio:', precioString);
    
    // Convertir a número
    const precioNumerico = parseFloat(precioString) || 0;
    const subtotalNumerico = precioNumerico * item.cantidad;
    
    console.log('🔢 Precio numérico:', precioNumerico);
    console.log('🔢 Cantidad:', item.cantidad);
    console.log('🔢 Subtotal numérico:', subtotalNumerico);
    
    // Formatear con la nueva función
    const precioMostrar = formatearNumeroConCeros(precioNumerico) + ' Gs';
    const subtotalMostrar = formatearNumeroConCeros(subtotalNumerico) + ' Gs';
    
    console.log('💰 Resultado - Precio:', precioMostrar, 'Subtotal:', subtotalMostrar);
    
    return {
        precioMostrar: precioMostrar,
        subtotalMostrar: subtotalMostrar
    };
}

// Función para mostrar el resumen del carrito - VERSIÓN CORREGIDA
function mostrarResumenCarrito(carrito) {
    console.log('🛍️ Mostrando resumen del carrito:', carrito);
    
    const tituloElement = document.getElementById('nombreJuego');
    const contenedorResumen = document.getElementById('resumen-carrito') || crearContenedorResumen();
    
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
    
    // Si hay productos en el carrito
    const totalJuegos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if (tituloElement) {
        tituloElement.textContent = `Pedido de ${totalJuegos} juego(s)`;
    }
    
    // Crear HTML del resumen
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

// FUNCIÓN CORREGIDA para calcular total del carrito
function calcularTotalCarrito(carrito) {
    let total = 0;
    console.log('🔢 Calculando TOTAL del carrito');
    
    carrito.forEach(item => {
        let precioString = item.precio ? item.precio.toString() : '0';
        
        // Limpiar el precio igual que en calcularPrecios
        precioString = precioString
            .replace(/\s?Gs\s?/g, '')
            .replace(/\$/g, '')
            .replace(/\./g, '')
            .trim();
        
        const precioNumerico = parseFloat(precioString) || 0;
        const subtotal = precioNumerico * item.cantidad;
        
        console.log(`   ${item.nombre}: ${precioNumerico} x ${item.cantidad} = ${subtotal}`);
        
        total += subtotal;
    });
    
    console.log(`💰 TOTAL FINAL: ${total}`);
    return total;
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página cargada - Iniciando carrito...');
    
    // Obtener carrito
    carrito = obtenerDatosCarrito();
    console.log('📦 Carrito al cargar:', carrito);
    
    // Mostrar resumen
    mostrarResumenCarrito(carrito);
    
    // Actualizar monto
    const total = calcularTotalCarrito(carrito);
    actualizarMontoTransferencia(formatearNumeroConCeros(total) + ' Gs');
    
    // Agregar event listener global como backup
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'btnVaciarCarrito') {
            vaciarCarrito();
        }
    });
});

// Función para debug
function debugCarritoCompleto() {
    console.log('=== 🐛 DEBUG COMPLETO DEL CARRITO ===');
    console.log('sessionStorage carrito:', sessionStorage.getItem('carrito'));
    console.log('Variable global carrito:', carrito);
    console.log('Botón vaciar en DOM:', document.getElementById('btnVaciarCarrito'));
}

function crearContenedorResumen() {
    const contenedor = document.createElement('div');
    contenedor.id = 'resumen-carrito';
    contenedor.className = 'resumen-carrito';
    
    const nombreJuegoElement = document.getElementById('nombreJuego');
    if (nombreJuegoElement && nombreJuegoElement.parentNode) {
        nombreJuegoElement.parentNode.insertBefore(contenedor, nombreJuegoElement.nextSibling);
        return contenedor;
    }
    return null;
}

function actualizarMontoTransferencia(precio) {
    const montoValor = document.getElementById('monto-valor');
    if (montoValor) {
        montoValor.textContent = precio;
    }
}

// Hacer funciones globales
window.vaciarCarrito = vaciarCarrito;
window.debugCarritoCompleto = debugCarritoCompleto;
window.mostrarResumenCarrito = mostrarResumenCarrito;

console.log('✅ pedido.js cargado - Funciones disponibles:');