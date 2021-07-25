const nodemailer = require('nodemailer'); 


const sendEmail = async options => {

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port:process.env.MAILTRAP_PORT,
        auth:{
            user:process.env.MAILTRAP_USERNAME, 
            pass:process.env.MAILTRAP_PASSWORD
        }
    });


    let mailOptions = {
        from: 'classicman@auira.com',
        to: options.email, 
        subject: options.subject, 
        text: options.message
    }


    await transporter.sendMail(mailOptions);
}

module.exports = {sendEmail}