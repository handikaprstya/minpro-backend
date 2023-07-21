const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_DATABASE,
        pass: process.env.PASSWORD_EMAIL
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter