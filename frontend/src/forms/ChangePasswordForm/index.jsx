import "./ChangePasswordForm.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import apiConfig from "../../config";

// eslint-disable-next-line react/prop-types
function ChangePasswordForm({ onClick }) {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!(password == confirmPassword)) {
      console.log("mat khau xac nhan khong khop voi nhau");
      return;
    }
    try {
      const jwt = localStorage.getItem("jwt");
      const apiUrl = apiConfig.apiurls.changepassword;
      const body = {
        Account: {
          username: localStorage.getItem("username"), //luc login luu jwt vao day
          password: oldPassword,
        },
        newPassword: password,
      };
      const config = {
        headers: { Authorization: `Bearer ${jwt}` },
      };
      const response = await axios.post(apiUrl, body, config);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container-changepasswordform">
      <div
        className="changepasswordform-background"
        onClick={() => onClick(false)}
      ></div>
      <div className="changepasswordform-content">
        <h2 className="changepasswordform-title">Đổi mật khẩu</h2>

        <form
          onSubmit={handleSubmit}
          method="POST"
          className="changepasswordform-inputform"
        >
          <div className="changepassword-input">
            {" "}
            <FontAwesomeIcon icon={faKey} className="changepassword-icon" />
            <input
              type="password"
              id="changepassword-oldpassword"
              name="oldPassword"
              placeholder="Nhập mật khẩu cũ"
              required
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
            />
          </div>

          <div className="changepassword-input">
            {" "}
            <FontAwesomeIcon icon={faLock} className="changepassword-icon" />
            <input
              type="password"
              id="changepassword-newpassword"
              name="newPassword"
              placeholder="Nhập mật khẩu mới"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <div className="changepassword-input">
            {" "}
            <FontAwesomeIcon icon={faLock} className="changepassword-icon" />
            <input
              type="password"
              id="changepassword-confirmpassword"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu mới"
              required
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>

          <button type="submit" className="changepassword-submit">
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordForm;
