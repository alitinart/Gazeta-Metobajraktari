const nodemailer = require("nodemailer");

require("dotenv").config();

let user = process.env.EMAIL_USER;
let pass = process.env.EMAIL_PASS;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user,
    pass,
  },
});

module.exports = function emailProvider(to, subject, text) {
  let mailOptions = {
    from: user,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return { error: true, message: error };
    }
    return { error: false, message: "Email Sent" };
  });
};
