import express from "express";
import Contact from "../models/contact.js";
import transporter from "../config/mailer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, service, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      service,
      message,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Portfolio Enquiry from ${name}`,
      html: `
        <h2>New Client Enquiry</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });
    

    res.status(201).json({
      success: true,
      message: "Project request sent successfully!",
    });
  } catch (error) {
    console.error("FULL ERROR:", error);
    console.error("MESSAGE:", error.message);
    console.error("STACK:", error.stack);

    res.status(500).json({
        success: false,
        message: error.message,
    });
}
});

export default router;