import nodemailer from "nodemailer";
import Mailgen from "mailgen";

// This code provides a basic implementation for sending emails using Nodemailer with Gmail SMTP and generating HTML email content using Mailgen
 
const sendEmail = async function (email, subject, message) {
    let testAccount = await nodemailer.createTestAccount(); // not neccessary just for testing

  // create reusable transporter object using the default SMTP transport

  let transporter = nodemailer.createTransport({
    service:'gmail',
    
    auth: {
        user: process.env.SMTP_FROM_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    }
 
  });


  
let MailGenerator = new Mailgen({
    theme:"default",
    product:{
        name:"Mailgen",
        link:'https://mailgen.js/'
    }
})





let sandesh = {
    from: process.env.SMTP_FROM_EMAIL, // sender address
    to: email, // user email
    subject: subject, // Subject line
    html: message, // html body
}

await transporter.sendMail(sandesh);
  
};

export { sendEmail};
