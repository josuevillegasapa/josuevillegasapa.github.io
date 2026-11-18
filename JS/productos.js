// =========================================================
// GESTIÓN DEL CATÁLOGO DE PRODUCTOS (productos.html)
// =========================================================

let listaProductos = [];

const catalogoContenedor = document.getElementById('catalogo-productos');
const inputBuscador = document.getElementById('buscador');
const selectCategoria = document.getElementById('filtro-categoria');
const selectStock = document.getElementById('filtro-stock');
const selectOrden = document.getElementById('orden-precio');
const modalDetalle = document.getElementById('modal-detalle');
const contenidoModal = document.getElementById('contenido-modal-detalle');
const btnCerrarModal = document.getElementById('cerrar-modal');

// Obtener productos desde productos.json mediante fetch()
async function inicializarCatalogo() {
    try {
        const respuesta = await fetch('data/productos.json');
        if (!respuesta.ok) throw new Error('Error al leer data/productos.json');
        
        listaProductos = await respuesta.json();
        poblarSelectCategorias(listaProductos);
        aplicarParametroURL();
        filtrarYRenderizar();
    } catch (error) {
        console.error('Error cargando el catálogo:', error);
        catalogoContenedor.innerHTML = '<p>No se pudieron cargar los productos. Verifica la ejecución en un servidor local.</p>';
    }
}

// Cargar categorías únicas en el <select>
function poblarSelectCategorias(productos) {
    const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];
    categoriasUnicas.forEach(cat => {
        const opcion = document.createElement('option');
        opcion.value = cat;
        opcion.textContent = cat;
        selectCategoria.appendChild(opcion);
    });
}

// Leer si el usuario llegó desde index.html haciendo clic en una categoría
function aplicarParametroURL() {
    const params = new URLSearchParams(window.location.search);
    const catURL = params.get('categoria');
    if (catURL) {
        selectCategoria.value = catURL;
    }
}

// Filtrar y ordenar según los controles seleccionados
function filtrarYRenderizar() {
    const texto = inputBuscador.value.toLowerCase().trim();
    const categoria = selectCategoria.value;
    const estadoStock = selectStock.value;
    const orden = selectOrden.value;

    let filtrados = listaProductos.filter(prod => {
        const coincideNombre = prod.nombre.toLowerCase().includes(texto) || 
                               prod.descripcion.toLowerCase().includes(texto);
        const coincideCategoria = (categoria === 'todas') || (prod.categoria === categoria);
        
        let coincideStock = true;
        if (estadoStock === 'disponible') coincideStock = prod.stock > 0;
        if (estadoStock === 'agotado') coincideStock = prod.stock === 0;

        return coincideNombre && coincideCategoria && coincideStock;
    });

    // Ordenamiento por precio
    if (orden === 'asc') {
        filtrados.sort((a, b) => a.precio - b.precio);
    } else if (orden === 'desc') {
        filtrados.sort((a, b) => b.precio - a.precio);
    }

    renderizarTarjetas(filtrados);
}

// Generar HTML de cada tarjeta de producto
function renderizarTarjetas(productos) {
    catalogoContenedor.innerHTML = '';

    if (productos.length === 0) {
        catalogoContenedor.innerHTML = '<p>No se encontraron productos que coincidan con los filtros aplicados.</p>';
        return;
    }

    productos.forEach(prod => {
        let claseStock = 'stock-disponible';
        let textoStock = `En stock: ${prod.stock} unid.`;

        if (prod.stock === 0) {
            claseStock = 'stock-agotado';
            textoStock = 'Agotado';
        } else if (prod.stock <= 5) {
            claseStock = 'stock-bajo';
            textoStock = `¡Últimas ${prod.stock} unidades!`;
        }

        const card = document.createElement('article');
        card.className = 'card-producto';
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='img/banner.jpg'">
            <div class="card-body">
                <span class="badge-categoria">${prod.categoria}</span>
                <h3>${prod.nombre}</h3>
                <p class="card-desc">${prod.descripcion}</p>
                <p class="card-precio">Bs ${prod.precio.toFixed(2)}</p>
                <p class="card-stock ${claseStock}">${textoStock}</p>
                <div class="card-acciones">
                    <button class="btn btn-secondary btn-sm btn-detalle" data-id="${prod.id}">Ver Detalles</button>
                    <button class="btn btn-primary btn-sm btn-agregar" data-id="${prod.id}" ${prod.stock === 0 ? 'disabled' : ''}>
                        ${prod.stock === 0 ? 'Agotado' : '+ Carrito'}
                    </button>
                </div>
            </div>
        `;
        catalogoContenedor.appendChild(card);
    });

    // Eventos de los botones en las tarjetas
    document.querySelectorAll('.btn-detalle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            mostrarDetalleModal(id);
        });
    });

    document.querySelectorAll('.btn-agregar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const prod = listaProductos.find(p => p.id === id);
            if (prod) agregarAlCarrito(prod);
        });
    });
}

// Abrir modal con información detallada del producto
function mostrarDetalleModal(id) {
    const prod = listaProductos.find(p => p.id === id);
    if (!prod) return;

    contenidoModal.innerHTML = `
        <div class="detalle-grid">
            <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='img/banner.jpg'">
            <div>
                <span class="badge-categoria">${prod.categoria}</span>
                <h2 style="margin: 0.5rem 0; color: var(--color-primario);">${prod.nombre}</h2>
                <p style="margin-bottom: 1rem; color: var(--color-texto-suave);">${prod.descripcion}</p>
                <p class="card-precio" style="font-size: 1.6rem;">Bs ${prod.precio.toFixed(2)}</p>
                <p style="margin-bottom: 1.2rem;"><strong>Disponibilidad:</strong> ${prod.stock > 0 ? prod.stock + ' unidades' : 'Sin stock'}</p>
                <button class="btn btn-primary btn-block" id="btn-modal-carrito" ${prod.stock === 0 ? 'disabled' : ''}>
                    ${prod.stock === 0 ? 'Producto Agotado' : '🛒 Agregar al Carrito'}
                </button>
            </div>
        </div>
    `;

    modalDetalle.classList.remove('oculto');

    const btnModalCarrito = document.getElementById('btn-modal-carrito');
    if (btnModalCarrito && prod.stock > 0) {
        btnModalCarrito.addEventListener('click', () => {
            agregarAlCarrito(prod);
            modalDetalle.classList.add('oculto');
        });
    }
}

// Eventos de filtros y cierre de modal
document.addEventListener('DOMContentLoaded', () => {
    inicializarCatalogo();

    inputBuscador.addEventListener('input', filtrarYRenderizar);
    selectCategoria.addEventListener('change', filtrarYRenderizar);
    selectStock.addEventListener('change', filtrarYRenderizar);
    selectOrden.addEventListener('change', filtrarYRenderizar);

    btnCerrarModal.addEventListener('click', () => modalDetalle.classList.add('oculto'));
    window.addEventListener('click', (e) => {
        if (e.target === modalDetalle) modalDetalle.classList.add('oculto');
    });
});