# VISZLA
GRUPO VISZLA 
# VISZLA — Backend (US-06 / US-07)

Administración de usuarios para **The Nexus Battle IV**  
Incluye:
- **US-06**: Baja permanente de usuario.
- **US-07**: Suspensión temporal de usuario (y bloqueo de login si está suspendido).
- **UI** simple en `/pages/users.html` para crear, listar, suspender, reactivar y eliminar usuarios.
- Conexión a **MongoDB Atlas** mediante variables de entorno.

---

## Requisitos

- **Node.js** 18+ (recomendado 20+)
- Acceso a **MongoDB Atlas** (el equipo usa un solo clúster compartido)
- Tener el archivo **.env** (se comparte por privado – *no se sube a GitHub*)

---

## Instalación

```bash
git clone https://github.com/RicarDr21/VISZLA.git
cd VISZLA
npm install
