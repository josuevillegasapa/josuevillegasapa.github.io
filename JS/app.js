// =========================================================
// FUNCIONES GLOBALES Y GESTIÓN DE CARRITO EN LOCALSTORAGE
// =========================================================

// Obtener el carrito actual desde localStorage
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito_andestech')) || [];
}

// Guardar el carrito en localStorage y actualizar el contador visual
function guardarCarrito(carrito) {
    localStorage.setItem('carrito_andestech', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Actualizar el número del icono de carrito en la barra de navegación
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        const carrito = obtenerCarrito();
        const totalArticulos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.textContent = totalArticulos;
    }
}

// Agregar un producto al carrito validando su stock disponible
function agregarAlCarrito(producto) {
    if (producto.stock <= 0) {
        alert('Lo sentimos, este producto está agotado.');
        return;
    }

    const carrito = obtenerCarrito();
    const indiceExistente = carrito.findIndex(item => item.id === producto.id);

    if (indiceExistente !== -1) {
        if (carrito[indiceExistente].cantidad < producto.stock) {
            carrito[indiceExistente].cantidad += 1;
        } else {
            alert(`Solo hay ${producto.stock} unidades disponibles en stock.`);
            return;
        }
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            stock: producto.stock,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    alert(`"${producto.nombre}" se agregó al carrito.`);
}

// Cargar productos destacados en index.html
async function cargarProductosDestacados() {
    const contenedorDestacados = document.getElementById('productos-destacados');
    if (!contenedorDestacados) return;

    try {
        const respuesta = await fetch('data/productos.json');
        if (!respuesta.ok) throw new Error('No se pudo cargar productos.json');
        
        const productos = await respuesta.json();
        // Seleccionar los primeros 4 productos con stock disponible
        const destacados = productos.filter(p => p.stock > 0).slice(0, 4);

        contenedorDestacados.innerHTML = '';
        destacados.forEach(prod => {
            const card = document.createElement('article');
            card.className = 'card-producto';
            card.innerHTML = `
                <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='img/banner.jpg'">
                <div class="card-body">
                    <span class="badge-categoria">${prod.categoria}</span>
                    <h3>${prod.nombre}</h3>
                    <p class="card-desc">${prod.descripcion}</p>
                    <p class="card-precio">Bs ${prod.precio.toFixed(2)}</p>
                    <p class="card-stock stock-disponible">Disponible (${prod.stock} unid.)</p>
                    <div class="card-acciones">
                        <a href="productos.html" class="btn btn-secondary btn-sm">Ver Catálogo</a>
                        <button class="btn btn-primary btn-sm btn-add-destacado" data-id="${prod.id}">+ Carrito</button>
                    </div>
                </div>
            `;
            contenedorDestacados.appendChild(card);
        });

        // Asignar eventos a los botones "+ Carrito" de inicio
        document.querySelectorAll('.btn-add-destacado').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const prodSeleccionado = productos.find(p => p.id === id);
                if (prodSeleccionado) agregarAlCarrito(prodSeleccionado);
            });
        });

    } catch (error) {
        console.error('Error al cargar destacados:', error);
        contenedorDestacados.innerHTML = '<p>Error al cargar los productos destacados.</p>';
    }
}

// Inicializar funciones globales al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
    cargarProductosDestacados();
});