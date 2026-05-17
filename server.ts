import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
       return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const nodemailer = await import("nodemailer");
      
      // Configure transporter
      // For Gmail: Host: 'smtp.gmail.com', Port: 465, Secure: true
      // You'll need to set up an App Password in your Google Account settings
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE !== 'false',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER}>`,
        to: "thrithwakapreethi57@gmail.com",
        replyTo: email,
        subject: `New Contact Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h2 style="color: #2563eb;">New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
      };

      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("Contact form submission received, but SMTP credentials are not configured.");
        // Return success but log the warning so the user knows they need to config it
        return res.json({ 
          success: true, 
          message: "Form received! (Developer note: configure SMTP_USER and SMTP_PASS in settings to enable actual email delivery)" 
        });
      }

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Signal transmitted successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Transmission failure. Please try again later." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
