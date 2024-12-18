// import React from 'react';
import PropTypes from "prop-types";
import LoginForm from "../../forms/LoginForm";
import RegisterForm from "../../forms/RegisterForm";
import cn from "classnames";
import { useState } from "react";
import styles from "./UserNavigation.module.scss";
import { useNavigate } from "react-router-dom";
import UserMenu from "../UserMenu";

function UserNavigation(props) {
  const [loginButton, setLoginButton] = useState(false);
  const [registerButton, setRegisterButton] = useState(false);
  const navigate = useNavigate();

  return (
    <section
      className={cn(styles.products_section, props.className, "productpage")}
      style={{
        "--src": `url(${"/assets/41b3660a9d11681941f8449946929cbc.png"})`,
      }}
    >
      {/* Main section for product listings and navigation. */}

      <div className={styles.flex_col}>
        {/* Flex container for the header and main navigation. */}

        <div className={styles.nav_row}>
          {/* Flex row for the navigation items. */}

          <div className={styles.nav_items_row}>
            {/* Row containing navigation text items. */}
            <img
              className={styles.logo_image}
              src={"/assets/9e896045718051ae38aa72cbcbb13a57.svg"}
              alt="alt text"
            />
            <p
              className={styles.nav_link_home}
              onClick={() => {
                navigate("/home");
              }}
            >
              {/* Home navigation link. */}
              Home
            </p>
            <p className={styles.nav_link_collections}>
              {/* Collections navigation link. */}
              Collections
            </p>
            <p className={styles.nav_link_new}>
              {/* New arrivals navigation link. */}
              New
            </p>
          </div>

          <img
            onClick={() => {
              navigate("/");
            }}
            className={styles.cart_icon_image}
            src={"/assets/1394a97fb28e3bbd55d86c8b49ec2438.svg"}
            alt="alt text"
          />

          <div className={styles.action_row}>
            {/* Row for actions such as cart and icons. */}
            <button
              className={styles.cart_btn}
              onClick={() => {
                setLoginButton(true);
              }}
            >
              {/* TODO */}
              Đăng nhập
            </button>

            <button
              className={styles.cart_btn}
              onClick={() => {
                setRegisterButton(true);
              }}
            >
              {/* TODO */}
              Đăng ký
            </button>

            <button
              className={styles.cart_btn}
              onClick={() => {
                if (localStorage.getItem("jwt")) {
                  navigate(`/cart`);
                } else {
                  setLoginButton(true);
                }
              }}
            >
              {/* TODO */}
              Giỏ hàng
            </button>

            <img
              className={styles.user_icon_image}
              onClick={() => {
                if (localStorage.getItem("jwt")) {
                  navigate(`/order`);
                } else {
                  setLoginButton(true);
                }
              }}
              src={"/assets/8ecd0665ef44a158a91286e813013816.svg"}
              alt="alt text"
            />
            <UserMenu style={{ color: "black" }} />

            {/* <img
              className={styles.search_icon_image}
              onClick={() => {
                navigate(`/userprofile`);
              }}
              src={"/assets/07f6f37074cc6b961c8f31453e6917b8.svg"}
              alt="alt text"
            /> */}

            <div></div>
            {loginButton && <LoginForm onClick={setLoginButton} />}
            {registerButton && <RegisterForm onClick={setRegisterButton} />}
          </div>
        </div>
      </div>
    </section>
  );
}

UserNavigation.propTypes = {
  className: PropTypes.string,
};

export default UserNavigation;
