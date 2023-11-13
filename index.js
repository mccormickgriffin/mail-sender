const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL],
    methods: 'POST',
  })
);

// Route
app.post("/send-email", (req, res) => {
  const { name, senderEmail, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: process.env.EMAIL_ADDRESS,
    subject: "Message from portfolio site",
    text: `Name: ${name}\nEmail: ${senderEmail}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Failed to send email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

// Server
const appName = process.env.APP_NAME;
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`${appName} is running on port ${port}`);
});
