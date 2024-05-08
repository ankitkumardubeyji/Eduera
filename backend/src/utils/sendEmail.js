import nodemailer from "nodemailer"

export const sendEmail = async()=>{
    
    // this transporter is responsible for sending the emails , it is configured with SMTP settings including host port authentication credentials
    let transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST, // SMTP server hostname
        port:587, // SMTP server port
        secure:false, // use transport layer security for secure communication
        auth:{
            user:`jensen.low@etheral.email`,
            pass:`3HBShyt9rVB4CNaxrc`
        }
    })

    // send email with the defined transport object is called to send the email 
    await transporter.sendEmail({
        from:process.env.SMTP_FROM_EMAIL, // sender address
        to:email,  // user email
        subject:subject, // subject line
        html:message  // html body 
    })
}

