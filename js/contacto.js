// =========================================================
// VALIDACIÓN DEL FORMULARIO DE CONTACTO (contacto.html)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-contacto');
    const confirmacion = document.getElementById('confirmacion-envio');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        limpiarErrores();
        confirmacion.classList.add('oculto');

        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const celular = document.getElementById('celular').value.trim();
        const asunto = document.getElementById('asunto').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        let esValido = true;

        // Validación de nombre
        if (nombre.length < 3) {
            mostrarError('error-nombre', 'Ingresa tu nombre completo (mínimo 3 caracteres).');
            esValido = false;
        }

        // Validación de correo electrónico
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            mostrarError('error-correo', 'Ingresa un correo electrónico válido.');
            esValido = false;
        }

        // Validación de celular (8 dígitos numéricos en Bolivia, iniciando en 6 o 7)
        const regexCelular = /^[67]\d{7}$/;
        if (!regexCelular.test(celular)) {
            mostrarError('error-celular', 'Ingresa un número de celular válido de 8 dígitos (Ej. 71234567).');
            esValido = false;
        }

        // Validación de asunto
        if (asunto.length < 4) {
            mostrarError('error-asunto', 'El asunto debe tener al menos 4 caracteres.');
            esValido = false;
        }

        // Validación de mensaje
        if (mensaje.length < 10) {
            mostrarError('error-mensaje', 'El mensaje debe contener al menos 10 caracteres.');
            esValido = false;
        }

        // Si todo es válido, simular envío exitoso
        if (esValido) {
            form.reset();
            confirmacion.classList.remove('oculto');
        }
    });

    function mostrarError(idElemento, texto) {
        const elemento = document.getElementById(idElemento);
        if (elemento) elemento.textContent = texto;
    }

    function limpiarErrores() {
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    }
});