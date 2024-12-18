import PropTypes from "prop-types";
import cn from "classnames";
import { useState } from "react";
import axios from "axios";
import styles from "./index.module.scss";

function ChangePassword(props) {
  // State để lưu trữ dữ liệu nhập vào
  const [email, setEmail] = useState("");
  const [emailSend, setEmailSend] = useState(false);
  const [emailSendSuccess, setEmailSendSucces] = useState(false);
  const [emailSendFail, setEmailSendFail] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const [changePasswordClick, setChangePasswordClick] = useState(false);

  const handleConfirmEmail = async () => {
    setEmailSend(true);
    try {
      const body = {
        email: email,
      };
      const response = await axios.post(
        `https://localhost:7121/api/Authentication/RequestPasswordReset`,
        body
      );
      console.log(response.data);

      if (response.data == "email not found") {
        setEmailSendFail(true);
      } else {
        setEmailSendSucces(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleConfirmPassword = async () => {
    setChangePasswordClick(true);
    // Logic để xử lý xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      console.log("mat khau khong khop");
      return;
    } else {
      setPasswordMismatch(false);
      console.log("New Password:", newPassword);
      // Logic tiếp theo để thay đổi mật khẩu
    }

    try {
      const body = {
        email: email,
        code: verificationCode,
        newPassword: newPassword,
      };
      const response = await axios.post(
        `https://localhost:7121/api/Authentication/ResetPassword`,
        body
      );
      console.log(response.data);

      if (response.data == "Invalid reset code") {
        setChangePasswordSuccess(false);
      } else {
        setChangePasswordSuccess(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <section
      className={cn(
        styles.password_reset_section,
        props.className,
        "change-password"
      )}
      style={{
        "--src": `url(${"/assets/76ba15bb1dab00bdcf93f82d34a0a7a0.png"})`,
      }}
    >
      {/* Section for resetting password, including instructions and input fields. */}

      <div className={styles.flex_col}>
        <h1 className={styles.password_reset_title}>
          {/* Main title indicating the purpose of this section. */}
          QUÊN MẬT KHẨU
        </h1>

        <div className={styles.flex_col1}>
          <div className={styles.flex_row}>
            <p className={styles.input_email_prompt}>
              {/* Prompt to enter email address. */}
              Nhập email
            </p>

            <div className={styles.flex_col2}>
              <input
                type="email"
                className={styles.rect} // Áp dụng class 'rect'
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailSend && (
                <p className={styles.email_verification_instruction}>
                  {/* Instruction indicating how to verify email for confirmation code. */}
                  {emailSendSuccess
                    ? "kiểm tra email để lấy mã xác nhận"
                    : "đang kiểm tra email.."}
                  {emailSendFail && "email không tồn tại!"}
                </p>
              )}
            </div>

            <button
              className={styles.confirm_email_btn}
              onClick={handleConfirmEmail}
            >
              {/* TODO */}
              Xác nhận
            </button>
          </div>

          {emailSendSuccess && (
            <div className={styles.flex_col3}>
              <div className={styles.flex_row1}>
                <p className={styles.input_verification_code_prompt}>
                  {/* Prompt to enter confirmation code. */}
                  Nhập mã xác nhận
                </p>
                <input
                  type="text"
                  className={styles.rect1} // Áp dụng class 'rect1'
                  placeholder="Nhập mã xác nhận"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>

              <div className={styles.flex_row2}>
                <p className={styles.input_new_password_prompt}>
                  {/* Prompt to enter a new password. */}
                  Nhập mật khẩu mới
                </p>
                <input
                  type="password"
                  className={styles.rect1} // Áp dụng class 'rect1'
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className={styles.flex_row3}>
                <p className={styles.confirm_password_prompt}>
                  {/* Prompt to confirm the new password. */}
                  Xác nhận mật khẩu
                </p>
                <input
                  type="password"
                  className={styles.rect1} // Áp dụng class 'rect1'
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {passwordMismatch && (
                <p className={styles.password_mismatch_warning}>
                  {/* Warning message for mismatched passwords. */}
                  mật khẩu xác nhận không khớp!
                </p>
              )}

              {changePasswordClick && (
                <p className={styles.password_mismatch_warning}>
                  {/* Warning message for mismatched passwords. */}
                  {changePasswordSuccess
                    ? "đổi mật khẩu thành công!"
                    : "sai mã xác nhận!"}
                </p>
              )}

              <button
                className={styles.confirm_password_btn}
                onClick={handleConfirmPassword}
              >
                {/* TODO */}
                Xác nhận
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

ChangePassword.propTypes = {
  className: PropTypes.string,
};

export default ChangePassword;
