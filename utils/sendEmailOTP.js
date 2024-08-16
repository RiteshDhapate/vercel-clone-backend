import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  // port: 587,
  auth: {
    user: "rieshdhapatepatil@gmail.com",
    pass: "qivfhfxkjjftcjwa",
  },
});

export async function sendEmail(toEmail, otp) {
  try {
    const info = await transporter.sendMail({
      from: '"SwiftDeploy 👻" <swifttalk@gmail.com>', // sender address
      to: toEmail, // list of receivers
      subject: "SwiftDeploy otp", // Subject line
      text: "Hello from SwiftTalk", // plain text body
      html: `
          <b>OTP: <strong>${otp}</strong></b>  
          <p>If you didn't request this, simply ignore this message.</p>
          <p>Stay secure,</p>
          <p>SwiftDeploy team</p>
      `, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
}
