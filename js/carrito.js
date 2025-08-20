// --- Utilidades de carrito ---
function getCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || [];
}

function setCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarContador() {
  const carrito = getCarrito();
  const contador = document.getElementById('contadorCarrito');
  if (contador) {
    contador.textContent = carrito.length;
    contador.style.display = carrito.length > 0 ? 'inline-block' : 'none';
  }
}

// --- Agregar producto desde tienda.html ---
document.addEventListener('DOMContentLoaded', function () {
  // Botones de agregar al carrito (inicial y dinámicos)
  function setCarritoBtnEvents() {
    document.querySelectorAll('.btn-producto').forEach(btn => {
      if (!btn.dataset.carritoEvent) {
        btn.addEventListener('click', function () {
          const card = btn.closest('.producto-card');
          if (!card) return;

          const nombre = card.querySelector('.producto-titulo').textContent;
          const precio = card.querySelector('.producto-precio').textContent;
          const imagen = card.querySelector('img').getAttribute('src');

          const producto = { nombre, precio, imagen };

          const carrito = getCarrito();
          carrito.push(producto);
          setCarrito(carrito);
          actualizarContador();

          btn.textContent = "¡Agregado!";
          setTimeout(() => btn.textContent = "AGREGAR AL CARRITO", 1000);
        });
        btn.dataset.carritoEvent = "true";
      }
    });
  }

  setCarritoBtnEvents();

  // Observer para productos generados dinámicamente
  const main = document.querySelector('main');
  if (main) {
    const observer = new MutationObserver(() => {
      setCarritoBtnEvents();
    });
    observer.observe(main, { childList: true, subtree: true });
  }

  actualizarContador();

  if (document.getElementById('carritoLista')) {
    mostrarCarrito();
  }

  const btnFinalizar = document.getElementById('finalizarCompra');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', finalizarCompra);
  }

  const btnVaciar = document.getElementById('vaciarCarrito');
  if (btnVaciar) {
    btnVaciar.addEventListener('click', vaciarCarrito);
  }
});

// --- Mostrar productos en carritocompras.html ---
function mostrarCarrito() {
  const carrito = getCarrito();
  const lista = document.getElementById('carritoLista');
  const totalSpan = document.getElementById('carritoTotal');
  lista.innerHTML = '';
  let total = 0;

  if (carrito.length === 0) {
    lista.innerHTML = '<p class="text-center">El carrito está vacío.</p>';
  totalSpan.textContent = '₡0.00';
    return;
  }

  carrito.forEach((prod, idx) => {
    const precioNum = parseFloat(prod.precio.replace(/[^0-9.]/g, ''));
    total += precioNum;

    const item = document.createElement('div');
    item.className = 'd-flex align-items-center mb-3 border-bottom pb-2';
    item.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" style="width:50px; height:50px; object-fit:contain; margin-right:15px;">
      <div class="flex-grow-1">
        <div><strong>${prod.nombre}</strong></div>
        <div>${prod.precio}</div>
      </div>
      <button class="btn btn-sm btn-danger ms-2" data-idx="${idx}">&times;</button>
    `;
    lista.appendChild(item);
  });

  totalSpan.textContent = `₡${total.toFixed(3)}`;

  lista.querySelectorAll('button[data-idx]').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = parseInt(btn.getAttribute('data-idx'));
      const carrito = getCarrito();
      carrito.splice(idx, 1);
      setCarrito(carrito);
      mostrarCarrito();
      actualizarContador();
    });
  });
}

// --- Vaciar carrito ---
function vaciarCarrito() {
  setCarrito([]);
  actualizarContador();
  mostrarCarrito();
}

// --- Finalizar compra ---
function finalizarCompra() {
  const carrito = getCarrito();

  if (carrito.length === 0) {
    mostrarModalMensaje("El carrito está vacío. No se puede realizar la compra.");
    return;
  }

  // Mostrar formulario de datos
  mostrarFormularioCompra(carrito);
}

// --- Modal para mensajes ---
function mostrarModalMensaje(mensaje) {
  let modal = document.getElementById('modalCompra');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'modalCompra';
  modal.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;padding:2rem 2.5rem;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.18);text-align:center;max-width:90vw;">
        <h4 style="color:#0b1d3a;">¡Atención!</h4>
        <p style="font-size:1.2rem;">${mensaje}</p>
        <button id="cerrarModalCompra" style="background:#0b1d3a;color:#fff;padding:0.5rem 1.5rem;border:none;border-radius:6px;font-weight:600;margin-top:1rem;">Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('cerrarModalCompra').onclick = () => modal.remove();
}

// --- Modal para formulario de compra ---
function mostrarFormularioCompra(carrito) {
  let modal = document.getElementById('modalCompra');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'modalCompra';
  modal.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center;overflow:auto;padding:20px;">
      <div style="background:#fff;padding:1.2rem 4.5rem 1.2rem 4.5rem;border-radius:16px;box-shadow:0 8px 32px rgba(11,29,58,0.13);max-width:750px;width:100%;">
        <h2 style="color:#0b1d3a;font-weight:700;margin-bottom:1.1rem;font-size:1.45rem;letter-spacing:0.5px;">Formulario de Compra</h2>
        <form id="formCompra" style="display:grid;grid-template-columns:1fr 1fr;gap:1.1rem;">
          <div style="display:flex;flex-direction:column;gap:0.5rem;grid-column:1/2;">
            <label style="font-weight:600;color:#0b1d3a;font-size:1.08rem;">Email:</label>
            <input type="email" name="email" class="form-control" required style="padding:0.7rem 1rem;font-size:1.08rem;border-radius:8px;border:1px solid #cfd8dc;">
          </div>
          <div style="display:flex;flex-direction:column;gap:0.5rem;grid-column:2/3;">
            <label style="font-weight:600;color:#0b1d3a;font-size:1.08rem;">Nombre completo:</label>
            <input type="text" name="nombre" class="form-control" required style="padding:0.7rem 1rem;font-size:1.08rem;border-radius:8px;border:1px solid #cfd8dc;">
          </div>
          <div style="display:flex;flex-direction:column;gap:0.5rem;grid-column:1/2;">
            <label style="font-weight:600;color:#0b1d3a;font-size:1.08rem;">Fecha de nacimiento:</label>
            <input type="date" name="fechaNacimiento" id="fechaNacimiento" class="form-control" required style="padding:0.7rem 1rem;font-size:1.08rem;border-radius:8px;border:1px solid #cfd8dc;">
          </div>
          <div style="display:flex;flex-direction:column;gap:0.5rem;grid-column:2/3;">
            <label style="font-weight:600;color:#0b1d3a;font-size:1.08rem;">Edad:</label>
            <input type="number" name="edad" id="edad" class="form-control" readonly style="padding:0.7rem 1rem;font-size:1.08rem;border-radius:8px;border:1px solid #cfd8dc;background:#f7f7fa;">
          </div>
          <div style="display:flex;flex-direction:column;gap:0.5rem;grid-column:1/2;">
            <label style="font-weight:600;color:#0b1d3a;font-size:1.08rem;">Rango de ingreso:</label>
            <select name="rangoIngreso" class="form-select" required style="padding:0.7rem 1rem;font-size:1.08rem;border-radius:8px;border:1px solid #cfd8dc;">
              <option value="">Seleccione...</option>
              <option value="0-300000">₡0 - ₡300,000</option>
              <option value="300001-500000">₡300,001 - ₡500,000</option>
              <option value="500001-700000">₡500,001 - ₡700,000</option>
              <option value="700001-1000000">₡700,001 - ₡1,000,000</option>
              <option value="1000001-1500000">₡1,000,001 - ₡1,500,000</option>
              <option value="1500001-2000000">₡1,500,001 - ₡2,000,000</option>
              <option value="2000001+">₡2,000,001 o más</option>
            </select>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.5rem;grid-column:2/3;">
            <label style="font-weight:600;color:#0b1d3a;font-size:1.08rem;">Género:</label>
            <select name="genero" class="form-select" required style="padding:0.7rem 1rem;font-size:1.08rem;border-radius:8px;border:1px solid #cfd8dc;">
              <option value="">Seleccione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.5rem;grid-column:1/3;">
            <label style="font-weight:600;color:#0b1d3a;font-size:1.08rem;">Grado académico:</label>
            <select name="grado" class="form-select" multiple required style="padding:0.7rem 1rem;font-size:1.08rem;border-radius:8px;border:1px solid #cfd8dc;">
              <option value="Primaria">Primaria</option>
              <option value="Secundaria">Secundaria</option>
              <option value="Universidad">Universidad</option>
              <option value="Postgrado">Postgrado</option>
            </select>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:1.2rem;margin-top:1.1rem;grid-column:1/3;">
            <button type="submit" class="btn btn-success" style="font-size:1.15rem;padding:0.8rem 2.2rem;border-radius:8px;font-weight:700;">Finalizar Compra</button>
            <button type="button" id="cerrarModalCompra" class="btn btn-secondary" style="font-size:1.15rem;padding:0.8rem 2.2rem;border-radius:8px;font-weight:700;">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('cerrarModalCompra').onclick = () => modal.remove();

  // --- Actualizar edad automáticamente ---
  const fechaInput = document.getElementById('fechaNacimiento');
  const edadInput = document.getElementById('edad');
  fechaInput.addEventListener('change', () => {
    const fecha = new Date(fechaInput.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    edadInput.value = edad;
  });

  // --- Manejo del submit ---
  const form = document.getElementById('formCompra');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const datos = Object.fromEntries(formData.entries());

    // Validaciones simples
    let error = '';
    form.querySelectorAll('input, select').forEach(inp => inp.style.borderColor = '');

    if (!datos.email) { error = 'El email es requerido'; form.querySelector('[name="email"]').style.borderColor='red'; }
    else if (!datos.nombre) { error = 'El nombre es requerido'; form.querySelector('[name="nombre"]').style.borderColor='red'; }
    else if (!datos.fechaNacimiento) { error = 'La fecha de nacimiento es requerida'; form.querySelector('[name="fechaNacimiento"]').style.borderColor='red'; }
    else if (!datos.edad) { error = 'No se pudo calcular la edad'; form.querySelector('[name="edad"]').style.borderColor='red'; }
    else if (!datos.rangoIngreso) { error = 'El rango de ingreso es requerido'; form.querySelector('[name="rangoIngreso"]').style.borderColor='red'; }
    else if (!datos.genero) { error = 'Debe seleccionar un género'; form.querySelector('[name="genero"]').style.borderColor='red'; }
    else if (!datos.grado) { error = 'Debe seleccionar al menos un grado académico'; form.querySelector('[name="grado"]').style.borderColor='red'; }

    if (error) {
      mostrarModalMensaje(error);
      return;
    }

    // Mostrar confirmación antes de finalizar compra
    let modalConfirm = document.getElementById('modalCompraConfirm');
    if (modalConfirm) modalConfirm.remove();

    // Mostrar los datos ingresados
    let gradoTxt = Array.isArray(datos.grado) ? datos.grado.join(', ') : datos.grado;
    modalConfirm = document.createElement('div');
    modalConfirm.id = 'modalCompraConfirm';
    modalConfirm.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center;">
        <div style="background:#fff;padding:2rem 2.5rem;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.18);text-align:left;max-width:90vw;min-width:320px;">
          <h4 style="color:#0b1d3a;text-align:center;">¿Estos datos son correctos?</h4>
          <ul style="list-style:none;padding:0;font-size:1.08rem;">
            <li><strong>Email:</strong> ${datos.email}</li>
            <li><strong>Nombre:</strong> ${datos.nombre}</li>
            <li><strong>Fecha de nacimiento:</strong> ${datos.fechaNacimiento}</li>
            <li><strong>Edad:</strong> ${datos.edad}</li>
            <li><strong>Rango de ingreso:</strong> ${datos.rangoIngreso}</li>
            <li><strong>Género:</strong> ${datos.genero}</li>
            <li><strong>Grado académico:</strong> ${gradoTxt}</li>
          </ul>
          <div style="display:flex;justify-content:center;gap:2rem;margin-top:1.2rem;">
            <button id="confirmarFinalizarCompra" style="background:#02964c;color:#fff;padding:0.5rem 1.5rem;border:none;border-radius:6px;font-weight:600;">Sí, son correctos</button>
            <button id="cancelarFinalizarCompra" style="background:#0b1d3a;color:#fff;padding:0.5rem 1.5rem;border:none;border-radius:6px;font-weight:600;">No, editar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalConfirm);

    document.getElementById('confirmarFinalizarCompra').onclick = function() {
      let total = 0;
      carrito.forEach(prod => total += parseFloat(prod.precio.replace(/[^0-9.]/g, '')));
      setCarrito([]);
      actualizarContador();
      mostrarCarrito();
      modal.remove();
      modalConfirm.remove();
      mostrarModalCompra(total);
    };
    document.getElementById('cancelarFinalizarCompra').onclick = function() {
      modalConfirm.remove();
    };
  });
}

// --- Modal para compra exitosa ---
function mostrarModalCompra(total) {
  let modal = document.getElementById('modalCompra');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'modalCompra';
  modal.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;padding:2rem 2.5rem;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.18);text-align:center;max-width:90vw;">
        <h4 style="color:#0b1d3a;">¡Compra exitosa!</h4>
  <p style="font-size:1.2rem;">Total pagado: <strong style='color:#0b1d3a;'>₡${total.toFixed(3)}</strong></p>
        <p>¡Gracias por tu compra!</p>
        <button id="cerrarModalCompra" style="background:#0b1d3a;color:#fff;padding:0.5rem 1.5rem;border:none;border-radius:6px;font-weight:600;margin-top:1rem;">Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('cerrarModalCompra').onclick = () => modal.remove();
}

// --- Vaciar carrito ---
function vaciarCarrito() {
  const carrito = getCarrito();

  if (carrito.length === 0) {
    mostrarModalMensaje("El carrito ya está vacío.");
    return;
  }

  // Mostrar confirmación antes de vaciar
  let modal = document.getElementById('modalCompra');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'modalCompra';
  modal.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;padding:2rem 2.5rem;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.18);text-align:center;max-width:90vw;">
        <h4 style="color:#0b1d3a;">¿Está seguro que desea vaciar el carrito?</h4>
        <p style="font-size:1.2rem;">Esta acción no se puede deshacer.</p>
        <div style="display:flex;justify-content:center;gap:2rem;margin-top:1.2rem;">
          <button id="confirmarVaciarCarrito" style="background:#d32f2f;color:#fff;padding:0.5rem 1.5rem;border:none;border-radius:6px;font-weight:600;">Sí, vaciar</button>
          <button id="cancelarVaciarCarrito" style="background:#0b1d3a;color:#fff;padding:0.5rem 1.5rem;border:none;border-radius:6px;font-weight:600;">No</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('confirmarVaciarCarrito').onclick = function() {
    setCarrito([]);
    actualizarContador();
    mostrarCarrito();
    modal.remove();
    mostrarModalMensaje("Carrito vaciado correctamente.");
  };
  document.getElementById('cancelarVaciarCarrito').onclick = function() {
    modal.remove();
  };
}