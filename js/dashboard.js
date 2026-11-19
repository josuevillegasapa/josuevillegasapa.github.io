// =========================================================
// PANEL DE CONTROL Y ESTADÍSTICAS (dashboard.html)
// =========================================================

async function cargarDashboard() {
    try {
        const respuesta = await fetch('data/productos.json');
        if (!respuesta.ok) throw new Error('Error al cargar productos.json');
        
        const productos = await respuesta.json();

        calcularKPIs(productos);
        generarGraficoCategorias(productos);
        generarGraficoStock(productos);
        llenarTablaBajoStock(productos);
        actualizarFechaHora();

    } catch (error) {
        console.error('Error en el dashboard:', error);
    }
}

// Calcular y mostrar los 6 indicadores principales (KPIs)
function calcularKPIs(productos) {
    const totalProductos = productos.length;
    const categoriasUnicas = new Set(productos.map(p => p.categoria)).size;
    
    // Valor total del inventario = suma de (precio * stock)
    const valorInventario = productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);
    
    const conStock = productos.filter(p => p.stock > 0).length;
    const agotados = productos.filter(p => p.stock === 0).length;
    const bajoStock = productos.filter(p => p.stock > 0 && p.stock <= 5).length;

    document.getElementById('kpi-total-productos').textContent = totalProductos;
    document.getElementById('kpi-total-categorias').textContent = categoriasUnicas;
    document.getElementById('kpi-valor-inventario').textContent = `Bs ${valorInventario.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('kpi-stock-disponible').textContent = conStock;
    document.getElementById('kpi-bajo-stock').textContent = bajoStock;
    document.getElementById('kpi-agotados').textContent = agotados;
}

// Gráfico 1: Cantidad de productos por categoría (Barras)
function generarGraficoCategorias(productos) {
    const conteoCategorias = {};
    productos.forEach(p => {
        conteoCategorias[p.categoria] = (conteoCategorias[p.categoria] || 0) + 1;
    });

    const etiquetas = Object.keys(conteoCategorias);
    const valores = Object.values(conteoCategorias);

    const ctx = document.getElementById('grafico-categorias').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Cantidad de Productos',
                data: valores,
                backgroundColor: ['#2563eb', '#0ea5e9', '#10b981', '#f59e0b', '#6366f1'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// Gráfico 2: Distribución de estado de stock (Dona / Doughnut)
function generarGraficoStock(productos) {
    const stockNormal = productos.filter(p => p.stock > 5).length;
    const bajoStock = productos.filter(p => p.stock > 0 && p.stock <= 5).length;
    const agotados = productos.filter(p => p.stock === 0).length;

    const ctx = document.getElementById('grafico-stock').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Stock Óptimo (> 5)', 'Bajo Stock (1 - 5)', 'Agotados (0)'],
            datasets: [{
                data: [stockNormal, bajoStock, agotados],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// Llenar tabla con productos que tienen stock <= 5 (incluye agotados y bajo stock)
function llenarTablaBajoStock(productos) {
    const tbody = document.getElementById('tabla-bajo-stock');
    tbody.innerHTML = '';

    const productosCriticos = productos
        .filter(p => p.stock <= 5)
        .sort((a, b) => a.stock - b.stock);

    if (productosCriticos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Todo el inventario cuenta con stock óptimo.</td></tr>';
        return;
    }

    productosCriticos.forEach(prod => {
        const esAgotado = prod.stock === 0;
        const badgeEstado = esAgotado
            ? '<span class="stock-agotado">● Agotado</span>'
            : '<span class="stock-bajo">▲ Bajo Stock</span>';

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>#${prod.id}</td>
            <td><strong>${prod.nombre}</strong></td>
            <td>${prod.categoria}</td>
            <td>Bs ${prod.precio.toFixed(2)}</td>
            <td><strong>${prod.stock}</strong></td>
            <td>${badgeEstado}</td>
        `;
        tbody.appendChild(fila);
    });
}

// Mostrar fecha y hora actual del sistema
function actualizarFechaHora() {
    const ahora = new Date();
    const fechaFormateada = ahora.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const horaFormateada = ahora.toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('fecha-actualizacion').textContent = `${fechaFormateada} - ${horaFormateada}`;
}

document.addEventListener('DOMContentLoaded', cargarDashboard);