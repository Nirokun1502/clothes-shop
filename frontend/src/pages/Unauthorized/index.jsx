import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Unauthorized, Error 401</h1>
      <button
        onClick={() => {
          navigate("/home");
        }}
      >
        Quay lại trang chủ
      </button>
    </div>
  );
}

export default Unauthorized;
