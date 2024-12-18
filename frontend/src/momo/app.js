import express from "express";
import crypto from "crypto";
import axios from "axios";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Để phân tích JSON

app.post("/payment", async (req, res) => {
  const { amount, requestId, orderId } = req.body;

  // Các tham số cần thiết cho chữ ký
  const accessKey = "F8BBA842ECF85";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const orderInfo = "pay with MoMo";
  const partnerCode = "MOMO";
  const redirectUrl =
    "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
  const ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
  const requestType = "payWithMethod";
  const autoCapture = true;
  const lang = "vi";
  const extraData = "";
  const orderGroupId = "";

  // Tạo chuỗi dữ liệu để tính toán chữ ký
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  // Tính toán chữ ký
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  // Tạo body yêu cầu để gửi đến dịch vụ MoMo
  const requestBody = {
    partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture,
    extraData,
    orderGroupId,
    signature,
  };

  try {
    const result = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "server error",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
