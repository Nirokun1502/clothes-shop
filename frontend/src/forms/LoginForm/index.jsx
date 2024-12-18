import "./LoginForm.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiConfig from "../../config";
import axios from "axios";

// eslint-disable-next-line react/prop-types
function LoginForm({ onClick }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFail, setLoginFail] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const loginApiUrl = apiConfig.apiurls.login;

      const body = {
        username: username,
        password: password,
      };

      const Loginresponse = await axios.post(loginApiUrl, body);

      localStorage.setItem("username", username);
      localStorage.setItem("jwt", Loginresponse.data);

      //get account info
      const accountInfoApiUrl = apiConfig.apiurls.accountinfo;
      const Infobody = {
        key: "value",
      };
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      };

      const Inforespone = await axios.post(accountInfoApiUrl, Infobody, config);
      localStorage.setItem("accountinfo", JSON.stringify(Inforespone.data));

      console.log(localStorage.getItem("jwt"));
      console.log(localStorage.getItem("accountinfo"));
      window.location.reload();
      onClick(false);
    } catch (error) {
      setLoginFail(true);
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container-loginform">
      <div
        className="loginform-background"
        onClick={() => onClick(false)}
      ></div>
      <div className="loginform-content">
        <h2 className="loginform-title">Đăng nhập</h2>

        <form
          method="POST"
          className="loginform-inputform"
          onSubmit={handleSubmit}
        >
          {loginFail && (
            <h2 className="login-fail">Sai thông tin đăng nhập!</h2>
          )}
          <div className="login-input">
            {" "}
            <FontAwesomeIcon icon={faUser} className="login-icon" />
            <input
              type="text"
              id="login-username"
              name="username"
              placeholder="Tên tài khoản"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              required
            />
          </div>

          <div className="login-input">
            {" "}
            <FontAwesomeIcon icon={faLock} className="login-icon" />
            <input
              type="password"
              id="login-password"
              name="password"
              placeholder="Mật khẩu"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </div>

          <p
            className="login-link"
            onClick={() => {
              onClick(false);
              navigate("/changepassword");
            }}
          >
            Quên mật khẩu?
          </p>

          <button className="login-submit" type="submit">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
