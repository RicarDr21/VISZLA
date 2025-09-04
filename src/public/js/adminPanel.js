const API = {
  list: () => fetch('/users').then(r => r.json()),
  create: (body) =>
    fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(r => r.json()),
  remove: (id) =>
    fetch(`/users/${id}`, {
      method: 'DELETE',
      headers: { 'x-role': 'admin' } // simula admin
    }).then(async r => ({ ok: r.ok, body: await r.json() })),
  suspend: (id) =>
    fetch(`/users/${id}/suspend`, {
      method: 'PUT',
      headers: { 'x-role': 'admin' }
    }).then(async r => ({ ok: r.ok, body: await r.json() })),
  reactivate: (id) =>
    fetch(`/users/${id}/reactivate`, {
      method: 'PUT',
      headers: { 'x-role': 'admin' }
    }).then(async r => ({ ok: r.ok, body: await r.json() })),
};

const tbody = document.getElementById('usersTbody');
const msg = document.getElementById('msg');
const form = document.getElementById('createForm');
const reloadBtn = document.getElementById('reloadBtn');

function setMsg(text, type = 'muted') {
  msg.className = `small text-${type}`;
  msg.textContent = text;
  if (text) setTimeout(() => setMsg(''), 3000);
}

function row(user) {
  const tr = document.createElement('tr');
  const suspended = user.suspended === true;

  tr.innerHTML = `
    <td>${user.name ?? '-'}</td>
    <td>${user.email ?? '-'}</td>
    <td>${user.role ?? '-'}</td>
    <td>${suspended ? 'Suspendido' : 'Activo'}</td>
    <td class="text-end">
      <div class="btn-group btn-group-sm" role="group">
        ${suspended
          ? `<button class="btn btn-success" data-act="reactivate" data-id="${user._id}">Reactivar</button>`
          : `<button class="btn btn-warning" data-act="suspend" data-id="${user._id}">Suspender</button>`
        }
        <button class="btn btn-outline-danger" data-act="delete" data-id="${user._id}">Eliminar</button>
      </div>
    </td>
  `;

  tr.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    const act = btn.dataset.act;

    if (act === 'delete') {
      if (!confirm('¿Eliminar permanentemente este usuario?')) return;
      const res = await API.remove(id);
      setMsg(res.body?.message || (res.ok ? 'Eliminado' : 'Error'), res.ok ? 'success' : 'danger');
      load();
    }
    if (act === 'suspend') {
      const res = await API.suspend(id);
      setMsg(res.body?.message || (res.ok ? 'Suspendido' : 'Error'), res.ok ? 'warning' : 'danger');
      load();
    }
    if (act === 'reactivate') {
      const res = await API.reactivate(id);
      setMsg(res.body?.message || (res.ok ? 'Reactivado' : 'Error'), res.ok ? 'success' : 'danger');
      load();
    }
  });

  return tr;
}

async function load() {
  tbody.innerHTML = '';
  const users = await API.list();
  users.forEach(u => tbody.appendChild(row(u)));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  try {
    await API.create(data);
    form.reset();
    setMsg('Usuario creado.', 'success');
    load();
  } catch {
    setMsg('Error creando usuario', 'danger');
  }
});

reloadBtn.addEventListener('click', load);
load();