document.addEventListener('DOMContentLoaded', () => {
  const urlJSON = 'https://raw.githubusercontent.com/Andresq38/imagenes/main/imagenes.json';

  fetch(urlJSON)
    .then(res => res.json())
    .then(data => {
      // --- Carrusel ---
      const carouselInner = document.querySelector('#hero-carousel .carousel-inner');
      const indicators = document.querySelector('#hero-carousel .carousel-indicators');
      if (carouselInner && indicators && Array.isArray(data.carrusel)) {
        carouselInner.innerHTML = '';
        indicators.innerHTML = '';
        data.carrusel.forEach((item, index) => {
          const div = document.createElement('div');
          div.classList.add('carousel-item');
          if (index === 0) div.classList.add('active');
          div.innerHTML = `
            <img src="${item.imagen}" class="d-block w-100" alt="${item.titulo}">
            <div class="carousel-caption">
              <h2>${item.titulo}</h2>
              <p>${item.descripcion}</p>
              <a href="tienda.html" class="btn-carousel">Ir a la Tienda</a>
            </div>
          `;
          carouselInner.appendChild(div);

          const btn = document.createElement('button');
          btn.type = 'button';
          btn.setAttribute('data-bs-target', '#hero-carousel');
          btn.setAttribute('data-bs-slide-to', index);
          if (index === 0) btn.classList.add('active');
          indicators.appendChild(btn);
        });
      }

      // --- Productos Destacados (iconos) ---
      const productosDestacados = document.getElementById('productos-destacados');
      if (productosDestacados && Array.isArray(data.iconos)) {
        productosDestacados.innerHTML = '';
        data.iconos.forEach(icono => {
          const a = document.createElement('a');
          a.href = icono.link || '#';
          a.className = 'col mb-4';
          a.innerHTML = `
            <div class="producto">
              <img src="${icono.imagen}" alt="${icono.titulo}" class="img-fluid">
              <h3>${icono.titulo}</h3>
              <p style= "color: black">${icono.descripcion}</p>
            </div>
          `;
          productosDestacados.appendChild(a);
        });
      }

        // --- Imagen principal (about-hero) ---
        const aboutHeroImg = document.getElementById('about-hero-img');
        if (aboutHeroImg && Array.isArray(data.acercade)) {
          aboutHeroImg.innerHTML = '';
          data.acercade.forEach((img, i) => {
            if (!img.imagen) {
              console.warn('La imagen en la posición', i, 'no tiene la propiedad "imagen"', img);
              return;
            }
            const image = document.createElement('img');
            image.src = img.imagen;
            image.alt = 'Moda masculina elegante y casual';
            aboutHeroImg.appendChild(image);
            console.log('Imagen principal agregada:', img.imagen);
          });
        }

        // --- Galería ---
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) {
          console.warn('No se encontró el contenedor #gallery-grid en el DOM');
        } else {
          if (!Array.isArray(data.galeria)) {
            console.warn('No se encontró la propiedad galeria en el JSON o no es un array:', data.galeria);
          } else {
            galleryGrid.innerHTML = '';
            data.galeria.forEach((img, i) => {
              if (!img.imagen) {
                console.warn('La imagen en la posición', i, 'no tiene la propiedad "imagen"', img);
                return;
              }
              const image = document.createElement('img');
              image.src = img.imagen;
              image.alt = '';
              galleryGrid.appendChild(image);
              console.log('Imagen agregada:', img.imagen);
            });
          }
        }

          // --- Imagen principal (tienda) ---
          const tiendaHeroImg = document.getElementById('tienda-hero-img');
          if (tiendaHeroImg && Array.isArray(data.tienda)) {
            tiendaHeroImg.innerHTML = '';
            data.tienda.forEach((img, i) => {
              if (!img.imagen) {
                console.warn('La imagen en la posición', i, 'no tiene la propiedad "imagen"', img);
                return;
              }
              const image = document.createElement('img');
              image.src = img.imagen;
              image.alt = 'Moda masculina elegante y casual';
              tiendaHeroImg.appendChild(image);
              console.log('Imagen principal tienda agregada:', img.imagen);
            });
          }

          // --- Productos: Camisas ---
          const camisasGrid = document.getElementById('camisas-grid');
          if (camisasGrid && Array.isArray(data.camisas)) {
            camisasGrid.innerHTML = '';
            data.camisas.forEach((producto, i) => {
              if (!producto.imagen || !producto.titulo || !producto.descripcion || !producto.precio) {
                console.warn('Faltan propiedades en el producto camisas en la posición', i, producto);
                return;
              }
              const col = document.createElement('div');
              col.className = 'col-md-4';
              col.innerHTML = `
                <div class="card producto-card h-100">
                  <img src="${producto.imagen}" class="card-img-top mx-auto d-block" alt="${producto.titulo}" style="width:110px; height:110px; object-fit:contain; margin-top:20px;">
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title producto-titulo">${producto.titulo}</h5>
                    <p class="producto-desc mb-2">${producto.descripcion}</p>
                    <div class="producto-precio mb-3">${producto.precio}</div>
                    <button class="btn btn-producto mt-auto">AGREGAR AL CARRITO</button>
                  </div>
                </div>
              `;
              camisasGrid.appendChild(col);
              console.log('Producto camisa agregado:', producto.titulo);
            });
          }

          // --- Productos: Pantalones ---
          const pantalonesGrid = document.getElementById('pantalones-grid');
          if (pantalonesGrid && Array.isArray(data.pantalones)) {
            pantalonesGrid.innerHTML = '';
            data.pantalones.forEach((producto, i) => {
              if (!producto.imagen || !producto.titulo || !producto.descripcion || !producto.precio) {
                console.warn('Faltan propiedades en el producto pantalones en la posición', i, producto);
                return;
              }
              const col = document.createElement('div');
              col.className = 'col-md-4';
              col.innerHTML = `
                <div class="card producto-card h-100">
                  <img src="${producto.imagen}" class="card-img-top mx-auto d-block" alt="${producto.titulo}" style="width:110px; height:110px; object-fit:contain; margin-top:20px;">
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title producto-titulo">${producto.titulo}</h5>
                    <p class="producto-desc mb-2">${producto.descripcion}</p>
                    <div class="producto-precio mb-3">${producto.precio}</div>
                    <button class="btn btn-producto mt-auto">AGREGAR AL CARRITO</button>
                  </div>
                </div>
              `;
              pantalonesGrid.appendChild(col);
              console.log('Producto pantalón agregado:', producto.titulo);
            });
          }

          // --- Productos: Pantalonetas/Shorts ---
          const pantalonetasGrid = document.getElementById('pantalonetas-grid');
          if (pantalonetasGrid) {
            pantalonetasGrid.innerHTML = '';
            let productos = [];
            if (Array.isArray(data.pantalonetas)) productos = productos.concat(data.pantalonetas);
            if (Array.isArray(data.shorts)) productos = productos.concat(data.shorts);
            productos.forEach((producto, i) => {
              if (!producto.imagen || !producto.titulo || !producto.descripcion || !producto.precio) {
                console.warn('Faltan propiedades en el producto pantalonetas/shorts en la posición', i, producto);
                return;
              }
              const col = document.createElement('div');
              col.className = 'col-md-4';
              col.innerHTML = `
                <div class="card producto-card h-100">
                  <img src="${producto.imagen}" class="card-img-top mx-auto d-block" alt="${producto.titulo}" style="width:110px; height:110px; object-fit:contain; margin-top:20px;">
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title producto-titulo">${producto.titulo}</h5>
                    <p class="producto-desc mb-2">${producto.descripcion}</p>
                    <div class="producto-precio mb-3">${producto.precio}</div>
                    <button class="btn btn-producto mt-auto">AGREGAR AL CARRITO</button>
                  </div>
                </div>
              `;
              pantalonetasGrid.appendChild(col);
              console.log('Producto pantaloneta/short agregado:', producto.titulo);
            });
          }

          // --- Productos: Tenis/Zapatos ---
          const tenisGrid = document.getElementById('tenis-grid');
          if (tenisGrid) {
            tenisGrid.innerHTML = '';
            let productos = [];
            if (Array.isArray(data.tenis)) productos = productos.concat(data.tenis);
            if (Array.isArray(data.zapatos)) productos = productos.concat(data.zapatos);
            productos.forEach((producto, i) => {
              if (!producto.imagen || !producto.titulo || !producto.descripcion || !producto.precio) {
                console.warn('Faltan propiedades en el producto tenis/zapatos en la posición', i, producto);
                return;
              }
              const col = document.createElement('div');
              col.className = 'col-md-4';
              col.innerHTML = `
                <div class="card producto-card h-100">
                  <img src="${producto.imagen}" class="card-img-top mx-auto d-block" alt="${producto.titulo}" style="width:110px; height:110px; object-fit:contain; margin-top:20px;">
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title producto-titulo">${producto.titulo}</h5>
                    <p class="producto-desc mb-2">${producto.descripcion}</p>
                    <div class="producto-precio mb-3">${producto.precio}</div>
                    <button class="btn btn-producto mt-auto">AGREGAR AL CARRITO</button>
                  </div>
                </div>
              `;
              tenisGrid.appendChild(col);
              console.log('Producto tenis/zapato agregado:', producto.titulo);
            });
          }

          // --- Productos: Abrigos ---
          const abrigosGrid = document.getElementById('abrigos-grid');
          if (abrigosGrid && Array.isArray(data.abrigos)) {
            abrigosGrid.innerHTML = '';
            data.abrigos.forEach((producto, i) => {
              if (!producto.imagen || !producto.titulo || !producto.descripcion || !producto.precio) {
                console.warn('Faltan propiedades en el producto abrigos en la posición', i, producto);
                return;
              }
              const col = document.createElement('div');
              col.className = 'col-md-4';
              col.innerHTML = `
                <div class="card producto-card h-100">
                  <img src="${producto.imagen}" class="card-img-top mx-auto d-block" alt="${producto.titulo}" style="width:110px; height:110px; object-fit:contain; margin-top:20px;">
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title producto-titulo">${producto.titulo}</h5>
                    <p class="producto-desc mb-2">${producto.descripcion}</p>
                    <div class="producto-precio mb-3">${producto.precio}</div>
                    <button class="btn btn-producto mt-auto">AGREGAR AL CARRITO</button>
                  </div>
                </div>
              `;
              abrigosGrid.appendChild(col);
              console.log('Producto abrigo agregado:', producto.titulo);
            });
          }

          // --- Productos: Accesorios ---
          const accesoriosGrid = document.getElementById('accesorios-grid');
          if (accesoriosGrid && Array.isArray(data.accesorios)) {
            accesoriosGrid.innerHTML = '';
            data.accesorios.forEach((producto, i) => {
              if (!producto.imagen || !producto.titulo || !producto.descripcion || !producto.precio) {
                console.warn('Faltan propiedades en el producto accesorios en la posición', i, producto);
                return;
              }
              const col = document.createElement('div');
              col.className = 'col-md-4';
              col.innerHTML = `
                <div class="card producto-card h-100">
                  <img src="${producto.imagen}" class="card-img-top mx-auto d-block" alt="${producto.titulo}" style="width:110px; height:110px; object-fit:contain; margin-top:20px;">
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title producto-titulo">${producto.titulo}</h5>
                    <p class="producto-desc mb-2">${producto.descripcion}</p>
                    <div class="producto-precio mb-3">${producto.precio}</div>
                    <button class="btn btn-producto mt-auto">AGREGAR AL CARRITO</button>
                  </div>
                </div>
              `;
              accesoriosGrid.appendChild(col);
              console.log('Producto accesorio agregado:', producto.titulo);
            });
          }

          // --- Carrito ---
          const carritoHeroImg = document.getElementById('carrito-hero-img');
          if (carritoHeroImg && Array.isArray(data.carrito)) {
            carritoHeroImg.innerHTML = '';
            data.carrito.forEach((img, i) => {
              if (!img.imagen) {
                console.warn('La imagen en la posición', i, 'no tiene la propiedad "imagen"', img);
                return;
              }
              const image = document.createElement('img');
              image.src = img.imagen;
              image.alt = 'Moda masculina elegante y casual';
              image.style = 'width:300px; height:300px; object-fit:cover; border-radius:16px; box-shadow:0 2px 12px #0b1d3a33; border:3px solid #0b1d3a;';
              carritoHeroImg.appendChild(image);
              console.log('Imagen principal carrito agregada:', img.imagen);
            });
          }

          // --- Autor ---
          const autorImg = document.getElementById('autor-img');
          if (autorImg && Array.isArray(data.autor)) {
            autorImg.innerHTML = '';
            data.autor.forEach((img, i) => {
              if (!img.imagen) {
                console.warn('La imagen en la posición', i, 'no tiene la propiedad "imagen"', img);
                return;
              }
              const image = document.createElement('img');
              image.src = img.imagen;
              image.alt = 'Foto de Andres Quesada Molia';
              image.className = 'rounded-circle shadow';
              image.style = 'width:400px; height:400px; object-fit:cover;';
              autorImg.appendChild(image);
              console.log('Imagen autor agregada:', img.imagen);
            });
          }




    })
    .catch(err => console.error('Error al cargar el JSON:', err));
});