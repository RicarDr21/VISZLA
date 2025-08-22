const API = {
  list: () => fetch('/users').then(r => r.json()),
};

// Variable para almacenar los usuarios obtenidos del API
let usuarios = [];

// Referencias a elementos del DOM
const usersContainer = document.getElementById('users-container');
const searchInput = document.getElementById('search');
const filterRole = document.getElementById('filter-role');
const filterStatus = document.getElementById('filter-status');
const sortSelect = document.getElementById('sort');
const orderSelect = document.getElementById('order');

// Función para renderizar usuarios
function renderizarUsuarios(usuariosFiltrados) {
  usersContainer.innerHTML = ''; // Limpiar

  if (usuariosFiltrados.length === 0) {
    usersContainer.innerHTML = '<p class="no-results">No se encontraron usuarios con esos criterios.</p>';
    return;
  }

  usuariosFiltrados.forEach(usuario => {
    const userCard = document.createElement('div');
    userCard.className = 'user-card';

    userCard.innerHTML = `
      <h3>${usuario.name}</h3>
      <p><strong>Correo:</strong> <span>${usuario.email}</span></p>
      <p><strong>Rol:</strong> <span>${usuario.role}</span></p>
      <p><strong>Estado:</strong> <span class="status ${!usuario.suspended ? 'activo' : 'suspendido'}">${!usuario.suspended ? 'Activo' : 'Suspendido'}</span></p>
    `;

    usersContainer.appendChild(userCard);
  });
}

// Función para obtener datos filtrados y ordenados
function aplicarFiltrosYOrden() {
  let filtrados = [...usuarios]; // Usamos los usuarios cargados desde el API

  // Filtro: búsqueda por nombre o correo
  const searchTerm = searchInput.value.toLowerCase().trim();
  if (searchTerm) {
    filtrados = filtrados.filter(u =>
      u.name.toLowerCase().includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm)
    );
  }

  // Filtro: por rol
  const rol = filterRole.value;
  if (rol) {
    filtrados = filtrados.filter(u => u.role === rol);
  }

  // Filtro: por estado
  const status = filterStatus.value;
  if (status) {
    const activo = status === 'activo';
    filtrados = filtrados.filter(u => !u.suspended === activo);
  }

  // Ordenamiento
  const sort = sortSelect.value;
  const order = orderSelect.value;

  filtrados.sort((a, b) => {
    let aValue, bValue;

    if (sort === 'nombre') {
      aValue = a.name;
      bValue = b.name;
    } else if (sort === 'rol') {
      aValue = a.role;
      bValue = b.role;
    } else if (sort === 'estado') {
      aValue = !a.suspended ? 1 : 0;
      bValue = !b.suspended ? 1 : 0;
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  renderizarUsuarios(filtrados);
}

// Escuchar cambios en los controles
searchInput.addEventListener('input', aplicarFiltrosYOrden);
filterRole.addEventListener('change', aplicarFiltrosYOrden);
filterStatus.addEventListener('change', aplicarFiltrosYOrden);
sortSelect.addEventListener('change', aplicarFiltrosYOrden);
orderSelect.addEventListener('change', aplicarFiltrosYOrden);

// Cargar usuarios al iniciar y luego renderizar
document.addEventListener('DOMContentLoaded', async () => {
  try {
    usuarios = await API.list(); // Cargar usuarios del API
    console.log(usuarios);
    
    aplicarFiltrosYOrden(); // Mostrar todos los usuarios inicialmente
  } catch (error) {
    usersContainer.innerHTML = '<p class="error">Error al cargar los usuarios.</p>';
    console.error('Error al cargar los usuarios:', error);
  }
});