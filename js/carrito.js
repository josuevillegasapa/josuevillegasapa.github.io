// =========================================================
// GESTIÓN DE LA VISTA DE CARRITO (carrito.html)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const tbodyCarrito = document.getElementById('lista-carrito');
    const msgVacio = document.getElementById('mensaje-carrito-vacio');
    const resumenCantidad = document.getElementById('resumen-cantidad');
    const resumenTotal = document.getElementById('resumen-total');
    const btnVaciar = document.getElementById('btn-vaciar-carrito');
    const btnFinalizar = document.getElementById('btn-finalizar-compra');

    function renderizarCarrito() {
        const carrito = obtenerCarrito();
        tbodyCarrito.innerHTML = '';

        if (carrito.length === 0) {
            msgVacio.classList.remove('oculto');
            resumenCantidad.textContent = '0';
            resumenTotal.textContent = 'Bs 0.00';
            return;
        }

        msgVacio.classList.add('oculto');
        let totalUnidades = 0;
        let totalPagar = 0;

        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            totalUnidades += item.cantidad;
            totalPagar += subtotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div style="display:flex; align-items:center; gap:0.8rem;">
                        <img src="${item.imagen}" alt="${item.nombre}" style="width:50px; height:50px; object-fit:cover; border-radius:6px;" onerror="this.src='img/banner.jpg'">
                        <strong>${item.nombre}</strong>
                    </div>
                </td>
                <td>Bs ${item.precio.toFixed(2)}</td>
                <td>
                    <button class="btn btn-secondary btn-sm btn-restar" data-index="${index}">-</button>
                    <span style="margin: 0 0.6rem; font-weight:700;">${item.cantidad}</span>
                    <button class="btn btn-secondary btn-sm btn-sumar" data-index="${index}">+</button>
                </td>
                <td><strong>Bs ${subtotal.toFixed(2)}</strong></td>
                <td>
                    <button class="btn btn-danger btn-sm btn-eliminar" data-index="${index}" style="margin:0;">Eliminar</button>
                </td>
            `;
            tbodyCarrito.appendChild(tr);
        });

        resumenCantidad.textContent = totalUnidades;
        resumenTotal.textContent = `Bs ${totalPagar.toFixed(2)}`;

        asignarEventosCarrito();
    }

    function asignarEventosCarrito() {
        document.querySelectorAll('.btn-sumar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                const carrito = obtenerCarrito();
                if (carrito[idx].cantidad < carrito[idx].stock) {
                    carrito[idx].cantidad += 1;
                    guardarCarrito(carrito);
                    renderizarCarrito();
                } else {
                    alert(`Stock máximo alcanzado (${carrito[idx].stock} unidades).`);
                }
            });
        });

        document.querySelectorAll('.btn-restar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                const carrito = obtenerCarrito();
                if (carrito[idx].cantidad > 1) {
                    carrito[idx].cantidad -= 1;
                } else {
                    carrito.splice(idx, 1);
                }
                guardarCarrito(carrito);
                renderizarCarrito();
            });
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                const carrito = obtenerCarrito();
                carrito.splice(idx, 1);
                guardarCarrito(carrito);
                renderizarCarrito();
            });
        });
    }

    btnVaciar.addEventListener('click', () => {
        if (obtenerCarrito().length === 0) return;
        if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
            guardarCarrito([]);
            renderizarCarrito();
        }
    });

    btnFinalizar.addEventListener('click', () => {
        const carrito = obtenerCarrito();
        if (carrito.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
            return;
        }
        alert('¡Pedido confirmado con éxito! Gracias por comprar en AndesTech Store.');
        guardarCarrito([]);
        renderizarCarrito();
    });

    renderizarCarrito();
});