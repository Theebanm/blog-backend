const nodemail = require("nodemailer");

const sendEmail = async ({ emailTo, subject, code, content }) => {
  const transporter = nodemail.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  if (!emailTo) {
    res.status(400);
    throw new Error("No receiptant email provided");
  }

  const message = {
    to: emailTo,
    subject: subject,
    html: `
       <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
            <h2>${content} 🔐</h2>
            <p> Please use the verification code below:</p>
            <div style="font-size: 20px; font-weight: bold; color: #333; background-color: #eee; padding: 10px; display: inline-block; margin: 10px 0;">
              ${code}
            </div>
            <p>If you didn’t request this, please ignore this email.</p>
            <p>Happy Blogging! 🚀</p>
        </div>
      </div>
        `,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
