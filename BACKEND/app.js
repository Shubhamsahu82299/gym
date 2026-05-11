import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail.js";

// Ensure environment variables load FIRST
config({ path: "./config.env" });

const app = express();
const router = express.Router();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Removed 'next' parameter because we are sending direct responses
router.post("/send/mail", async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    // Removed next() wrapper, directly returning the response
    return res.status(400).json({
      success: false,
      message: "Please provide all details",
    });
  }

  try {
    await sendEmail({
      email: process.env.SMTP_MAIL, // Sending to our own email
      subject: "GYM WEBSITE CONTACT",
      message,
      userEmail: email,
    });
    
    res.status(200).json({
      success: true,
      message: "Message Sent Successfully.",
    });
  } catch (error) {
    
    console.error("❌ MAIL SENDING FAILED:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.use(router);


if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`✅ Server listening at port ${PORT}`);
  });
}

export default app;
