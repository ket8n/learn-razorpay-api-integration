import express from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import cors from "cors";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/test", (req, res) => {
  res.json("ok");
});

app.post("/order", (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const { amount, currency, receipt, payment_capture } = req.body;

  // Ensure the data is correctly parsed and converted
  const options = {
    amount: parseInt(amount), // amount in smallest currency unit (e.g., paise for INR)
    currency,
    receipt,
    payment_capture: parseInt(payment_capture),
  };

  razorpay.orders
    .create(options)
    .then((response) => {
      if (!response) {
        return res.status(500).send("Error");
      }
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error");
    });
});

app.post("/order/validate", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not valid" });
  }
  res.json({
    msg: "Success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
