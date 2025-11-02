const Brevo = require('@getbrevo/brevo');
let emailAPI = new Brevo.TransactionalEmailsApi();
emailAPI.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;

module.exports.enviarEmail = async function (direccion, key, mensaje) {
    //const client = new Brevo.TransactionalEmailsApi();
    //client.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    let message = new Brevo.SendSmtpEmail();
    message.subject = mensaje;
    message.textContent = "Hello world!";
    message.sender = { name: "JAG", email: "jgallud@gmail.com" };
    message.to = [{ email: direccion, name: direccion }];
    emailAPI.sendTransacEmail(message).then(res => {
        console.log(JSON.stringify(res.body));
    }).catch(err => {
        console.error("Error sending email:", err);
    });
}
