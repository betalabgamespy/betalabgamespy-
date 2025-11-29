// FUNCIÓN SIMPLE PARA ENVIAR A GMAIL
function enviarAGmail(event) {
    event.preventDefault();
    
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Validar campos obligatorios
    if (!nombre || !apellido || !telefono || !email) {
        alert('❌ Por favor, complete todos los campos obligatorios');
        return;
    }
    
    // Obtener carrito
    const carrito = obtenerDatosCarrito();
    
    // Validar que el carrito no esté vacío
    if (carrito.length === 0) {
        alert('❌ El carrito está vacío. Agregue juegos antes de enviar el pedido.');
        return;
    }
    
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
    cuerpoMensaje += `📎 IMPORTANTE: Recuerde que debe acercar la consola al local para la instalación de los juegos.`;

    // Enviar por Gmail
    const emailDestino = 'betalabgamespy@gmail.com';
    const asunto = `🎮 PEDIDO - ${nombre} ${apellido}`;
    const mailtoLink = `mailto:${emailDestino}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpoMensaje)}`;
    
    // Mostrar alerta con instrucciones claras - SOLO UNA ALERTA
    alert(`📧 SE ABRIRÁ GMAIL\n\n📎 INSTRUCCIONES IMPORTANTES:\n\n1. Se abrirá Gmail automáticamente\n2. Revisa que todos los datos estén correctos\n3. Presiona ENVIAR para completar tu pedido\n\n✅ Te estaremos contactando en el transcurso del día`);
    
    // Abrir cliente de correo
    window.location.href = mailtoLink;
    
    // Opcional: Vaciar el carrito después de enviar
    setTimeout(() => {
        vaciarCarrito();
    }, 1000);
}


