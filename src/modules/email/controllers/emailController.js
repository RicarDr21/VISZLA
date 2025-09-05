const sgMail = require('../../../config/email');

exports.enviarCorreoBienvenida = async (usuario) => {
  try {
    const msg = {
      to: usuario.email, // destinatario
      from: "noreply@nexusbattles.com", // remitente (debes validarlo en SendGrid)
      subject: "¡Bienvenido a Nexus Battles!",
      html: `
        <h1>Hola ${usuario.nombre}</h1>
        <p>Tu cuenta ha sido creada exitosamente 🎉</p>
        <p>Prepárate para comenzar tus batallas mágicas.</p>
      `,
    };

    await sgMail.send(msg);
    console.log("Correo enviado a:", usuario.email);
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
};
