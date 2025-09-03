const API = {
  login: (data) =>
    fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
};

// Elementos del DOM
const form = document.getElementById('loginForm');
const alertContainer = document.getElementById('alertContainer');
const submitBtn = document.getElementById('submitBtn');
const spinner = document.getElementById('spinner');

// Funciones de utilidad
function showAlert(message, type = 'danger', errors = []) {
  let alertHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      <strong>${message}</strong>
  `;
  
  if (errors && errors.length > 0) {
    alertHTML += '<ul class="mb-0 mt-2">';
    errors.forEach(error => {
      alertHTML += `<li>${error}</li>`;
    });
    alertHTML += '</ul>';
  }
  
  alertHTML += `
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  
  alertContainer.innerHTML = alertHTML;
}

function clearFieldErrors() {
  const fields = ['email', 'password'];
  fields.forEach(field => {
    const input = document.getElementById(field);
    input.classList.remove('is-invalid');
    const feedback = input.nextElementSibling?.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = '';
    }
  });
}

function setLoading(loading) {
  if (loading) {
    submitBtn.disabled = true;
    spinner.classList.remove('d-none');
    submitBtn.textContent = 'Iniciando sesión...';
  } else {
    submitBtn.disabled = false;
    spinner.classList.add('d-none');
    submitBtn.textContent = 'Iniciar Sesión';
  }
}

// Event listener para el formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  alertContainer.innerHTML = '';
  clearFieldErrors();
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  setLoading(true);
  
  try {
    const response = await API.login(data);
    const result = await response.json();
    
    if (response.ok) {
      showAlert(`¡Bienvenido, ${result.user.name}!`, 'success');
      
      // Guardar información del usuario (simulado - en producción usar JWT)
      sessionStorage.setItem('user', JSON.stringify(result.user));
      
      // Redirigir según el rol del usuario
      setTimeout(() => {
        if (result.user.role === 'admin') {
          window.location.href = '/pages/users.html';
        } else {
          window.location.href = '/pages/dashboard.html'; // Crear esta página para usuarios normales
        }
      }, 1500);
      
    } else {
      showAlert(result.message || 'Error en el inicio de sesión', 'danger', result.errors);
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert('Error de conexión. Inténtalo de nuevo.', 'danger');
  } finally {
    setLoading(false);
  }
});