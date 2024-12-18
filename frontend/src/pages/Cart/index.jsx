// import React from 'react';
import PropTypes from "prop-types";
import cn from "classnames";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../State/Cart/Action";
import { useNavigate } from "react-router-dom";
import CreateOrder from "../CreateOrder";

function Cart(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(true);
  const { cart } = useSelector((store) => store.cart);
  // console.log("cartis" + cart);

  useEffect(() => {
    const accountId = JSON.parse(localStorage.getItem("accountinfo"))?.account
      ?.accountId;
    console.log("accountid is:" + accountId);
    dispatch(getCart(accountId));
  }, [refresh]);

  return (
    <section
      className={cn(styles["shopping-bag-section"], props.className, "cart")}
      style={{
        "--src": `url(${"/assets/76ba15bb1dab00bdcf93f82d34a0a7a0.png"})`,
      }}
    >
      {/* Main section for displaying the shopping bag contents. */}

      <div className={styles.flex_row}>
        <div className={styles.flex_col}>
          <div className={styles.flex_col1}>
            <h2 className={styles["shopping-bag-title"]}>
              {/* Title of the shopping bag. */}
              Shopping bag
            </h2>
            <hr className={styles["divider-line"]} size={1} />
          </div>

          <div className={styles.flex_row1}>
            {cart?.cartItems?.map((item, index) => (
              <CartItem
                item={item}
                key={`cartItem#${index}`}
                cartId={cart.cartId}
                setRefresh={setRefresh}
              />
            ))}
          </div>
        </div>

        <div className={styles["order-summary-section"]}>
          {/* Section displaying the order summary. */}

          <div className={styles.flex_col8}>
            <div className={styles.flex_col7}>
              <h3 className={styles["order-summary-title"]}>
                {/* Title for the order summary section. */}
                ORDER SUMMARY
              </h3>

              <div className={styles["summary-row-subtotal"]}>
                {/* Row containing the subtotal information. */}
                <p className={styles["subtotal-label"]}>
                  {/* Label for the subtotal. */}
                  Subtotal
                </p>
                <p className={styles["subtotal-amount"]}>
                  {/* Amount for the subtotal. */}
                  {cart?.cartItems?.reduce((total, item) => {
                    return total + item.quantity * item.variant.price;
                  }, 0)}
                  VND
                </p>
              </div>

              <hr className={styles["order-summary-divider"]} size={1} />

              <div className={styles["summary-row-total"]}>
                {/* Row containing the total information. */}
                <p className={styles["total-label_box"]}>
                  {/* Label for the total amount. */}
                  <span className={styles["total-label"]}>
                    <span className={styles["total-label_span0"]}>Total</span>
                    <span className={styles["total-label_span1"]}> </span>
                    <span className={styles["total-label_span2"]}>
                      (Tax incl.)
                    </span>
                  </span>
                </p>
                <p className={styles["total-amount"]}>
                  {/* Total amount including tax. */}{" "}
                  {cart?.cartItems?.reduce((total, item) => {
                    return total + item.quantity * item.variant.price;
                  }, 0)}
                  VND
                </p>
              </div>
            </div>

            <button
              className={styles["continue-button"]}
              onClick={() => {
                navigate("/checkout");
              }}
            >
              {/* Button to continue to the next step. */}
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

Cart.propTypes = {
  className: PropTypes.string,
};

export default Cart;
