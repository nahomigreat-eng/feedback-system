const QRCode = require("qrcode");

const customerId = "CUST001";

const url = `https://feedback-system-fawn-theta.vercel.app/feedback?customerId=${customerId}`;

QRCode.toFile(`qr-${customerId}.png`, url, function (err) {
  if (err) throw err;
  console.log("QR generated");
});