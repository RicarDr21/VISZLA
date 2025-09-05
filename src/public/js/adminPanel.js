const userData = JSON.parse(sessionStorage.getItem("usuario") || "{}");
const token = userData?.token || "";

const API = {
  list: (search = "") =>
    fetch(`/api/admin/users-listar?search=${encodeURIComponent(search)}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => data.usuarios || []),

  create: (body) =>
    fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    }).then(r => r.json()),

  remove: (id, motivo = "Eliminación desde panel") =>
    fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ motivo })
    }).then(async r => ({ ok: r.ok, body: await r.json() })),

  suspend: (id, motivo = "Suspendido desde panel") =>
    fetch(`/api/admin/users/${id}/suspender`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ motivo })
    }).then(async r => ({ ok: r.ok, body: await r.json() })),

  reactivate: (id) =>
    fetch(`/api/admin/users/${id}/reactivar`, {
      method: 'PUT',
      headers: { "Authorization": `Bearer ${token}` }
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
  const estado = user.estado || 'activo';

  tr.innerHTML = `
    <td>${user.nombres ?? ''} ${user.apellidos ?? ''}</td>
    <td>${user.apodo ?? '-'}</td>
    <td>${user.email ?? '-'}</td>
    <td>${user.rol ?? '-'}</td>
    <td>${estado}</td>
    <td class="text-end">
      <div class="btn-group btn-group-sm" role="group">
        ${estado === 'suspendido'
          ? `<button class="btn btn-success" data-act="reactivate" data-id="${user._id}">Reactivar</button>`
          : `<button class="btn btn-warning" data-act="suspend" data-id="${user._id}">Suspender</button>`
        }
        <button class="btn btn-outline-danger" data-act="delete" data-id="${user._id}">Banear</button>
      </div>
    </td>
  `;

  tr.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    const act = btn.dataset.act;

    if (act === 'delete') {
      if (!confirm('Banear permanentemente este usuario?')) return;
      const res = await API.remove(id);
      setMsg(res.body?.msg || (res.ok ? 'Eliminado' : 'Error'), res.ok ? 'success' : 'danger');
      load();
    }

    if (act === 'suspend') {
      const motivo = prompt('Motivo de la suspensión:', 'Incumplimiento de reglas');
      const res = await API.suspend(id, motivo);
      setMsg(res.body?.msg || (res.ok ? 'Suspendido' : 'Error'), res.ok ? 'warning' : 'danger');
      load();
    }

    if (act === 'reactivate') {
      const res = await API.reactivate(id);
      setMsg(res.body?.msg || (res.ok ? 'Reactivado' : 'Error'), res.ok ? 'success' : 'danger');
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
    setMsg('Usuario creado (admin).', 'success');
    load();
  } catch {
    setMsg('Error creando usuario', 'danger');
  }
});

reloadBtn.addEventListener('click', load);
load();
