const path = require('path');
const fs = require('fs');
const template = '/src/views/Mailer.html';
const transporter = require('./Transporter');

/**
 * @description Envia un correo
 * @param {String} to      Destinatario
 * @param {String} text    Mensaje
 * @param {String} subject Asunto
 * @return {Promise<SMTPTransport.SentMessageInfo>}
 */
exports.sendMail = async function(to, text, subject) {
  try {
    const html = fs.readFileSync(
        path.resolve() + template, {encoding: 'utf-8'},
    );
    const info = await transporter.sendMail({
      from: process.env.MAILER_USER,
      to,
      subject,
      html: html.replace('{{content}}', text),
    });
    return info;
  } catch {
    console.log('Error in mailer: %s', info.messageId);
  }
};
