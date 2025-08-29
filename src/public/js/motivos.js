document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("motivoForm");
  const lista = document.getElementById("listaMotivos");

  // Cuando se envía el formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const descripcion = document.getElementById("descripcion").value;

    try {
      const res = await fetch("/motivos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-role": "admin" // 👈 esto asegura que tengas acceso
        },
        body: JSON.stringify({ descripcion })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Motivo guardado con éxito ✅");
        agregarMotivoLista(data); // lo añade a la lista en pantalla
        form.reset();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al guardar motivo");
    }
  });

  // Función para mostrar motivos en la lista
  function agregarMotivoLista(motivo) {
    const li = document.createElement("li");
    li.textContent = motivo.descripcion;
    lista.appendChild(li);
  }

  // Cargar motivos existentes al inicio
  async function cargarMotivos() {
    try {
      const res = await fetch("/motivos", {
        headers: { "x-role": "admin" }
      });
      const data = await res.json();
      if (res.ok) {
        data.forEach(m => agregarMotivoLista(m));
      }
    } catch (err) {
      console.error("Error al cargar motivos", err);
    }
  }

  cargarMotivos();
});
