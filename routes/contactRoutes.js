import express from "express";
import Contact from "../models/contact.js";
import oauth2Client from "../config/mailer.js";
import { google } from "googleapis";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Incoming request:", req.body);

    const { name, email, service, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      service,
      message,
    });

    console.log("Saved to MongoDB:", contact);
   try {
  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const emailLines = [
    `From: "Rasi Digital" <${process.env.GOOGLE_EMAIL}>`,
    `To: ${process.env.GOOGLE_EMAIL}`,
    `Reply-To: ${email}`,
    `Subject: New Portfolio Enquiry from ${name}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "",
    `
      <h2>New Client Enquiry</h2>

      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Service:</b> ${service}</p>
      <p><b>Message:</b></p>

      <p>${message}</p>
    `,
  ];

  const encodedMessage = Buffer.from(emailLines.join("\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  console.log("✅ Email sent using Gmail API");
} catch (mailError) {
  console.error("❌ Gmail API Error:");
  console.error(mailError.response?.data || mailError.message);
}

    res.status(201).json({
      success: true,
      message: "Project request saved successfully!",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;