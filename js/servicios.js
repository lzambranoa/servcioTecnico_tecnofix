// ============================================================
// TECNOFIX - GESTIÓN DE SERVICIOS
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Si existe el formulario de creación
  const formCrear = document.querySelector("#formCrearServicio");
  if (formCrear) {
    prellenarIdClienteDesdeURL();

    formCrear.addEventListener("submit", async (e) => {
      e.preventDefault();
      await crearServicio();
    });
  }

  // Si existe el formulario de edición
  const formEditarServicio = document.getElementById("formEditarServicio");
  if (formEditarServicio) {
    formEditarServicio.addEventListener("submit", async (e) => {
      e.preventDefault();
      await actualizarServicio();
    });

    // Cargar datos del servicio en edición
    const params = new URLSearchParams(window.location.search);
    const idServicio = params.get("id");
    if (idServicio) {
      cargarDatosServicio(idServicio);
    }
  }

  // Si estamos en la lista de servicios
  if (document.getElementById("tablaServicios")) {
    cargarServicios();
  }
});


// ============================================================
// 🔹 PRELLENAR ID CLIENTE DESDE URL (al crear servicio)
// ============================================================
function prellenarIdClienteDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  const idCliente = params.get("id_cliente");

  if (idCliente) {
    const inputCliente = document.getElementById("cliente");
    if (inputCliente) {
      inputCliente.value = idCliente;
      inputCliente.readOnly = true;
      document.getElementById("tipo").focus();
    }
  }
}


// ============================================================
// 🔹 CREAR SERVICIO
// ============================================================
async function crearServicio() {
  const form = document.querySelector("#formCrearServicio");
  const datos = new FormData(form);

  try {
    const response = await fetch("../php/crear_servicio.php", {
      method: "POST",
      body: datos,
    });

    const result = await response.json();

    if (result.success) {
      const modal = new bootstrap.Modal(document.getElementById("modalServicioExito"));
      modal.show();

      form.reset();
      cargarServicios();
    } else {
      alert("❌ Error al registrar el servicio.");
    }
  } catch (error) {
    console.error("Error al crear servicio:", error);
    alert("Hubo un error al crear el servicio.");
  }
}


// ============================================================
// 🔹 ACTUALIZAR SERVICIO
// ============================================================
async function actualizarServicio() {
  const formEditarServicio = document.getElementById("formEditarServicio");
  const formData = new FormData(formEditarServicio);

  try {
    const response = await fetch("../php/actualizar_servicio.php", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      const modal = new bootstrap.Modal(document.getElementById("modalExito"));
      modal.show();

      document.getElementById("btnVolverServicios").addEventListener("click", () => {
        window.location.href = "servicios.html";
      });
    } else {
      alert(data.message || "Error al actualizar el servicio.");
    }
  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    alert("Hubo un error al actualizar el servicio.");
  }
}


// ============================================================
// 🔹 CARGAR SERVICIOS (LISTAR)
// ============================================================
async function cargarServicios() {
  try {
    const response = await fetch("../php/listar_servicios.php");
    const data = await response.json();

    mostrarServicios(data);
  } catch (error) {
    console.error("Error al cargar servicios:", error);
  }
}


// ============================================================
// 🔹 MOSTRAR SERVICIOS EN TABLA
// ============================================================
function mostrarServicios(servicios) {
  const tabla = document.getElementById("tablaServicios");
  if (!tabla) return;

  tabla.innerHTML = "";

  if (!servicios || servicios.length === 0) {
    tabla.innerHTML = `<tr><td colspan="5" class="text-center">No hay servicios registrados</td></tr>`;
    return;
  }

  servicios.forEach(servicio => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${servicio.cliente}</td>
      <td>${servicio.tipo_servicio}</td>
      <td>${servicio.estado}</td>
      <td>${servicio.costo_estimado}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2 update-button" title="Editar">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn btn-sm btn-danger delete-button" title="Eliminar">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    // Editar servicio
    fila.querySelector(".update-button").addEventListener("click", () => {
      window.location.href = `../paginas/editar_servicio.html?id=${encodeURIComponent(servicio.id_servicio)}`;
    });

    // Eliminar servicio
    fila.querySelector(".delete-button").addEventListener("click", () => {
      const modal = new bootstrap.Modal(document.getElementById("modalConfirmarEliminar"));
      document.getElementById("btnConfirmarEliminar").onclick = async () => {
        modal.hide();
        await eliminarServicio(servicio.id_servicio);
      };
      modal.show();
    });

    tabla.appendChild(fila);
  });
}


// ============================================================
// 🔹 ELIMINAR SERVICIO
// ============================================================
async function eliminarServicio(id) {
  const formData = new FormData();
  formData.append("id_servicio", id);

  try {
    const response = await fetch("../php/eliminar_servicio.php", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      const modal = new bootstrap.Modal(document.getElementById("modalEliminacionExitosa"));
      modal.show();
      cargarServicios();
    } else {
      alert(result.error || "Error al eliminar el servicio.");
    }
  } catch (error) {
    console.error("Error al eliminar servicio:", error);
  }
}


// ============================================================
// 🔹 CARGAR DATOS DE SERVICIO A EDITAR
// ============================================================
async function cargarDatosServicio(id) {
  try {
    const response = await fetch(`../php/obtener_servicios.php?id=${id}`);
    const data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      alert("No se encontraron datos del servicio.");
      return;
    }

    // Cargar datos en el formulario
    document.getElementById("id_servicio").value = data.id_servicio;
    document.getElementById("cliente").value = data.id_cliente;
    document.getElementById("tipo").value = data.tipo_servicio;
    document.getElementById("estado").value = data.estado;
    document.getElementById("costo").value = data.costo_estimado;
  } catch (error) {
    console.error("Error al cargar datos del servicio:", error);
    alert("Hubo un error al cargar los datos del servicio.");
  }
}
