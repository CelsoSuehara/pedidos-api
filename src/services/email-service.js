'user strict';
var config = require('../config');
const sgMail = require('@sendgrid/mail');

exports.send = async (to, subject, body) => {    
    
    sgMail.setApiKey(config.sendgridKey);
    const msg = {
        to: to,
        from: 'celsoys@hotmail.com',
        subject: subject,
        text: 'Testando...',
        html: body
    };
    sgMail.send(msg);
}
