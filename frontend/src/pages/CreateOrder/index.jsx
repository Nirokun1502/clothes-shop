import { useEffect, useState } from "react";
import axios from "axios";

const CreateOrder = ({ total }) => {
  useEffect(() => {
    setAmount(total);
  }, [total]);

  const [amount, setAmount] = useState(total);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    try {
      const result = await axios.post("http://localhost:5000/payment", {
        amount,
        requestId: new Date().getTime().toString(),
        orderId: `MOMO${new Date().getTime()}`,
      });
      setResponse(result.data);
      setError(null);

      // Mở trang mới với payUrl trả về
      const payUrl = result.data.payUrl; // Thay đổi 'payUrl' nếu key khác
      if (payUrl) {
        window.open(payUrl, "_blank"); // Mở trang mới
      }
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  return (
    <div>
      <button onClick={handlePayment}>Thanh toán với MoMo</button>
      {/* {response && <div>Response: {JSON.stringify(response)}</div>}
      {error && <div>Error: {error}</div>} */}
    </div>
  );
};

export default CreateOrder;
