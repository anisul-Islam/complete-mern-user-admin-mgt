const dev = require('../config');

const nodemailer = require('nodemailer');

exports.sendEmailWithNodeMailer = async (emailData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: dev.app.smtpUsername, // generated ethereal user
        pass: dev.app.smtpPassword, // generated ethereal password
      },
    });

    const mailOptions = {
      from: dev.app.smtpUsername, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };

    // send mail with defined transport object
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('-----SMTP ERROR1--------');
        console.log(error);
      } else {
        console.log('Message sent: %s', info.response);
      }
    });
  } catch (error) {
    console.log('-----SMTP ERROR2--------');
    console.log('Problem sending Email: ', error);
  }
};
