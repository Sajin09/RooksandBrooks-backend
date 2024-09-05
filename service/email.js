const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path')
const fs = require('fs')

const sendEmail = async (toEmail, messageContent, file) => {
    let config = {
        service: "gmail",
        auth: {
            user: process.env.NODE_JS_APP_USER,
            pass: process.env.NODE_JS_APP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    };

    let transporter = nodemailer.createTransport(config);

    let message = {
        from: toEmail,
        to: process.env.NODE_JS_APP_USER,
        subject: "Resume Submission",
        html: `<b>${messageContent}</b>`,
        attachments: file?[
            {
                filename:file.originalname,
                path:file.path
            }
        ]:[]
    };

    try {
        let info = await transporter.sendMail(message);
        if(file){
            fs.unlink(file.path,(err)=>{
                if(err) console.error('failed to delete file:',err)
            })
        }
        return {
            msg: "Email sent",
            info: info.messageId
        };
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { sendEmail };