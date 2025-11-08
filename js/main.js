// ===============================
// TecnoFix - Funciones del sistema
// ===============================


// 🔍 Filtro de búsqueda de clientes
function filtrarClientes() {
  const filtro = document.getElementById('busquedaCliente').value.toLowerCase();
  const filas = document.querySelectorAll('.fila-cliente');

  filas.forEach(fila => {
    const texto = fila.textContent.toLowerCase();
    fila.style.display = texto.includes(filtro) ? '' : 'none';
  });
}

// ✅ Validación del formulario de clientes
function validarFormularioCliente() {
  const documento = document.getElementById('documento').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const direccion = document.getElementById('direccion').value.trim();

  // Validar que todos los campos estén llenos
  if (!documento || !nombre || !telefono || !direccion) {
    alert("Por favor completa todos los campos.");
    return false;
  }

  // Validar formato de documento (6 a 10 dígitos)
  if (!/^\d{6,10}$/.test(documento)) {
    alert("El documento debe tener entre 6 y 10 dígitos.");
    return false;
  }

  // Validar formato de teléfono (7 a 10 dígitos)
  if (!/^\d{7,10}$/.test(telefono)) {
    alert("El teléfono debe tener entre 7 y 10 dígitos.");
    return false;
  }

  return true;
}

// ✅ Validación del formulario de servicios
function validarFormularioServicio() {
  const cliente = document.getElementById('cliente').value.trim();
  const tipo = document.getElementById('tipo').value.trim();
  const costo = parseFloat(document.getElementById('costo').value);

  // Validar campos obligatorios
  if (!cliente || !tipo || isNaN(costo)) {
    alert("Por favor completa todos los campos.");
    return false;
  }

  // Validar que el costo sea mayor a cero
  if (costo <= 0) {
    alert("El costo estimado debe ser mayor a cero.");
    return false;
  }

  return true;
}

// 📊 Generar reporte de servicios
function generarReporteServicios() {
  const servicios = document.querySelectorAll('.fila-servicio');
  let total = servicios.length;
  let finalizados = 0;

  servicios.forEach(servicio => {
    if (servicio.dataset.estado === 'finalizado') {
      finalizados++;
    }
  });

  document.getElementById('totalServicios').textContent = total;
  document.getElementById('finalizados').textContent = finalizados;
}

// 📁 Exportar servicios a CSV
function exportarCSV() {
  let csv = "Cliente,Servicio,Estado,Costo\n";
  const filas = document.querySelectorAll('.fila-servicio');

  filas.forEach(fila => {
    const datos = fila.querySelectorAll('td');
    const cliente = datos[0]?.textContent || '';
    const servicio = datos[1]?.textContent || '';
    const estado = datos[2]?.textContent || '';
    const costo = datos[3]?.textContent || '';
    csv += `${cliente},${servicio},${estado},${costo}\n`;
  });

  // Crear archivo CSV y descargarlo
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'servicios.csv';
  a.click();
}


// ===============================
// Cargar clientes dinámicamente
// ===============================

// === CREAR CLIENTE ===
document.addEventListener("DOMContentLoaded", () => {
  const formCliente = document.querySelector("#formClientes");

  if (formCliente) {
    formCliente.addEventListener("submit", async (e) => {
      e.preventDefault();
      const datos = new FormData(formCliente);

      try {
        const response = await fetch("../php/crear_cliente.php", {
          method: "POST",
          body: datos,
        });
        const result = await response.json();

        if (result.success) {
          const nuevoId = result.id_cliente;

          // Redirigir a servicios.html con el ID en la URL
        //window.location.href = `../paginas/servicios.html?id_cliente=${nuevoId}`;

          // Mostrar el modal de éxito
          const modal = new bootstrap.Modal(document.getElementById("modalClienteExito"));
          modal.show();

          // Botón: ir a servicios con el id del cliente
          document.getElementById("btnIrServicios").onclick = () => {
            window.location.href = `../paginas/servicios.html?id_cliente=${nuevoId}`;
          };

          // Limpia el formulario
          formCliente.reset();
        } else {
          alert("❌ Error al registrar cliente.");
        }
      } catch (error) {
        console.error("Error al crear cliente:", error);
        alert("Ocurrió un error al guardar el cliente.");
      }
    });
  }
});


// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarClientes);

// Función para obtener los clientes desde PHP y mostrarlos en la tabla
function cargarClientes() {

  if (!document.getElementById('tablaClientes')) return;

  fetch('../php/listar_clientes.php')  // ajusta la ruta según ubicación de tu HTML
    .then(response => response.json())
    .then(data => {
      const tabla = document.getElementById('tablaClientes');
      tabla.innerHTML = ''; // limpiar tabla

      if (data.length === 0) {
        const filaVacia = document.createElement('tr');
        filaVacia.innerHTML = `<td colspan="5" style="text-align:center;">No hay clientes registrados</td>`;
        tabla.appendChild(filaVacia);
        return;
      }

      // Agregar filas dinámicamente
      data.forEach(cliente => {
        const fila = document.createElement('tr');
        fila.classList.add('fila-cliente');
        fila.innerHTML = `
          <td>${cliente.documento}</td>
          <td>${cliente.nombre}</td>
          <td>${cliente.telefono}</td>
          <td>${cliente.direccion}</td>
          <td>
            <button class="update-button"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-button"><i class="fa-solid fa-trash"></i></button>
          </td>
        `;
        tabla.appendChild(fila);
      });
    })
    .catch(error => {
      console.error('Error al cargar clientes:', error);
    });
}

// ===============================
// Búsqueda dinámica de clientes
// ===============================

let clientesOriginales = []; // aquí guardamos la lista completa

document.addEventListener('DOMContentLoaded', () => {
  cargarClientes();

  // evento para buscar mientras se escribe
  const inputBuscar = document.getElementById('busquedaCliente');
  if (inputBuscar) {
    inputBuscar.addEventListener('input', filtrarClientes);
  }
});

function cargarClientes() {
  fetch('../php/listar_clientes.php')
    .then(response => response.json())
    .then(data => {
      clientesOriginales = data; // guardamos copia original
      mostrarClientes(data);
    })
    .catch(error => console.error('Error al cargar clientes:', error));
}

// Muestra los clientes en la tabla
function mostrarClientes(lista) {
  const tabla = document.getElementById('tablaClientes');
  if (!tabla) return;
  tabla.innerHTML = '';

  if (!lista || lista.length === 0) {
    const filaVacia = document.createElement('tr');
    filaVacia.innerHTML = `<td colspan="5" class="text-center">No hay clientes registrados</td>`;
    tabla.appendChild(filaVacia);
    return;
  }

  lista.forEach(cliente => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${cliente.documento}</td>
      <td>${cliente.nombre}</td>
      <td>${cliente.telefono}</td>
      <td>${cliente.direccion}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2 update-button">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn btn-danger btn-sm delete-button">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    // 🔹 Botón editar
    fila.querySelector('.update-button').addEventListener('click', () => {
      window.location.href = `editar_cliente.html?documento=${encodeURIComponent(cliente.documento)}`;
    });

    // 🔹 Botón eliminar
    fila.querySelector('.delete-button').addEventListener('click', () => {
      const modalElement = document.getElementById('modalConfirmarEliminar');
      const texto = document.getElementById('textoConfirmacionEliminar');
      const modalConfirm = bootstrap.Modal.getOrCreateInstance(modalElement);

      texto.textContent = `¿Estás seguro de que deseas eliminar al cliente "${cliente.nombre}"?`;

      // Evitar listeners duplicados
      const btnConfirmar = document.getElementById('btnConfirmarEliminar');
      const btnCancelar = document.getElementById('btnCancelarEliminar');
      btnConfirmar.replaceWith(btnConfirmar.cloneNode(true));
      btnCancelar.replaceWith(btnCancelar.cloneNode(true));

      // ✅ Reasignar botones después del replace
      document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
        await eliminarCliente(cliente.documento);
        modalConfirm.hide();
      });

      document.getElementById('btnCancelarEliminar').addEventListener('click', () => {
        modalConfirm.hide();
      });

      modalConfirm.show();
    });

    tabla.appendChild(fila);
  });
}



async function eliminarCliente(documento) {
  try {
    const response = await fetch(`../php/eliminar_cliente.php?documento=${encodeURIComponent(documento)}`);
    const data = await response.json();

    if (data.success) {
      alert("Cliente eliminado correctamente.");
      cargarClientes(); // 🔄 Recargar la lista
    } else {
      alert("No se pudo eliminar el cliente.");
    }
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    alert("Ocurrió un error al eliminar el cliente.");
  }
}

// Filtrar clientes por nombre o documento
function filtrarClientes(event) {
  const texto = event.target.value.toLowerCase().trim();

  if (texto === '') {
    // Si no hay texto, mostrar la lista completa
    mostrarClientes(clientesOriginales);
    return;
  }

  // Filtrar según nombre o documento
  const filtrados = clientesOriginales.filter(cliente =>
    cliente.nombre.toLowerCase().includes(texto) ||
    cliente.documento.toLowerCase().includes(texto)
  );

  mostrarClientes(filtrados);
}

//===============================
// Actualización de clientes
// ===============================    


// Delegar eventos de actualización
document.addEventListener('click', (e) => {
  if (e.target.closest('.update-button')) {
    const fila = e.target.closest('tr');
    const documento = fila.querySelector('td').textContent.trim(); // primer td = documento
    window.location.href = `editar_cliente.html?documento=${documento}`;
  }
});

// --------- Detectar resultado de creación de cliente al cargar clientes.html ---------
document.addEventListener('DOMContentLoaded', () => {
  // Solo ejecutar cuando estemos en la página clientes.html
  // (opcional) puedes comprobar window.location.pathname si lo deseas

  const params = new URLSearchParams(window.location.search);
  const success = params.get('success');
  const idCliente = params.get('id_cliente');

  if (success === '1' && idCliente) {
    // Mostrar modal de éxito (asegúrate de tener en tu HTML el modal con id modalClienteExito)
    try {
      const modalEl = document.getElementById('modalClienteExito');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        // Configurar el botón que redirige a servicios con el id del cliente
        const btnIrServicios = document.getElementById('btnIrServicios');
        if (btnIrServicios) {
          btnIrServicios.onclick = () => {
            // Ajusta la ruta hacia servicios.html según tu estructura
            window.location.href = `../paginas/servicios.html?id_cliente=${encodeURIComponent(idCliente)}`;
          };
        }
        modal.show();
      } else {
        // Si no hay modal en HTML, podemos usar alert como fallback
        alert('Cliente creado correctamente.');
      }
    } catch (err) {
      console.error('Error mostrando modal de cliente creado:', err);
    }

    // Limpiar los parámetros de la URL para evitar que el modal vuelva a aparecer al recargar
    if (window.history && window.history.replaceState) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  // Si quieres también manejar el caso success=0 -> mostrar error toast/alert
  if (success === '0') {
    const error = params.get('error') || '';
    if (error === 'missing') {
      alert('Faltan datos requeridos al crear el cliente.');
    } else if (error === 'db') {
      alert('Error en la base de datos al crear el cliente (posible duplicado).');
    } else {
      alert('No se pudo crear el cliente.');
    }
    // Limpiar params
    if (window.history && window.history.replaceState) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }
});


