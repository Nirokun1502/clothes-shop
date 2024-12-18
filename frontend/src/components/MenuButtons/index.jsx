import LoginForm from "../../forms/LoginForm";
import RegisterForm from "../../forms/RegisterForm";
import "./MenuButtons.scss";
import { useState } from "react";

function MenuButtons() {
  const [registerButton, setRegisterButton] = useState(false);
  const [loginButton, setLoginButton] = useState(false);

  return (
    <div className="container-button">
      <button
        className="register-button"
        onClick={() => {
          setRegisterButton(true);
        }}
      >
        Đăng ký
      </button>
      <button
        className="login-button"
        onClick={() => {
          setLoginButton(true);
        }}
      >
        Đăng nhập
      </button>

      {registerButton && <RegisterForm onClick={setRegisterButton} />}
      {loginButton && <LoginForm onClick={setLoginButton} />}
    </div>
  );
}

export default MenuButtons;
