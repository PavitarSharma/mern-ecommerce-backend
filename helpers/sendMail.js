import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: false,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: "Visit On my site",
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
