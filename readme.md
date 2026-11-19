# 🛒 AndesTech Store - Tienda Virtual Multipágina

Proyecto de examen final consistente en el desarrollo de una tienda virtual multipágina moderna, interactiva y adaptable (*Responsive Design*), desarrollada con **HTML5, CSS3, JavaScript (ES6+) y JSON**. 

El sistema simula el funcionamiento completo de un comercio electrónico, consumiendo datos de forma dinámica desde un archivo externo (`productos.json`) mediante la API `fetch()` para renderizar el catálogo, gestionar un carrito de compras con persistencia local y alimentar un panel de control estadístico (*Dashboard*).

---

## 🎯 Objetivos del Proyecto

* Implementar la lectura, procesamiento y presentación dinámica de información estructurada en formato JSON utilizando `fetch()`.
* Diseñar una interfaz limpia, intuitiva y adaptable a computadoras, tablets y dispositivos móviles mediante CSS Grid y Flexbox.
* Desarrollar un panel de control (*Dashboard*) demostrativo que calcule indicadores clave de rendimiento (KPIs) y genere gráficos estadísticos en tiempo real a partir del inventario.

---

## 🗂️ Estructura del Proyecto

El código fuente está organizado de forma modular siguiendo la siguiente jerarquía de directorios:

```text
TIENDA-VIRTUAL/
│
├── index.html          # Página principal (banner, categorías y productos destacados)
├── productos.html      # Catálogo completo con búsqueda, filtros, ordenamiento y modal de detalle
├── nosotros.html       # Información institucional (historia, misión, visión, valores y objetivos)
├── contacto.html       # Formulario de contacto con validación JS e información de la tienda
├── dashboard.html      # Panel de control con KPIs, gráficos (Chart.js) y tabla de bajo stock
├── carrito.html        # Gestión del carrito de compras almacenado en localStorage
├── faq.html            # Sección interactiva de preguntas frecuentes
│
├── data/
│   └── productos.json  # Base de datos local en formato JSON con 15 productos en Bolivianos (Bs)
│
├── css/
│   └── estilos.css     # Hoja de estilos global, diseño responsivo y variables visuales
│
├── js/
│   ├── app.js          # Lógica global, sincronización de contador del carrito y destacados
│   ├── productos.js    # Carga del catálogo, filtros dinámicos, ordenamiento y vista de detalle
│   ├── dashboard.js    # Cálculo automático de KPIs, renderizado de gráficos y alertas de stock
│   ├── contacto.js     # Validación de campos del formulario y mensaje de confirmación
│   └── carrito.js      # Administración de cantidades, subtotales y vaciado en localStorage
│
├── img/
│   ├── logo.png        # Logotipo institucional de la tienda
│   ├── banner.jpg      # Imagen promocional principal
│   ├── producto1.jpg   # Recursos gráficos de referencia para los productos
│   ├── producto2.jpg
│   └── producto3.jpg
│
└── README.md           # Documentación técnica y guía de funcionamiento del proyecto
