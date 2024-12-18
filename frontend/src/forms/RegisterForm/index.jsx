import "./RegisterForm.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import apiConfig from "../../config";

// eslint-disable-next-line react/prop-types
function RegisterForm({ onClick }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!(password == confirmPassword)) {
      setErrorMessage("Mật khẩu xác nhận không khớp với nhau");
      return;
    }
    try {
      const apiUrl = apiConfig.apiurls.register;
      const body = {
        username: username,
        password: password,
        email: email,
        first_Name: firstName,
        last_Name: lastName,
        phone: phoneNumber,
      };

      const response = await axios.post(apiUrl, body);
      response.data
        ? console.log("dang ky thanh cong")
        : console.log("dang ky that bai");
      window.location.reload();
    } catch (error) {
      setErrorMessage(
        "Đăng ký thất bại. Tên tài khoản, email hoặc sđt đã được sử dụng"
      );
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container-registerform">
      <div
        className="registerform-background"
        onClick={() => onClick(false)}
      ></div>
      <div className="registerform-content">
        <h2 className="registerform-title">Đăng ký</h2>
        <form
          onSubmit={handleSubmit}
          method="POST"
          className="registerform-inputform"
        >
          {errorMessage && <h2 className="login-fail">{errorMessage}</h2>}
          <div className="register-input">
            {" "}
            <FontAwesomeIcon icon={faUser} className="register-icon" />
            <input
              type="text"
              id="register-username"
              name="username"
              placeholder="Tên tài khoản"
              required
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>

          <div className="register-input">
            {" "}
            <FontAwesomeIcon icon={faLock} className="register-icon" />
            <input
              type="password"
              id="register-password"
              name="password"
              placeholder="Mật khẩu"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <div className="register-input">
            {" "}
            <FontAwesomeIcon icon={faLock} className="register-icon" />
            <input
              type="password"
              id="register-confirmpassword"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              required
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>

          <div className="register-input">
            {" "}
            <FontAwesomeIcon icon={faLock} className="register-icon" />
            <input
              type="text"
              id="register-lastname"
              name="lastname"
              placeholder="Họ"
              required
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>

          <div className="register-input">
            {" "}
            <FontAwesomeIcon icon={faLock} className="register-icon" />
            <input
              type="text"
              id="register-firstname"
              name="firstname"
              placeholder="Tên"
              required
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
          </div>

          <div className="register-input">
            {" "}
            <FontAwesomeIcon icon={faLock} className="register-icon" />
            <input
              type="text"
              id="register-email"
              name="email"
              placeholder="Email"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className="register-input">
            {" "}
            <FontAwesomeIcon icon={faLock} className="register-icon" />
            <input
              type="text"
              id="register-phonenumber"
              name="phonenumber"
              placeholder="Số điện thoại"
              required
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
          </div>

          <button type="submit" className="register-submit">
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
