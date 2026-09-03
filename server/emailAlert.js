const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendAlertEmail(result) {
  const { coinId, currentPrice, threshold, direction } = result;

  const subject = `Price Alert: ${coinId} is now $${currentPrice}`;
  const text =
    `${coinId.toUpperCase()} has gone ${direction} your threshold of $${threshold}.\n` +
    `Current price: $${currentPrice}\n\n` +
    `This alert was sent by your Price Tracker app.`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ALERT_RECIPIENT,
      subject,
      text
    });
    console.log(`  Email alert sent for ${coinId}`);
  } catch (error) {
    console.error(`  Failed to send email alert for ${coinId}:`, error.message);
  }
}

module.exports = { sendAlertEmail };