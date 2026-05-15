const QRCode = require("qrcode");

const customerId = "CUST001";

const url = `https://your-vercel-app.vercel.app/feedback?customerId=${customerId}`;

QRCode.toFile(`qr-${customerId}.png`, url, function (err) {
  if (err) throw err;
  console.log("QR generated");
});