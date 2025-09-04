const API = {
  login: (data) =>
    fetch('/api/usuarios/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
};

// Elementos del DOM
const form = document.getElementById("loginForm");
const alertContainer = document.getElementById("alertContainer");
const submitBtn = document.getElementById("submitBtn");
const spinner = document.getElementById("spinner");

// Funciones de utilidad
function showAlert(message, type = "danger", errors = []) {
  let alertHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      <strong>${message}</strong>
  `;

  if (errors && errors.length > 0) {
    alertHTML += "<ul class='mb-0 mt-2'>";
    errors.forEach((error) => {
      alertHTML += `<li>${error}</li>`;
    });
    alertHTML += "</ul>";
  }

  alertHTML += `
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;

  alertContainer.innerHTML = alertHTML;
}

function clearFieldErrors() {
  const fields = ["email", "password"];
  fields.forEach((field) => {
    const input = document.getElementById(field);
    input.classList.remove("is-invalid");
    const feedback = input.nextElementSibling?.nextElementSibling;
    if (feedback && feedback.classList.contains("invalid-feedback")) {
      feedback.textContent = "";
    }
  });
}

function setLoading(loading) {
  if (loading) {
    submitBtn.disabled = true;
    spinner.classList.remove("d-none");
    submitBtn.textContent = "Iniciando sesión...";
  } else {
    submitBtn.disabled = false;
    spinner.classList.add("d-none");
    submitBtn.textContent = "Iniciar Sesión";
  }
}

// Event listener para el formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  clearFieldErrors();
  alertContainer.innerHTML = "";
  setLoading(true);

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await API.login({ email, password });
    const result = await response.json();
    console.log("📩 Respuesta cruda:", result);

    if (!response.ok) {
      // ❌ Caso error
      showAlert(result.message || "Error en el inicio de sesión", "danger", result.errors);
      return;
    }

    // ✅ Caso éxito → tomar directamente los campos que devuelve el backend
    const usuario = {
      nombres: result.nombres,
      rol: result.rol,
      token: result.token
    };

    showAlert(`¡Bienvenido, ${usuario.nombres}!`, "success");

    // Guardar en sessionStorage
    sessionStorage.setItem("usuario", JSON.stringify(usuario));

    // Redirigir según rol
    setTimeout(() => {
      if (usuario.rol === "admin") {
        window.location.href = "adminPanel.html";
      } else {
        window.location.href = "HomeUser.html";
      }
    }, 1500);

  } catch (error) {
    console.error("❌ Error en login:", error);
    showAlert("Error en la conexión con el servidor", "danger");
  } finally {
    setLoading(false);
  }
});
  