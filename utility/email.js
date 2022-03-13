const nodemailer = require('nodemailer'); 
const pug = require('pug')
const htmlToText = require('html-to-text')

class Email {
    constructor(user, url){
        this.to = user.email;
        this.firstName = user.firstName.split(' ')[0];
        this.url = url; 
        this.from = process.env.EMAIL_FROM
    }

    createTransport(){

        if(process.env.NODE_ENV ==='production')
        {
            return 1;
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
            auth:{
                user:process.env.EMAIL_USERNAME, 
                pass:process.env.EMAIL_PASSWORD
            }
        });

        return transporter;
        
    }

    async send (template, subject)
    {

       const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,
       {
           firstName: this.firstName, 
           url: this.url, 
           subject: subject
       });

        let mailOptions = {
            from: this.from,
            to: this.to, 
            subject: subject, 
            html:html,
            text:htmlToText.fromString(html)
        }
    
    
       await this.createTransport().sendMail(mailOptions);

    }

   async sendWelcome(){
       await  this.send('welcome','Welcome to Natours Tours');
    }

   async sendPasswordReset(){
       await this.send('passwordreset', 'Your password reset token');
   }
}



module.exports =  Email